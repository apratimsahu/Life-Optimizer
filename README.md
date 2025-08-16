# Life Optimizer

A comprehensive React-based lifestyle optimization web application that empowers users to track, analyze, and visualize the impact of daily habits on their health, productivity, and happiness. Using scientifically-backed calculation engines, the app provides real-time impact assessments and future projections to help users make informed decisions about their lifestyle choices.

## 🌟 Features

### Core Lifestyle Tracking
- **Sleep Impact Analysis**: Monitor how sleep duration and quality affect health scores, productivity boosts, mood impact, and recovery rates
- **Exercise & Fitness Monitoring**: Track weight loss progression, health improvements, energy levels, and mental clarity gains
- **Deep Work & Productivity Analytics**: Analyze productivity scores, skill development, career advancement potential, and income projections
- **Nutrition & Wellness Assessment**: Evaluate health scores, energy levels, and immunity based on diet quality and hydration habits
- **Social Impact & Well-being**: Measure happiness scores, stress reduction levels, and emotional resilience through social interactions

### Advanced Visualization
- **Interactive Dashboard**: Real-time progress rings and metric cards displaying current lifestyle impact scores
- **Daily Input Interface**: Intuitive sliders for easy habit tracking across all five core areas
- **Future Projections**: Configurable time-range predictions showing long-term impact of current habits
- **Streak Tracking**: Visual feedback for maintaining consistent healthy habits
- **Multi-chart Analytics**: Line charts, area charts, bar charts, and radar charts for comprehensive data visualization

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with TypeScript for type-safe development
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with dark mode support and responsive design
- **Data Visualization**: Recharts library for interactive charts and graphs
- **Icons**: Lucide React for consistent, modern iconography
- **State Management**: React hooks (useState, useMemo) for optimal performance

## 🏗️ Architecture

### Application Structure
- **Single-Page Application**: Tab-based navigation with three main sections
  - Dashboard: Real-time metric visualization
  - Daily Inputs: Interactive habit tracking interface
  - Future Projections: Long-term impact predictions

### Calculation Engines
The app uses scientifically-backed formulas and algorithms:
- **TDEE Calculator**: Mifflin-St Jeor equation for metabolic rate calculations
- **Sleep Impact Engine**: Quality and duration scoring with health/productivity multipliers
- **Exercise Impact Engine**: Weight loss, energy, and mental clarity calculations
- **Deep Work Engine**: Productivity scoring with career and income projections
- **Nutrition Engine**: Diet quality assessment with health score calculations
- **Social Impact Engine**: Happiness and stress reduction metrics

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/apratimsahu/Life-Optimizer.git
cd Life-Optimizer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🚀 Available Scripts

- `npm run dev` - Start development server (runs on http://localhost:5173)
- `npm run build` - Type check with TypeScript and build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint with TypeScript support for code quality

> **Note**: No test framework is currently configured. The test script will return an error if executed.

## 📁 Project Structure

```
Life Optimizer/
├── src/
│   ├── main.tsx                      # React app entry point
│   ├── lifestyle-simulation-app.tsx  # Main component (~700 lines)
│   ├── index.css                     # Global Tailwind styles
│   └── vite-env.d.ts                # Vite type definitions
├── azure-deploy.md                   # Azure deployment guide
├── CLAUDE.md                         # Development guidance
└── README.md                         # Project documentation
```

## 🎯 Key Components

### UI Components
- **ProgressRing**: Circular progress indicators with customizable colors and icons
- **InputSlider**: Interactive range inputs with real-time value display and units
- **MetricCard**: Display cards with trend indicators for health/productivity metrics
- **StreakTracker**: Visual feedback system for maintaining consistent habits

### Application Tabs
- **Dashboard**: Real-time visualization with progress rings and metric cards
- **Daily Inputs**: Interactive sliders for habit data input across 5 core areas
- **Future Projections**: Time-configurable predictions with multiple chart types

## 🔄 Data Flow

- **State Management**: React hooks (useState) for all user inputs and calculations
- **Performance**: useMemo for expensive calculations to prevent unnecessary re-renders
- **Real-time Updates**: All tabs update instantly when input values change
- **Profile Integration**: User profile data affects all calculation engines

## 🚀 Deployment

The project includes comprehensive Azure deployment documentation in `azure-deploy.md` with setup instructions for Azure Static Web Apps, including:
- Azure CLI installation and configuration
- Static Web App creation and GitHub integration
- Automated CI/CD pipeline setup

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing TypeScript and React patterns
- Use Tailwind CSS for styling consistency
- Ensure all calculations are memoized for performance
- Maintain responsive design across all components

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Apratim Sahu** - [@apratimsahu](https://github.com/apratimsahu)

Project Link: [https://github.com/apratimsahu/Life-Optimizer](https://github.com/apratimsahu/Life-Optimizer)

---

*Built with ❤️ using React 19, TypeScript, and Tailwind CSS*