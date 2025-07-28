# SmartPack

SmartPack is a smart packing assistant that helps you prepare for your trips by generating personalized packing lists based on your trip details and weather forecasts.

## Features

- Create trip profiles with destinations, dates, and travel modes
- Automatically fetch weather data for your destinations
- Generate personalized packing lists based on trip details and weather
- Get AI-powered suggestions for items you might have forgotten
- Save and manage multiple packing lists

## Technology Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS + Headless UI
- **Backend:** AWS Lambda (Express/Node) + Ollama
- **Weather:** Open-Meteo API
- **Deployment:** AWS (Lambda, S3, CloudFront)

## Getting Started

### Prerequisites

- Node.js (LTS version)
- npm
- AWS CLI (for deployment)
- Ollama (for local AI development)

### Installation

1. Clone the repository

   ```
   git clone https://github.com/your-username/smartpack.git
   cd smartpack
   ```

2. Install dependencies

   ```
   npm install
   ```

3. Start the development server

   ```
   npm run dev
   ```

4. Start the Lambda backend (in a separate terminal)
   ```
   npm run lambda:dev
   ```

## Development Commands

### Frontend

- `npm run dev` - Start the development server
- `npm run build` - Build the production version
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

### Backend (Lambda)

- `npm run lambda:dev` - Start the local Lambda development server
- `npm run lambda:build` - Build the Lambda function for deployment
- `npm run lambda:deploy` - Deploy the Lambda function to AWS
- `npm run lambda:test` - Run Lambda function tests

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
