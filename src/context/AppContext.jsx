import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Themes: 'midnight' (default), 'emerald', 'cyberpunk'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('aura-theme') || 'midnight';
  });

  // Authentication Mock State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('aura-auth') === 'true';
  });

  const [user, setUser] = useState({
    username: 'ApexAthlete',
    email: 'apex@aurafit.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    bio: 'Pushing past limits. Focused on hypertrophy and metabolic conditioning.',
    level: 4,
    experience: 720,
    nextLevelExp: 1000,
    streak: 6,
    healthScore: 84,
    weight: 78.5,
    height: 182,
    age: 26,
    gender: 'Male',
    goalType: 'cut', // 'cut' | 'bulk' | 'maintain' | 'custom'
    targetCalories: 2200,
    targetMacros: { protein: 165, carbs: 220, fats: 73 }, // standard splits
    targetWater: 3000, // ml
    targetSteps: 10000,
  });

  // Food Database (Preloaded Mock Food bank)
  const [foodBank, setFoodBank] = useState([
    { id: '1', name: 'Avocado Salad', calories: 240, protein: 4, carbs: 12, fats: 22, sugar: 3, vitamins: 'Vitamin E, C, B6', barcode: '888123456789' },
    { id: '2', name: 'Grilled Chicken Breast', calories: 165, protein: 31, carbs: 0, fats: 3.6, sugar: 0, vitamins: 'Vitamin B6, Iron, Niacin', barcode: '737622440022' },
    { id: '3', name: 'Salmon Fillet', calories: 208, protein: 22, carbs: 0, fats: 13, sugar: 0, vitamins: 'Vitamin D, Omega-3, B12', barcode: '012000000133' },
    { id: '4', name: 'Whey Protein Shake', calories: 140, protein: 26, carbs: 3, fats: 2, sugar: 1, vitamins: 'Calcium, B-Complex', barcode: '028400070566' },
    { id: '5', name: 'Oatmeal Bowl with Berries', calories: 280, protein: 8, carbs: 54, fats: 4, sugar: 9, vitamins: 'Iron, Magnesium, Vitamin C', barcode: '049000028904' },
    { id: '6', name: 'Greek Yogurt Bowl', calories: 150, protein: 15, carbs: 8, fats: 4, sugar: 6, vitamins: 'Calcium, Vitamin B12, Zinc', barcode: '930060138541' },
    { id: '7', name: 'Double Cheeseburger', calories: 580, protein: 35, carbs: 45, fats: 32, sugar: 7, vitamins: 'Iron, Vitamin B12', barcode: '123456789012' },
    { id: '8', name: 'Golden Banana', calories: 105, protein: 1.3, carbs: 27, fats: 0.3, sugar: 14, vitamins: 'Vitamin B6, Potassium, C', barcode: '930060138000' },
    { id: '9', name: 'French Fries', calories: 365, protein: 4, carbs: 48, fats: 17, sugar: 0.5, vitamins: 'Vitamin C, Potassium, Vitamin B6', barcode: '011111222223' }
  ]);

  // Logged meals today and historical log
  const [meals, setMeals] = useState([
    { id: 'm1', name: 'Oatmeal Bowl with Berries', calories: 280, protein: 8, carbs: 54, fats: 4, sugar: 9, vitamins: 'Iron, Vitamin C', category: 'Breakfast', time: '08:15 AM', date: '2026-05-20' },
    { id: 'm2', name: 'Grilled Chicken Breast', calories: 165, protein: 31, carbs: 0, fats: 3.6, sugar: 0, vitamins: 'Vitamin B6, Iron', category: 'Lunch', time: '01:30 PM', date: '2026-05-20' },
    { id: 'm3', name: 'Whey Protein Shake', calories: 140, protein: 26, carbs: 3, fats: 2, sugar: 1, vitamins: 'Calcium', category: 'Snack', time: '05:00 PM', date: '2026-05-20' },
    // Past days (for analytics demo)
    { id: 'm4', name: 'Pepperoni Pizza Slice', calories: 290, protein: 12, carbs: 32, fats: 12, sugar: 3, vitamins: 'Calcium', category: 'Dinner', time: '08:00 PM', date: '2026-05-19' },
    { id: 'm5', name: 'Greek Yogurt Bowl', calories: 150, protein: 15, carbs: 8, fats: 4, sugar: 6, vitamins: 'Calcium', category: 'Breakfast', time: '09:00 AM', date: '2026-05-19' },
    { id: 'm6', name: 'Salmon Fillet', calories: 416, protein: 44, carbs: 0, fats: 26, sugar: 0, vitamins: 'Vitamin D', category: 'Lunch', time: '02:00 PM', date: '2026-05-19' },
    { id: 'm7', name: 'Double Cheeseburger', calories: 580, protein: 35, carbs: 45, fats: 32, sugar: 7, vitamins: 'Iron', category: 'Dinner', time: '07:30 PM', date: '2026-05-18' },
    { id: 'm8', name: 'Avocado Salad', calories: 240, protein: 4, carbs: 12, fats: 22, sugar: 3, vitamins: 'Vitamin E', category: 'Lunch', time: '01:10 PM', date: '2026-05-18' }
  ]);

  // Water Intake State
  const [waterIntake, setWaterIntake] = useState([
    { date: '2026-05-20', amount: 1800 },
    { date: '2026-05-19', amount: 3200 },
    { date: '2026-05-18', amount: 2800 },
    { date: '2026-05-17', amount: 3000 },
  ]);

  // Weight History State
  const [weightHistory, setWeightHistory] = useState([
    { date: '05-14', weight: 79.8 },
    { date: '05-15', weight: 79.5 },
    { date: '05-16', weight: 79.2 },
    { date: '05-17', weight: 79.0 },
    { date: '05-18', weight: 78.8 },
    { date: '05-19', weight: 78.7 },
    { date: '05-20', weight: 78.5 },
  ]);

  // Step Tracker State
  const [stepLogs, setStepLogs] = useState([
    { date: '2026-05-20', steps: 8430 },
    { date: '2026-05-19', steps: 11200 },
    { date: '2026-05-18', steps: 9800 },
    { date: '2026-05-17', steps: 10400 },
  ]);

  // Workouts State
  const [workouts, setWorkouts] = useState([
    { id: 'w1', type: 'Strength Training', duration: 60, caloriesBurned: 450, time: '06:00 PM', date: '2026-05-20' },
    { id: 'w2', type: 'HIIT Cardio', duration: 30, caloriesBurned: 350, time: '07:30 AM', date: '2026-05-19' },
    { id: 'w3', type: 'Outdoor Cycling', duration: 45, caloriesBurned: 400, time: '06:30 PM', date: '2026-05-18' }
  ]);

  // Achievements/Badges
  const [achievements, setAchievements] = useState([
    { id: 'a1', title: 'First Scan', description: 'Log a food item using AI Image or Barcode recognition.', icon: 'Camera', unlocked: true, date: '2026-05-18' },
    { id: 'a2', title: 'Hydration Master', description: 'Hit your water intake goal 3 days in a row.', icon: 'Droplet', unlocked: true, date: '2026-05-19' },
    { id: 'a3', title: 'Streak Builder', description: 'Maintain a logging streak of 5+ days.', icon: 'Flame', unlocked: true, date: '2026-05-18' },
    { id: 'a4', title: 'Macro Perfectionist', description: 'Hit all macro goals within ±5% accuracy.', icon: 'Sliders', unlocked: false, date: null },
    { id: 'a5', title: 'Iron Warrior', description: 'Log 5 workouts in a single week.', icon: 'Dumbbell', unlocked: false, date: null },
    { id: 'a6', title: 'Clean Eater', description: 'Keep daily sugar intake below 30g for 3 days.', icon: 'CheckCircle', unlocked: false, date: null }
  ]);

  // Health Challenges
  const [challenges, setChallenges] = useState([
    { id: 'c1', title: 'Sub-Zero Sugar Week', description: 'Limit sugar to less than 25g/day.', progress: 60, daysLeft: 2, active: true },
    { id: 'c2', title: 'Step-tember Marathon', description: 'Log 10,000 steps daily for 7 days.', progress: 85, daysLeft: 1, active: true },
    { id: 'c3', title: 'Intermittent Fasting Fit', description: 'Observe 16:8 fasting window for 5 consecutive days.', progress: 20, daysLeft: 4, active: false }
  ]);

  // Admin and API Monitor Stats
  const [adminStats, setAdminStats] = useState({
    totalUsers: 14209,
    apiRequestsToday: 34812,
    activeVisionScans: 8493,
    avgProcessingTime: 120, // ms
    uptime: '99.98%',
    activeConnections: 541,
    dbItemsCount: 154382,
    apiFailures: 4
  });

  // Apply visual theme to document body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aura-theme', theme);
  }, [theme]);

  // Login handler
  const loginUser = (email, password) => {
    setIsAuthenticated(true);
    localStorage.setItem('aura-auth', 'true');
    setUser(prev => ({ ...prev, email: email, username: email.split('@')[0] }));
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('aura-auth');
  };

  // Add meal helper
  const addMeal = (mealData) => {
    const newMeal = {
      id: 'm-' + Math.random().toString(36).substr(2, 9),
      name: mealData.name,
      calories: Math.round(Number(mealData.calories) || 0),
      protein: Math.round(Number(mealData.protein) || 0),
      carbs: Math.round(Number(mealData.carbs) || 0),
      fats: Math.round(Number(mealData.fats) || 0),
      sugar: Math.round(Number(mealData.sugar) || 0),
      vitamins: mealData.vitamins || 'None listed',
      category: mealData.category || 'Lunch',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0]
    };
    
    setMeals(prev => [newMeal, ...prev]);
    
    // Add user experience points
    setUser(prev => {
      const expGain = 45;
      const newExp = prev.experience + expGain;
      let newLevel = prev.level;
      let newNextLevelExp = prev.nextLevelExp;
      if (newExp >= prev.nextLevelExp) {
        newLevel += 1;
        newNextLevelExp = Math.round(prev.nextLevelExp * 1.5);
      }
      
      // Update health score slightly based on calorie balancing
      const todayTotal = meals
        .filter(m => m.date === new Date().toISOString().split('T')[0])
        .reduce((sum, item) => sum + item.calories, 0) + newMeal.calories;
      const deviation = Math.abs(todayTotal - prev.targetCalories);
      const scoreImpact = deviation > 500 ? -2 : 1;
      const finalScore = Math.max(50, Math.min(100, prev.healthScore + scoreImpact));

      return {
        ...prev,
        experience: newExp % newNextLevelExp,
        nextLevelExp: newNextLevelExp,
        level: newLevel,
        healthScore: finalScore
      };
    });

    // Update Admin stats request
    setAdminStats(prev => ({
      ...prev,
      apiRequestsToday: prev.apiRequestsToday + 1
    }));
  };

  // Delete meal helper
  const deleteMeal = (id) => {
    setMeals(prev => prev.filter(m => m.id !== id));
  };

  // Log water intake
  const logWater = (amount) => {
    const today = new Date().toISOString().split('T')[0];
    setWaterIntake(prev => {
      const index = prev.findIndex(w => w.date === today);
      if (index > -1) {
        const updated = [...prev];
        updated[index] = { ...updated[index], amount: Math.max(0, updated[index].amount + amount) };
        
        // Trigger Hydration Master check
        if (updated[index].amount >= user.targetWater) {
          checkWaterAchievements(updated);
        }
        return updated;
      } else {
        const updated = [{ date: today, amount: Math.max(0, amount) }, ...prev];
        return updated;
      }
    });
  };

  const checkWaterAchievements = (waterLog) => {
    // Check if hit target for 3 consecutive days
    let count = 0;
    const sorted = [...waterLog].sort((a,b) => new Date(b.date) - new Date(a.date));
    for (let i = 0; i < Math.min(sorted.length, 3); i++) {
      if (sorted[i].amount >= user.targetWater) {
        count++;
      }
    }
    if (count >= 3) {
      unlockAchievement('a2');
    }
  };

  // Log steps today
  const logSteps = (amount) => {
    const today = new Date().toISOString().split('T')[0];
    setStepLogs(prev => {
      const index = prev.findIndex(s => s.date === today);
      if (index > -1) {
        const updated = [...prev];
        updated[index] = { ...updated[index], steps: Math.max(0, updated[index].steps + amount) };
        return updated;
      } else {
        return [{ date: today, steps: Math.max(0, amount) }, ...prev];
      }
    });
  };

  // Log Weight helper
  const logWeight = (weightNum) => {
    const today = new Date().toLocaleDateString([], { month: '2-digit', day: '2-digit' }).replace('/', '-');
    const fullDate = new Date().toISOString().split('T')[0];
    
    setUser(prev => ({ ...prev, weight: Number(weightNum) }));
    setWeightHistory(prev => {
      const filtered = prev.filter(w => w.date !== today);
      return [...filtered, { date: today, weight: Number(weightNum) }].sort((a,b) => a.date.localeCompare(b.date));
    });
  };

  // Add Workout helper
  const addWorkout = (workoutData) => {
    const newWorkout = {
      id: 'w-' + Math.random().toString(36).substr(2, 9),
      type: workoutData.type,
      duration: Math.round(Number(workoutData.duration) || 0),
      caloriesBurned: Math.round(Number(workoutData.caloriesBurned) || 0),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0]
    };
    setWorkouts(prev => [newWorkout, ...prev]);

    // Update challenges progress if step/exercise related
    setChallenges(prev => prev.map(c => {
      if (c.id === 'c2') { // steps challenge
        return { ...c, progress: Math.min(100, c.progress + 5) };
      }
      return c;
    }));

    // Unlock achievement check
    setUser(prev => {
      const expGain = 80;
      return {
        ...prev,
        experience: (prev.experience + expGain) % prev.nextLevelExp,
        level: prev.experience + expGain >= prev.nextLevelExp ? prev.level + 1 : prev.level
      };
    });
  };

  // Toggle Challenge state
  const toggleChallengeActive = (id) => {
    setChallenges(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, active: !c.active };
      }
      return c;
    }));
  };

  // Unlock achievement by id
  const unlockAchievement = (id) => {
    setAchievements(prev => prev.map(a => {
      if (a.id === id && !a.unlocked) {
        return { ...a, unlocked: true, date: new Date().toISOString().split('T')[0] };
      }
      return a;
    }));
  };

  // Add customized food item to Admin bank
  const addFoodToDatabase = (foodData) => {
    const newFood = {
      id: String(foodBank.length + 1),
      name: foodData.name,
      calories: Math.round(Number(foodData.calories) || 0),
      protein: Math.round(Number(foodData.protein) || 0),
      carbs: Math.round(Number(foodData.carbs) || 0),
      fats: Math.round(Number(foodData.fats) || 0),
      sugar: Math.round(Number(foodData.sugar) || 0),
      vitamins: foodData.vitamins || 'General vitamins',
      barcode: foodData.barcode || ''
    };
    setFoodBank(prev => [...prev, newFood]);
    setAdminStats(prev => ({
      ...prev,
      dbItemsCount: prev.dbItemsCount + 1
    }));
  };

  // Update Settings
  const updateSettings = (settingsData) => {
    setUser(prev => ({
      ...prev,
      username: settingsData.username || prev.username,
      goalType: settingsData.goalType || prev.goalType,
      targetCalories: Number(settingsData.targetCalories) || prev.targetCalories,
      targetWater: Number(settingsData.targetWater) || prev.targetWater,
      targetSteps: Number(settingsData.targetSteps) || prev.targetSteps,
      targetMacros: {
        protein: Number(settingsData.protein) || prev.targetMacros.protein,
        carbs: Number(settingsData.carbs) || prev.targetMacros.carbs,
        fats: Number(settingsData.fats) || prev.targetMacros.fats,
      }
    }));
  };

  // AI OCR/Bar Analysis Simulation
  const simulateBarcodeScan = (barcodeValue) => {
    setAdminStats(prev => ({
      ...prev,
      apiRequestsToday: prev.apiRequestsToday + 1,
      activeVisionScans: prev.activeVisionScans + 1
    }));

    const match = foodBank.find(f => f.barcode === barcodeValue);
    if (match) {
      return Promise.resolve(match);
    } else {
      // Simulate creating a random item based on barcode hashes
      const calculatedCalories = (parseInt(barcodeValue.substr(0,4)) % 450) + 50;
      const genericProduct = {
        name: `Barcode Product #${barcodeValue.substr(0, 5)}`,
        calories: calculatedCalories,
        protein: Math.round(calculatedCalories * 0.08),
        carbs: Math.round(calculatedCalories * 0.12),
        fats: Math.round(calculatedCalories * 0.04),
        sugar: Math.round(calculatedCalories * 0.03),
        vitamins: 'Vitamin C, Zinc',
        barcode: barcodeValue
      };
      return Promise.resolve(genericProduct);
    }
  };

  // NLP text parsing simulator
  const parseMealText = (text) => {
    const clean = text.toLowerCase().trim();
    
    // Check direct matches first
    const matchedFood = foodBank.find(f => clean.includes(f.name.toLowerCase()));
    if (matchedFood) {
      // Simple multiplier scanner (e.g. "2 eggs" or "three plates of salmon")
      let count = 1;
      const numMatches = clean.match(/^(\d+)\s+/);
      if (numMatches) {
        count = parseInt(numMatches[1]);
      } else if (clean.startsWith('two ')) count = 2;
      else if (clean.startsWith('three ')) count = 3;

      return {
        name: count > 1 ? `${count}x ${matchedFood.name}` : matchedFood.name,
        calories: matchedFood.calories * count,
        protein: matchedFood.protein * count,
        carbs: matchedFood.carbs * count,
        fats: matchedFood.fats * count,
        sugar: matchedFood.sugar * count,
        vitamins: matchedFood.vitamins
      };
    }

    // Heuristics parser
    let estCalories = 0;
    let estProtein = 0;
    let estCarbs = 0;
    let estFats = 0;
    let foundIngredients = [];

    // Egg matching
    if (clean.includes('egg')) {
      const match = clean.match(/(\d+)\s*egg/);
      const count = match ? parseInt(match[1]) : 1;
      estCalories += count * 70;
      estProtein += count * 6;
      estFats += count * 5;
      foundIngredients.push(`${count}x Fresh Eggs`);
    }
    // Bread matching
    if (clean.includes('bread') || clean.includes('toast')) {
      const match = clean.match(/(\d+)\s*(slice|toast)/);
      const count = match ? parseInt(match[1]) : 1;
      estCalories += count * 80;
      estCarbs += count * 15;
      estProtein += count * 3;
      foundIngredients.push(`${count}x Wheat Bread`);
    }
    // Oatmeal matching
    if (clean.includes('oatmeal') || clean.includes('oats')) {
      estCalories += 150;
      estCarbs += 27;
      estProtein += 5;
      estFats += 2.5;
      foundIngredients.push('Organic Oatmeal');
    }
    // Chicken breast
    if (clean.includes('chicken') || clean.includes('poultry')) {
      estCalories += 200;
      estProtein += 35;
      estFats += 4.5;
      foundIngredients.push('Grilled Chicken Breast');
    }
    // Banana
    if (clean.includes('banana')) {
      estCalories += 105;
      estCarbs += 27;
      estProtein += 1;
      foundIngredients.push('Ripe Banana');
    }
    // Milk/Latte
    if (clean.includes('milk') || clean.includes('latte')) {
      estCalories += 120;
      estCarbs += 12;
      estProtein += 8;
      estFats += 5;
      foundIngredients.push('Whole Milk');
    }

    if (foundIngredients.length > 0) {
      return {
        name: foundIngredients.join(' & '),
        calories: estCalories,
        protein: estProtein,
        carbs: estCarbs,
        fats: estFats,
        sugar: Math.round(estCarbs * 0.2),
        vitamins: 'Vitamin B6, Calcium, Iron'
      };
    }

    // Default fallbacks for random typing
    const hash = clean.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const mockCal = (hash % 380) + 120;
    return {
      name: text.length > 20 ? text.substring(0, 20) + '...' : text,
      calories: mockCal,
      protein: Math.round(mockCal * 0.08),
      carbs: Math.round(mockCal * 0.12),
      fats: Math.round(mockCal * 0.04),
      sugar: Math.round(mockCal * 0.03),
      vitamins: 'General micro-nutrients'
    };
  };

  return (
    <AppContext.Provider value={{
      theme,
      setTheme,
      isAuthenticated,
      setIsAuthenticated,
      user,
      setUser,
      foodBank,
      setFoodBank,
      meals,
      setMeals,
      waterIntake,
      weightHistory,
      stepLogs,
      workouts,
      achievements,
      challenges,
      adminStats,
      loginUser,
      logoutUser,
      addMeal,
      deleteMeal,
      logWater,
      logSteps,
      logWeight,
      addWorkout,
      toggleChallengeActive,
      unlockAchievement,
      addFoodToDatabase,
      updateSettings,
      simulateBarcodeScan,
      parseMealText
    }}>
      {children}
    </AppContext.Provider>
  );
};
