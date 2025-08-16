# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based lifestyle optimization web application called "Life Optimizer" that helps users track and visualize the impact of daily habits on their health, productivity, and happiness. The app provides real-time calculations and future projections based on user inputs.

## Architecture

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with dark mode support
- **Charts**: Recharts library for data visualization
- **Icons**: Lucide React

### Application Structure

The app is architected as a single-page application with tab-based navigation:

- **Dashboard Tab**: Real-time visualization of all lifestyle metrics with progress rings and metric cards
- **Daily Inputs Tab**: Interactive sliders for inputting daily habit data across 5 core areas
- **Future Projections Tab**: Long-term impact predictions with configurable time ranges

### Core Calculation Engines

The main component (`lifestyle-simulation-app.tsx`) contains dedicated calculation engines:

- `calculateTDEE()` - Total Daily Energy Expenditure using Mifflin-St Jeor equation
- `calculateSleepImpact()` - Sleep quality and duration impact on health/productivity
- `calculateExerciseImpact()` - Exercise effects on weight, health, energy, and mental clarity
- `calculateDeepWorkImpact()` - Productivity scoring and career/income projections
- `calculateNutritionImpact()` - Diet quality and hydration effects on health metrics
- `calculateSocialImpact()` - Social interaction effects on happiness and stress

### Key UI Components

- `ProgressRing` - Circular progress indicators with customizable colors and icons
- `InputSlider` - Interactive range inputs with real-time value display
- `MetricCard` - Display cards for various health and productivity metrics with trend indicators
- `StreakTracker` - Track consistent habit maintenance with visual feedback

## Development Commands

```bash
# Start development server (runs on localhost:5173)
npm run dev

# Type check and build for production
npm run build

# Preview production build
npm run preview

# Run ESLint with TypeScript support
npm run lint

# Note: No test framework is currently configured
# Test script returns "Error: no test specified"
```

## Data Flow and State Management

The application uses React's built-in state management:

- All user inputs stored in component state using `useState`
- Calculations are memoized with `useMemo` for performance optimization
- Real-time updates across all tabs when inputs change
- Profile data (age, weight, height, activity level) affects all calculation engines

## Styling and Theming

- Tailwind CSS with dark mode support via `dark:` classes
- Color-coded themes: Health (green), Productivity (blue), Happiness (amber)
- Responsive grid layouts for different screen sizes
- Components automatically adapt to dark/light mode preferences

## Deployment

The project includes Azure deployment documentation (`azure-deploy.md`) with setup instructions for Azure Static Web Apps.