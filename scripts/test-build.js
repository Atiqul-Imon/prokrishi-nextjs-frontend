#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing production build...\n');

try {
  // Check if .env.local exists
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    console.log('⚠️  Warning: .env.local not found. Creating from template...');
    const templatePath = path.join(__dirname, '..', 'env.production.example');
    if (fs.existsSync(templatePath)) {
      fs.copyFileSync(templatePath, envPath);
      console.log('✅ Created .env.local from template');
    }
  }

  // Clean previous build
  console.log('🧹 Cleaning previous build...');
  execSync('rm -rf .next', { stdio: 'inherit' });

  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Run linting
  console.log('🔍 Running linting...');
  execSync('npm run lint', { stdio: 'inherit' });

  // Build the application
  console.log('🏗️  Building application...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('\n✅ Production build test completed successfully!');
  console.log('🚀 Your application is ready for deployment to Vercel.');
  
} catch (error) {
  console.error('\n❌ Build test failed:', error.message);
  process.exit(1);
} 