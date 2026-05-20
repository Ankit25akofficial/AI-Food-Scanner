import React, { useContext, useState, useEffect } from 'react';
import {
  User, Target, Droplet, Footprints, Flame, Zap,
  CheckCircle, Save, RotateCcw, ChevronRight, Cpu, Dumbbell, Scale
} from 'lucide-react';
import { AppContext } from '../context/AppContext';

const GOAL_PRESETS = [
  {
    id: 'cut',
    icon: Flame,
    label: 'Fat Cut',
    sub: 'Hyper-efficiency',
    color: '#ef4444',
    glow: 'rgba(239,68,68,0.3)',
    cal: 2000, protein: 150, carbs: 200, fats: 66,
    desc: 'Caloric deficit with high protein to preserve lean mass.'
  },
  {
    id: 'bulk',
    icon: Dumbbell,
    label: 'Lean Bulk',
    sub: 'Hypertrophy mode',
    color: 'var(--secondary)',
    glow: 'var(--secondary-glow)',
    cal: 3000, protein: 180, carbs: 350, fats: 100,
    desc: 'Caloric surplus to maximise muscle protein synthesis.'
  },
  {
    id: 'maintain',
    icon: Scale,
    label: 'Maintain',
    sub: 'Homeostasis',
    color: 'var(--accent)',
    glow: 'var(--accent-glow)',
    cal: 2500, protein: 160, carbs: 260, fats: 88,
    desc: 'Balanced nutrition to hold current body composition.'
  },
  {
    id: 'custom',
    icon: Cpu,
    label: 'Custom',
    sub: 'Manual config',
    color: 'var(--primary)',
    glow: 'var(--primary-glow)',
    cal: null, protein: null, carbs: null, fats: null,
    desc: 'Manually define every caloric and macro threshold.'
  },
];

const THEMES = [
  { id: 'midnight', label: 'Midnight Void', color: '#8b5cf6', glow: 'rgba(139,92,246,0.4)', dot: '#8b5cf6' },
  { id: 'emerald',  label: 'Emerald Synth', color: '#10b981', glow: 'rgba(16,185,129,0.4)',  dot: '#10b981' },
  { id: 'cyberpunk',label: 'Cyber Amber',   color: '#eab308', glow: 'rgba(234,179,8,0.4)',   dot: '#eab308' },
];

/* Live Macro Donut */
function MacroDonut({ protein, carbs, fats }) {
  const p = Number(protein) || 0;
  const c = Number(carbs) || 0;
  const f = Number(fats) || 0;
  const calP = p * 4, calC = c * 4, calF = f * 9;
  const total = calP + calC + calF || 1;
  const r = 52, cx = 64, cy = 64;
  const circ = 2 * Math.PI * r;

  const segments = [
    { pct: calP / total, color: 'var(--primary)', label: 'Protein', cal: calP },
    { pct: calC / total, color: 'var(--accent)',   label: 'Carbs',   cal: calC },
    { pct: calF / total, color: 'var(--secondary)',label: 'Fats',    cal: calF },
  ];

  let offset = 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '4px 0' }}>
      <svg width="128" height="128" style={{ flexShrink: 0 }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
        {segments.map(({ pct, color }, i) => {
          const dash = pct * circ;
          const el = (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={color} strokeWidth="14" strokeLinecap="butt"
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset * circ + circ * 0.25}
              style={{ transition: 'stroke-dasharray 0.8s ease' }}
            />
          );
          offset += pct;
          return el;
        })}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--text-primary)" fontSize="14" fontWeight="800">{calP + calC + calF}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontFamily="monospace">kcal</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {segments.map(({ color, label, cal, pct }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: color, boxShadow: `0 0 5px ${color}` }} />
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', minWidth: '50px' }}>{label}</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>{cal} kcal</span>
            <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>({Math.round(pct * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Styled input with glow focus */
function GlowInput({ label, labelColor = 'var(--text-secondary)', icon: Icon, iconColor, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label style={{ fontSize: '10px', color: labelColor, fontFamily: 'var(--font-hud)', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '5px' }}>
        {Icon && <Icon size={10} style={{ color: iconColor || labelColor }} />}
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          {...props}
          onFocus={e => { setFocused(true); props.onFocus?.(e); }}
          onBlur={e => { setFocused(false); props.onBlur?.(e); }}
          style={{
            width: '100%', padding: '10px 14px',
            background: focused ? 'rgba(168,85,247,0.08)' : 'rgba(0,0,0,0.3)',
            border: focused ? '1px solid rgba(168,85,247,0.5)' : '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px', color: 'var(--text-primary)', fontSize: '14px',
            outline: 'none', transition: 'all 0.2s',
            boxShadow: focused ? '0 0 16px rgba(168,85,247,0.2)' : 'none',
            fontFamily: 'inherit',
            ...(props.style || {})
          }}
        />
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { user, updateSettings, theme, setTheme } = useContext(AppContext);

  const [username,       setUsername]       = useState(user.username);
  const [goalType,       setGoalType]       = useState(user.goalType);
  const [targetCalories, setTargetCalories] = useState(user.targetCalories);
  const [targetWater,    setTargetWater]    = useState(user.targetWater);
  const [targetSteps,    setTargetSteps]    = useState(user.targetSteps);
  const [protein,        setProtein]        = useState(user.targetMacros.protein);
  const [carbs,          setCarbs]          = useState(user.targetMacros.carbs);
  const [fats,           setFats]           = useState(user.targetMacros.fats);
  const [saved,          setSaved]          = useState(false);
  const [mounted,        setMounted]        = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  const applyPreset = (preset) => {
    setGoalType(preset.id);
    if (preset.cal) {
      setTargetCalories(preset.cal);
      setProtein(preset.protein);
      setCarbs(preset.carbs);
      setFats(preset.fats);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings({
      username, goalType,
      targetCalories: Number(targetCalories),
      targetWater: Number(targetWater),
      targetSteps: Number(targetSteps),
      protein: Number(protein), carbs: Number(carbs), fats: Number(fats)
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const calcKcal = (Number(protein) * 4) + (Number(carbs) * 4) + (Number(fats) * 9);
  const diff = calcKcal - Number(targetCalories);
  const diffOk = Math.abs(diff) < 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(12px)', transition: 'all 0.5s ease' }}>

      <style>{`
        @keyframes saveFlash { 0%{transform:scale(1)} 50%{transform:scale(1.04)} 100%{transform:scale(1)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .settings-card { animation: slideUp 0.45s ease both; }
        select { background: rgba(0,0,0,0.35) !important; border: 1px solid rgba(255,255,255,0.08) !important; border-radius: 10px !important; color: var(--text-primary) !important; padding: 10px 14px !important; font-size:14px !important; outline:none; transition: all 0.2s; width:100%; }
        select:focus { border-color: rgba(168,85,247,0.5) !important; box-shadow: 0 0 16px rgba(168,85,247,0.2) !important; }
        select option { background: #1a1625; color: var(--text-primary); }
      `}</style>

      {/* ── Header ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 8px var(--primary-glow)' }} />
          <span className="hud-font" style={{ fontSize: '10px', color: 'var(--primary)', letterSpacing: '2px' }}>SYSTEM SETTINGS PROTOCOL</span>
        </div>
        <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>
          Goal &amp; Profile&nbsp;<span style={{ background: 'linear-gradient(90deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Settings</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
          Calibrate neural targets for caloric intake, step limits, hydration capacity, and macro splits.
        </p>
      </div>

      {/* ── Save Banner ── */}
      {saved && (
        <div style={{
          display: 'flex', gap: '10px', alignItems: 'center',
          background: 'linear-gradient(90deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))',
          border: '1px solid rgba(16,185,129,0.35)', borderRadius: '12px',
          padding: '12px 18px', fontSize: '13px', color: '#34d399',
          animation: 'saveFlash 0.3s ease, slideUp 0.3s ease'
        }}>
          <CheckCircle size={16} style={{ flexShrink: 0 }} />
          <div>
            <strong>Configuration synchronized!</strong>
            <span style={{ color: 'var(--text-secondary)', marginLeft: '8px' }}>Macro total: {calcKcal} kcal</span>
          </div>
        </div>
      )}

      {/* ── Goal Preset Cards ── */}
      <div className="settings-card" style={{ animationDelay: '0.05s' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-hud)', letterSpacing: '1.5px', marginBottom: '10px' }}>SELECT GOAL PRESET</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
          {GOAL_PRESETS.map((p, i) => {
            const Icon = p.icon;
            const active = goalType === p.id;
            return (
              <button key={p.id} type="button" onClick={() => applyPreset(p)} style={{
                padding: '14px 12px', borderRadius: '12px', cursor: 'pointer', textAlign: 'left',
                background: active ? `linear-gradient(135deg, ${p.color}18, ${p.color}08)` : 'rgba(0,0,0,0.2)',
                border: active ? `1.5px solid ${p.color}55` : '1.5px solid rgba(255,255,255,0.05)',
                boxShadow: active ? `0 0 20px ${p.glow}` : 'none',
                transition: 'all 0.25s ease',
                animationDelay: `${0.08 + i * 0.06}s`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? `${p.color}25` : 'rgba(255,255,255,0.05)', boxShadow: active ? `0 0 10px ${p.glow}` : 'none', flexShrink: 0 }}>
                    <Icon size={14} style={{ color: active ? p.color : 'var(--text-muted)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: active ? p.color : 'var(--text-primary)' }}>{p.label}</div>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-hud)' }}>{p.sub}</div>
                  </div>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{p.desc}</div>
                {active && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', color: p.color, fontSize: '9px', fontFamily: 'var(--font-hud)' }}>
                    <CheckCircle size={10} /> SELECTED
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* ── Two Column Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '16px' }} className="scanner-layout">

          {/* Left — Profile + Targets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Profile card */}
            <div className="glass-panel settings-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', animationDelay: '0.15s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <User size={13} style={{ color: 'var(--primary)' }} />
                <span className="hud-font" style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '1.5px' }}>OPERATOR PROFILE</span>
              </div>
              <GlowInput label="USERNAME / ALIAS" icon={User} value={username} onChange={e => setUsername(e.target.value)} type="text" required />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-hud)', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Target size={10} style={{ color: 'var(--secondary)' }} /> GOAL MODE
                </label>
                <select value={goalType} onChange={e => { setGoalType(e.target.value); }}>
                  <option value="cut">⚡ Fat Cut Preservation</option>
                  <option value="bulk">💪 Lean Bulk Hypertrophy</option>
                  <option value="maintain">⚖️ Homeostatic Maintenance</option>
                  <option value="custom">🎛️ Custom Parameters</option>
                </select>
              </div>
            </div>

            {/* Targets card */}
            <div className="glass-panel settings-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', animationDelay: '0.22s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <Zap size={13} style={{ color: 'var(--accent)' }} />
                <span className="hud-font" style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '1.5px' }}>DAILY TARGETS</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <GlowInput label="CALORIES (kcal)" icon={Flame} iconColor="var(--primary)" value={targetCalories} onChange={e => setTargetCalories(e.target.value)} type="number" required />
                <GlowInput label="HYDRATION (ml)"  icon={Droplet} iconColor="#22d3ee"       value={targetWater}    onChange={e => setTargetWater(e.target.value)}    type="number" required />
                <GlowInput label="DAILY STEPS"     icon={Footprints} iconColor="var(--secondary)" value={targetSteps} onChange={e => setTargetSteps(e.target.value)} type="number" required style={{ gridColumn: '1 / -1' }} />
              </div>
            </div>
          </div>

          {/* Right — Macros + Donut */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="glass-panel settings-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', animationDelay: '0.28s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <Cpu size={13} style={{ color: 'var(--secondary)' }} />
                <span className="hud-font" style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '1.5px' }}>MACRONUTRIENT CALIBRATION</span>
              </div>

              <GlowInput label="PROTEIN (g)" labelColor="var(--primary)" icon={Flame} iconColor="var(--primary)"
                value={protein} onChange={e => setProtein(e.target.value)} type="number" required />
              <GlowInput label="CARBOHYDRATES (g)" labelColor="var(--accent)" icon={Zap} iconColor="var(--accent)"
                value={carbs} onChange={e => setCarbs(e.target.value)} type="number" required />
              <GlowInput label="LIPIDS / FATS (g)" labelColor="var(--secondary)" icon={Droplet} iconColor="var(--secondary)"
                value={fats} onChange={e => setFats(e.target.value)} type="number" required />

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
                <MacroDonut protein={protein} carbs={carbs} fats={fats} />
              </div>

              {/* Balance indicator */}
              <div style={{
                padding: '10px 14px', borderRadius: '8px',
                background: diffOk ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${diffOk ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
                fontSize: '11px', display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                {diffOk
                  ? <CheckCircle size={13} style={{ color: '#34d399', flexShrink: 0 }} />
                  : <Zap size={13} style={{ color: '#f87171', flexShrink: 0 }} />}
                <span style={{ color: diffOk ? '#34d399' : '#f87171' }}>
                  {diffOk
                    ? `Macro total (${calcKcal} kcal) matches target ✓`
                    : `Off by ${Math.abs(diff)} kcal — adjust macros or calorie target`}
                </span>
              </div>
            </div>

            {/* Theme Switcher */}
            <div className="glass-panel settings-card" style={{ padding: '18px', animationDelay: '0.34s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span className="hud-font" style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '1.5px' }}>VISUAL THEME</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {THEMES.map(t => (
                  <button key={t.id} type="button" onClick={() => setTheme(t.id)} style={{
                    flex: 1, padding: '10px 8px', borderRadius: '10px', cursor: 'pointer',
                    background: theme === t.id ? `linear-gradient(135deg, ${t.color}22, ${t.color}10)` : 'rgba(0,0,0,0.2)',
                    border: theme === t.id ? `1.5px solid ${t.color}66` : '1.5px solid rgba(255,255,255,0.06)',
                    boxShadow: theme === t.id ? `0 0 16px ${t.glow}` : 'none',
                    transition: 'all 0.25s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px'
                  }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: t.color, boxShadow: theme === t.id ? `0 0 10px ${t.glow}` : 'none', transition: 'all 0.25s' }} />
                    <span style={{ fontSize: '9px', fontFamily: 'var(--font-hud)', color: theme === t.id ? t.color : 'var(--text-muted)', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{t.label}</span>
                    {theme === t.id && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: t.color, boxShadow: `0 0 6px ${t.color}` }} />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Save Button ── */}
        <button type="submit" style={{
          width: '100%', padding: '14px', borderRadius: '12px', cursor: 'pointer',
          background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
          border: 'none', color: 'white', fontWeight: 800, fontSize: '14px',
          fontFamily: 'var(--font-hud)', letterSpacing: '2px',
          boxShadow: '0 0 24px var(--primary-glow)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          transition: 'all 0.2s', animation: saved ? 'saveFlash 0.3s ease' : 'none'
        }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 36px var(--primary-glow)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 24px var(--primary-glow)'; e.currentTarget.style.transform = 'none'; }}
        >
          {saved ? <><CheckCircle size={16} /> SYNCHRONIZED</> : <><Save size={16} /> SYNCHRONIZE PARAMETERS</>}
        </button>
      </form>
    </div>
  );
}
