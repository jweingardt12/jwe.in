import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// Initialize OpenAI
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Credentials': 'true',
  'Content-Type': 'application/json'
};

// Handle OPTIONS request for CORS
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
}

export async function GET(request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      return NextResponse.json({ 
        error: 'OpenAI API key not configured. Please contact the site administrator.' 
      }, { 
        status: 500,
        headers: corsHeaders 
      });
    }

    // Define our preferred models with descriptions
    const preferredModels = [
      { id: 'gpt-4o', name: 'GPT-4o', description: 'Latest and most capable model' },
      { id: 'gpt-4', name: 'GPT-4', description: 'High quality, slower' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Powerful with larger context' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast, less accurate' },
      { id: 'o1', name: 'o1', description: 'Reasoning model' },
      { id: 'o1-mini', name: 'o1-mini', description: 'Smaller reasoning model' },
      { id: 'o3', name: 'o3', description: 'Advanced reasoning model' },
      { id: 'o3-mini', name: 'o3-mini', description: 'Smaller advanced reasoning model' }
    ];

    // Fetch models from OpenAI
    const response = await openai.models.list();
    
    // First, extract all GPT and reasoning models excluding audio and realtime variants
    const allModels = response.data.filter(model => 
      (model.id.includes('gpt-') || 
       model.id === 'o1' || 
       model.id === 'o1-mini' || 
       model.id === 'o3' || 
       model.id === 'o3-mini' ||
       model.id.startsWith('o1-') ||
       model.id.startsWith('o3-')) && 
      !model.id.includes('instruct') && 
      !model.id.includes('-vision-') &&
      !model.id.includes('embedding') &&
      !model.id.includes('search') &&
      !model.id.includes('audio') &&
      !model.id.includes('realtime')
    );
    
    console.log('All available models:', allModels.map(m => m.id));
    
    // Create a map to store our final model selection
    // We'll use this to ensure we only have one version of each base model
    const finalModelsMap = new Map();
    
    // First, add our preferred models if they exist in the available models
    for (const preferred of preferredModels) {
      // Check for exact match first
      const exactMatch = allModels.find(m => m.id === preferred.id);
      if (exactMatch) {
        finalModelsMap.set(preferred.id, {
          id: preferred.id,
          name: preferred.name,
          description: preferred.description,
          isRecommended: true
        });
        continue;
      }
      
      // If no exact match, look for the latest version of this model
      const baseModelVersions = allModels
        .filter(m => m.id.startsWith(preferred.id + '-'))
        .sort((a, b) => b.id.localeCompare(a.id)); // Sort in reverse to get latest version first
      
      if (baseModelVersions.length > 0) {
        const latestVersion = baseModelVersions[0];
        // Extract version number for display
        const versionMatch = latestVersion.id.match(/-(\d{4})$/);
        const versionSuffix = versionMatch ? ` (${versionMatch[1]})` : '';
        
        finalModelsMap.set(preferred.id, {
          id: latestVersion.id,
          name: preferred.name + versionSuffix,
          description: preferred.description,
          isRecommended: true
        });
      }
    }
    
    // Now add any other models that aren't variants of our preferred models
    for (const model of allModels) {
      // Skip if this is a variant of a preferred model we already added
      if (preferredModels.some(p => model.id === p.id || model.id.startsWith(p.id + '-'))) {
        continue;
      }
      
      // For other models like chatgpt-*, add them as non-recommended
      finalModelsMap.set(model.id, {
        id: model.id,
        name: model.id,
        description: '',
        isRecommended: false
      });
    }
    
    // Convert map to array and sort
    let finalModels = Array.from(finalModelsMap.values());
    
    // Sort: recommended first, then alphabetically
    finalModels.sort((a, b) => {
      if (a.isRecommended && !b.isRecommended) return -1;
      if (!a.isRecommended && b.isRecommended) return 1;
      
      // Within recommended models, use our preferred order
      if (a.isRecommended && b.isRecommended) {
        const aIndex = preferredModels.findIndex(p => a.name.startsWith(p.name));
        const bIndex = preferredModels.findIndex(p => b.name.startsWith(p.name));
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      }
      
      // Otherwise sort alphabetically
      return a.name.localeCompare(b.name);
    });
    
    console.log('Final models:', finalModels.map(m => m.name));

    return NextResponse.json({
      models: finalModels
    }, { 
      headers: corsHeaders 
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch models. Please try again.' 
    }, { 
      status: 500,
      headers: corsHeaders 
    });
  }
} 