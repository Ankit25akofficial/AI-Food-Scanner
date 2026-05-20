import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  Flame, Droplet, Trophy, Zap, ChevronRight, Apple,
  TrendingUp, Target, Activity, Star, CheckCircle2, Lock, Cpu
} from 'lucide-react';
import { AppContext } from '../context/AppContext';
import ProgressRing from '../components/ProgressRing';

/* ── Animated counter hook ── */
function useCountUp(target, duration = 900) {
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

/* ── Animated progress bar ── */
function AnimBar({ pct, color, glow, delay = 0 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(Math.min(100, pct)), 120 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.03)' }}>
      <div style={{
        height: '100%', borderRadius: '99px',
        background: `linear-gradient(90deg, ${color}, ${color}cc)`,
        boxShadow: `0 0 10px ${glow}`,
        width: `${width}%`,
        transition: 'width 1s cubic-bezier(0.4,0,0.2,1)'
      }} />
    </div>
  );
}

/* ── Stat mini-tile ── */
function StatTile({ icon: Icon, label, value, sub, color, delay }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{
      flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '12px',
      padding: '14px 12px', textAlign: 'center',
      border: `1px solid ${color}22`,
      boxShadow: visible ? `0 0 20px ${color}18` : 'none',
      transform: visible ? 'translateY(0)' : 'translateY(12px)',
      opacity: visible ? 1 : 0,
      transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: '-12px', right: '-12px', width: '40px', height: '40px', borderRadius: '50%', background: `radial-gradient(circle, ${color}22, transparent 70%)` }} />
      <Icon size={18} style={{ color, marginBottom: '6px' }} />
      <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{value}</div>
      <div style={{ fontSize: '9px', color, fontFamily: 'var(--font-hud)', letterSpacing: '1px', marginTop: '2px' }}>{label}</div>
      {sub && <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>{sub}</div>}
    </div>
  );
}

export default function DashboardPage({ setActivePage }) {
  const { user, meals, waterIntake, logWater, achievements, challenges, toggleChallengeActive } = useContext(AppContext);
  const [mounted, setMounted] = useState(false);
  const waveRef = useRef(null);

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayMeals = meals.filter(m => m.date === todayStr);

  const totalCalories = todayMeals.reduce((s, i) => s + i.calories, 0);
  const totalProtein  = todayMeals.reduce((s, i) => s + i.protein,  0);
  const totalCarbs    = todayMeals.reduce((s, i) => s + i.carbs,    0);
  const totalFats     = todayMeals.reduce((s, i) => s + i.fats,     0);

  const todayWater  = waterIntake.find(w => w.date === todayStr)?.amount || 0;
  const waterPct    = Math.min(100, Math.round((todayWater / user.targetWater) * 100));
  const calPct      = Math.min(100, Math.round((totalCalories / user.targetCalories) * 100));

  const animCal    = useCountUp(totalCalories);
  const animWater  = useCountUp(todayWater);

  const macros = [
    { label: 'PROTEIN',       val: totalProtein, target: user.targetMacros.protein, color: 'var(--primary)', glow: 'var(--primary-glow)',   delay: 0   },
    { label: 'CARBOHYDRATES', val: totalCarbs,   target: user.targetMacros.carbs,   color: 'var(--accent)',   glow: 'var(--accent-glow)',    delay: 100 },
    { label: 'LIPIDS (FATS)', val: totalFats,    target: user.targetMacros.fats,    color: 'var(--secondary)',glow: 'var(--secondary-glow)', delay: 200 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ── Inline keyframes ── */}
      <style>{`
        @keyframes wave { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes bubble { 0%{transform:translateY(0);opacity:.6} 100%{transform:translateY(-120px);opacity:0} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glowPulse { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes scanline { 0%{top:-10%} 100%{top:110%} }
        .dash-card { animation: fadeSlideUp 0.5s ease both; }
        .dash-card:nth-child(1){animation-delay:.05s}
        .dash-card:nth-child(2){animation-delay:.12s}
        .dash-card:nth-child(3){animation-delay:.19s}
      `}</style>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '12px',
        opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(-10px)',
        transition: 'all 0.5s ease'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--secondary)', boxShadow: '0 0 6px var(--secondary)', animation: 'glowPulse 2s infinite' }} />
            <span className="hud-font" style={{ fontSize: '10px', color: 'var(--secondary)', letterSpacing: '2px' }}>NEXUS PORTAL DIRECTIVE</span>
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
            Welcome back,&nbsp;<span style={{
              background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>{user.username}</span>
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {[
            { icon: Flame, label: 'STREAK',     value: `${user.streak} DAYS`,     border: 'var(--secondary)', bg: 'rgba(16,185,129,0.08)' },
            { icon: Zap,   label: 'HEALTH IDX', value: `${user.healthScore}%`,    border: 'var(--accent)',    bg: 'rgba(6,182,212,0.08)'  },
            { icon: Cpu,   label: 'CALORIES',   value: `${animCal} kcal`,         border: 'var(--primary)',   bg: 'rgba(168,85,247,0.08)' },
          ].map(({ icon: Icon, label, value, border, bg }) => (
            <div key={label} style={{
              padding: '8px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px',
              background: bg, border: `1px solid ${border}44`,
              boxShadow: `0 0 14px ${border}22`,
            }}>
              <Icon size={15} style={{ color: border }} />
              <div style={{ fontSize: '11px' }}>
                <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-hud)', letterSpacing: '1px', fontSize: '9px' }}>{label}</div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '12px' }}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Today's Quick Stats ── */}
      <div style={{
        display: 'flex', gap: '10px', flexWrap: 'wrap',
        opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease 0.1s'
      }}>
        <StatTile icon={Flame}     label="CALORIES"  value={`${animCal}`}            sub={`/ ${user.targetCalories} kcal`} color="var(--primary)"   delay={0}   />
        <StatTile icon={Activity}  label="PROTEIN"   value={`${totalProtein}g`}      sub={`/ ${user.targetMacros.protein}g`} color="var(--secondary)" delay={80}  />
        <StatTile icon={TrendingUp}label="CARBS"     value={`${totalCarbs}g`}        sub={`/ ${user.targetMacros.carbs}g`}   color="var(--accent)"    delay={160} />
        <StatTile icon={Droplet}   label="HYDRATION" value={`${animWater}ml`}         sub={`/ ${user.targetWater}ml`}         color="#22d3ee"          delay={240} />
        <StatTile icon={Target}    label="MEALS"     value={todayMeals.length}        sub="logged today"                       color="#f59e0b"          delay={320} />
      </div>

      {/* ── Core Widget Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>

        {/* Calorie Ring */}
        <div className="glass-panel dash-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '260px', position: 'relative', overflow: 'hidden' }}>
          {/* scanline */}
          <div style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, var(--primary-glow), transparent)', animation: 'scanline 3s linear infinite', pointerEvents: 'none' }} />
          <span className="hud-font" style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '1.5px' }}>CALORIE INGESTION TRACKER</span>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ProgressRing value={totalCalories} target={user.targetCalories} size={190} strokeWidth={14} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            {[
              { label: 'Consumed', val: `${totalCalories}`, color: 'var(--primary)' },
              { label: 'Remaining', val: `${Math.max(0, user.targetCalories - totalCalories)}`, color: 'var(--secondary)' },
              { label: 'Goal', val: `${user.targetCalories}`, color: 'var(--text-muted)' },
            ].map(d => (
              <div key={d.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: d.color }}>{d.val}</div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-hud)' }}>{d.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Macros */}
        <div className="glass-panel dash-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden' }}>
          <span className="hud-font" style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '1.5px' }}>MACRONUTRIENT RATIO SPLITS</span>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '18px' }}>
            {macros.map(({ label, val, target, color, glow, delay }) => (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, color, fontFamily: 'var(--font-hud)', fontSize: '11px', letterSpacing: '1px' }}>{label}</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{val}g <span style={{ color: 'var(--text-muted)' }}>/ {target}g</span></span>
                </div>
                <AnimBar pct={(val / target) * 100} color={color} glow={glow} delay={delay} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '3px' }}>
                  <span style={{ fontSize: '9px', color, fontFamily: 'var(--font-hud)' }}>{Math.round((val / target) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hydration */}
        <div className="glass-panel dash-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="hud-font" style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '1.5px' }}>HYDRATION FLOW</span>
            <span style={{ color: '#22d3ee', fontWeight: 700, fontSize: '12px', fontFamily: 'var(--font-hud)' }}>
              {animWater} <span style={{ color: 'var(--text-muted)' }}>/ {user.targetWater} ml</span>
            </span>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1 }}>
            {/* Animated water bottle */}
            <div style={{ position: 'relative', width: '54px', height: '130px', flexShrink: 0 }}>
              <div style={{
                width: '54px', height: '130px', borderRadius: '27px',
                border: '2px solid #22d3ee', boxShadow: '0 0 16px #22d3ee44',
                position: 'relative', overflow: 'hidden', background: 'rgba(0,0,0,0.35)',
                display: 'flex', alignItems: 'flex-end'
              }}>
                {/* wave fill */}
                <div style={{ width: '100%', height: `${waterPct}%`, position: 'relative', overflow: 'hidden', transition: 'height 0.8s ease', background: 'linear-gradient(0deg, #0e749088, #22d3ee55)' }}>
                  <div style={{
                    position: 'absolute', top: '-6px', left: 0, width: '200%', height: '12px',
                    background: 'radial-gradient(ellipse at 25% 50%, #22d3ee 0%, transparent 60%), radial-gradient(ellipse at 75% 50%, #22d3ee 0%, transparent 60%)',
                    animation: 'wave 2s linear infinite',
                    opacity: 0.7
                  }} />
                </div>
                {/* pct label */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#e0f2fe', fontFamily: 'var(--font-hud)', textShadow: '0 0 6px #22d3ee' }}>{waterPct}%</span>
                </div>
              </div>
            </div>

            {/* Quick add buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              {[
                { label: '+250 ml — Cup',    amt: 250,  color: '#22d3ee' },
                { label: '+500 ml — Bottle', amt: 500,  color: '#0ea5e9' },
                { label: '+750 ml — Large',  amt: 750,  color: '#0284c7' },
              ].map(({ label, amt, color }) => (
                <button key={amt} onClick={() => logWater(amt)} style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
                  background: 'rgba(34,211,238,0.07)', border: '1px solid rgba(34,211,238,0.15)',
                  borderRadius: '8px', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '12px',
                  transition: 'all 0.2s', fontWeight: 500
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,211,238,0.14)'; e.currentTarget.style.boxShadow = `0 0 10px ${color}44`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(34,211,238,0.07)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <Droplet size={13} style={{ color }} fill={color} />{label}
                </button>
              ))}
              <button onClick={() => logWater(-250)} style={{
                padding: '7px 12px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
                borderRadius: '8px', cursor: 'pointer', color: '#f87171', fontSize: '11px', transition: 'all 0.2s'
              }}>↩ Undo last drink</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Achievements + Challenges ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }} className="scanner-layout">

        {/* ═══ Achievements ═══ */}
        <div className="glass-panel" style={{ padding: '22px', animation: 'fadeSlideUp 0.5s ease 0.35s both', position: 'relative', overflow: 'hidden' }}>
          {/* decorative corner glow */}
          <div style={{ position: 'absolute', top: '-25px', right: '-25px', width: '100px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.1), transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '7px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px var(--primary-glow)' }}>
                <Trophy size={12} style={{ color: 'white' }} />
              </div>
              <span className="hud-font" style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '1.5px' }}>BIOMETRIC ACHIEVEMENTS</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ padding: '3px 8px', borderRadius: '99px', background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)', fontSize: '9px', color: 'var(--primary)', fontFamily: 'var(--font-hud)' }}>
                {achievements.filter(a => a.unlocked).length}/{achievements.length}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--primary)', cursor: 'pointer', fontFamily: 'var(--font-hud)', display: 'flex', alignItems: 'center', gap: '3px' }} onClick={() => setActivePage('analytics')}>
                VIEW ALL <ChevronRight size={11} />
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {achievements.slice(0, 4).map((ach, i) => {
              const xpReward = ach.unlocked ? [50, 75, 100, 120][i] || 50 : '??';
              const achColors = ['#8b5cf6', '#10b981', '#eab308', '#f43f5e'];
              const achColor = achColors[i % achColors.length];
              const ringR = 14, ringCirc = 2 * Math.PI * ringR;
              const ringPct = ach.unlocked ? 100 : [40, 60, 20, 80][i] || 30;

              return (
                <div key={ach.id} style={{
                  padding: '14px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '14px',
                  background: ach.unlocked
                    ? `linear-gradient(90deg, ${achColor}14, ${achColor}06)`
                    : 'rgba(0,0,0,0.18)',
                  border: ach.unlocked ? `1px solid ${achColor}35` : '1px solid rgba(255,255,255,0.05)',
                  animation: `fadeSlideUp 0.4s ease ${0.4 + i * 0.08}s both`,
                  position: 'relative', overflow: 'hidden',
                  transition: 'all 0.25s ease',
                  cursor: 'pointer'
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = `0 0 20px ${achColor}22`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {/* Left accent bar */}
                  {ach.unlocked && (
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: `linear-gradient(180deg, ${achColor}, ${achColor}88)`, borderRadius: '0 3px 3px 0', boxShadow: `0 0 10px ${achColor}66` }} />
                  )}

                  {/* Progress ring icon */}
                  <div style={{ position: 'relative', width: '38px', height: '38px', flexShrink: 0 }}>
                    <svg width="38" height="38" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
                      <circle cx="19" cy="19" r={ringR} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                      <circle cx="19" cy="19" r={ringR} fill="none"
                        stroke={achColor} strokeWidth="3" strokeLinecap="round"
                        strokeDasharray={ringCirc}
                        strokeDashoffset={ringCirc - (ringPct / 100) * ringCirc}
                        style={{ transition: 'stroke-dashoffset 1.2s ease', filter: `drop-shadow(0 0 4px ${achColor})` }}
                      />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {ach.unlocked
                        ? <Trophy size={14} style={{ color: achColor }} />
                        : <Lock size={12} style={{ color: 'var(--text-muted)' }} />}
                    </div>
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: ach.unlocked ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ach.title}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.3 }}>{ach.description}</div>
                  </div>

                  {/* Right status */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                    {ach.unlocked
                      ? <span style={{ padding: '2px 8px', borderRadius: '99px', background: `${achColor}20`, border: `1px solid ${achColor}40`, fontSize: '8px', color: achColor, fontFamily: 'var(--font-hud)', letterSpacing: '0.5px' }}>✓ UNLOCKED</span>
                      : <span style={{ padding: '2px 8px', borderRadius: '99px', background: 'rgba(255,255,255,0.04)', fontSize: '8px', color: 'var(--text-muted)', fontFamily: 'var(--font-hud)' }}>{ringPct}%</span>}
                    <span style={{ fontSize: '9px', color: ach.unlocked ? '#eab308' : 'var(--text-muted)', fontFamily: 'var(--font-hud)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Star size={9} style={{ color: ach.unlocked ? '#eab308' : 'var(--text-muted)' }} fill={ach.unlocked ? '#eab308' : 'none'} /> +{xpReward} XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══ Challenges ═══ */}
        <div className="glass-panel" style={{ padding: '22px', animation: 'fadeSlideUp 0.5s ease 0.42s both', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-25px', left: '-25px', width: '100px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.1), transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '7px', background: 'linear-gradient(135deg, var(--accent), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px var(--accent-glow)' }}>
                <Target size={12} style={{ color: 'white' }} />
              </div>
              <span className="hud-font" style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '1.5px' }}>HYPERFIT CHALLENGES</span>
            </div>
            <span style={{ padding: '3px 8px', borderRadius: '99px', background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)', fontSize: '9px', color: 'var(--accent)', fontFamily: 'var(--font-hud)' }}>
              {challenges.filter(c => c.active).length} ACTIVE
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {challenges.map((chal, i) => {
              const chalColors = ['#06b6d4', '#f59e0b', '#8b5cf6'];
              const cc = chalColors[i % chalColors.length];
              const xpReward = [200, 350, 500][i] || 200;
              const urgency = chal.daysLeft <= 7 ? 'rgba(239,68,68,0.15)' : 'transparent';

              return (
                <div key={chal.id} style={{
                  padding: '16px', borderRadius: '12px',
                  background: chal.active
                    ? `linear-gradient(135deg, ${cc}12, ${cc}04)`
                    : 'rgba(0,0,0,0.15)',
                  border: chal.active ? `1px solid ${cc}30` : '1px solid rgba(255,255,255,0.05)',
                  animation: `fadeSlideUp 0.4s ease ${0.45 + i * 0.08}s both`,
                  position: 'relative', overflow: 'hidden',
                  transition: 'all 0.25s ease',
                  cursor: 'pointer'
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = `0 0 20px ${cc}22`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {/* Left accent */}
                  {chal.active && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: `linear-gradient(180deg, ${cc}, ${cc}88)`, borderRadius: '0 3px 3px 0', boxShadow: `0 0 10px ${cc}66` }} />}

                  {/* Header row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>{chal.title}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '99px', background: urgency, border: chal.daysLeft <= 7 ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.06)', fontSize: '9px', color: chal.daysLeft <= 7 ? '#f87171' : 'var(--text-muted)', fontFamily: 'var(--font-hud)' }}>
                        ⏱ {chal.daysLeft}D LEFT
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.4 }}>{chal.description}</p>

                  {/* Progress area */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-hud)' }}>PROGRESS</span>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: chal.active ? cc : 'var(--text-muted)', fontFamily: 'var(--font-hud)' }}>{chal.progress}%</span>
                    </div>
                    <div style={{ height: '7px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{
                        height: '100%', borderRadius: '99px',
                        background: chal.active ? `linear-gradient(90deg, ${cc}, ${cc}aa)` : 'rgba(255,255,255,0.08)',
                        boxShadow: chal.active ? `0 0 10px ${cc}66` : 'none',
                        width: `${chal.progress}%`, transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)'
                      }} />
                    </div>
                  </div>

                  {/* Footer: XP reward + button */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '9px', color: '#eab308', fontFamily: 'var(--font-hud)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Star size={10} style={{ color: '#eab308' }} fill="#eab308" /> +{xpReward} XP
                      </span>
                      <span style={{ width: '1px', height: '10px', background: 'rgba(255,255,255,0.1)' }} />
                      <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-hud)' }}>
                        {chal.progress >= 100 ? '🏁 COMPLETE' : chal.progress >= 75 ? '🔥 ALMOST' : '📊 IN PROGRESS'}
                      </span>
                    </div>
                    <button onClick={() => toggleChallengeActive(chal.id)} style={{
                      padding: '5px 12px', fontSize: '9px', borderRadius: '99px', cursor: 'pointer',
                      fontFamily: 'var(--font-hud)', letterSpacing: '0.5px', fontWeight: 700,
                      background: chal.active ? `${cc}18` : 'rgba(255,255,255,0.05)',
                      border: chal.active ? `1px solid ${cc}40` : '1px solid rgba(255,255,255,0.08)',
                      color: chal.active ? cc : 'var(--text-muted)',
                      transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '4px'
                    }}
                      onMouseEnter={e => { if (chal.active) { e.currentTarget.style.boxShadow = `0 0 12px ${cc}44`; } }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      {chal.active ? <><Zap size={10} /> ACTIVE</> : 'ENGAGE'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── CTA Banner ── */}
      <div style={{
        padding: '20px 24px', borderRadius: '14px',
        background: 'linear-gradient(90deg, rgba(168,85,247,0.1), rgba(16,185,129,0.06))',
        border: '1px solid rgba(168,85,247,0.2)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px',
        position: 'relative', overflow: 'hidden',
        animation: 'fadeSlideUp 0.5s ease 0.55s both'
      }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px var(--primary-glow)', flexShrink: 0 }}>
            <Apple size={20} style={{ color: 'white' }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>Ready to log food?</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Launch the AURA neural scanner to identify nutrition facts in seconds.</div>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setActivePage('scanner')} style={{ flexShrink: 0, gap: '8px', boxShadow: '0 0 20px var(--primary-glow)' }}>
          Launch AI Scanner <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
