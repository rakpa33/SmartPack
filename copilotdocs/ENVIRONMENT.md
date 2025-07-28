<!--
This file documents environment variables, setup, and configuration for SmartPack.
Keep this comment at the top; do not overwrite or remove it when updating the document.

How to update: Add or update entries whenever you add, remove, or change environment variables, setup steps, or configuration. Review after onboarding or infra changes.
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
```

## Required Development Setup

### Local Development Ports

- **Frontend (Vite)**: `http://localhost:5173`
- **Backend (Express)**: `http://localhost:3000`
- **Health Check**: `http://localhost:3000/health`

### Startup Commands

```bash
# Terminal 1: Start backend
npm run lambda:dev

# Terminal 2: Start frontend
npm run dev
```

### Verification Steps

1. Backend health check: Visit `http://localhost:3000/health`
2. Frontend running: Visit `http://localhost:5173`
3. AI Suggestions: Test with custom prompt in SuggestionsPanel
4. Complete user flow: Plan trip → Generate checklist → Refine suggestions

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

✅ **Backend API**: Lambda function with Express.js server  
✅ **Frontend Integration**: TripForm calls backend API for packing list generation  
✅ **AI Suggestions Panel**: Custom prompt refinement with backend integration  
✅ **Local Development**: Backend runs on http://localhost:3000  
✅ **Health Monitoring**: Backend health check endpoint available  
✅ **CORS Configuration**: Properly configured for local development  
✅ **Error Handling**: Graceful API error handling in frontend  
🚧 **Production Deployment**: Ready for AWS Lambda deployment  
🚧 **Production CORS**: Update production URLs after deployment

## Troubleshooting Environment Issues

### Backend Connection Problems

```bash
# Check if backend is running
netstat -ano | findstr ":3000"

# Test backend health
curl http://localhost:3000/health
# OR visit in browser: http://localhost:3000/health

# Restart backend if needed
taskkill /F /IM node.exe
npm run lambda:dev
```

### Frontend API Connection Issues

- Verify `VITE_API_URL` points to `http://localhost:3000` in development
- Check browser developer console for CORS or network errors
- Ensure both frontend and backend are running simultaneously
