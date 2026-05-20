import React, { useContext, useState, useEffect } from 'react';
import { 
  Dumbbell, Flame, Compass, Scale, Plus, Play, 
  Calendar, Trash2, Footprints, Zap, Heart, TrendingUp, 
  Sparkles, CheckCircle2, Activity 
} from 'lucide-react';
import { AppContext } from '../context/AppContext';

// MET estimation values per minute
const WORKOUT_TYPES = [
  { id: 'Strength Training', label: 'Hypertrophy Core', desc: 'Resistance & mechanical tension', met: 6, icon: Dumbbell, color: '#a855f7', glow: 'var(--primary-glow)' },
  { id: 'Running', label: 'V2 Max Running', desc: 'Cardiovascular high pacing', met: 11, icon: Heart, color: '#ec4899', glow: 'var(--secondary-glow)' },
  { id: 'HIIT Cardio', label: 'HIIT Metabolism', desc: 'Anaerobic interval spikes', met: 12, icon: Zap, color: '#f59e0b', glow: 'var(--accent-glow)' },
  { id: 'Outdoor Cycling', label: 'Endurance Cycle', desc: 'Aero capacity conditioning', met: 9, icon: Activity, color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.3)' },
  { id: 'Yoga / Stretch', label: 'Flex Recovery', desc: 'Myofascial restore & breathing', met: 3.5, icon: Sparkles, color: '#10b981', glow: 'rgba(16, 185, 129, 0.3)' }
];

/* ── Animated count-up hook ── */
function useCountUp(target, duration = 800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) { setVal(0); return; }
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const pct = Math.min((ts - start) / duration, 1);
      setVal(Math.round(pct * target));
      if (pct < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return val;
}

export default function FitnessPage() {
  const { user, workouts, addWorkout, logSteps, logWeight, stepLogs, meals } = useContext(AppContext);

  // States
  const [workoutType, setWorkoutType] = useState('Strength Training');
  const [duration, setDuration] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [stepInput, setStepInput] = useState('');
  const [weightInput, setWeightInput] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Submit workout
  const handleWorkoutSubmit = (e) => {
    e.preventDefault();
    if (!duration) return;

    const matched = WORKOUT_TYPES.find(w => w.id === workoutType);
    const metBurnRate = matched ? matched.met : 6;
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

  // Compute total calories consumed today to show dynamic net balance
  const todayMeals = meals.filter(m => m.date === todayStr);
  const totalConsumedToday = todayMeals.reduce((s, m) => s + m.calories, 0);
  const netCalories = totalConsumedToday - totalBurnedToday;

  // Staggered transitions
  const animSteps = useCountUp(todaySteps);
  const animBurned = useCountUp(totalBurnedToday);
  const animWeight = useCountUp(user.weight * 10) / 10;
  const animConsumed = useCountUp(totalConsumedToday);

  // Filtered workouts
  const filteredWorkouts = workouts.filter(w => {
    if (activeTab === 'all') return true;
    return w.type.toLowerCase().includes(activeTab.toLowerCase());
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="hud-font" style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600, letterSpacing: '1.5px' }}>CARDIOVASCULAR & HYPERTROPHY INDEX</span>
          <h2 style={{ fontSize: '28px', color: 'var(--text-primary)', marginTop: '4px' }}>Fitness Progress <span className="glow-text">Tracker</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Monitor daily pedometer milestones, register custom exercise training protocols, and log structural weight updates.
          </p>
        </div>

        {/* HUD NET BALANCE TILE */}
        <div className="glass-panel" style={{ padding: '12px 20px', display: 'flex', gap: '16px', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--card-border)' }}>
          <div style={{ textAlign: 'right' }}>
            <span className="hud-font" style={{ fontSize: '9px', color: 'var(--text-secondary)', letterSpacing: '1px' }}>METABOLIC NET STATE</span>
            <div style={{ fontSize: '18px', fontWeight: 800, color: netCalories > user.targetCalories ? '#ef4444' : 'var(--primary)', fontFamily: 'var(--font-hud)', marginTop: '2px' }}>
              {netCalories > 0 ? `+${netCalories}` : netCalories} <span style={{ fontSize: '11px', fontWeight: 'normal', color: 'var(--text-muted)' }}>kcal</span>
            </div>
          </div>
          <div style={{ height: '30px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
            <div>In: <strong style={{ color: 'var(--accent)' }}>{animConsumed} kcal</strong></div>
            <div>Out: <strong style={{ color: 'var(--secondary)' }}>{animBurned} kcal</strong></div>
          </div>
        </div>
      </div>

      {/* Steps, Burned, and Weight Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Steps Pedometer Widget */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden', animation: 'fadeSlideUp 0.4s ease both' }}>
          <div style={{ position: 'absolute', top: '-15px', right: '-15px', width: '60px', height: '60px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.12), transparent 70%)', pointerEvents: 'none' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="hud-font" style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '1px' }}>PEDOMETER TARGET INDEX</span>
            <span style={{ fontSize: '9px', padding: '2px 8px', borderRadius: '99px', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', color: 'var(--accent)', fontFamily: 'var(--font-hud)' }}>
              {stepsPct}% TARGET
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
            <div style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
                  style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)', filter: 'drop-shadow(0 0 6px rgba(6,182,212,0.5))' }}
                />
              </svg>
              <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Footprints size={20} style={{ color: 'var(--accent)', filter: 'drop-shadow(0 0 4px rgba(6,182,212,0.3))' }} />
              </div>
            </div>

            <div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-hud)', letterSpacing: '0.5px' }}>
                {animSteps.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                of <strong style={{ color: 'var(--text-primary)' }}>{user.targetSteps.toLocaleString()}</strong> Daily Steps
              </div>
            </div>
          </div>

          <form onSubmit={handleStepSubmit} style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="number" 
              placeholder="Add step increment..." 
              value={stepInput}
              onChange={(e) => setStepInput(e.target.value)}
              style={{ flex: 1, padding: '8px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.3)', color: 'var(--text-primary)' }}
            />
            <button type="submit" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              Add Steps
            </button>
          </form>
        </div>

        {/* Burned Energy Widget */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden', animation: 'fadeSlideUp 0.4s ease 0.1s both' }}>
          <div style={{ position: 'absolute', top: '-15px', right: '-15px', width: '60px', height: '60px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.12), transparent 70%)', pointerEvents: 'none' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="hud-font" style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '1px' }}>ACTIVE CALORIES BURNED</span>
            <span style={{ fontSize: '9px', padding: '2px 8px', borderRadius: '99px', background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.3)', color: 'var(--secondary)', fontFamily: 'var(--font-hud)' }}>
              ENERGY EXPENDITURE
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '12px',
              background: 'rgba(236, 72, 153, 0.1)',
              border: '1px solid var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px var(--secondary-glow)',
              flexShrink: 0
            }}>
              <Flame size={26} style={{ color: 'var(--secondary)' }} className="animate-pulse" />
            </div>

            <div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-hud)', letterSpacing: '0.5px' }}>
                {animBurned} <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>kcal</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Burnt across <strong style={{ color: 'var(--text-primary)' }}>{todayWorkouts.length}</strong> logged protocols
              </div>
            </div>
          </div>

          <div style={{ 
            fontSize: '11px', 
            color: 'var(--text-secondary)', 
            background: 'rgba(255,255,255,0.02)', 
            border: '1px solid rgba(255,255,255,0.05)',
            padding: '10px', 
            borderRadius: '8px', 
            textAlign: 'center',
            fontStyle: 'italic'
          }}>
            ⚡ Metabolic state active: {totalBurnedToday >= 500 ? 'Peak Conditioning' : totalBurnedToday >= 200 ? 'Active Mode' : 'Basal Rate'}
          </div>
        </div>

        {/* Metric Weight Log Widget */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden', animation: 'fadeSlideUp 0.4s ease 0.2s both' }}>
          <div style={{ position: 'absolute', top: '-15px', right: '-15px', width: '60px', height: '60px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%)', pointerEvents: 'none' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="hud-font" style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '1px' }}>METRIC WEIGHT LOG</span>
            <span style={{ fontSize: '9px', padding: '2px 8px', borderRadius: '99px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', color: 'var(--primary)', fontFamily: 'var(--font-hud)' }}>
              CORE BODY MASS
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '12px',
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px var(--primary-glow)',
              flexShrink: 0
            }}>
              <Scale size={26} style={{ color: 'var(--primary)' }} />
            </div>

            <div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-hud)', letterSpacing: '0.5px' }}>
                {animWeight} <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>kg</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Current mass index for metabolic math
              </div>
            </div>
          </div>

          <form onSubmit={handleWeightSubmit} style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="number" 
              step="0.1"
              placeholder="e.g. 78.3" 
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              style={{ flex: 1, padding: '8px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.3)', color: 'var(--text-primary)' }}
            />
            <button type="submit" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
              Log Mass
            </button>
          </form>
        </div>
      </div>

      {/* Interactive Workout selector deck & Timeline */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }} className="scanner-layout">
        
        {/* Workout Logger deck */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeSlideUp 0.5s ease 0.3s both' }}>
          <div>
            <span className="hud-font" style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', letterSpacing: '1px' }}>
              EXERCISE SESSION DECK
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
              Select a specialized training protocol below to estimate metabolic output
            </span>
          </div>

          {/* Quick Selection Deck */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
            {WORKOUT_TYPES.map(work => {
              const Icon = work.icon;
              const isSelected = workoutType === work.id;
              return (
                <div 
                  key={work.id}
                  onClick={() => setWorkoutType(work.id)}
                  style={{
                    padding: '14px 10px',
                    borderRadius: '12px',
                    background: isSelected ? `linear-gradient(135deg, ${work.color}15, ${work.color}05)` : 'rgba(0,0,0,0.15)',
                    border: isSelected ? `1.5px solid ${work.color}` : '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.background = 'rgba(0,0,0,0.15)';
                    }
                  }}
                >
                  {/* corner glow */}
                  {isSelected && <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '30px', height: '30px', borderRadius: '50%', background: work.color, opacity: 0.2, filter: 'blur(10px)' }} />}

                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: isSelected ? work.color : 'rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isSelected ? 'white' : 'var(--text-secondary)',
                    boxShadow: isSelected ? `0 0 10px ${work.glow}` : 'none',
                    transition: 'all 0.25s'
                  }}>
                    <Icon size={16} />
                  </div>

                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)', transition: 'all 0.25s' }}>
                      {work.id.split(' ')[0]}
                    </div>
                    <span style={{ fontSize: '8px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontFamily: 'var(--font-hud)', marginTop: '2px' }}>
                      MET: {work.met}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleWorkoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }} className="hud-font">Duration (Minutes)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 45" 
                  value={duration} 
                  onChange={(e) => setDuration(e.target.value)} 
                  required 
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--card-border)',
                    background: 'rgba(0,0,0,0.3)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }} className="hud-font">Custom Calories (Optional)</label>
                <input 
                  type="number" 
                  placeholder="Automated estimate..." 
                  value={customCalories} 
                  onChange={(e) => setCustomCalories(e.target.value)} 
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--card-border)',
                    background: 'rgba(0,0,0,0.3)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px', boxShadow: '0 0 15px var(--primary-glow)' }}>
              <Play size={14} fill="white" /> REGISTER EXERCISE PROTOCOL
            </button>
          </form>
        </div>

        {/* Workout timeline chronological log */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', animation: 'fadeSlideUp 0.5s ease 0.4s both' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span className="hud-font" style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '1px' }}>CHRONOLOGICAL REGISTER</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {['all', 'strength', 'cardio'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '2px 8px',
                    fontSize: '8px',
                    borderRadius: '6px',
                    background: activeTab === tab ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-hud)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {filteredWorkouts.length === 0 ? (
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'var(--text-muted)', 
              fontSize: '12px', 
              border: '1px dashed rgba(255,255,255,0.08)', 
              borderRadius: '12px', 
              padding: '24px', 
              textAlign: 'center',
              background: 'rgba(0,0,0,0.1)'
            }}>
              <Calendar size={24} style={{ marginBottom: '8px', opacity: 0.4 }} />
              <div>No workouts logged under this filter today. Record a training protocol to sync data.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '290px', overflowY: 'auto', paddingRight: '4px' }}>
              {filteredWorkouts.map((work, idx) => {
                // Pick matches to map color coding
                const typeMatch = WORKOUT_TYPES.find(w => w.id === work.type);
                const colorCode = typeMatch ? typeMatch.color : 'var(--primary)';
                const IconComponent = typeMatch ? typeMatch.icon : Dumbbell;

                return (
                  <div 
                    key={work.id} 
                    className="glass-panel" 
                    style={{ 
                      padding: '12px 14px', 
                      background: 'rgba(0,0,0,0.25)', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      borderLeft: `3px solid ${colorCode}`,
                      borderRadius: '8px',
                      transition: 'transform 0.2s',
                      animation: `fadeSlideUp 0.3s ease ${idx * 0.05}s both`
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.01)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
                  >
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: `${colorCode}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colorCode
                      }}>
                        <IconComponent size={14} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>{work.type}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2.5px' }}>
                          {work.duration} mins • {work.time} • {work.date}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: colorCode, fontSize: '13px', fontFamily: 'var(--font-hud)' }}>
                        -{work.caloriesBurned} kcal
                      </div>
                      <div style={{ fontSize: '8px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }} className="hud-font">
                        EST BURNT
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
