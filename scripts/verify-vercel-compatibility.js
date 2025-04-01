#!/usr/bin/env node

/**
 * Vercel Compatibility Checker
 * This script checks your Next.js application for common issues that might cause
 * deployment problems on Vercel.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const NEXT_CONFIG_PATH = path.join(ROOT_DIR, 'next.config.js');
const VERCEL_CONFIG_PATH = path.join(ROOT_DIR, 'vercel.json');
const PACKAGE_JSON_PATH = path.join(ROOT_DIR, 'package.json');

// ANSI color codes for output formatting
const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Initialize results
let errors = 0;
let warnings = 0;
let passes = 0;

function log(message, type = 'info') {
  switch (type) {
    case 'error':
      console.error(`${COLORS.red}✖ ERROR: ${message}${COLORS.reset}`);
      errors++;
      break;
    case 'warning':
      console.warn(`${COLORS.yellow}⚠ WARNING: ${message}${COLORS.reset}`);
      warnings++;
      break;
    case 'success':
      console.log(`${COLORS.green}✓ PASS: ${message}${COLORS.reset}`);
      passes++;
      break;
    default:
      console.log(`${COLORS.blue}ℹ INFO: ${message}${COLORS.reset}`);
  }
}

function checkFileExists(filePath, name) {
  if (fs.existsSync(filePath)) {
    log(`${name} found at ${filePath}`, 'success');
    return true;
  } else {
    log(`${name} not found at ${filePath}`, 'error');
    return false;
  }
}

function checkNextConfig() {
  log('Checking Next.js configuration...');
  
  if (!checkFileExists(NEXT_CONFIG_PATH, 'next.config.js')) {
    return;
  }
  
  try {
    // Read the next.config.js file as text to check for deprecated properties
    const configContent = fs.readFileSync(NEXT_CONFIG_PATH, 'utf8');
    
    // Check for deprecated properties
    const deprecatedProps = [
      { regex: /target\s*:\s*['"]serverless['"]/, name: 'target' },
      { regex: /distDir\s*:\s*['"]\.\/public['"]/, name: 'distDir pointing to ./public' },
      { regex: /assetPrefix\s*:\s*['"]\.\/['"]/, name: 'assetPrefix with relative path' },
    ];
    
    for (const prop of deprecatedProps) {
      if (prop.regex.test(configContent)) {
        log(`Deprecated property '${prop.name}' found in next.config.js`, 'error');
      } else {
        log(`No deprecated '${prop.name}' property found`, 'success');
      }
    }
    
    // Check for proper handling of WebSocket dependencies
    const hasWebSocketConfig = /externals.*bufferutil|utf-8-validate/.test(configContent);
    if (hasWebSocketConfig) {
      log('WebSocket dependencies properly configured as externals', 'success');
    } else {
      log('WebSocket dependencies not configured as externals. This might cause issues with WebSocket functionality', 'warning');
    }
    
  } catch (error) {
    log(`Error reading next.config.js: ${error.message}`, 'error');
  }
}

function checkVercelConfig() {
  log('Checking Vercel configuration...');
  
  if (!checkFileExists(VERCEL_CONFIG_PATH, 'vercel.json')) {
    log('vercel.json is optional, but can be useful for custom configuration', 'info');
    return;
  }
  
  try {
    const vercelConfig = JSON.parse(fs.readFileSync(VERCEL_CONFIG_PATH, 'utf8'));
    
    // Check for potential issues in vercel.json
    if (vercelConfig.builds && vercelConfig.framework) {
      log('Both "builds" and "framework" properties found in vercel.json. This might cause conflicts.', 'warning');
    } else if (vercelConfig.framework === 'nextjs') {
      log('Framework correctly set to "nextjs"', 'success');
    }
    
    // Check for proper Node.js version
    if (vercelConfig.builds && vercelConfig.builds.some(build => build.use === '@vercel/next')) {
      const nextBuild = vercelConfig.builds.find(build => build.use === '@vercel/next');
      if (nextBuild && nextBuild.config && nextBuild.config.nodeVersion) {
        log(`Node.js version set to ${nextBuild.config.nodeVersion} for Next.js build`, 'success');
      } else {
        log('No Node.js version specified for Next.js build', 'warning');
      }
    }
    
  } catch (error) {
    log(`Error parsing vercel.json: ${error.message}`, 'error');
  }
}

function checkPackageJson() {
  log('Checking package.json...');
  
  if (!checkFileExists(PACKAGE_JSON_PATH, 'package.json')) {
    return;
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
    
    // Check for required dependencies
    const requiredDeps = ['next', 'react', 'react-dom'];
    for (const dep of requiredDeps) {
      if (packageJson.dependencies && packageJson.dependencies[dep]) {
        log(`Required dependency '${dep}' found: ${packageJson.dependencies[dep]}`, 'success');
      } else {
        log(`Required dependency '${dep}' not found in dependencies`, 'error');
      }
    }
    
    // Check for WebSocket dependencies
    const wsRelatedDeps = ['ws', 'bufferutil', 'utf-8-validate'];
    for (const dep of wsRelatedDeps) {
      if ((packageJson.dependencies && packageJson.dependencies[dep]) || 
          (packageJson.devDependencies && packageJson.devDependencies[dep])) {
        log(`WebSocket-related dependency '${dep}' found`, 'success');
      } else {
        log(`WebSocket-related dependency '${dep}' not found. This might cause issues if your app uses WebSockets`, 'warning');
      }
    }
    
    // Check for build script
    if (packageJson.scripts && packageJson.scripts.build === 'next build') {
      log('Build script correctly set to "next build"', 'success');
    } else if (packageJson.scripts && packageJson.scripts.build) {
      log(`Build script is set to "${packageJson.scripts.build}". Make sure it builds your Next.js app correctly`, 'warning');
    } else {
      log('No build script found in package.json', 'error');
    }
    
    // Check for engines field
    if (packageJson.engines && packageJson.engines.node) {
      log(`Node.js version requirement set to ${packageJson.engines.node}`, 'success');
    } else {
      log('No Node.js version requirement specified in "engines" field', 'warning');
    }
    
  } catch (error) {
    log(`Error parsing package.json: ${error.message}`, 'error');
  }
}

function checkApiRoutes() {
  log('Checking API routes...');
  
  const apiDir = path.join(ROOT_DIR, 'src', 'app', 'api');
  if (fs.existsSync(apiDir)) {
    log('API directory found', 'success');
    
    // Check for route.js files in API directory
    const apiRoutes = [];
    function findRouteFiles(dir) {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      for (const file of files) {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) {
          findRouteFiles(filePath);
        } else if (file.name === 'route.js' || file.name === 'route.ts') {
          apiRoutes.push(filePath);
        }
      }
    }
    
    try {
      findRouteFiles(apiDir);
      log(`Found ${apiRoutes.length} API route files`, 'info');
      
      // Check each API route file for potential issues
      for (const routeFile of apiRoutes) {
        const content = fs.readFileSync(routeFile, 'utf8');
        
        // Check for proper error handling
        if (/try\s*{[\s\S]*?}\s*catch\s*\([^)]*\)\s*{/.test(content)) {
          log(`API route ${path.relative(ROOT_DIR, routeFile)} has proper error handling`, 'success');
        } else {
          log(`API route ${path.relative(ROOT_DIR, routeFile)} might be missing error handling`, 'warning');
        }
        
        // Check for proper response objects
        if (/NextResponse\.json/.test(content)) {
          log(`API route ${path.relative(ROOT_DIR, routeFile)} uses NextResponse.json for responses`, 'success');
        } else {
          log(`API route ${path.relative(ROOT_DIR, routeFile)} might not be using NextResponse.json for responses`, 'warning');
        }
      }
      
    } catch (error) {
      log(`Error checking API routes: ${error.message}`, 'error');
    }
  } else {
    log('No API directory found at src/app/api', 'info');
  }
}

function checkBuildProcess() {
  log('Checking build process...');
  
  try {
    // Run a dry-run build to check for errors
    log('Running a dry-run build check (this might take a moment)...');
    execSync('npx next build --no-lint', { stdio: 'pipe', cwd: ROOT_DIR });
    log('Next.js build completed successfully', 'success');
  } catch (error) {
    log(`Next.js build failed: ${error.message}`, 'error');
    log('This indicates that your application will likely fail to build on Vercel', 'error');
    
    // Try to extract useful information from the error
    const errorOutput = error.stdout ? error.stdout.toString() : '';
    if (errorOutput) {
      const errorLines = errorOutput.split('\n')
        .filter(line => line.includes('Error:') || line.includes('error'))
        .slice(0, 5); // Show only the first 5 error lines
      
      if (errorLines.length > 0) {
        log('Error details:', 'info');
        errorLines.forEach(line => console.log(`  ${line.trim()}`));
      }
    }
  }
}

function printSummary() {
  console.log('\n' + '-'.repeat(80));
  console.log(`${COLORS.magenta}VERCEL COMPATIBILITY CHECK SUMMARY${COLORS.reset}`);
  console.log('-'.repeat(80));
  console.log(`${COLORS.green}✓ Passed: ${passes}${COLORS.reset}`);
  console.log(`${COLORS.yellow}⚠ Warnings: ${warnings}${COLORS.reset}`);
  console.log(`${COLORS.red}✖ Errors: ${errors}${COLORS.reset}`);
  console.log('-'.repeat(80));
  
  if (errors > 0) {
    console.log(`${COLORS.red}Your application has issues that will likely cause deployment failures on Vercel.${COLORS.reset}`);
  } else if (warnings > 0) {
    console.log(`${COLORS.yellow}Your application has some potential issues that might affect deployment on Vercel.${COLORS.reset}`);
  } else {
    console.log(`${COLORS.green}Your application looks good for deployment on Vercel!${COLORS.reset}`);
  }
  
  console.log('\nFor more information about deploying Next.js on Vercel, visit:');
  console.log(`${COLORS.cyan}https://nextjs.org/docs/deployment${COLORS.reset}`);
}

// Run all checks
console.log(`${COLORS.magenta}VERCEL COMPATIBILITY CHECKER${COLORS.reset}`);
console.log(`Checking project in: ${ROOT_DIR}\n`);

checkNextConfig();
console.log('');

checkVercelConfig();
console.log('');

checkPackageJson();
console.log('');

checkApiRoutes();
console.log('');

checkBuildProcess();
console.log('');

printSummary();
