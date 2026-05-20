import React, { useContext } from 'react';
import { BarChart3, TrendingDown, Target, Trophy, Award, Sliders, CheckCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import InteractiveChart from '../components/InteractiveChart';

export default function AnalyticsPage() {
  const { user, meals, weightHistory, achievements } = useContext(AppContext);

  // Compile daily calorie totals for the past 3 days based on current logs
  // plus some static demo data to look like a full week
  const calorieHistory = [
    { date: '05-14', calories: 2100 },
    { date: '05-15', calories: 2350 },
    { date: '05-16', calories: 1980 },
    { date: '05-17', calories: 2050 },
    { date: '05-18', calories: 2220 }, // matches past data
    { date: '05-19', calories: 1720 }, // matches past data
    { date: '05-20', calories: meals.filter(m => m.date === '2026-05-20').reduce((s, m) => s + m.calories, 0) }
  ];

  // Calculate Macro Ratios logged today
  const todayMeals = meals.filter(m => m.date === new Date().toISOString().split('T')[0]);
  const totalProt = todayMeals.reduce((s, m) => s + m.protein, 0);
  const totalCarb = todayMeals.reduce((s, m) => s + m.carbs, 0);
  const totalFat = todayMeals.reduce((s, m) => s + m.fats, 0);

  const totalMacroGrams = (totalProt + totalCarb + totalFat) || 1;
  const protPct = Math.round((totalProt / totalMacroGrams) * 100);
  const carbPct = Math.round((totalCarb / totalMacroGrams) * 100);
  const fatPct = Math.round((totalFat / totalMacroGrams) * 100);

  const targetMacroGrams = (user.targetMacros.protein + user.targetMacros.carbs + user.targetMacros.fats) || 1;
  const targetProtPct = Math.round((user.targetMacros.protein / targetMacroGrams) * 100);
  const targetCarbPct = Math.round((user.targetMacros.carbs / targetMacroGrams) * 100);
  const targetFatPct = Math.round((user.targetMacros.fats / targetMacroGrams) * 100);

  // Compute weight delta
  const initialWeight = weightHistory[0]?.weight || 80;
  const currentWeight = user.weight;
  const weightDelta = (currentWeight - initialWeight).toFixed(1);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title */}
      <div>
        <span className="hud-font" style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>ANALYTICAL METRICS ENGINE</span>
        <h2 style={{ fontSize: '28px', color: 'var(--text-primary)', marginTop: '4px' }}>Nutrition & Biometric <span className="glow-text">Analytics</span></h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          Evaluate historical calorie intake patterns, body weight fluctuations, and macronutrient balance indices.
        </p>
      </div>

      {/* Historical charts container */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="scanner-layout">
        
        {/* Calorie Intake Chart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <span className="hud-font" style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '16px' }}>
            WEEKLY CALORIE INGESTION HISTOGRAM
          </span>
          <InteractiveChart 
            type="line" 
            data={calorieHistory} 
            xKey="date" 
            yKey="calories" 
            targetValue={user.targetCalories}
            color="var(--primary)"
            glowColor="var(--primary-glow)"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span>Target: {user.targetCalories} kcal</span>
            <span>Avg Intake: {Math.round(calorieHistory.reduce((s,d) => s + d.calories, 0) / calorieHistory.length)} kcal</span>
          </div>
        </div>

        {/* Weight Tracking Chart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <span className="hud-font" style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '16px' }}>
            BODY WEIGHT TRACKING TIMELINE (kg)
          </span>
          <InteractiveChart 
            type="line" 
            data={weightHistory} 
            xKey="date" 
            yKey="weight" 
            targetValue={77.0} // Target weight
            color="var(--accent)"
            glowColor="var(--accent-glow)"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span>Start: {initialWeight} kg</span>
            <span>Current: {currentWeight} kg ({weightDelta >= 0 ? `+${weightDelta}` : weightDelta} kg)</span>
          </div>
        </div>
      </div>

      {/* Macro Split Analysis and Achievements Cabinet */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="scanner-layout">
        
        {/* Macro split comparisons */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <span className="hud-font" style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '16px' }}>
            MACRONUTRIENT BALANCE INDEX COMPARISON
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center', height: '80%' }}>
            {/* Consumed breakdown */}
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: 600 }}>
                Logged Today:
              </div>
              <div style={{ display: 'flex', height: '24px', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${protPct}%`, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white', fontWeight: 'bold' }} title={`Protein: ${protPct}%`}>
                  {protPct > 10 ? `P: ${protPct}%` : ''}
                </div>
                <div style={{ width: `${carbPct}%`, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white', fontWeight: 'bold' }} title={`Carbs: ${carbPct}%`}>
                  {carbPct > 10 ? `C: ${carbPct}%` : ''}
                </div>
                <div style={{ width: `${fatPct}%`, background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white', fontWeight: 'bold' }} title={`Fats: ${fatPct}%`}>
                  {fatPct > 10 ? `F: ${fatPct}%` : ''}
                </div>
              </div>
            </div>

            {/* Target splits */}
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: 600 }}>
                System Target Splits:
              </div>
              <div style={{ display: 'flex', height: '24px', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${targetProtPct}%`, background: 'var(--primary)', opacity: 0.7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white', fontWeight: 'bold' }}>
                  P: {targetProtPct}%
                </div>
                <div style={{ width: `${targetCarbPct}%`, background: 'var(--accent)', opacity: 0.7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white', fontWeight: 'bold' }}>
                  C: {targetCarbPct}%
                </div>
                <div style={{ width: `${targetFatPct}%`, background: 'var(--secondary)', opacity: 0.7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white', fontWeight: 'bold' }}>
                  F: {targetFatPct}%
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', fontSize: '11px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }} />
                <span>Protein (4 kcal/g)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', background: 'var(--accent)', borderRadius: '50%' }} />
                <span>Carbohydrates (4 kcal/g)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', background: 'var(--secondary)', borderRadius: '50%' }} />
                <span>Fats/Lipids (9 kcal/g)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trophies cabinet */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <span className="hud-font" style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '16px' }}>
            EARNED BADGES & TROPHY CABINET
          </span>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
            {achievements.map(ach => (
              <div key={ach.id} className="glass-panel" style={{ 
                padding: '12px', 
                textAlign: 'center',
                background: ach.unlocked ? 'rgba(168, 85, 247, 0.03)' : 'rgba(0,0,0,0.2)',
                border: ach.unlocked ? '1.5px solid var(--primary)' : '1px solid var(--card-border)',
                boxShadow: ach.unlocked ? '0 0 10px var(--primary-glow)' : 'none',
                opacity: ach.unlocked ? 1 : 0.55
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: ach.unlocked ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginInline: 'auto',
                  marginBottom: '8px',
                  color: ach.unlocked ? 'white' : 'var(--text-muted)'
                }}>
                  <Award size={20} />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {ach.title}
                </div>
                <div style={{ fontSize: '9px', color: 'var(--text-secondary)', marginTop: '2px', height: '24px', overflow: 'hidden' }}>
                  {ach.description}
                </div>
                {ach.unlocked && (
                  <div style={{ color: 'var(--accent)', fontSize: '8px', marginTop: '6px', fontWeight: 'bold' }} className="hud-font">
                    UNLOCKED
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
