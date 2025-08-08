# SmartPack SmartPack is a smart packing assistant that helps you prepare for your trips by generating **AI-powered** personalized packing lists based on your trip details and weather forecasts. ## Features - Create trip profiles with destinations, dates, and travel modes
- Automatically fetch weather data for your destinations
- ** AI-powered packing lists** using Ollama LLM integration
- ** Custom AI suggestions** based on your specific needs and prompts
- ** Intelligent fallback** to rule-based logic when AI is unavailable
- Save and manage multiple packing lists with smart categorization ## Technology Stack - **Frontend:** React + TypeScript + Vite + Tailwind CSS + Headless UI
- **Backend:** AWS Lambda (Express/Node) + **Ollama (Local AI)**
- **Weather:** Open-Meteo API
- **Deployment:** AWS (Lambda, S3, CloudFront) ## Quick Start ### Prerequisites - Node.js (LTS version)
- npm
- **Ollama** (for AI functionality)
- AWS CLI (for deployment)
- Git (with proper configuration for Windows - see below) ### Windows Git Configuration If you're developing on Windows, configure Git to handle line endings properly:
```bash
# Configure Git to preserve LF line endings
git config core.autocrlf input
``` The project includes a `.gitattributes` file that enforces consistent line endings across all platforms. ### Installation 1. **Setup Ollama AI** (required for smart features) ```bash # Install Ollama - see https://ollama.ai/download ollama pull llama3.1:8b ollama serve ``` **Detailed setup:** See [OLLAMA_SETUP.md](./OLLAMA_SETUP.md) 2. **Clone and install** ```bash git clone https://github.com/your-username/smartpack.git cd smartpack npm install ``` 3. **Start development servers** ```bash # Terminal 1: Backend with AI npm run lambda:dev # Terminal 2: Frontend npm run dev ``` ## AI Features ### Smart Packing Lists - **Context-aware**: Analyzes destinations, weather, trip duration, travel modes
- **Intelligent quantities**: Suggests appropriate amounts based on trip length
- **Activity-specific**: Detects business trips, adventures, beach vacations, etc.
- **Weather-adaptive**: Adjusts recommendations based on climate conditions ### Custom AI Suggestions - Enter specific prompts like "business meetings", "hiking gear", "photography equipment"
- Get targeted suggestions beyond the initial packing list
- Add suggested items directly to your checklist ### Reliable Fallback - Automatically switches to rule-based logic if Ollama is unavailable
- All core functionality works even without AI
- Clear indicators when running in fallback mode ### AI-Enhanced Interface - **Visual AI Indicators**: Animated Ollama badges showing AI status
- **Real-time Feedback**: Status indicators for AI vs fallback data
- **Transparent Processing**: Clear visibility into AI generation state
- **Professional Design**: Gradient styling and smooth animations 4. Start the Lambda backend (in a separate terminal) ``` npm run lambda:dev ``` ## Development Commands ### Frontend - `npm run dev` - Start the development server
- `npm run build` - Build the production version
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint ### Backend (Lambda) - `npm run lambda:dev` - Start the local Lambda development server
- `npm run lambda:build` - Build the Lambda function for deployment
- `npm run lambda:deploy` - Deploy the Lambda function to AWS
- `npm run lambda:test` - Run Lambda function tests ```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom'; export default tseslint.config([ globalIgnores(['dist']), { files: ['**/*.{ts,tsx}'], extends: [ // Other configs... // Enable lint rules for React reactX.configs['recommended-typescript'], // Enable lint rules for React DOM reactDom.configs.recommended, ], languageOptions: { parserOptions: { project: ['./tsconfig.node.json', './tsconfig.app.json'], tsconfigRootDir: import.meta.dirname, }, // other options... }, },
]);
```
