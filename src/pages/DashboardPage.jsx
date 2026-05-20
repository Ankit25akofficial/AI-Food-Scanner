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

        {/* Achievements */}
        <div className="glass-panel" style={{ padding: '22px', animation: 'fadeSlideUp 0.5s ease 0.35s both' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span className="hud-font" style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '1.5px' }}>BIOMETRIC ACHIEVEMENTS</span>
            <span style={{ fontSize: '10px', color: 'var(--primary)', cursor: 'pointer', fontFamily: 'var(--font-hud)', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => setActivePage('analytics')}>
              VIEW ALL <ChevronRight size={11} />
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {achievements.slice(0, 4).map((ach, i) => (
              <div key={ach.id} style={{
                padding: '12px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px',
                background: ach.unlocked ? 'linear-gradient(90deg, rgba(168,85,247,0.08), rgba(168,85,247,0.03))' : 'rgba(0,0,0,0.15)',
                border: ach.unlocked ? '1px solid rgba(168,85,247,0.2)' : '1px solid rgba(255,255,255,0.04)',
                animation: `fadeSlideUp 0.4s ease ${0.4 + i * 0.07}s both`,
                position: 'relative', overflow: 'hidden'
              }}>
                {ach.unlocked && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: 'linear-gradient(180deg, var(--primary), var(--secondary))', borderRadius: '0 2px 2px 0', boxShadow: '0 0 8px var(--primary-glow)' }} />}
                <div style={{
                  width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0,
                  background: ach.unlocked ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: ach.unlocked ? '0 0 12px var(--primary-glow)' : 'none'
                }}>
                  {ach.unlocked ? <Trophy size={15} style={{ color: 'white' }} /> : <Lock size={14} style={{ color: 'var(--text-muted)' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: ach.unlocked ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ach.title}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '1px' }}>{ach.description}</div>
                </div>
                {ach.unlocked
                  ? <span style={{ fontSize: '9px', color: 'var(--secondary)', fontFamily: 'var(--font-hud)', letterSpacing: '0.5px', flexShrink: 0 }}>✓ UNLOCKED</span>
                  : <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-hud)', flexShrink: 0 }}>LOCKED</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Challenges */}
        <div className="glass-panel" style={{ padding: '22px', animation: 'fadeSlideUp 0.5s ease 0.42s both' }}>
          <span className="hud-font" style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '1.5px', display: 'block', marginBottom: '14px' }}>ACTIVE HYPERFIT CHALLENGES</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {challenges.map((chal, i) => (
              <div key={chal.id} style={{
                padding: '12px 14px', borderRadius: '10px',
                background: chal.active ? 'linear-gradient(90deg, rgba(234,179,8,0.07), rgba(234,179,8,0.02))' : 'rgba(0,0,0,0.12)',
                border: chal.active ? '1px solid rgba(234,179,8,0.2)' : '1px solid rgba(255,255,255,0.04)',
                animation: `fadeSlideUp 0.4s ease ${0.45 + i * 0.07}s both`,
                position: 'relative', overflow: 'hidden'
              }}>
                {chal.active && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: 'var(--accent)', borderRadius: '0 2px 2px 0', boxShadow: '0 0 8px var(--accent-glow)' }} />}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>{chal.title}</span>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-hud)', flexShrink: 0, marginLeft: '8px' }}>{chal.daysLeft}D LEFT</span>
                </div>
                <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.4 }}>{chal.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ flex: 1, height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '99px',
                      background: chal.active ? 'linear-gradient(90deg, var(--accent), var(--secondary))' : 'rgba(255,255,255,0.1)',
                      boxShadow: chal.active ? '0 0 8px var(--accent-glow)' : 'none',
                      width: `${chal.progress}%`, transition: 'width 1s ease'
                    }} />
                  </div>
                  <span style={{ fontSize: '9px', color: chal.active ? 'var(--accent)' : 'var(--text-muted)', fontFamily: 'var(--font-hud)', minWidth: '28px', textAlign: 'right' }}>{chal.progress}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => toggleChallengeActive(chal.id)} style={{
                    padding: '4px 10px', fontSize: '9px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'var(--font-hud)', letterSpacing: '0.5px',
                    background: chal.active ? 'rgba(6,182,212,0.12)' : 'rgba(255,255,255,0.05)',
                    border: chal.active ? '1px solid rgba(6,182,212,0.3)' : '1px solid rgba(255,255,255,0.08)',
                    color: chal.active ? 'var(--accent)' : 'var(--text-muted)',
                    transition: 'all 0.2s'
                  }}>
                    {chal.active ? '⚡ ACTIVE' : 'ENGAGE'}
                  </button>
                </div>
              </div>
            ))}
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
