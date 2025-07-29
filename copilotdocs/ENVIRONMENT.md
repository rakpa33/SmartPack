<!--
This file documents environment variables, configuration settings, deployment procedures, and development environment setup for SmartPack.
Keep this comment at the top; do not overwrite or remove it when updating the document.

DOCUMENT PURPOSE:
- Complete environment configuration reference for all deployment contexts
- Development environment setup with enhanced AI and professional UI requirements
- Production deployment procedures for AWS Lambda and static hosting
- Environment variable documentation with purpose and usage examples
- Port configuration and service startup procedures
- Troubleshooting guide for environment-specific issues

ENVIRONMENT CONTEXTS:
- **Development**: Local Vite + Express + Ollama AI setup with enhanced features
- **Testing**: CI/CD environment configuration for comprehensive test suite
- **Production**: AWS Lambda backend + static frontend deployment
- **Hybrid**: Local development with cloud service integration

WHEN TO UPDATE:
1. NEW ENVIRONMENT VARIABLES: API URLs, service endpoints, configuration flags
2. PORT CHANGES: Service port updates, proxy configurations, development server changes
3. DEPLOYMENT UPDATES: AWS configuration, serverless framework changes, hosting updates
4. SERVICE INTEGRATION: New external APIs, enhanced AI features, professional UI dependencies
5. TESTING ENVIRONMENT: CI/CD configuration, test database setup, mock service configuration
6. SECURITY UPDATES: API keys, authentication methods, CORS configuration

UPDATE GUIDELINES:
- Document both development and production values for each environment variable
- Include clear purpose statements for each configuration setting
- Provide verification steps and expected outputs for environment validation
- Cross-reference with COMMANDS.md for startup procedures and TROUBLESHOOTING.md for common issues
- Maintain current status sections reflecting enhanced AI and professional UI features
- Include specific version requirements and compatibility notes

CONFIGURATION CATEGORIES:
- **Core Services**: Frontend (Vite), Backend (Express/Lambda), AI (Ollama)
- **Development Tools**: Testing frameworks, build tools, development servers
- **External APIs**: Weather services, geocoding, enhanced AI integration
- **Deployment**: AWS credentials, serverless configuration, static hosting
- **Security**: CORS settings, API authentication, environment isolation

VERIFICATION PROCEDURES:
- All required services accessible on documented ports
- Enhanced AI integration functional with intelligent responses
- Professional UI features rendering correctly (Heroicons, accessibility)
- Complete test suite passing in environment
- Production deployment health checks successful

HOW TO USE FOR AI ASSISTANCE:
- Reference this document for complete environment setup before troubleshooting connectivity issues
- Use verification procedures to systematically diagnose environment problems
- Check current integration status to understand implemented features and deployment readiness
- Cross-reference with ONBOARDING.md for step-by-step setup and COMMANDS.md for specific command syntax
- Validate that environment configuration aligns with current project dependencies and enhanced features
- Use troubleshooting sections to resolve common environment-specific issues
-->

# Environment Variables for SmartPack

List all required environment variables and their purpose. Keep this file up-to-date as you add or change variables.

## Development Environment

```bash
# Frontend development (Vite runs on port 5173)
NODE_ENV=development
VITE_API_URL=http://localhost:3000

# Backend development (Express server runs on port 3000)
PORT=3000
NODE_ENV=development

# Ollama AI Configuration
OLLAMA_HOST=http://localhost:11434  # Local Ollama service
OLLAMA_MODEL=llama3.1:8b           # AI model for packing recommendations
```

## Required Development Setup

### Prerequisites

1. **Node.js** v20.14.0 or later
2. **npm** 10.7.0 or later
3. **Ollama** installed and running locally
   - Download from: https://ollama.ai/
   - Install llama3.1:8b model: `ollama pull llama3.1:8b`
   - Start service: `ollama serve` (runs on port 11434)

### Local Development Ports

- **Frontend (Vite)**: `http://localhost:5173`
- **Backend (Express)**: `http://localhost:3000`
- **Ollama AI Service**: `http://localhost:11434`
- **Health Check**: `http://localhost:3000/health`

### Startup Commands

```bash
# Terminal 1: Start Ollama service (if not running as service)
ollama serve

# Terminal 2: Start backend with AI integration
npm run lambda:dev

# Terminal 3: Start frontend
npm run dev
```

### Installation Steps

```bash
# Install dependencies with legacy peer deps for compatibility
npm install --legacy-peer-deps

# Verify Ollama model availability
ollama list  # Should show llama3.1:8b

# Test Ollama integration
ollama run llama3.1:8b "Generate a packing list for a 3-day business trip"
```

### Verification Steps

1. **Ollama Service**: Verify `http://localhost:11434` responds
2. **Backend Health**: Visit `http://localhost:3000/health`
3. **Frontend Running**: Visit `http://localhost:5173`
4. **AI Integration Test**: Generate packing list and verify real AI responses (not mock data)
5. **Professional UI Verification**: Confirm Heroicons vector icons display properly
6. **Testing Suite**: Run `npm test -- --run` and `npx playwright test`
7. **Complete AI Workflow**: Plan trip → Generate AI checklist → Custom AI suggestions

## Production Environment

```bash
# Frontend production
NODE_ENV=production
VITE_API_URL=https://your-deployed-api-gateway-url.amazonaws.com

# Backend production (AWS Lambda)
NODE_ENV=production
AWS_REGION=us-east-2
```

## AWS Deployment Variables

Required for serverless deployment:

```bash
AWS_PROFILE=default
AWS_REGION=us-east-2
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

## How to use

- Copy `.env.example` to `.env` and fill in the values for your environment.
- Reference this file for variable descriptions and usage.

## Deployment Steps

### Backend Deployment (AWS Lambda)

1. **Prerequisites**:

   ```bash
   # Ensure AWS CLI is configured
   aws configure list

   # Install serverless dependencies
   npm install -D serverless@3 serverless-esbuild serverless-offline
   ```

2. **Build and Deploy**:

   ```bash
   # Build the lambda function
   npm run lambda:build

   # Deploy to AWS
   npm run lambda:deploy
   ```

3. **Update Frontend Configuration**:
   - After successful deployment, update `src/services/apiService.ts`
   - Replace `http://localhost:3000` with your deployed API Gateway URL
   - Update the production URL in `serverless.yml` custom.corsOrigin.prod

### Frontend Deployment

1. **Build for production**:

   ```bash
   npm run build
   ```

2. **Deploy to your hosting service** (Vercel, Netlify, S3, etc.)

## Current Integration Status

✅ **Enhanced AI Backend**: Complete intelligent system with 7-aspect trip analysis  
✅ **Professional UI**: Heroicons React vector icon system with ARIA accessibility  
✅ **Comprehensive Testing**: Unit, integration, and E2E test coverage following external best practices  
✅ **Backend API**: Lambda function with Express.js server and intelligent recommendations  
✅ **Frontend Integration**: TripForm calls enhanced AI backend for context-aware packing lists  
✅ **AI Suggestions Panel**: Smart prompt refinement with intelligent backend integration  
✅ **Local Development**: Enhanced backend runs on http://localhost:3000  
✅ **Health Monitoring**: Backend health check endpoint available  
✅ **CORS Configuration**: Properly configured for local development  
✅ **Error Handling**: Graceful API error handling in frontend  
✅ **Test Suite**: Vitest + React Testing Library + Playwright comprehensive coverage  
🚧 **Production Deployment**: Ready for AWS Lambda deployment with enhanced AI  
🚧 **Production CORS**: Update production URLs after deployment

## Troubleshooting Environment Issues

### Enhanced AI Backend Connection Problems

```bash
# Check if enhanced AI backend is running
netstat -ano | findstr ":3000"

# Test enhanced backend health
curl http://localhost:3000/health
# OR visit in browser: http://localhost:3000/health

# Restart enhanced AI backend if needed
taskkill /F /IM node.exe
npm run lambda:dev

# Test intelligent recommendations
curl -X POST http://localhost:3000/api/generate-suggestions ^
  -H "Content-Type: application/json" ^
  -d "{\"prompt\":\"4-day business trip to Chicago\"}"
```

### Professional UI Icon Issues

- Verify Heroicons React package is installed: `npm list @heroicons/react`
- Check that vector icons render properly (not emoji)
- Ensure ARIA accessibility attributes are present
- Test icon responsiveness across device sizes

### Comprehensive Testing Environment

```bash
# Run complete test suite
npm test -- --run

# Run E2E tests specifically
npx playwright test

# Run enhanced AI unit tests
npm test -- enhancedAI.unit.test.ts

# Run integration tests
npm test -- enhancedAI.integration.test.tsx

# Run E2E tests
npx playwright test enhancedAI.e2e.test.ts
```

### Frontend API Connection Issues

- Verify `VITE_API_URL` points to `http://localhost:3000` in development
- Check browser developer console for CORS or network errors
- Ensure both enhanced AI frontend and backend are running simultaneously
- **Test Enhanced AI**: Verify intelligent recommendations appear (not repetitive static suggestions)
- **Professional UI Check**: Confirm Heroicons vector icons load properly
- **Test Coverage**: Run test suite to validate API integration functionality
