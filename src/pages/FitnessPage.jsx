import React, { useContext, useState } from 'react';
import { Dumbbell, Flame, Compass, Scale, Plus, Play, Calendar, Trash2 } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function FitnessPage() {
  const { user, workouts, addWorkout, logSteps, logWeight, stepLogs } = useContext(AppContext);

  // States
  const [workoutType, setWorkoutType] = useState('Strength Training');
  const [duration, setDuration] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [stepInput, setStepInput] = useState('');
  const [weightInput, setWeightInput] = useState('');

  // Submit workout
  const handleWorkoutSubmit = (e) => {
    e.preventDefault();
    if (!duration) return;

    // MET estimation values per minute
    let metBurnRate = 6; // Strength training
    if (workoutType === 'Running') metBurnRate = 11;
    if (workoutType === 'HIIT Cardio') metBurnRate = 12;
    if (workoutType === 'Outdoor Cycling') metBurnRate = 9;
    if (workoutType === 'Yoga / Stretch') metBurnRate = 3.5;

    const estimatedBurn = Math.round(Number(duration) * metBurnRate);
    const finalBurn = customCalories ? Number(customCalories) : estimatedBurn;

    addWorkout({
      type: workoutType,
      duration: Number(duration),
      caloriesBurned: finalBurn
    });

    setDuration('');
    setCustomCalories('');
  };

  // Submit steps
  const handleStepSubmit = (e) => {
    e.preventDefault();
    if (!stepInput) return;
    logSteps(Number(stepInput));
    setStepInput('');
  };

  // Submit weight
  const handleWeightSubmit = (e) => {
    e.preventDefault();
    if (!weightInput) return;
    logWeight(Number(weightInput));
    setWeightInput('');
  };

  // Steps calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySteps = stepLogs.find(s => s.date === todayStr)?.steps || 0;
  const stepsPct = Math.min(100, Math.round((todaySteps / user.targetSteps) * 100));

  // Compute total calories burned today
  const todayWorkouts = workouts.filter(w => w.date === todayStr);
  const totalBurnedToday = todayWorkouts.reduce((s, w) => s + w.caloriesBurned, 0);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title */}
      <div>
        <span className="hud-font" style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>CARDIOVASCULAR & HYPERTROPHY INDEX</span>
        <h2 style={{ fontSize: '28px', color: 'var(--text-primary)', marginTop: '4px' }}>Fitness Progress <span className="glow-text">Tracker</span></h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          Monitor daily step goals, register structural workouts, and update core body composition weight metrics.
        </p>
      </div>

      {/* Steps, Burned, and Weight Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Steps widget */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span className="hud-font" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>PEDOMETER TARGET INDEX</span>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
            <div style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="90" height="90" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="45" cy="45" r="38" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                <circle 
                  cx="45" 
                  cy="45" 
                  r="38" 
                  fill="transparent" 
                  stroke="var(--accent)" 
                  strokeWidth="6" 
                  strokeDasharray={238.76}
                  strokeDashoffset={238.76 - (stepsPct / 100) * 238.76}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.6s ease', filter: 'drop-shadow(0 0 5px var(--accent-glow))' }}
                />
              </svg>
              <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', fontWeight: 'bold' }}>
                <span className="hud-font glow-text-cyan">{stepsPct}%</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{todaySteps.toLocaleString()}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>of {user.targetSteps.toLocaleString()} Steps</div>
            </div>
          </div>

          <form onSubmit={handleStepSubmit} style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="number" 
              placeholder="e.g. 1500" 
              value={stepInput}
              onChange={(e) => setStepInput(e.target.value)}
              style={{ flex: 1, padding: '6px 12px', fontSize: '13px' }}
            />
            <button type="submit" className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}>
              Add Steps
            </button>
          </form>
        </div>

        {/* Burned Widget */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span className="hud-font" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>ACTIVE CALORIES BURNED</span>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(236, 72, 153, 0.1)',
              border: '1px solid var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 10px var(--secondary-glow)'
            }} className="animate-pulse">
              <Flame size={28} style={{ color: 'var(--secondary)' }} />
            </div>

            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{totalBurnedToday} kcal</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Estimated Energy Burnt Today</div>
            </div>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
            {todayWorkouts.length} exercises logged today.
          </div>
        </div>

        {/* Weight update widget */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span className="hud-font" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>METRIC WEIGHT LOG</span>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 10px var(--primary-glow)'
            }}>
              <Scale size={28} style={{ color: 'var(--primary)' }} />
            </div>

            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{user.weight} kg</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Current logged body mass</div>
            </div>
          </div>

          <form onSubmit={handleWeightSubmit} style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="number" 
              step="0.1"
              placeholder="e.g. 78.1" 
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              style={{ flex: 1, padding: '6px 12px', fontSize: '13px' }}
            />
            <button type="submit" className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}>
              Log Weight
            </button>
          </form>
        </div>
      </div>

      {/* Workout Logger & Workout timeline list */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }} className="scanner-layout">
        
        {/* Workout Logger Form */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <span className="hud-font" style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '16px' }}>
            LOG EXERCISE SESSION
          </span>

          <form onSubmit={handleWorkoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }} className="hud-font">Training Protocol</label>
                <select value={workoutType} onChange={(e) => setWorkoutType(e.target.value)}>
                  <option value="Strength Training">Strength Training</option>
                  <option value="Running">Running (Outdoor)</option>
                  <option value="HIIT Cardio">HIIT Cardio</option>
                  <option value="Outdoor Cycling">Outdoor Cycling</option>
                  <option value="Yoga / Stretch">Yoga / Stretch</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }} className="hud-font">Duration (Minutes)</label>
                <input type="number" placeholder="45" value={duration} onChange={(e) => setDuration(e.target.value)} required />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }} className="hud-font">Custom Calorie Burn (Optional, leaves empty for automated estimate)</label>
              <input type="number" placeholder="e.g. 400" value={customCalories} onChange={(e) => setCustomCalories(e.target.value)} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Play size={14} /> Register Exercise Log
            </button>
          </form>
        </div>

        {/* Workout Log Timeline */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <span className="hud-font" style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '16px' }}>
            CHRONOLOGICAL WORKOUT REGISTER
          </span>

          {workouts.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '12px', border: '1px dashed var(--card-border)', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
              No exercise logged yet. Log workout above to begin calculation.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto', paddingRight: '4px' }}>
              {workouts.map(work => (
                <div key={work.id} className="glass-panel" style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>{work.type}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {work.duration} mins • {work.time} • {work.date}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--secondary)', fontSize: '14px' }}>-{work.caloriesBurned} kcal</div>
                    <div style={{ fontSize: '8px', color: 'var(--text-muted)' }} className="hud-font">BURNT</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
