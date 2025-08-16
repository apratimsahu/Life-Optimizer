import { useState, useMemo } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Moon, Sun, Activity, Brain, Heart, TrendingUp, Award, Zap, Coffee, Users, Target, Calendar, AlertCircle, CheckCircle, Flame, User, DollarSign, Settings, Eye, Footprints, Smartphone, Utensils, Lightbulb } from 'lucide-react';

// ============ TYPES ============
interface Profile {
  sex: string;
  age: number;
  height: number;
  weight: number;
  activityLevel: string;
}

// ============ CALCULATION ENGINES ============
const calculateTDEE = (profile: Profile, activityLevel: string): number => {
  const { sex, age, height, weight } = profile;
  
  // Mifflin-St Jeor Equation
  let bmr;
  if (sex === 'Male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  // Activity multipliers
  const activityMultipliers: Record<string, number> = {
    'Sedentary': 1.2,
    'Light': 1.375,
    'Moderate': 1.55,
    'Active': 1.725,
    'Very Active': 1.9
  };
  
  return Math.round(bmr * (activityMultipliers[activityLevel] || 1.55));
};

const calculateSleepImpact = (hours: number, quality: number) => {
  const optimalHours = 7.5;
  const sleepScore = Math.max(0, 100 - Math.abs(hours - optimalHours) * 15);
  const qualityMultiplier = quality / 10;
  
  return {
    healthScore: sleepScore * qualityMultiplier,
    productivityBoost: quality > 7 ? 1.15 : quality > 5 ? 1.0 : 0.85,
    moodImpact: quality > 7 ? 1.2 : 1.0,
    recoveryRate: hours >= 7 ? 1.0 : 0.7
  };
};

const calculateExerciseImpact = (minutes: number, intensity: number) => {
  const weeklyMinutes = minutes * 7;
  const intensityMultiplier = intensity / 10;
  
  return {
    weeklyWeightLoss: (weeklyMinutes / 30) * 0.11 * intensityMultiplier, // lbs per week
    healthScore: Math.min(100, (minutes / 30) * 25 * intensityMultiplier),
    energyBoost: 1 + (minutes / 60) * 0.3 * intensityMultiplier,
    mentalClarity: 1 + (minutes / 45) * 0.2,
    longevityBonus: minutes >= 30 ? 1.15 : 1.0
  };
};

const calculateDeepWorkImpact = (hours: number, focusQuality: number) => {
  const optimalDuration = hours >= 2 && hours <= 4;
  const focusMultiplier = focusQuality / 10;
  
  return {
    productivityScore: Math.min(100, hours * 20 * focusMultiplier),
    skillGrowth: hours * 0.5 * focusMultiplier, // % monthly improvement
    careerAdvancement: optimalDuration ? 1.3 : 1.0,
    cognitiveReserve: 1 + (hours / 8) * 0.4,
    incomeProjection: hours * 15 * focusMultiplier // $ per day potential
  };
};

const calculateNutritionImpact = (quality: number, hydration: number) => {
  return {
    healthScore: (quality / 10) * 80 + (hydration / 8) * 20,
    energyLevel: quality > 7 ? 1.2 : 1.0,
    immunityBoost: quality > 8 ? 1.25 : 1.0,
    skinHealth: hydration >= 6 ? 1.15 : 0.9,
    digestiveHealth: quality * 10
  };
};

const calculateSocialImpact = (hours: number, quality: number) => {
  const qualityMultiplier = quality / 10;
  
  return {
    happinessScore: Math.min(100, hours * 15 * qualityMultiplier),
    stressReduction: hours >= 2 ? 0.8 : 1.0,
    emotionalResilience: 1 + (hours / 5) * 0.3 * qualityMultiplier,
    networkGrowth: hours * 2 * qualityMultiplier,
    mentalHealth: Math.min(100, hours * 20 * qualityMultiplier)
  };
};

// ============ COMPONENTS ============
// Custom Tooltip for dark mode support
const CustomTooltip = ({ active, payload, label, isDarkMode }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={`p-3 rounded-lg border shadow-lg transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-600 text-white' 
          : 'bg-white border-gray-200 text-gray-900'
      }`}>
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {`${entry.name}: ${typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};
interface ProgressRingProps {
  score: number;
  label: string;
  color: string;
  icon?: any;
  size?: number;
  isDarkMode?: boolean;
}

const ProgressRing = ({ score, label, color, icon: Icon, size = 120 }: ProgressRingProps) => {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size/2}
          cy={size/2}
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx={size/2}
          cy={size/2}
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        {Icon && <Icon className="w-5 h-5 mb-1" style={{ color }} />}
        <span className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(score)}</span>
        <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
      </div>
    </div>
  );
};

interface InputSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  icon?: any;
  color: string;
  unit?: string;
  isDarkMode?: boolean;
}

const InputSlider = ({ label, value, onChange, min, max, step = 1, icon: Icon, color, unit = '' }: InputSliderProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5" style={{ color }} />}
          <label className="font-medium text-gray-700 dark:text-gray-300">{label}</label>
        </div>
        <span className="font-bold text-lg" style={{ color }}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, #6b7280 ${((value - min) / (max - min)) * 100}%, #6b7280 100%)`
        }}
      />
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-500 dark:text-gray-400">{min}{unit}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{max}{unit}</span>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: any;
  color: string;
  trend?: number;
  isDarkMode?: boolean;
}

const MetricCard = ({ title, value, subtitle, icon: Icon, color, trend }: MetricCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">{value}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
};

interface StreakTrackerProps {
  streak: number;
  lastActive: string;
  isDarkMode?: boolean;
}

const StreakTracker = ({ streak, lastActive }: StreakTrackerProps) => {
  const isActiveToday = lastActive === new Date().toDateString();
  
  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Flame className="w-8 h-8" />
          <div>
            <h3 className="text-3xl font-bold">{streak}</h3>
            <p className="text-sm opacity-90">Day Streak</p>
          </div>
        </div>
        {isActiveToday ? (
          <CheckCircle className="w-6 h-6" />
        ) : (
          <AlertCircle className="w-6 h-6 animate-pulse" />
        )}
      </div>
      <div className="bg-white/20 dark:bg-black/20 rounded-lg p-3">
        <p className="text-sm font-medium">
          {streak === 0 ? "Start your journey today!" :
           streak < 7 ? "Building momentum! Keep going!" :
           streak < 30 ? "You're on fire! Don't break the chain!" :
           "Incredible consistency! You're unstoppable!"}
        </p>
      </div>
    </div>
  );
};

// ============ MAIN APP ============
const App = () => {
  // Profile states
  const [profile, setProfile] = useState<Profile>({
    sex: 'Male',
    age: 28,
    height: 175, // cm
    weight: 75, // kg
    activityLevel: 'Moderate'
  });
  
  // Input states
  const [sleepHours, setSleepHours] = useState(7.5);
  const [sleepQuality, setSleepQuality] = useState(7);
  const [exerciseMinutes, setExerciseMinutes] = useState(30);
  const [exerciseIntensity, setExerciseIntensity] = useState(6);
  const [deepWorkHours, setDeepWorkHours] = useState(3);
  const [focusQuality, setFocusQuality] = useState(7);
  const [nutritionQuality, setNutritionQuality] = useState(7);
  const [hydration, setHydration] = useState(6);
  const [socialHours, setSocialHours] = useState(2);
  const [socialQuality, setSocialQuality] = useState(7);
  const [steps, setSteps] = useState(9000);
  const [screenTime, setScreenTime] = useState(2.5);
  const [protein, setProtein] = useState(120);
  const [calories, setCalories] = useState(2349);
  const [autoCalories, setAutoCalories] = useState(true);
  
  // Financial states
  const [income, setIncome] = useState(150000);
  const [expenses, setExpenses] = useState(90000);
  const [savingsRate, setSavingsRate] = useState(20);
  
  // Simulation states
  const [simulationDays, setSimulationDays] = useState(120);
  const [presetMode, setPresetMode] = useState('Balanced');
  
  // UI states
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [streak] = useState(7);
  const [lastActive] = useState(new Date().toDateString());
  
  // Calculate TDEE and auto calories
  const calculatedTDEE = useMemo(() => calculateTDEE(profile, profile.activityLevel), [profile]);
  const effectiveCalories = useMemo(() => {
    if (autoCalories) {
      return calculatedTDEE - 300; // 300 calorie deficit for weight loss
    }
    return calories;
  }, [autoCalories, calculatedTDEE, calories]);
  
  // Calculate impacts
  const sleepImpact = useMemo(() => calculateSleepImpact(sleepHours, sleepQuality), [sleepHours, sleepQuality]);
  const exerciseImpact = useMemo(() => calculateExerciseImpact(exerciseMinutes, exerciseIntensity), [exerciseMinutes, exerciseIntensity]);
  const deepWorkImpact = useMemo(() => calculateDeepWorkImpact(deepWorkHours, focusQuality), [deepWorkHours, focusQuality]);
  const nutritionImpact = useMemo(() => calculateNutritionImpact(nutritionQuality, hydration), [nutritionQuality, hydration]);
  const socialImpact = useMemo(() => calculateSocialImpact(socialHours, socialQuality), [socialHours, socialQuality]);
  
  // Overall scores
  const overallHealth = useMemo(() => {
    return Math.min(100, (
      sleepImpact.healthScore * 0.3 +
      exerciseImpact.healthScore * 0.3 +
      nutritionImpact.healthScore * 0.25 +
      socialImpact.mentalHealth * 0.15
    ));
  }, [sleepImpact, exerciseImpact, nutritionImpact, socialImpact]);
  
  const overallProductivity = useMemo(() => {
    return Math.min(100, (
      deepWorkImpact.productivityScore * 0.4 +
      sleepImpact.productivityBoost * 30 +
      exerciseImpact.mentalClarity * 20 +
      nutritionImpact.energyLevel * 10
    ));
  }, [deepWorkImpact, sleepImpact, exerciseImpact, nutritionImpact]);
  
  const overallHappiness = useMemo(() => {
    return Math.min(100, (
      socialImpact.happinessScore * 0.35 +
      sleepImpact.moodImpact * 20 +
      exerciseImpact.mentalClarity * 20 +
      (100 - socialImpact.stressReduction * 50) * 0.25
    ));
  }, [socialImpact, sleepImpact, exerciseImpact]);
  
  // Projection data for charts
  const projectionData = useMemo(() => {
    const months = ['Now', '1 mo', '3 mo', '6 mo', '1 yr'];
    const baseWeight = 160; // lbs
    
    return months.map((month, index) => {
      const multiplier = index === 0 ? 0 : index === 1 ? 4 : index === 2 ? 12 : index === 3 ? 26 : 52;
      return {
        month,
        weight: Math.max(120, baseWeight - exerciseImpact.weeklyWeightLoss * multiplier),
        health: Math.min(100, overallHealth + (overallHealth * 0.02 * multiplier)),
        productivity: Math.min(100, overallProductivity + deepWorkImpact.skillGrowth * multiplier),
        income: deepWorkImpact.incomeProjection * 30 * (index === 0 ? 0 : index === 1 ? 1 : index === 2 ? 3 : index === 3 ? 6 : 12),
        happiness: Math.min(100, overallHappiness + (socialImpact.emotionalResilience - 1) * 10 * multiplier)
      };
    });
  }, [exerciseImpact, overallHealth, overallProductivity, deepWorkImpact, overallHappiness, socialImpact]);
  
  // Radar chart data
  // Preset modes handler
  const applyPreset = (mode: string) => {
    setPresetMode(mode);
    switch (mode) {
      case 'Balanced':
        setSleepHours(7.5);
        setSleepQuality(7);
        setExerciseMinutes(30);
        setExerciseIntensity(6);
        setDeepWorkHours(3);
        setFocusQuality(7);
        setNutritionQuality(7);
        setHydration(6);
        setSocialHours(2);
        setSocialQuality(7);
        setSteps(9000);
        setScreenTime(2.5);
        setProtein(120);
        break;
      case 'Hard Charger':
        setSleepHours(6.5);
        setSleepQuality(8);
        setExerciseMinutes(60);
        setExerciseIntensity(8);
        setDeepWorkHours(5);
        setFocusQuality(9);
        setNutritionQuality(9);
        setHydration(8);
        setSocialHours(1.5);
        setSocialQuality(8);
        setSteps(12000);
        setScreenTime(1.5);
        setProtein(150);
        break;
      case 'Gentle Reset':
        setSleepHours(8.5);
        setSleepQuality(6);
        setExerciseMinutes(20);
        setExerciseIntensity(4);
        setDeepWorkHours(2);
        setFocusQuality(6);
        setNutritionQuality(6);
        setHydration(5);
        setSocialHours(3);
        setSocialQuality(6);
        setSteps(6000);
        setScreenTime(3.5);
        setProtein(100);
        break;
    }
  };
  
  const radarData = useMemo(() => [
    {
      category: 'Sleep',
      value: sleepImpact.healthScore,
      fullMark: 100
    },
    {
      category: 'Exercise',
      value: exerciseImpact.healthScore,
      fullMark: 100
    },
    {
      category: 'Nutrition',
      value: nutritionImpact.healthScore,
      fullMark: 100
    },
    {
      category: 'Deep Work',
      value: deepWorkImpact.productivityScore,
      fullMark: 100
    },
    {
      category: 'Social',
      value: socialImpact.happinessScore,
      fullMark: 100
    }
  ], [sleepImpact, exerciseImpact, nutritionImpact, deepWorkImpact, socialImpact]);
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      {/* Header */}
      <header className={`backdrop-blur-sm border-b sticky top-0 z-10 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-800/90 border-gray-700' 
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Life Optimizer
                </h1>
                <p className={`text-xs transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Transform your daily habits into life-changing results</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {/* Preset Mode Buttons */}
              <div className="hidden md:flex gap-1 mr-4">
                {['Balanced', 'Hard Charger', 'Gentle Reset'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => applyPreset(mode)}
                    className={`px-3 py-1 text-sm rounded-md font-medium transition-all ${
                      presetMode === mode
                        ? 'bg-blue-500 text-white'
                        : isDarkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              
              {/* Tab Buttons */}
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'dashboard' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('inputs')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'inputs' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Daily Inputs
              </button>
              <button
                onClick={() => setActiveTab('projections')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'projections' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Future You
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Profile and Current Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Your Profile */}
              <div className={`rounded-2xl p-6 shadow-lg border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-100'
              }`}>
                <div className="flex items-center gap-2 mb-4">
                  <User className={`w-5 h-5 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                  <h2 className={`text-lg font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>Your Profile</h2>
                </div>
                <p className={`text-xs mb-4 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>Personalize your baseline to improve accuracy.</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Sex</span>
                    <select 
                      value={profile.sex}
                      onChange={(e) => setProfile({...profile, sex: e.target.value})}
                      className={`text-sm font-medium bg-transparent border-none outline-none cursor-pointer transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-900'
                      }`}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Age</span>
                    <input
                      type="number"
                      value={profile.age}
                      onChange={(e) => setProfile({...profile, age: parseInt(e.target.value)})}
                      className={`w-16 text-sm font-medium text-right bg-transparent border-none outline-none transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-900'
                      }`}
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <span className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Height (cm)</span>
                    <input
                      type="number"
                      value={profile.height}
                      onChange={(e) => setProfile({...profile, height: parseInt(e.target.value)})}
                      className={`w-16 text-sm font-medium text-right bg-transparent border-none outline-none transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-900'
                      }`}
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <span className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Weight (kg)</span>
                    <input
                      type="number"
                      value={profile.weight}
                      onChange={(e) => setProfile({...profile, weight: parseInt(e.target.value)})}
                      className={`w-16 text-sm font-medium text-right bg-transparent border-none outline-none transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-900'
                      }`}
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <span className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Activity Level</span>
                    <select 
                      value={profile.activityLevel}
                      onChange={(e) => setProfile({...profile, activityLevel: e.target.value})}
                      className={`text-sm font-medium bg-transparent border-none outline-none cursor-pointer transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-900'
                      }`}
                    >
                      <option value="Sedentary">Sedentary</option>
                      <option value="Light">Light</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Active">Active</option>
                      <option value="Very Active">Very Active</option>
                    </select>
                  </div>
                </div>
                
                <div className={`mt-4 pt-4 border-t transition-colors duration-300 ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-100'
                }`}>
                  <div className="text-center">
                    <p className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Estimated TDEE</p>
                    <p className="text-2xl font-bold text-blue-600">{calculatedTDEE} kcal</p>
                    <p className={`text-xs transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>BMR {Math.round(calculatedTDEE / (profile.activityLevel === 'Moderate' ? 1.55 : 1.2))} × Activity</p>
                  </div>
                </div>
              </div>
              
              {/* Current Metrics */}
              <div className={`rounded-2xl p-6 shadow-lg border transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
              }`}>
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-green-600" />
                  <h3 className={`font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>Weight</h3>
                </div>
                <p className="text-xs text-green-600 mb-2">Δ -{exerciseImpact.weeklyWeightLoss.toFixed(1)} kg</p>
                <p className={`text-3xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{profile.weight.toFixed(1)} kg</p>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>in 120d</p>
              </div>
              
              <div className={`rounded-2xl p-6 shadow-lg border transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
              }`}>
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-yellow-600" />
                  <h3 className={`font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>Savings</h3>
                </div>
                <p className="text-xs text-green-600 mb-2">in 120d</p>
                <p className={`text-3xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>₹{((income - expenses) * 4).toLocaleString()}</p>
              </div>
              
              <div className={`rounded-2xl p-6 shadow-lg border transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
              }`}>
                <div className="flex items-center gap-2 mb-4">
                  <Sun className="w-5 h-5 text-orange-600" />
                  <h3 className={`font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>Happiness</h3>
                </div>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>/100</p>
                <p className={`text-3xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{Math.round(overallHappiness)}</p>
                <div className={`w-full rounded-full h-1 mt-2 transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div 
                    className="bg-orange-500 h-1 rounded-full transition-all duration-500"
                    style={{ width: `${overallHappiness}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Main Scores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`rounded-2xl p-6 shadow-lg border transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
              }`}>
                <h2 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>Overall Scores</h2>
                <div className="flex justify-around">
                  <ProgressRing score={overallHealth} label="Health" color="#10b981" icon={Heart} isDarkMode={isDarkMode} />
                  <ProgressRing score={overallProductivity} label="Productivity" color="#3b82f6" icon={Brain} isDarkMode={isDarkMode} />
                  <ProgressRing score={overallHappiness} label="Happiness" color="#f59e0b" icon={Sun} isDarkMode={isDarkMode} />
                </div>
              </div>
              
              {/* Trajectory Section */}
              <div className={`rounded-2xl p-6 shadow-lg border transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
              }`}>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className={`w-5 h-5 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                  <h2 className={`text-lg font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>Trajectory</h2>
                </div>
                <p className={`text-xs mb-4 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>How your body, mind, and money evolve over time.</p>
                
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={projectionData.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#f0f0f0'} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: isDarkMode ? '#9CA3AF' : '#374151' }} />
                    <YAxis yAxisId="weight" orientation="left" domain={[60, 80]} tick={{ fontSize: 10, fill: isDarkMode ? '#9CA3AF' : '#374151' }} />
                    <YAxis yAxisId="score" orientation="right" domain={[0, 100]} tick={{ fontSize: 10, fill: isDarkMode ? '#9CA3AF' : '#374151' }} />
                    <Tooltip content={(props: any) => <CustomTooltip {...props} isDarkMode={isDarkMode} />} />
                    <Line 
                      yAxisId="weight"
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Weight (kg)"
                    />
                    <Line 
                      yAxisId="score"
                      type="monotone" 
                      dataKey="happiness" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Happiness"
                    />
                    <Line 
                      yAxisId="score"
                      type="monotone" 
                      dataKey="health" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      name="Health"
                    />
                    <Line 
                      yAxisId="score"
                      type="monotone" 
                      dataKey="productivity" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      name="Productivity"
                    />
                  </LineChart>
                </ResponsiveContainer>
                
                {/* Savings Bar Chart */}
                <ResponsiveContainer width="100%" height={120} className="mt-4">
                  <BarChart data={projectionData.slice(0, 5)}>
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: isDarkMode ? '#9CA3AF' : '#374151' }} />
                    <YAxis tick={{ fontSize: 10, fill: isDarkMode ? '#9CA3AF' : '#374151' }} />
                    <Tooltip content={(props: any) => <CustomTooltip {...props} isDarkMode={isDarkMode} />} />
                    <Bar dataKey="income" fill="#1f2937" name="Savings (₹)" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <StreakTracker streak={streak} lastActive={lastActive} isDarkMode={isDarkMode} />
            </div>
            
            {/* Simulation Window */}
            <div className={`rounded-2xl p-6 shadow-lg border transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className={`w-5 h-5 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`} />
                <h2 className={`text-lg font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>Simulation Window</h2>
              </div>
              <p className={`text-xs mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>How many days to project forward?</p>
              
              <div className="flex items-center gap-4">
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-900'
                }`}>{simulationDays} days</span>
                <input
                  type="range"
                  min="30"
                  max="120"
                  value={simulationDays}
                  onChange={(e) => setSimulationDays(parseInt(e.target.value))}
                  className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer transition-colors duration-300 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
                />
                <span className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>Max 120</span>
              </div>
            </div>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                title="Weight Loss Rate"
                value={`${exerciseImpact.weeklyWeightLoss.toFixed(1)} lbs/wk`}
                subtitle="Based on exercise"
                icon={Activity}
                color="#10b981"
                trend={exerciseMinutes > 30 ? 12 : -5}
                isDarkMode={isDarkMode}
              />
              <MetricCard
                title="Energy Level"
                value={`${Math.round(exerciseImpact.energyBoost * nutritionImpact.energyLevel * 100)}%`}
                subtitle="Physical + Mental"
                icon={Zap}
                color="#f59e0b"
                trend={8}
                isDarkMode={isDarkMode}
              />
              <MetricCard
                title="Focus Power"
                value={`${Math.round(deepWorkImpact.cognitiveReserve * 100)}%`}
                subtitle="Cognitive capacity"
                icon={Brain}
                color="#3b82f6"
                trend={deepWorkHours > 2 ? 15 : 0}
                isDarkMode={isDarkMode}
              />
              <MetricCard
                title="Income Potential"
                value={`+$${Math.round(deepWorkImpact.incomeProjection * 30)}/mo`}
                subtitle="From deep work"
                icon={TrendingUp}
                color="#8b5cf6"
                trend={deepWorkHours > 3 ? 20 : 5}
                isDarkMode={isDarkMode}
              />
            </div>
            
            {/* Smart Suggestions */}
            <div className={`rounded-2xl p-6 shadow-lg border transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                <h2 className={`text-lg font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>Smart Suggestions</h2>
              </div>
              <p className={`text-xs mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>Quick, high-impact tweaks based on your inputs.</p>
              
              <div className={`border rounded-lg p-4 transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-blue-900/20 border-blue-800 text-blue-300' 
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}>
                <p className="text-sm">
                  Looking good! Try extending the window or experimenting with presets.
                </p>
              </div>
            </div>
            
            {/* What Drives Each Metric */}
            <div className={`rounded-2xl p-6 shadow-lg border transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <Eye className={`w-5 h-5 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`} />
                <h2 className={`text-lg font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>What Drives Each Metric?</h2>
              </div>
              <p className={`text-xs mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>Understand the model so you can exploit it.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-green-600" />
                    <h3 className={`font-semibold transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>Weight</h3>
                  </div>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Weight shifts with your daily calorie balance vs TDEE. Auto-calories set a modest 300 kcal deficit.
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sun className="w-5 h-5 text-orange-600" />
                    <h3 className={`font-semibold transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>Happiness</h3>
                  </div>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Optimized by ~7-8h sleep, some daily movement, 0-3h social time, and keeping leisure screen time in check.
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <h3 className={`font-semibold transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>Productivity</h3>
                  </div>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    More deep work, fewer meetings, strong sleep. Batch shallow tasks and protect focus blocks.
                  </p>
                </div>
              </div>
              
              <div className={`mt-6 p-4 rounded-lg transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <p className={`text-xs italic transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  This is an educational sandbox with simplified heuristics — not medical or financial advice.
                </p>
              </div>
            </div>
            
            {/* Insights */}
            <div className={`rounded-2xl p-6 text-white transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-blue-600 to-purple-700' 
                : 'bg-gradient-to-r from-blue-500 to-purple-500'
            }`}>
              <h2 className="text-xl font-bold mb-4">Today's Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`backdrop-blur rounded-lg p-4 transition-colors duration-300 ${
                  isDarkMode ? 'bg-white/10' : 'bg-white/20'
                }`}>
                  <Award className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold mb-1">Top Performer</h3>
                  <p className="text-sm opacity-90">
                    Your {radarData.reduce((max, item) => item.value > max.value ? item : max).category} score is excellent at {Math.round(radarData.reduce((max, item) => item.value > max.value ? item : max).value)}%
                  </p>
                </div>
                <div className={`backdrop-blur rounded-lg p-4 transition-colors duration-300 ${
                  isDarkMode ? 'bg-white/10' : 'bg-white/20'
                }`}>
                  <Target className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold mb-1">Focus Area</h3>
                  <p className="text-sm opacity-90">
                    Improving {radarData.reduce((min, item) => item.value < min.value ? item : min).category} by 20% could boost overall health by 8%
                  </p>
                </div>
                <div className={`backdrop-blur rounded-lg p-4 transition-colors duration-300 ${
                  isDarkMode ? 'bg-white/10' : 'bg-white/20'
                }`}>
                  <Calendar className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold mb-1">30-Day Projection</h3>
                  <p className="text-sm opacity-90">
                    Continue this routine to lose {(exerciseImpact.weeklyWeightLoss * 4).toFixed(1)} lbs and increase productivity by {Math.round(deepWorkImpact.skillGrowth * 4)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Inputs Tab */}
        {activeTab === 'inputs' && (
          <div className="space-y-6">
            <div className={`rounded-2xl p-6 shadow-lg border transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center gap-2 mb-6">
                <Settings className={`w-6 h-6 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`} />
                <h2 className={`text-xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>Daily Inputs</h2>
              </div>
              <p className={`text-sm mb-6 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Adjust lifestyle dials and see the ripple effects.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputSlider
                  label="Sleep Duration"
                  value={sleepHours}
                  onChange={setSleepHours}
                  min={4}
                  max={12}
                  step={0.5}
                  icon={Moon}
                  color="#8b5cf6"
                  unit="h"
                  isDarkMode={isDarkMode}
                />
                <InputSlider
                  label="Sleep Quality"
                  value={sleepQuality}
                  onChange={setSleepQuality}
                  min={1}
                  max={10}
                  icon={Moon}
                  color="#8b5cf6"
                  isDarkMode={isDarkMode}
                />
                <InputSlider
                  label="Exercise Duration"
                  value={exerciseMinutes}
                  onChange={setExerciseMinutes}
                  min={0}
                  max={120}
                  step={5}
                  icon={Activity}
                  color="#10b981"
                  unit="min"
                  isDarkMode={isDarkMode}
                />
                <InputSlider
                  label="Exercise Intensity"
                  value={exerciseIntensity}
                  onChange={setExerciseIntensity}
                  min={1}
                  max={10}
                  icon={Activity}
                  color="#10b981"
                  isDarkMode={isDarkMode}
                />
                <InputSlider
                  label="Deep Work Hours"
                  value={deepWorkHours}
                  onChange={setDeepWorkHours}
                  min={0}
                  max={8}
                  step={0.5}
                  icon={Brain}
                  color="#3b82f6"
                  unit="h"
                  isDarkMode={isDarkMode}
                />
                <InputSlider
                  label="Focus Quality"
                  value={focusQuality}
                  onChange={setFocusQuality}
                  min={1}
                  max={10}
                  icon={Brain}
                  color="#3b82f6"
                  isDarkMode={isDarkMode}
                />
                <InputSlider
                  label="Nutrition Quality"
                  value={nutritionQuality}
                  onChange={setNutritionQuality}
                  min={1}
                  max={10}
                  icon={Coffee}
                  color="#f59e0b"
                  isDarkMode={isDarkMode}
                />
                <InputSlider
                  label="Water Intake"
                  value={hydration}
                  onChange={setHydration}
                  min={0}
                  max={12}
                  icon={Coffee}
                  color="#06b6d4"
                  unit=" cups"
                  isDarkMode={isDarkMode}
                />
                <InputSlider
                  label="Social Time"
                  value={socialHours}
                  onChange={setSocialHours}
                  min={0}
                  max={8}
                  step={0.5}
                  icon={Users}
                  color="#ec4899"
                  unit="h"
                  isDarkMode={isDarkMode}
                />
                <InputSlider
                  label="Social Quality"
                  value={socialQuality}
                  onChange={setSocialQuality}
                  min={1}
                  max={10}
                  icon={Users}
                  color="#ec4899"
                  isDarkMode={isDarkMode}
                />
                <InputSlider
                  label="Steps"
                  value={steps}
                  onChange={setSteps}
                  min={3000}
                  max={15000}
                  step={500}
                  icon={Footprints}
                  color="#8b5cf6"
                  isDarkMode={isDarkMode}
                />
                <InputSlider
                  label="Screen Time"
                  value={screenTime}
                  onChange={setScreenTime}
                  min={0.5}
                  max={8}
                  step={0.5}
                  icon={Smartphone}
                  color="#ef4444"
                  unit="h"
                  isDarkMode={isDarkMode}
                />
                <InputSlider
                  label="Social Time"
                  value={socialHours}
                  onChange={setSocialHours}
                  min={0}
                  max={8}
                  step={0.5}
                  icon={Users}
                  color="#ec4899"
                  unit="h"
                  isDarkMode={isDarkMode}
                />
                <InputSlider
                  label="Protein"
                  value={protein}
                  onChange={setProtein}
                  min={50}
                  max={200}
                  step={5}
                  icon={Utensils}
                  color="#10b981"
                  unit="g"
                  isDarkMode={isDarkMode}
                />
              </div>
              
              {/* Calories Section */}
              <div className={`mt-6 p-4 rounded-lg transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <label className={`text-sm font-medium transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>Calories</label>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Auto (TDEE - 300)</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoCalories}
                        onChange={(e) => setAutoCalories(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className={`w-11 h-6 rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-600 after:border-gray-500' : 'bg-gray-200 after:border-gray-300'
                      }`}></div>
                    </label>
                  </div>
                </div>
                <div className={`text-2xl font-bold text-center transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {effectiveCalories} kcal/day
                </div>
                {!autoCalories && (
                  <input
                    type="range"
                    min="1200"
                    max="4000"
                    step="50"
                    value={calories}
                    onChange={(e) => setCalories(parseInt(e.target.value))}
                    className={`w-full mt-3 h-2 rounded-lg appearance-none cursor-pointer transition-colors duration-300 ${
                      isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            </div>
            
            {/* Finances Section */}
            <div className={`rounded-2xl p-6 shadow-lg border transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-6 h-6 text-green-600" />
                <h2 className={`text-xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>Finances</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Income (₹/mo)</label>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(parseInt(e.target.value))}
                    className={`w-full p-3 border rounded-lg text-right font-bold text-lg transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Expenses (₹/mo)</label>
                  <input
                    type="number"
                    value={expenses}
                    onChange={(e) => setExpenses(parseInt(e.target.value))}
                    className={`w-full p-3 border rounded-lg text-right font-bold text-lg transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Savings Rate</span>
                  <span className={`font-bold transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{savingsRate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={savingsRate}
                  onChange={(e) => setSavingsRate(parseInt(e.target.value))}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer transition-colors duration-300 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
                />
                <div className="mt-2 text-center">
                  <span className="text-lg font-bold text-green-600">
                    ₹{(income - expenses).toLocaleString()}/mo saved
                  </span>
                </div>
              </div>
            </div>
            
            {/* Real-time Impact Display */}
            <div className={`rounded-2xl p-6 text-white transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-green-600 to-emerald-700' 
                : 'bg-gradient-to-r from-green-500 to-emerald-500'
            }`}>
              <h3 className="text-lg font-bold mb-4">Real-time Impact Analysis</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-3xl font-bold">{Math.round(sleepImpact.productivityBoost * 100)}%</p>
                  <p className="text-sm opacity-90">Productivity Boost</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{exerciseImpact.weeklyWeightLoss.toFixed(1)} lbs</p>
                  <p className="text-sm opacity-90">Weekly Weight Loss</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">+${Math.round(deepWorkImpact.incomeProjection)}</p>
                  <p className="text-sm opacity-90">Daily Income Potential</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{Math.round(socialImpact.stressReduction * 100)}%</p>
                  <p className="text-sm opacity-90">Stress Level</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Projections Tab */}
        {activeTab === 'projections' && (
          <div className="space-y-6">
            <div className={`rounded-2xl p-6 shadow-lg border transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <h2 className={`text-xl font-bold mb-6 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>Your Future Trajectory</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Weight Projection */}
                <div>
                  <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>Weight Loss Journey</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={projectionData}>
                      <defs>
                        <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#f0f0f0'} />
                      <XAxis dataKey="month" tick={{ fill: isDarkMode ? '#9CA3AF' : '#374151' }} />
                      <YAxis domain={['dataMin - 5', 'dataMax + 5']} tick={{ fill: isDarkMode ? '#9CA3AF' : '#374151' }} />
                      <Tooltip content={(props: any) => <CustomTooltip {...props} isDarkMode={isDarkMode} />} />
                      <Area type="monotone" dataKey="weight" stroke="#10b981" fillOpacity={1} fill="url(#weightGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Health Score Projection */}
                <div>
                  <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>Health Score Evolution</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={projectionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#f0f0f0'} />
                      <XAxis dataKey="month" tick={{ fill: isDarkMode ? '#9CA3AF' : '#374151' }} />
                      <YAxis domain={[0, 100]} tick={{ fill: isDarkMode ? '#9CA3AF' : '#374151' }} />
                      <Tooltip content={(props: any) => <CustomTooltip {...props} isDarkMode={isDarkMode} />} />
                      <Line type="monotone" dataKey="health" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Income Growth */}
                <div>
                  <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>Income Growth Potential</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={projectionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#f0f0f0'} />
                      <XAxis dataKey="month" tick={{ fill: isDarkMode ? '#9CA3AF' : '#374151' }} />
                      <YAxis tick={{ fill: isDarkMode ? '#9CA3AF' : '#374151' }} />
                      <Tooltip content={(props: any) => <CustomTooltip {...props} isDarkMode={isDarkMode} />} />
                      <Bar dataKey="income" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Happiness Trend */}
                <div>
                  <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>Happiness Trajectory</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={projectionData}>
                      <defs>
                        <linearGradient id="happinessGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#f0f0f0'} />
                      <XAxis dataKey="month" tick={{ fill: isDarkMode ? '#9CA3AF' : '#374151' }} />
                      <YAxis domain={[0, 100]} tick={{ fill: isDarkMode ? '#9CA3AF' : '#374151' }} />
                      <Tooltip content={(props: any) => <CustomTooltip {...props} isDarkMode={isDarkMode} />} />
                      <Area type="monotone" dataKey="happiness" stroke="#ec4899" fillOpacity={1} fill="url(#happinessGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Milestone Predictions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
                <Calendar className="w-8 h-8 mb-3" />
                <h3 className="text-lg font-semibold mb-2">30-Day Milestone</h3>
                <p className="text-3xl font-bold mb-2">-{(exerciseImpact.weeklyWeightLoss * 4).toFixed(1)} lbs</p>
                <p className="text-sm opacity-90">
                  Health Score: {Math.round(Math.min(100, overallHealth + overallHealth * 0.08))}%
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
                <Target className="w-8 h-8 mb-3" />
                <h3 className="text-lg font-semibold mb-2">90-Day Transformation</h3>
                <p className="text-3xl font-bold mb-2">+{Math.round(deepWorkImpact.skillGrowth * 12)}%</p>
                <p className="text-sm opacity-90">
                  Skill improvement & +${Math.round(deepWorkImpact.incomeProjection * 90)} earned
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white">
                <Award className="w-8 h-8 mb-3" />
                <h3 className="text-lg font-semibold mb-2">1-Year Vision</h3>
                <p className="text-3xl font-bold mb-2">New You</p>
                <p className="text-sm opacity-90">
                  -{(exerciseImpact.weeklyWeightLoss * 52).toFixed(0)} lbs, +${Math.round(deepWorkImpact.incomeProjection * 365)}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;