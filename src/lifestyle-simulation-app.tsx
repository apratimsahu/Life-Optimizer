import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Moon, Sun, Activity, Brain, Heart, TrendingUp, Award, Zap, Coffee, Users, Target, Calendar, AlertCircle, CheckCircle, Flame } from 'lucide-react';

// ============ CALCULATION ENGINES ============
const calculateSleepImpact = (hours, quality) => {
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

const calculateExerciseImpact = (minutes, intensity) => {
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

const calculateDeepWorkImpact = (hours, focusQuality) => {
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

const calculateNutritionImpact = (quality, hydration) => {
  return {
    healthScore: (quality / 10) * 80 + (hydration / 8) * 20,
    energyLevel: quality > 7 ? 1.2 : 1.0,
    immunityBoost: quality > 8 ? 1.25 : 1.0,
    skinHealth: hydration >= 6 ? 1.15 : 0.9,
    digestiveHealth: quality * 10
  };
};

const calculateSocialImpact = (hours, quality) => {
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
const ProgressRing = ({ score, label, color, icon: Icon, size = 120 }) => {
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
          className="text-gray-200"
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
        <span className="text-2xl font-bold">{Math.round(score)}</span>
        <span className="text-xs text-gray-600">{label}</span>
      </div>
    </div>
  );
};

const InputSlider = ({ label, value, onChange, min, max, step = 1, icon: Icon, color, unit = '' }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5" style={{ color }} />}
          <label className="font-medium text-gray-700">{label}</label>
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
          background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`
        }}
      />
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-500">{min}{unit}</span>
        <span className="text-xs text-gray-500">{max}{unit}</span>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, subtitle, icon: Icon, color, trend }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
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
      <h3 className="text-2xl font-bold mb-1">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
};

const StreakTracker = ({ streak, lastActive }) => {
  const isActiveToday = lastActive === new Date().toDateString();
  
  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
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
      <div className="bg-white/20 rounded-lg p-3">
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
  
  // UI states
  const [activeTab, setActiveTab] = useState('dashboard');
  const [streak, setStreak] = useState(7);
  const [lastActive, setLastActive] = useState(new Date().toDateString());
  
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
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
                <p className="text-xs text-gray-600">Transform your daily habits into life-changing results</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'dashboard' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
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
            {/* Main Scores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">Overall Scores</h2>
                <div className="flex justify-around">
                  <ProgressRing score={overallHealth} label="Health" color="#10b981" icon={Heart} />
                  <ProgressRing score={overallProductivity} label="Productivity" color="#3b82f6" icon={Brain} />
                  <ProgressRing score={overallHappiness} label="Happiness" color="#f59e0b" icon={Sun} />
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">Lifestyle Balance</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={radarData}>
                    <PolarGrid strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar name="Balance" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              <StreakTracker streak={streak} lastActive={lastActive} />
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
              />
              <MetricCard
                title="Energy Level"
                value={`${Math.round(exerciseImpact.energyBoost * nutritionImpact.energyLevel * 100)}%`}
                subtitle="Physical + Mental"
                icon={Zap}
                color="#f59e0b"
                trend={8}
              />
              <MetricCard
                title="Focus Power"
                value={`${Math.round(deepWorkImpact.cognitiveReserve * 100)}%`}
                subtitle="Cognitive capacity"
                icon={Brain}
                color="#3b82f6"
                trend={deepWorkHours > 2 ? 15 : 0}
              />
              <MetricCard
                title="Income Potential"
                value={`+$${Math.round(deepWorkImpact.incomeProjection * 30)}/mo`}
                subtitle="From deep work"
                icon={TrendingUp}
                color="#8b5cf6"
                trend={deepWorkHours > 3 ? 20 : 5}
              />
            </div>
            
            {/* Insights */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Today's Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                  <Award className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold mb-1">Top Performer</h3>
                  <p className="text-sm opacity-90">
                    Your {radarData.reduce((max, item) => item.value > max.value ? item : max).category} score is excellent at {Math.round(radarData.reduce((max, item) => item.value > max.value ? item : max).value)}%
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                  <Target className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold mb-1">Focus Area</h3>
                  <p className="text-sm opacity-90">
                    Improving {radarData.reduce((min, item) => item.value < min.value ? item : min).category} by 20% could boost overall health by 8%
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg p-4">
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
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Daily Lifestyle Inputs</h2>
              
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
                />
                <InputSlider
                  label="Sleep Quality"
                  value={sleepQuality}
                  onChange={setSleepQuality}
                  min={1}
                  max={10}
                  icon={Moon}
                  color="#8b5cf6"
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
                />
                <InputSlider
                  label="Exercise Intensity"
                  value={exerciseIntensity}
                  onChange={setExerciseIntensity}
                  min={1}
                  max={10}
                  icon={Activity}
                  color="#10b981"
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
                />
                <InputSlider
                  label="Focus Quality"
                  value={focusQuality}
                  onChange={setFocusQuality}
                  min={1}
                  max={10}
                  icon={Brain}
                  color="#3b82f6"
                />
                <InputSlider
                  label="Nutrition Quality"
                  value={nutritionQuality}
                  onChange={setNutritionQuality}
                  min={1}
                  max={10}
                  icon={Coffee}
                  color="#f59e0b"
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
                />
                <InputSlider
                  label="Social Quality"
                  value={socialQuality}
                  onChange={setSocialQuality}
                  min={1}
                  max={10}
                  icon={Users}
                  color="#ec4899"
                />
              </div>
            </div>
            
            {/* Real-time Impact Display */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
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
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Your Future Trajectory</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Weight Projection */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Weight Loss Journey</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={projectionData}>
                      <defs>
                        <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                      <Tooltip />
                      <Area type="monotone" dataKey="weight" stroke="#10b981" fillOpacity={1} fill="url(#weightGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Health Score Projection */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Health Score Evolution</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={projectionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="health" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Income Growth */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Income Growth Potential</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={projectionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="income" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Happiness Trend */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Happiness Trajectory</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={projectionData}>
                      <defs>
                        <linearGradient id="happinessGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
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