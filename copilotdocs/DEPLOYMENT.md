<!--
This file contains comprehensive deployment guidelines for SmartPack production environments.
Keep this comment at the top; do not overwrite or remove it when updating the document.

DOCUMENT PURPOSE:
- Provide step-by-step production deployment procedures
- Document infrastructure requirements and AWS setup
- Define environment configuration and secrets management
- Establish monitoring, backup, and maintenance procedures
- Serve as operational runbook for deployment teams

HOW TO UPDATE:
1. INFRASTRUCTURE CHANGES: Update immediately when AWS resources or architecture changes
2. DEPLOYMENT STEPS: Modify procedures when deployment process evolves
3. ENVIRONMENT CONFIG: Update when new environment variables or secrets are added
4. MONITORING SETUP: Revise when new monitoring tools or alerts are configured
5. SECURITY UPDATES: Modify when security requirements or procedures change
6. ROLLBACK PROCEDURES: Update when recovery processes are tested or changed

FORMATTING RULES:
- Use clear step-by-step numbered instructions
- Include all required commands with exact syntax
- Provide verification steps after major deployment phases
- Document all environment variables and their purposes
- Include troubleshooting sections for common deployment issues
- Link to related documentation (architecture, security, troubleshooting)
- Use consistent terminology for AWS services and resources
-->

# SmartPack Deployment Guide

## ⚠️ CLARIFYING QUESTIONS NEEDED

**IMPORTANT**: This document contains fictional AWS infrastructure that needs to be revised based on actual implementation plans. The following questions need answers:

1. **AWS Account**: Do you have an AWS account set up for SmartPack deployment?
2. **Domain**: Do you have a registered domain name for production?
3. **AWS Services**: Which AWS services do you actually plan to use (S3, CloudFront, Lambda, API Gateway)?
4. **Deployment Strategy**: Do you want serverless (Lambda) or container-based deployment?
5. **Environment Variables**: What are the actual environment variables needed for the Lambda function?
6. **Budget Constraints**: What are the AWS cost considerations for this deployment?
7. **CI/CD**: Do you want automated deployment or manual deployment procedures?
8. **Monitoring**: What level of monitoring and alerting do you need?

## Current Deployment Status

### ✅ **Ready for Deployment**

- **Lambda Function**: Express.js app with serverless-http wrapper
- **Frontend Build**: React app builds to `/dist` folder via Vite
- **Development Environment**: Working locally with hot reload
- **API Integration**: Frontend connects to localhost:3000 backend

### 🔄 **Needs Configuration**

- **AWS Account Setup**: IAM roles, policies, and service configurations
- **Domain Registration**: Production domain name and SSL certificates
- **Environment Variables**: Production API URLs and configuration
- **Build Scripts**: Deployment automation and CI/CD pipeline

### ❌ **Not Yet Implemented**

- **AWS Infrastructure**: No resources currently deployed
- **Production Environment**: No production build deployed anywhere
- **Monitoring/Logging**: No CloudWatch or alerting configured
- **Backup/Recovery**: No data backup strategies implemented

This document provides comprehensive deployment procedures for SmartPack production environments.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Infrastructure Setup](#infrastructure-setup)
- [Environment Configuration](#environment-configuration)
- [Deployment Procedures](#deployment-procedures)
- [Post-Deployment Verification](#post-deployment-verification)
- [Monitoring & Alerts](#monitoring--alerts)
- [Backup & Recovery](#backup--recovery)
- [Rollback Procedures](#rollback-procedures)
- [Maintenance](#maintenance)
- [Troubleshooting](#troubleshooting)

## Overview

SmartPack deployment architecture leverages AWS services for scalable, serverless operation:

- **Frontend**: Static React app hosted on AWS S3 + CloudFront
- **Backend**: AWS Lambda functions with API Gateway
- **AI Processing**: Container-based Lambda for Ollama model
- **Monitoring**: CloudWatch + AWS X-Ray
- **Security**: WAF + SSL/TLS termination

## Prerequisites

### Required Tools

```bash
# AWS CLI v2
aws --version

# Node.js 18+ and npm
node --version
npm --version

# AWS CDK (for infrastructure as code)
npm install -g aws-cdk
cdk --version

# Docker (for Lambda container deployment)
docker --version
```

### AWS Account Setup

1. **AWS Account**: Production AWS account with appropriate permissions
2. **IAM User**: Deployment user with required policies
3. **AWS CLI**: Configured with production credentials
4. **Domain**: Registered domain for production URL (optional)

### Required IAM Permissions

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "lambda:*",
        "apigateway:*",
        "s3:*",
        "cloudfront:*",
        "cloudwatch:*",
        "iam:CreateRole",
        "iam:AttachRolePolicy",
        "iam:PassRole"
      ],
      "Resource": "*"
    }
  ]
}
```

## Infrastructure Setup

### 1. S3 Bucket Configuration

#### Frontend Hosting Bucket

```bash
# Create S3 bucket for static hosting
aws s3 mb s3://smartpack-frontend-prod --region us-east-1

# Configure bucket for static website hosting
aws s3 website s3://smartpack-frontend-prod \
  --index-document index.html \
  --error-document index.html

# Set bucket policy for public read access
aws s3api put-bucket-policy \
  --bucket smartpack-frontend-prod \
  --policy file://bucket-policy.json
```

**bucket-policy.json:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::smartpack-frontend-prod/*"
    }
  ]
}
```

### 2. CloudFront Distribution

```bash
# Create CloudFront distribution configuration
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

**cloudfront-config.json:**

```json
{
  "CallerReference": "smartpack-prod-$(date +%s)",
  "Comment": "SmartPack Production CDN",
  "DefaultCacheBehavior": {
    "TargetOriginId": "smartpack-s3-origin",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000
  },
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "smartpack-s3-origin",
        "DomainName": "smartpack-frontend-prod.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "Enabled": true,
  "PriceClass": "PriceClass_100"
}
```

### 3. Lambda Function Setup

#### API Lambda Function

```bash
# Create deployment package
zip -r smartpack-api.zip . -x "*.git*" "node_modules/*" "*.md"

# Create Lambda function
aws lambda create-function \
  --function-name smartpack-api-prod \
  --runtime nodejs18.x \
  --role arn:aws:iam::ACCOUNT_ID:role/smartpack-lambda-role \
  --handler index.handler \
  --zip-file fileb://smartpack-api.zip \
  --timeout 30 \
  --memory-size 512
```

#### AI Processing Lambda (Container)

```bash
# Build Docker image for Ollama Lambda
docker build -t smartpack-ai .

# Tag for ECR
docker tag smartpack-ai:latest ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/smartpack-ai:latest

# Push to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/smartpack-ai:latest

# Create Lambda function from container
aws lambda create-function \
  --function-name smartpack-ai-prod \
  --code ImageUri=ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/smartpack-ai:latest \
  --role arn:aws:iam::ACCOUNT_ID:role/smartpack-lambda-role \
  --timeout 300 \
  --memory-size 3008
```

### 4. API Gateway Configuration

```bash
# Create REST API
aws apigateway create-rest-api \
  --name smartpack-api-prod \
  --description "SmartPack Production API"

# Get API ID from output, then create resources and methods
export API_ID=<api-id-from-previous-command>

# Create /generate resource
aws apigateway create-resource \
  --rest-api-id $API_ID \
  --parent-id <root-resource-id> \
  --path-part generate

# Configure POST method for /generate
aws apigateway put-method \
  --rest-api-id $API_ID \
  --resource-id <generate-resource-id> \
  --http-method POST \
  --authorization-type NONE

# Deploy API
aws apigateway create-deployment \
  --rest-api-id $API_ID \
  --stage-name prod
```

## Environment Configuration

### Environment Variables

#### Lambda Function Environment Variables

```bash
# Set environment variables for API Lambda
aws lambda update-function-configuration \
  --function-name smartpack-api-prod \
  --environment Variables='{
    "NODE_ENV":"production",
    "OLLAMA_HOST":"http://localhost:11434",
    "AI_MODEL":"llama3.1:8b",
    "LOG_LEVEL":"info",
    "CORS_ORIGIN":"https://your-domain.com"
  }'

# Set environment variables for AI Lambda
aws lambda update-function-configuration \
  --function-name smartpack-ai-prod \
  --environment Variables='{
    "NODE_ENV":"production",
    "MODEL_NAME":"llama3.1:8b",
    "MAX_TOKENS":"2048",
    "TEMPERATURE":"0.7"
  }'
```

### Secrets Management

```bash
# Store sensitive configuration in AWS Secrets Manager
aws secretsmanager create-secret \
  --name smartpack/prod/config \
  --secret-string '{
    "apiKey": "your-api-key",
    "weatherApiKey": "your-weather-api-key",
    "databaseUrl": "your-database-url"
  }'
```

### SSL/TLS Certificate

```bash
# Request SSL certificate via ACM (must be in us-east-1 for CloudFront)
aws acm request-certificate \
  --domain-name smartpack.yourdomain.com \
  --validation-method DNS \
  --region us-east-1
```

## Deployment Procedures

### 1. Frontend Deployment

#### Build and Deploy React App

```bash
# Install dependencies
npm install

# Build production version
npm run build

# Sync to S3 bucket
aws s3 sync ./dist s3://smartpack-frontend-prod --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id <distribution-id> \
  --paths "/*"
```

#### Automated Frontend Deployment Script

```bash
#!/bin/bash
# deploy-frontend.sh

set -e

echo "Building SmartPack frontend..."
npm run build

echo "Deploying to S3..."
aws s3 sync ./dist s3://smartpack-frontend-prod --delete

echo "Invalidating CloudFront cache..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
  --distribution-id <distribution-id> \
  --paths "/*" \
  --query 'Invalidation.Id' \
  --output text)

echo "Waiting for invalidation to complete..."
aws cloudfront wait invalidation-completed \
  --distribution-id <distribution-id> \
  --id $INVALIDATION_ID

echo "Frontend deployment complete!"
```

### 2. Backend Deployment

#### API Lambda Deployment

```bash
# Install production dependencies
npm install --production

# Create deployment package
zip -r smartpack-api-$(date +%Y%m%d-%H%M%S).zip . \
  -x "*.git*" "*.md" "test/*" "docs/*"

# Update Lambda function
aws lambda update-function-code \
  --function-name smartpack-api-prod \
  --zip-file fileb://smartpack-api-$(date +%Y%m%d-%H%M%S).zip

# Update function configuration if needed
aws lambda update-function-configuration \
  --function-name smartpack-api-prod \
  --timeout 30 \
  --memory-size 512
```

#### AI Lambda Deployment

```bash
# Build new container image
docker build -t smartpack-ai:$(date +%Y%m%d-%H%M%S) .

# Tag for ECR
docker tag smartpack-ai:$(date +%Y%m%d-%H%M%S) \
  ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/smartpack-ai:$(date +%Y%m%d-%H%M%S)

# Push to ECR
docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/smartpack-ai:$(date +%Y%m%d-%H%M%S)

# Update Lambda function
aws lambda update-function-code \
  --function-name smartpack-ai-prod \
  --image-uri ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/smartpack-ai:$(date +%Y%m%d-%H%M%S)
```

### 3. Complete Deployment Script

```bash
#!/bin/bash
# deploy-all.sh

set -e

echo "Starting SmartPack production deployment..."

# Deploy frontend
echo "Deploying frontend..."
./deploy-frontend.sh

# Deploy backend
echo "Deploying backend..."
./deploy-backend.sh

# Run post-deployment tests
echo "Running deployment verification..."
./verify-deployment.sh

echo "Deployment complete!"
```

## Post-Deployment Verification

### 1. Health Check Tests

```bash
# Test API Gateway health endpoint
curl -f https://your-api-gateway-url/prod/health

# Test complete packing list generation
curl -X POST https://your-api-gateway-url/prod/generate \
  -H "Content-Type: application/json" \
  -d '{
    "trip": {
      "name": "Test Deployment",
      "startDate": "2025-08-01",
      "endDate": "2025-08-03",
      "destinations": ["Paris, France"]
    },
    "weather": [{
      "location": "Paris, France",
      "temperature": 22,
      "conditions": "Sunny",
      "precipitation": 0
    }]
  }'
```

### 2. Frontend Verification

```bash
# Test frontend accessibility
curl -f https://your-domain.com

# Test key functionality
# (Manual testing in browser recommended)
```

### 3. Performance Testing

```bash
# Load test API endpoints
ab -n 100 -c 10 https://your-api-gateway-url/prod/health

# Monitor CloudWatch metrics during testing
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Duration \
  --dimensions Name=FunctionName,Value=smartpack-api-prod \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average,Maximum
```

## Monitoring & Alerts

### CloudWatch Dashboards

```bash
# Create CloudWatch dashboard
aws cloudwatch put-dashboard \
  --dashboard-name SmartPack-Production \
  --dashboard-body file://dashboard-config.json
```

### Lambda Monitoring

- **Duration**: Monitor function execution time
- **Error Rate**: Track failed invocations
- **Concurrent Executions**: Monitor concurrency limits
- **Memory Usage**: Track memory utilization

### CloudFront Monitoring

- **Origin Latency**: Monitor S3 response times
- **Cache Hit Rate**: Track CDN efficiency
- **Error Rate**: Monitor 4xx/5xx errors

### Alert Configuration

```bash
# Create CloudWatch alarm for high error rate
aws cloudwatch put-metric-alarm \
  --alarm-name smartpack-high-error-rate \
  --alarm-description "SmartPack API high error rate" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:ACCOUNT_ID:smartpack-alerts
```

## Backup & Recovery

### Database Backup

```bash
# Automated backup script (if database is added)
#!/bin/bash
# backup-database.sh

BACKUP_NAME="smartpack-backup-$(date +%Y%m%d-%H%M%S)"

# Create database snapshot
aws rds create-db-snapshot \
  --db-snapshot-identifier $BACKUP_NAME \
  --db-instance-identifier smartpack-prod

echo "Database backup created: $BACKUP_NAME"
```

### Configuration Backup

```bash
# Export current infrastructure configuration
aws lambda get-function-configuration \
  --function-name smartpack-api-prod > lambda-config-backup.json

aws apigateway get-rest-api \
  --rest-api-id $API_ID > api-config-backup.json
```

### Recovery Procedures

1. **Lambda Function Recovery**: Redeploy from last known good deployment package
2. **Frontend Recovery**: Redeploy from last successful build
3. **Configuration Recovery**: Restore from exported configuration files
4. **Database Recovery**: Restore from latest snapshot

## Rollback Procedures

### 1. Frontend Rollback

```bash
#!/bin/bash
# rollback-frontend.sh

# List recent S3 sync operations
aws s3api list-object-versions \
  --bucket smartpack-frontend-prod \
  --prefix index.html

# Restore previous version
aws s3api copy-object \
  --copy-source smartpack-frontend-prod/index.html?versionId=<previous-version-id> \
  --bucket smartpack-frontend-prod \
  --key index.html

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id <distribution-id> \
  --paths "/*"
```

### 2. Backend Rollback

```bash
# Get previous Lambda version
aws lambda list-versions-by-function \
  --function-name smartpack-api-prod

# Update alias to previous version
aws lambda update-alias \
  --function-name smartpack-api-prod \
  --name LIVE \
  --function-version <previous-version>
```

### 3. Emergency Rollback

```bash
#!/bin/bash
# emergency-rollback.sh

echo "Executing emergency rollback..."

# Rollback frontend
./rollback-frontend.sh

# Rollback backend
./rollback-backend.sh

# Verify rollback
./verify-deployment.sh

echo "Emergency rollback complete!"
```

## Maintenance

### Regular Maintenance Tasks

#### Weekly Tasks

1. **Update Dependencies**: Review and update npm packages
2. **Security Scan**: Run security vulnerability scans
3. **Performance Review**: Analyze CloudWatch metrics
4. **Backup Verification**: Test backup restoration procedures

#### Monthly Tasks

1. **Cost Analysis**: Review AWS costs and optimize
2. **Capacity Planning**: Analyze usage trends and scale accordingly
3. **Security Review**: Update IAM policies and access controls
4. **Disaster Recovery Test**: Full DR procedure testing

### Automated Maintenance

```bash
# Automated dependency update script
#!/bin/bash
# update-dependencies.sh

echo "Checking for dependency updates..."
npm audit
npm update

echo "Running tests after updates..."
npm test

echo "Dependency maintenance complete!"
```

## Troubleshooting

### Common Deployment Issues

#### 1. Lambda Deployment Failures

**Symptoms**: Function update fails with timeout or memory errors

**Solutions**:

```bash
# Check function logs
aws logs tail /aws/lambda/smartpack-api-prod --follow

# Increase memory and timeout
aws lambda update-function-configuration \
  --function-name smartpack-api-prod \
  --memory-size 1024 \
  --timeout 60
```

#### 2. CloudFront Cache Issues

**Symptoms**: Old content served after deployment

**Solutions**:

```bash
# Force cache invalidation
aws cloudfront create-invalidation \
  --distribution-id <distribution-id> \
  --paths "/*"

# Check invalidation status
aws cloudfront get-invalidation \
  --distribution-id <distribution-id> \
  --id <invalidation-id>
```

#### 3. API Gateway CORS Issues

**Symptoms**: Frontend can't access API due to CORS errors

**Solutions**:

```bash
# Update CORS configuration
aws apigateway put-method-response \
  --rest-api-id $API_ID \
  --resource-id <resource-id> \
  --http-method POST \
  --status-code 200 \
  --response-parameters method.response.header.Access-Control-Allow-Origin=false
```

### Monitoring and Debugging

```bash
# Real-time log monitoring
aws logs tail /aws/lambda/smartpack-api-prod --follow

# Get recent error logs
aws logs filter-log-events \
  --log-group-name /aws/lambda/smartpack-api-prod \
  --start-time $(date -d '1 hour ago' +%s)000 \
  --filter-pattern "ERROR"

# Check X-Ray traces for performance issues
aws xray get-trace-summaries \
  --time-range-type TimeRangeByStartTime \
  --start-time $(date -d '1 hour ago' +%s) \
  --end-time $(date +%s)
```

### Performance Optimization

1. **Lambda Cold Start**: Use provisioned concurrency for consistent performance
2. **Memory Allocation**: Monitor CloudWatch metrics to optimize memory settings
3. **Bundle Size**: Minimize deployment package size for faster cold starts
4. **Connection Pooling**: Implement connection reuse for external services

## See Also

- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture and infrastructure overview
- [SECURITY.md](SECURITY.md) - Security configurations and best practices
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Detailed troubleshooting procedures
- [API.md](API.md) - API documentation and testing
- [DEVLOG.md](DEVLOG.md) - Development history and deployment changes
