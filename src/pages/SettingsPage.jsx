import React, { useContext, useState } from 'react';
import { Settings, User, Eye, Sliders, CheckCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function SettingsPage() {
  const { user, updateSettings, theme, setTheme } = useContext(AppContext);

  // States
  const [username, setUsername] = useState(user.username);
  const [goalType, setGoalType] = useState(user.goalType);
  const [targetCalories, setTargetCalories] = useState(user.targetCalories);
  const [targetWater, setTargetWater] = useState(user.targetWater);
  const [targetSteps, setTargetSteps] = useState(user.targetSteps);
  const [protein, setProtein] = useState(user.targetMacros.protein);
  const [carbs, setCarbs] = useState(user.targetMacros.carbs);
  const [fats, setFats] = useState(user.targetMacros.fats);

  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Auto preset calorie triggers
  const handleGoalTypeChange = (e) => {
    const val = e.target.value;
    setGoalType(val);
    if (val === 'cut') {
      setTargetCalories(2000);
      setProtein(150);
      setCarbs(200);
      setFats(66);
    } else if (val === 'bulk') {
      setTargetCalories(3000);
      setProtein(180);
      setCarbs(350);
      setFats(100);
    } else if (val === 'maintain') {
      setTargetCalories(2500);
      setProtein(160);
      setCarbs(260);
      setFats(88);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verify macro calorie balance
    const calcCal = (Number(protein) * 4) + (Number(carbs) * 4) + (Number(fats) * 9);
    
    updateSettings({
      username,
      goalType,
      targetCalories: Number(targetCalories),
      targetWater: Number(targetWater),
      targetSteps: Number(targetSteps),
      protein: Number(protein),
      carbs: Number(carbs),
      fats: Number(fats)
    });

    setFeedbackMsg(`Nexus node configurations synchronized. (Calculated macro total: ${calcCal} kcal)`);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title */}
      <div>
        <span className="hud-font" style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>SYSTEM SETTINGS PROTOCOL</span>
        <h2 style={{ fontSize: '28px', color: 'var(--text-primary)', marginTop: '4px' }}>Goal & Profile <span className="glow-text">Settings</span></h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          Calibrate neural targets for caloric intake thresholds, step values, hydration capacity, and macro ratios.
        </p>
      </div>

      {feedbackMsg && (
        <div style={{ display: 'flex', gap: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.4)', color: 'white', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', alignItems: 'center' }}>
          <CheckCircle size={16} style={{ color: '#10b981' }} />
          <span>{feedbackMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }} className="scanner-layout">
        
        {/* Left Side: Targets Form */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <span className="hud-font" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>CALIBRATE HEALTH METRIC CAPACITIES</span>

          {/* User Username */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }} className="hud-font">Operator Alias</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="scanner-layout">
            {/* Goal Type preset */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }} className="hud-font">Goal Target Mode</label>
              <select value={goalType} onChange={handleGoalTypeChange}>
                <option value="cut">Fat Cut Preservation (Hyper-efficiency)</option>
                <option value="bulk">Lean Bulk Hypertrophy (Anabolism)</option>
                <option value="maintain">Homoeostatic Maintenance</option>
                <option value="custom">Custom Parameters split</option>
              </select>
            </div>

            {/* Target Calorie */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }} className="hud-font">Target Calories (kcal)</label>
              <input type="number" value={targetCalories} onChange={(e) => setTargetCalories(e.target.value)} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="scanner-layout">
            {/* Target Water */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }} className="hud-font">Target Hydration Flow (ml)</label>
              <input type="number" value={targetWater} onChange={(e) => setTargetWater(e.target.value)} required />
            </div>

            {/* Target Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }} className="hud-font">Step Pedometer Limit (Steps)</label>
              <input type="number" value={targetSteps} onChange={(e) => setTargetSteps(e.target.value)} required />
            </div>
          </div>

          {/* Save Button */}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
            Synchronize Parameters
          </button>
        </div>

        {/* Right Side: Macro Ratio Splits calibration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span className="hud-font" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>CALIBRATE MACRONUTRIENT GRAMS</span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Protein grams */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', color: 'var(--primary)' }} className="hud-font">Protein Target (grams)</label>
                <input type="number" value={protein} onChange={(e) => setProtein(e.target.value)} required />
              </div>

              {/* Carbs grams */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', color: 'var(--accent)' }} className="hud-font">Carbohydrates Target (grams)</label>
                <input type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} required />
              </div>

              {/* Fats grams */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', color: 'var(--secondary)' }} className="hud-font">Lipids (Fats) Target (grams)</label>
                <input type="number" value={fats} onChange={(e) => setFats(e.target.value)} required />
              </div>
            </div>

            <div style={{ height: '1px', background: 'var(--card-border)', margin: '4px 0' }}></div>
            
            {/* Visual calorie distribution helper */}
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Estimated caloric sum of macros: <br />
              <strong style={{ color: 'var(--text-primary)', fontSize: '12px' }}>
                {(protein * 4) + (carbs * 4) + (fats * 9)} kcal
              </strong> <br />
              Make sure this value corresponds roughly to your Daily Target Calories.
            </div>
          </div>

          {/* Theme customizer shortcut */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <span className="hud-font" style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '12px' }}>
              VISUAL DECK CHROMATIC INTERFACE
            </span>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ flex: 1, border: theme === 'midnight' ? '1.5px solid var(--primary)' : '1px solid var(--card-border)', fontSize: '12px', padding: '8px' }}
                onClick={() => setTheme('midnight')}
              >
                Midnight Void
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ flex: 1, border: theme === 'emerald' ? '1.5px solid var(--primary)' : '1px solid var(--card-border)', fontSize: '12px', padding: '8px' }}
                onClick={() => setTheme('emerald')}
              >
                Emerald Synth
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ flex: 1, border: theme === 'cyberpunk' ? '1.5px solid var(--primary)' : '1px solid var(--card-border)', fontSize: '12px', padding: '8px' }}
                onClick={() => setTheme('cyberpunk')}
              >
                Cyber Amber
              </button>
            </div>
          </div>
        </div>

      </form>

    </div>
  );
}
