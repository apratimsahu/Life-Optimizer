# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based lifestyle optimization web application called "Life Optimizer" that helps users track and visualize the impact of daily habits on their health, productivity, and happiness. The app provides real-time calculations and future projections based on user inputs.

## Architecture

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts library for data visualization
- **Icons**: Lucide React

### Key Components Structure

- `lifestyle-simulation-app.tsx` - Main application component containing:
  - Calculation engines for sleep, exercise, deep work, nutrition, and social impacts
  - UI components: ProgressRing, InputSlider, MetricCard, StreakTracker
  - Three main tabs: Dashboard, Daily Inputs, and Future Projections
  - Real-time impact calculations and visualizations

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Project Structure

```
src/
├── main.tsx              # App entry point
├── lifestyle-simulation-app.tsx  # Main app component (685 lines)
├── index.css            # Global styles
└── vite-env.d.ts        # Vite type definitions
```

## Key Features

The application calculates and visualizes:

1. **Sleep Impact**: Health score, productivity boost, mood impact based on hours and quality
2. **Exercise Impact**: Weight loss, health score, energy boost, mental clarity
3. **Deep Work Impact**: Productivity score, skill growth, career advancement, income projection
4. **Nutrition Impact**: Health score, energy level, immunity boost based on quality and hydration
5. **Social Impact**: Happiness score, stress reduction, emotional resilience

## Configuration Files

- `tsconfig.json` - TypeScript configuration with strict mode enabled
- `vite.config.ts` - Vite configuration with React plugin and HMR overlay disabled
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.cjs` - PostCSS configuration for Tailwind

## Development Notes

- The app uses React hooks extensively (useState, useEffect, useMemo)
- All calculations are memoized for performance
- Responsive design implemented with Tailwind CSS grid system
- Charts use Recharts components: LineChart, AreaChart, BarChart, RadarChart
- Color-coded themes: Health (green), Productivity (blue), Happiness (amber), etc.