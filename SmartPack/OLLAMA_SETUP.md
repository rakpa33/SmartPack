# SmartPack - Ollama AI Integration Setup

## Overview

SmartPack now uses **Ollama** for AI-powered packing list generation instead of mock data. This provides intelligent, context-aware suggestions based on your trip details, weather, and custom prompts.

## Prerequisites

1. **Ollama** installed and running locally
2. **LLM model** downloaded (recommended: llama3.1:8b)
3. **Node.js dependencies** installed

## Quick Setup

### 1. Install Ollama

**Windows:**

```bash
# Download from https://ollama.ai/download
# Or use winget:
winget install Ollama.Ollama
```

**macOS:**

```bash
# Download from https://ollama.ai/download
# Or use Homebrew:
brew install ollama
```

**Linux:**

```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### 2. Download a Model

```bash
# Start Ollama service (if not auto-started)
ollama serve

# Download the recommended model (in a new terminal)
ollama pull llama3.1:8b

# Alternative smaller model for testing:
# ollama pull llama3:8b

# Alternative larger model for better quality:
# ollama pull llama3.1:13b
```

### 3. Verify Installation

```bash
# Test that Ollama is running
curl http://localhost:11434/api/version

# Test model generation
ollama run llama3.1:8b "Generate a packing list for a 3-day beach vacation"
```

### 4. Configure SmartPack

The app is already configured to use `http://localhost:11434` by default. You can customize settings in `.env`:

```env
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b
```

### 5. Install Dependencies & Run

```bash
# Install the new dependencies
npm install

# Start the backend server
npm run lambda:dev

# In another terminal, start the frontend
npm run dev
```

## How It Works

### AI-Powered Packing Lists

When you submit a trip form, SmartPack:

1. **Analyzes** your trip details (destinations, dates, travel modes, preferences)
2. **Considers** weather forecasts for your destinations
3. **Generates** a comprehensive packing checklist using Ollama
4. **Provides** intelligent suggestions based on trip type, duration, and climate

### Custom AI Suggestions

In the Suggestions Panel, you can:

1. **Enter custom prompts** like "business meetings", "hiking", "photography gear"
2. **Get targeted suggestions** based on your specific needs
3. **Add items** directly to your main packing list
4. **Refresh** for new suggestions anytime

### Fallback System

If Ollama is not available:

- The system automatically falls back to the previous rule-based logic
- You'll see a notification that AI is unavailable
- All core functionality remains working

## Performance Tips

### Model Selection

- **llama3.1:8b** - Best balance of speed and quality (recommended)
- **llama3:8b** - Faster, slightly lower quality
- **llama3.1:13b** - Higher quality, requires more resources
- **mistral:7b** - Alternative option, good performance

### Resource Usage

- **RAM**: 8GB+ recommended for 8B models
- **CPU**: Modern multi-core processor preferred
- **GPU**: Optional, will speed up generation significantly

### Optimization

```bash
# For better performance on limited hardware:
ollama pull llama3:8b

# For GPU acceleration (if available):
# Ollama automatically detects and uses GPU
```

## Troubleshooting

### Ollama Not Running

```bash
# Check if Ollama is running
curl http://localhost:11434/api/version

# Start Ollama if needed
ollama serve
```

### Model Not Available

```bash
# List installed models
ollama list

# Pull missing model
ollama pull llama3.1:8b
```

### Network Issues

```bash
# Check if port 11434 is accessible
netstat -an | grep 11434

# Try different host in .env
OLLAMA_HOST=http://127.0.0.1:11434
```

### Performance Issues

```bash
# Use smaller model
ollama pull llama3:8b

# Update .env
OLLAMA_MODEL=llama3:8b
```

## API Endpoints

The backend now provides:

- `POST /generate` - Generate complete packing list using AI
- `POST /suggestions` - Get AI suggestions for custom prompts
- `GET /health` - Check API status

Both endpoints automatically fall back to rule-based logic if Ollama is unavailable.

## Development Notes

- The system uses **temperature 0.3** for packing lists (more consistent)
- The system uses **temperature 0.4** for custom suggestions (more creative)
- **JSON validation** ensures reliable parsing of AI responses
- **Error handling** provides graceful degradation

## Future Enhancements

- Support for additional models (OpenAI, Anthropic)
- Model fine-tuning for travel-specific knowledge
- Caching layer for faster repeated queries
- User feedback integration for improved suggestions
