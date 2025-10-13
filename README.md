# Mindscroll — AI Health Pipeline Prototype

A minimal working prototype that simulates the Mindscroll orchestration system with a frontend dashboard and a FastAPI backend, using dummy data to demonstrate how multiple health agents (food, exercise, lifestyle) communicate with an orchestrator to generate daily summaries and personalized insights.

## 🏗️ Project Structure

```
mindscroll/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── agents/
│   │   ├── food_agent.py       # Analyzes meals and nutrition
│   │   ├── exercise_agent.py   # Tracks exercise activities
│   │   ├── lifestyle_agent.py  # Monitors sleep and screen time
│   │   └── orchestrator.py     # Coordinates all agents
│   ├── schemas/
│   │   └── summary.py          # Pydantic data models
│   ├── dummy_data/
│   │   └── user_data.json      # Sample user data
│   └── requirements.txt        # Python dependencies
└── frontend/
    ├── pages/
    │   ├── index.tsx           # Landing page
    │   └── dashboard.tsx        # Results dashboard
    ├── components/
    │   ├── SummaryCard.tsx     # Reusable summary card
    │   ├── AgentOutput.tsx     # Agent-specific output display
    │   └── Navbar.tsx          # Navigation component
    ├── utils/
    │   └── api.ts              # API communication utilities
    ├── styles/
    │   └── globals.css         # Global styles with Tailwind
    └── package.json            # Node.js dependencies
```

## 🚀 Quick Start

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

   The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the Next.js development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

## 🧠 How It Works

### Backend Architecture

The backend simulates an AI health pipeline with three specialized agents:

- **Food Agent**: Analyzes meal data and provides nutritional insights
- **Exercise Agent**: Tracks physical activities and calculates calories burned
- **Lifestyle Agent**: Monitors sleep patterns and screen time for wellness scoring

The **Orchestrator** coordinates all agents and generates:
- Overall health score (0-10)
- Daily summary text
- Personalized recommendations

### API Endpoints

- `GET /` - API health check
- `GET /generate-summary` - Generate comprehensive daily health summary

### Frontend Features

- **Landing Page**: Clean introduction with agent explanations
- **Dashboard**: Real-time visualization of agent outputs and orchestrator summary
- **Responsive Design**: Mobile-friendly with TailwindCSS
- **Smooth Animations**: Fade-in and slide-up effects for better UX

## 🎨 Design System

- **Color Palette**: Light pastels with primary (blue) and secondary (purple) gradients
- **Typography**: Inter font family for clean readability
- **Components**: Modular, reusable React components
- **Animations**: CSS transitions and keyframe animations

## 🔧 Development

### Backend Development

The backend uses FastAPI with:
- Pydantic for data validation
- Modular agent architecture
- JSON-based dummy data (no database required)
- CORS enabled for frontend communication

### Frontend Development

The frontend uses Next.js with:
- TypeScript for type safety
- TailwindCSS for styling
- Recharts for data visualization (ready for future charts)
- Responsive design patterns

## 🧪 Testing the Pipeline

1. Start both backend and frontend servers
2. Visit `http://localhost:3000`
3. Click "Generate Daily Summary"
4. Watch the AI agents orchestrate results in real-time
5. Explore the dashboard with agent outputs and recommendations

## 🌱 Future Expansion

This prototype is designed for easy expansion:

- Replace dummy agent logic with real AI model calls
- Add user input forms for meal tracking and sleep logging
- Integrate with PostgreSQL via Supabase
- Add Firebase notifications for daily affirmations
- Implement reward system and social sharing features
- Add real-time data visualization with charts

## 📦 Deployment Ready

The project structure is optimized for:
- **Vercel**: Frontend deployment
- **Render**: Backend deployment
- **Docker**: Containerization support
- **Environment Variables**: Configuration management

## 🤝 Contributing

This is a prototype demonstration. For production use:
1. Add proper error handling
2. Implement authentication
3. Add data persistence
4. Integrate real AI models
5. Add comprehensive testing

---

**Built with ❤️ for AI Health Innovation**
