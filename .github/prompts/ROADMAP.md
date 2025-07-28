<!-- Project roadmap, phases, deliverables -->

# SmartPack – Roadmap

**App Name:** SmartPack  
**Technology Stack:** React + TypeScript + Vite + Tailwind CSS + Headless UI  
**AI/Backend:** AWS Lambda (Express/Node) + Ollama (self-hosted or local)  
**Weather:** Open-Meteo API (client-side)  
**Target:** Mobile-first responsive web application for single-user travel packing

---

## Phase 1: Environment Setup & Foundation

### Step 1: Verify Environment Prerequisites

**Estimated Time:** 30 minutes

**Tasks:**

- Ensure Node.js (LTS) and npm are installed
- Verify AWS CLI is installed and configured
- Confirm Ollama is installed and running (locally for dev/test)
- (Optional) Create AWS S3 bucket for future frontend deployment

**Deliverables:**

- Confirmed local and cloud environment readiness
- Ollama API running and accessible on localhost

---

### Step 2: Create React Vite Project Foundation

**Estimated Time:** 45 minutes

**Tasks:**

- Scaffold new Vite React TypeScript project
  ```bash
  npm create vite@latest SmartPack -- --template react-ts
  cd SmartPack
  npm install
  ```
- Install Tailwind CSS and initialize config
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```
- Set up Headless UI
  ```bash
  npm install @headlessui/react
  ```
- Set up Prettier, ESLint, and add basic config
- Update index.css with Tailwind’s base styles
- Set up basic project structure:
  ```
  src/
  ├── components/
  ├── pages/
  ├── hooks/
  ├── utils/
  ├── types/
  └── styles/
  ```

**Deliverables:**

- Vite React project with Tailwind and Headless UI ready
- ESLint/Prettier configured
- Initial folder structure

---

## Phase 2: UI/UX Core Layout & Navigation

### Step 3: Main Layout & Responsive Design

**Estimated Time:** 60 minutes

**Tasks:**

- Create a mobile-first layout using Tailwind
- Implement 3-column design for desktop, stacked layout for mobile (Trip Details, Packing Checklist, AI Suggestions)
- Add global navigation/header
- Set up dark mode toggle (Tailwind dark variant)
- Add placeholder content and test with Headless UI modal/dialog

**Key Components:**

- MainLayout.tsx
- DarkModeToggle.tsx
- AppHeader.tsx

**Deliverables:**

- Responsive layout working across devices
- Initial content placeholders
- Dark mode toggle (basic)

---

### Step 4: Trip Details Form & State Management

**Estimated Time:** 60 minutes

**Tasks:**

- Build a stepper/form for user input: name, dates, destination, travel mode, preferences
- Use Headless UI for accessible dialog/steps if needed
- Store form state using React context or top-level state
- Persist to localStorage for reload support

**Key Components:**

- TripForm.tsx
- useTripForm.ts (custom hook/context)

**Deliverables:**

- Functional multi-step trip form
- LocalStorage persistence of trip data
- Accessibility compliance (labels, focus management)

---

### Step 5: Packing Checklist UI

**Estimated Time:** 60 minutes

**Tasks:**

- Create checklist component with categories
- Allow checking/unchecking, adding, removing, editing items
- Persist checklist to localStorage
- Display trip summary in left column
- Translate and display submitted TripForm data in the Trip Details component/section

**Key Components:**

- PackingList.tsx
- ChecklistItem.tsx
- TripDetails.tsx

**Deliverables:**

- Interactive, persistent checklist
- Edits reflected in real-time
- Trip Details section displays submitted trip data (name, dates, destination, travel mode, etc.)
- UX validated by integration/E2E tests

---

## Phase 3: AI & Weather Integration

### Step 6: Weather API Integration

**Estimated Time:** 45 minutes

**Tasks:**

- Fetch weather data from Open-Meteo API client-side on trip form submit
- Display relevant weather info in UI
- Use weather data as context for AI packing list generation

**Deliverables:**

- Weather shown in trip summary
- Weather data accessible to backend AI call

---

### Step 7: AWS Lambda Backend for Packing List Generation

**Estimated Time:** 90 minutes

**Tasks:**

- Scaffold a simple Express app in lambda/ folder
- Set up a /generate route to accept trip + weather data
- Use serverless-http to deploy Express app to Lambda (API Gateway)
- Connect backend to Ollama (on local network for now)
- Return generated checklist to frontend for display

**Key Components:**

- lambda/app.ts
- lambda/serverless.yml

**Deliverables:**

- Deployed AWS Lambda backend
- /generate API endpoint returning mocked or Ollama-generated data

---

### Step 8: AI Suggestions Panel

**Estimated Time:** 45 minutes

**Tasks:**

- Build UI for entering custom refinement prompts
- On submit, call /generate endpoint with updated context
- Display additional AI-suggested checklist items
- Enable quick add of suggestions to main checklist

**Key Components:**

- SuggestionsPanel.tsx

**Deliverables:**

- Functional suggestions panel
- User can refine and regenerate list

---

## Phase 4: Testing, QA, & Accessibility

### Step 9: Integration & E2E Testing

**Estimated Time:** 75 minutes

**Tasks:**

- Write Vitest/RTL integration tests for form and checklist
- Write Playwright E2E test covering full flow: trip form → weather → checklist
- Validate all test outputs against GitHub Copilot suggestions
- Add accessibility checks (axe-core, Playwright assertions)

**Key Components:**

- src/**tests**/
- playwright/

**Deliverables:**

- Integration and E2E tests for core flows
- Basic accessibility validation

---

## Phase 5: Polish & Deployment

### Step 10: UI Polish & Enhancements

**Estimated Time:** 60 minutes

**Tasks:**

- Refine color palette and typography for Clean & Modern look
- Add focus-visible/focus-ring support for keyboard nav
- Add minor micro-interactions (animations, transitions)
- Make sure dark mode is robust and visually clear
- Tweak mobile and desktop breakpoints

**Deliverables:**

- Polished, professional-looking UI
- Enhanced accessibility and UX

---

### Step 11: Build & Deploy

**Estimated Time:** 60 minutes

**Tasks:**

- Build production bundle (npm run build)
- Deploy static frontend to AWS S3
- Set up CloudFront for CDN (if desired, optional for MVP)
- Deploy backend to Lambda using Serverless Framework
- Final smoke test of deployed app

**Deliverables:**

- Live SmartPack app (frontend and backend)
- End-to-end user testing in production

---

## Phase 6: Documentation & Success Criteria

### Step 12: Documentation & Handover

**Estimated Time:** 30 minutes

**Tasks:**

- Write concise README.md (setup, dev, deploy instructions)
- Add code comments and docstrings for complex logic
- Document known issues and future enhancements
- Review code for Copilot/AI-readability (future maintainers)

**Deliverables:**

- Complete, up-to-date documentation
- Easy onboarding for future improvements

---

## Success Criteria

### Functional Requirements

- Step-by-step trip entry and editing
- Weather is fetched and displayed
- Packing checklist generated, editable, persistent
- AI/LLM suggestions for refinement
- All user data local (no auth, no cloud sync)

### Technical Requirements

- TypeScript throughout
- Headless UI + Tailwind CSS for accessibility and modern look
- Tests written at each dev phase
- Fully static frontend, serverless backend
- Deployed to AWS S3 and Lambda

### User Experience

- Mobile-first and desktop responsive
- Clean, friendly UI with dark mode
- High accessibility (labels, focus, color contrast)
- Fast, reliable, and easy to use
