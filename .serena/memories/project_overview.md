# SmartPack Project Overview

## Project Purpose
SmartPack is a travel packing application designed to help users organize and manage their packing lists for trips. It features AI-powered packing suggestions, weather integration, and comprehensive trip planning capabilities.

## Core Functionality
- **Trip Planning**: Multi-step form for creating trips with destinations, dates, and transport modes
- **AI-Powered Suggestions**: Uses Ollama (local LLM) to generate intelligent packing recommendations
- **Weather Integration**: Fetches weather data to inform packing suggestions
- **Packing List Management**: CRUD operations for managing packing items
- **Data Persistence**: Uses browser localStorage for saving user data locally
- **Mobile-First Design**: Responsive interface optimized for mobile devices

## Tech Stack
### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Headless UI components
- **State Management**: React Context API + Custom Hooks
- **Routing**: React Router DOM

### Backend
- **Server**: Express.js (v5.1.0)
- **Deployment Target**: AWS Lambda via Serverless Framework
- **AI Integration**: Ollama client for local LLM
- **API**: RESTful endpoints with CORS support

### Testing
- **Unit/Integration**: Vitest
- **E2E**: Playwright
- **Component Testing**: React Testing Library
- **Accessibility**: jest-axe
- **Coverage**: Vitest Coverage with V8

### Development Tools
- **TypeScript**: Strict mode enabled
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier
- **Process Management**: Nodemon, Concurrently

## Architecture
- **Component-Based**: Functional React components with TypeScript
- **Three-Column Layout**: Trip Details | Packing List | AI Suggestions (desktop)
- **Mobile-First**: Progressive enhancement for larger screens
- **Accessibility**: WCAG 2.1 AA compliance target
- **Performance**: LCP ≤ 2.5s target, optimistic UI updates

## Key Features
- Multi-step trip planning wizard
- Dynamic packing list with categories
- AI-powered suggestions based on trip context
- Weather forecast integration
- LocalStorage persistence (no cloud sync)
- Comprehensive accessibility support
- Mobile-optimized touch interactions