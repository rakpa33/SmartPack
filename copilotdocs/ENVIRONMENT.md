<!--
This file documents environment variables, setup, and configuration for SmartPack.
Keep this comment at the top; do not overwrite or remove it when updating the document.

How to update: Add or update entries whenever you add, remove, or change environment variables, setup steps, or configuration. Review after onboarding or infra changes.
-->

# Environment Variables for SmartPack

List all required environment variables and their purpose. Keep this file up-to-date as you add or change variables.

## Development Environment

```bash
# Frontend development
NODE_ENV=development
VITE_API_URL=http://localhost:3000

# Backend development
PORT=3000
NODE_ENV=development
```

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
✅ **Local Development**: Backend runs on http://localhost:3000
🚧 **Production Deployment**: Ready for AWS Lambda deployment
🚧 **CORS Configuration**: Update production URLs after deployment
