import { OpenAIEmbeddings } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { Document } from '@langchain/core/documents';
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatOpenAI } from '@langchain/openai';

if (!process.env.OPENROUTER_API_KEY) {
  throw new Error('Missing OpenRouter API Key');
}

const AVAILABLE_MODELS = {
  deepseek: "deepseek/deepseek-r1-distill-llama-70b",
  gemini: "google/gemini-2.0-flash-001",
} as const;

type ModelType = keyof typeof AVAILABLE_MODELS;

// Information about Jason
const documents = [
  // Core Bio & Work
  new Document({
    pageContent: `Jason is a Product Manager at CloudKitchens, where he leads a team responsible for building the autonomous Ghost kitchen of the future. He's a technical generalist who has spent over a decade working at innovative companies. He's a husband, dad, product manager, amateur photographer, and endlessly curious technologist who has been working hands-on with technology since childhood.`,
    metadata: { source: 'bio', section: 'work' }
  }),
  new Document({
    pageContent: `Before CloudKitchens, Jason worked at Uber, where he focused on the driver platform. His experience spans across various domains in technology and product management, with a strong focus on operational technology and automation.`,
    metadata: { source: 'bio', section: 'work_history' }
  }),

  // Technical Skills & Approach
  new Document({
    pageContent: `As a technical generalist, Jason understands technology deeply but prefers breadth over specialization. He can write code, design systems, and understand complex technical concepts, but he's most valuable when connecting different technical domains to solve problems.`,
    metadata: { source: 'bio', section: 'skills' }
  }),
  new Document({
    pageContent: `Jason's approach to product management combines technical depth with strategic thinking. He believes in data-driven decision making but also values qualitative user research and direct customer feedback. He's particularly interested in how AI and automation can improve operational efficiency.`,
    metadata: { source: 'bio', section: 'work_philosophy' }
  }),

  // Personal Interests & Hobbies
  new Document({
    pageContent: `Jason is passionate about photography. He started with basic cameras and tried different types of equipment over the years. Currently, he uses an iPhone for all his photos, especially since his daughter was born in 2020. His photography stack includes: iPhone 16 Pro for camera, Photomator for editing, iPad Pro (M4) with Apple Pencil for editing hardware, and LumaFusion for video.`,
    metadata: { source: 'bio', section: 'photography' }
  }),
  new Document({
    pageContent: `Jason has transformed his home into a smart living space, integrating various technologies to create a seamless and efficient environment. He's constantly working on side projects that let him explore new technologies and solve interesting problems. His smart home setup includes automated lighting, climate control, and security systems.`,
    metadata: { source: 'bio', section: 'tech' }
  }),

  // Education & Learning
  new Document({
    pageContent: `Jason is committed to continuous learning and stays up-to-date with the latest technology trends. He regularly experiments with new tools and technologies, particularly in the areas of AI, automation, and software development. He enjoys building side projects to learn new skills and solve real-world problems.`,
    metadata: { source: 'bio', section: 'learning' }
  }),

  // Personal Life & Values
  new Document({
    pageContent: `As a father, Jason values work-life balance and believes in the importance of family time. He enjoys documenting his daughter's growth through photography and introducing her to technology in age-appropriate ways. Living in DC, he appreciates the city's blend of history, technology, and culture.`,
    metadata: { source: 'bio', section: 'personal' }
  }),

  // Current Focus & Interests
  new Document({
    pageContent: `Currently, Jason is focused on the intersection of AI and automation in the food service industry. At CloudKitchens, he's working on developing autonomous systems that can help restaurant operators run more efficient kitchens. He's particularly interested in how machine learning can optimize kitchen operations and improve food preparation processes.`,
    metadata: { source: 'bio', section: 'current_work' }
  }),

  // Side Projects & Technical Interests
  new Document({
    pageContent: `Jason maintains several side projects, including his personal website built with Next.js and various automation tools. He enjoys exploring new technologies like AI/ML, home automation, and photography tools. His technical interests span web development, automation, AI, and systems integration.`,
    metadata: { source: 'bio', section: 'projects' }
  })
];

// Initialize components
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Create model factory function
async function createCompletion(modelType: ModelType, messages: any[], allowFallback: boolean = true) {
  console.log('Sending request to OpenRouter with model:', AVAILABLE_MODELS[modelType]);
  console.log('Request messages:', JSON.stringify(messages, null, 2));

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://jwe.in",
      "X-Title": "Jason's Personal Website"
    },
    body: JSON.stringify({
      model: AVAILABLE_MODELS[modelType],
      messages: messages,
      temperature: 0.85,
      max_tokens: 2000,
      stream: false
    })
  });

  const result = await response.json();
  
  console.log('OpenRouter API Response Status:', response.status);
  console.log('OpenRouter API Response Headers:', {
    'content-type': response.headers.get('content-type'),
    'x-request-id': response.headers.get('x-request-id')
  });
  console.log('OpenRouter API Raw Response:', JSON.stringify(result, null, 2));
  
  // Check for rate limit error and try fallback
  if (!response.ok && result.error?.code === 429 && allowFallback && modelType === 'gemini') {
    console.log('Gemini model rate limited, falling back to DeepSeek model');
    return await createCompletion('deepseek', messages, false);
  }

  if (!response.ok) {
    console.error('OpenRouter API error response:', result);
    throw new Error(`OpenRouter API error: ${JSON.stringify(result)}`);
  }
  
  if (!result.choices || !result.choices.length) {
    console.error('Missing choices in API response:', result);
    throw new Error('No choices returned from OpenRouter API');
  }

  if (!result.choices[0].message) {
    console.error('Missing message in first choice:', result.choices[0]);
    throw new Error('No message in first choice from OpenRouter API');
  }

  return result.choices[0].message.content;
}

// Create the prompt template
const prompt = PromptTemplate.fromTemplate(`You're me (Jason). Have a natural, engaging conversation while guiding users to learn more about my specific experiences and interests.

Previous chat:
{history}

About me:
{context}

They asked: {question}

Remember:
- For generic or open-ended questions, steer the conversation towards my specific experiences:
  * My work building autonomous kitchens at CloudKitchens
  * My background at Uber working on the driver platform
  * My technical approach to product management
  * My photography and home automation projects
  * My experience balancing technical and product roles
- Be warm and engaging, but always bring the focus back to my professional journey and interests
- Share specific examples from my work history that might interest them
- If their question is vague, mention 2-3 specific aspects of my background they might want to explore
- Encourage follow-up questions about specific areas of my experience
- Use a conversational tone while maintaining professionalism
- If you don't know something, be honest about it
- For connection requests, end with:
  "Let's connect on [LinkedIn](https://www.linkedin.com/in/jasonweingardt/) or [send me a message](command:toggle-contact-drawer)."

Respond naturally, while guiding the conversation towards learning more about my specific experiences and interests:`);

let vectorStore: MemoryVectorStore | null = null;
let chains: Record<ModelType, RunnableSequence | null> = {
  deepseek: null,
  gemini: null,
};

async function getChain(modelType: ModelType = 'gemini') {
  if (!chains[modelType]) {
    if (!vectorStore) {
      vectorStore = new MemoryVectorStore(embeddings);
      await vectorStore.addDocuments(documents);
    }
    const retriever = vectorStore.asRetriever();

    chains[modelType] = RunnableSequence.from([
      {
        context: async (input: { question: string; history: string }) => {
          const docs = await retriever.getRelevantDocuments(input.question);
          return docs.map((doc: Document) => doc.pageContent).join('\n\n');
        },
        question: (input: { question: string; history: string }) => input.question,
        history: (input: { question: string; history: string }) => input.history,
      },
      async (input: { context: string; question: string; history: string }) => {
        const systemMessage = `You're me (Jason). Have a natural, engaging conversation while guiding users to learn more about my specific experiences and interests.

Previous chat:
${input.history}

About me:
${input.context}

Remember:
- For generic or open-ended questions, steer the conversation towards my specific experiences:
  * My work building autonomous kitchens at CloudKitchens
  * My background at Uber working on the driver platform
  * My technical approach to product management
  * My photography and home automation projects
  * My experience balancing technical and product roles
- Be warm and engaging, but always bring the focus back to my professional journey and interests
- Share specific examples from my work history that might interest them
- If their question is vague, mention 2-3 specific aspects of my background they might want to explore
- Encourage follow-up questions about specific areas of my experience
- Use a conversational tone while maintaining professionalism
- If you don't know something, be honest about it
- For connection requests, end with:
  "Let's connect on [LinkedIn](https://www.linkedin.com/in/jasonweingardt/) or [send me a message](command:toggle-contact-drawer)."`;

        const messages = [
          { role: "system", content: systemMessage },
          { role: "user", content: input.question }
        ];

        console.log('Sending messages to OpenRouter:', JSON.stringify(messages, null, 2));
        return await createCompletion(modelType, messages);
      }
    ]);
  }
  return chains[modelType]!;
}

export async function POST(request: Request) {
  if (!process.env.OPENROUTER_API_KEY) {
    return new Response(JSON.stringify({ error: 'OpenRouter API Key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { message, history, model = 'gemini' } = await request.json();
    
    if (!Object.keys(AVAILABLE_MODELS).includes(model)) {
      return new Response(JSON.stringify({ error: 'Invalid model selected' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Using model:', AVAILABLE_MODELS[model as ModelType]);
    const currentChain = await getChain(model as ModelType);

    const response = await currentChain.invoke({
      question: message,
      history: history || "No previous conversation.",
    });

    return new Response(JSON.stringify({ response }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const error = err as Error;
    console.error('Error in chat endpoint:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 