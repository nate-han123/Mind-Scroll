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

### Prerequisites

1. **OpenAI API Key**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Python 3.8+** and **Node.js 16+**

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env
   # Edit .env and add your OpenAI API key:
   # OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the FastAPI server:
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

### Quick Start Script

Use the provided startup script to run both services:
```bash
./start.sh
```

## 🧠 How It Works

### Backend Architecture

The backend uses **LangChain with GPT-4o-mini** for real AI processing:

- **Food Agent**: Uses AI to analyze meal descriptions and provide nutritional insights
- **Exercise Agent**: Uses AI to evaluate exercise activities and calculate calories burned
- **Lifestyle Agent**: Uses AI to assess sleep, screen time, and stress levels for wellness scoring

The **Orchestrator** coordinates all agents using AI to generate:
- Overall health score (0-10) with intelligent analysis
- Personalized daily summary text
- Smart recommendations based on all health factors

### API Endpoints

- `GET /` - API health check
- `GET /generate-summary` - Generate summary using dummy data (for testing)
- `POST /generate-summary-from-user-data` - Generate summary from user input data

### User Flow

1. **Input Collection**: Users input their meals, exercises, and lifestyle data through interactive forms
2. **AI Processing**: Each agent uses GPT-4o-mini to analyze the data intelligently
3. **Orchestration**: The orchestrator combines all agent outputs using AI for final insights
4. **Visual Feedback**: Color-coded results show performance levels (green/yellow/red)

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

### Complete User Flow

1. **Start Services**: Run both backend and frontend servers
2. **Visit Landing Page**: Go to `http://localhost:3000`
3. **Input Data**: Click on agent buttons to input your data:
   - 🍎 **Food Agent**: Enter your meals for the day
   - 💪 **Exercise Agent**: Log your physical activities
   - 🌱 **Lifestyle Agent**: Set sleep, screen time, and stress levels
4. **AI Processing**: Watch as GPT-4o-mini analyzes your data
5. **View Results**: See color-coded dashboard with personalized insights

### Color-Coded Visual Feedback

- 🟢 **Green**: Excellent performance (scores 8-10)
- 🟡 **Yellow**: Fair performance (scores 6-7)
- 🔴 **Red**: Needs attention (scores below 6)

### API Testing

Test the backend directly:
```bash
# Test with dummy data
curl http://localhost:8000/generate-summary

# Test with user data
curl -X POST http://localhost:8000/generate-summary-from-user-data \
  -H "Content-Type: application/json" \
  -d '{"meals": ["Avocado toast"], "exercises": ["30-min jog"], "lifestyle": {"sleep_hours": 8, "screen_time": 3, "stress_level": 4}}'
```

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
