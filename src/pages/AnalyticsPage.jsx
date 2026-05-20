import React, { useContext, useState, useEffect } from 'react';
import { BarChart3, TrendingDown, TrendingUp, Target, Trophy, Award, Zap, Flame, Activity, Star, Lock, ChevronUp, ChevronDown } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import InteractiveChart from '../components/InteractiveChart';

/* ── Animated count-up ── */
function useCountUp(target, dur = 800) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!target) { setV(0); return; }
    let start = null;
    const tick = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setV(Math.round(p * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return v;
}

/* ── Stat KPI tile ── */
function KPITile({ icon: Icon, label, value, sub, color, trend, delay = 0 }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{
      flex: '1 1 150px', padding: '16px', borderRadius: '14px',
      background: `linear-gradient(135deg, ${color}12, ${color}05)`,
      border: `1px solid ${color}30`,
      boxShadow: vis ? `0 0 22px ${color}18` : 'none',
      transform: vis ? 'translateY(0)' : 'translateY(14px)',
      opacity: vis ? 1 : 0,
      transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: '-14px', right: '-14px', width: '60px', height: '60px', borderRadius: '50%', background: `radial-gradient(circle, ${color}20, transparent 70%)` }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={15} style={{ color }} />
        </div>
        {trend !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px', color: trend >= 0 ? '#34d399' : '#f87171', fontFamily: 'var(--font-hud)' }}>
            {trend >= 0 ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {Math.abs(trend)}
          </div>
        )}
      </div>
      <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: '9px', color, fontFamily: 'var(--font-hud)', letterSpacing: '1px', marginTop: '3px' }}>{label}</div>
      {sub && <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '3px' }}>{sub}</div>}
    </div>
  );
}

/* ── Macro split stacked bar ── */
function MacroBar({ label, pPct, cPct, fPct, pG, cG, fG, dim = false, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(1), 150 + delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-hud)', letterSpacing: '0.5px' }}>{label}</span>
        <div style={{ display: 'flex', gap: '10px', fontSize: '10px', color: 'var(--text-secondary)' }}>
          <span style={{ color: 'var(--primary)' }}>P: {pG}g</span>
          <span style={{ color: 'var(--accent)' }}>C: {cG}g</span>
          <span style={{ color: 'var(--secondary)' }}>F: {fG}g</span>
        </div>
      </div>
      <div style={{ height: '28px', borderRadius: '8px', overflow: 'hidden', display: 'flex', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {[
          { pct: pPct, color: 'var(--primary)', glow: 'var(--primary-glow)', label: `P ${pPct}%` },
          { pct: cPct, color: 'var(--accent)',   glow: 'var(--accent-glow)',   label: `C ${cPct}%` },
          { pct: fPct, color: 'var(--secondary)',glow: 'var(--secondary-glow)',label: `F ${fPct}%` },
        ].map(({ pct, color, glow, label: lbl }) => (
          <div key={lbl} style={{
            width: w ? `${pct}%` : '0%', background: color, opacity: dim ? 0.55 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', color: 'white', fontWeight: 700, fontFamily: 'var(--font-hud)',
            transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
            boxShadow: `inset 0 0 8px ${glow}`,
            whiteSpace: 'nowrap', overflow: 'hidden'
          }}>
            {pct > 12 ? lbl : ''}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Badge card ── */
function BadgeCard({ ach, delay }) {
  const [vis, setVis] = useState(false);
  const [hov, setHov] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '16px 12px', borderRadius: '14px', textAlign: 'center',
        background: ach.unlocked
          ? hov ? 'linear-gradient(135deg, rgba(168,85,247,0.18), rgba(16,185,129,0.08))' : 'linear-gradient(135deg, rgba(168,85,247,0.10), rgba(16,185,129,0.04))'
          : 'rgba(0,0,0,0.18)',
        border: ach.unlocked ? '1.5px solid rgba(168,85,247,0.35)' : '1px solid rgba(255,255,255,0.05)',
        boxShadow: ach.unlocked && hov ? '0 0 24px var(--primary-glow)' : ach.unlocked ? '0 0 12px rgba(168,85,247,0.15)' : 'none',
        opacity: vis ? (ach.unlocked ? 1 : 0.5) : 0,
        transform: vis ? (hov ? 'translateY(-3px) scale(1.02)' : 'translateY(0)') : 'translateY(16px)',
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
        cursor: ach.unlocked ? 'pointer' : 'default',
        position: 'relative', overflow: 'hidden'
      }}
    >
      {ach.unlocked && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }} />
      )}
      <div style={{
        width: '44px', height: '44px', borderRadius: '50%', marginInline: 'auto', marginBottom: '10px',
        background: ach.unlocked ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: ach.unlocked ? '0 0 16px var(--primary-glow)' : 'none',
        transition: 'all 0.3s'
      }}>
        {ach.unlocked ? <Trophy size={20} style={{ color: 'white' }} /> : <Lock size={16} style={{ color: 'var(--text-muted)' }} />}
      </div>
      <div style={{ fontSize: '12px', fontWeight: 700, color: ach.unlocked ? 'var(--text-primary)' : 'var(--text-muted)', marginBottom: '4px', lineHeight: 1.3 }}>
        {ach.title}
      </div>
      <div style={{ fontSize: '9px', color: 'var(--text-secondary)', lineHeight: 1.4, height: '28px', overflow: 'hidden' }}>
        {ach.description}
      </div>
      <div style={{ marginTop: '8px' }}>
        {ach.unlocked
          ? <span style={{ fontSize: '8px', padding: '2px 8px', borderRadius: '99px', background: 'rgba(16,185,129,0.15)', color: '#34d399', fontFamily: 'var(--font-hud)', letterSpacing: '0.5px', border: '1px solid rgba(16,185,129,0.25)' }}>✓ UNLOCKED</span>
          : <span style={{ fontSize: '8px', padding: '2px 8px', borderRadius: '99px', background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', fontFamily: 'var(--font-hud)', letterSpacing: '0.5px' }}>LOCKED</span>}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { user, meals, weightHistory, achievements } = useContext(AppContext);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  const calorieHistory = [
    { date: '05-14', calories: 2100 },
    { date: '05-15', calories: 2350 },
    { date: '05-16', calories: 1980 },
    { date: '05-17', calories: 2050 },
    { date: '05-18', calories: 2220 },
    { date: '05-19', calories: 1720 },
    { date: '05-20', calories: meals.filter(m => m.date === '2026-05-20').reduce((s, m) => s + m.calories, 0) }
  ];

  const todayStr = new Date().toISOString().split('T')[0];
  const todayMeals = meals.filter(m => m.date === todayStr);
  const totalProt = todayMeals.reduce((s, m) => s + m.protein, 0);
  const totalCarb = todayMeals.reduce((s, m) => s + m.carbs, 0);
  const totalFat  = todayMeals.reduce((s, m) => s + m.fats, 0);

  const totalMG = (totalProt + totalCarb + totalFat) || 1;
  const protPct = Math.round((totalProt / totalMG) * 100);
  const carbPct = Math.round((totalCarb / totalMG) * 100);
  const fatPct  = Math.round((totalFat  / totalMG) * 100);

  const targetMG   = (user.targetMacros.protein + user.targetMacros.carbs + user.targetMacros.fats) || 1;
  const tProtPct   = Math.round((user.targetMacros.protein / targetMG) * 100);
  const tCarbPct   = Math.round((user.targetMacros.carbs   / targetMG) * 100);
  const tFatPct    = Math.round((user.targetMacros.fats    / targetMG) * 100);

  const initialWeight = weightHistory[0]?.weight || 80;
  const currentWeight = user.weight;
  const weightDelta   = (currentWeight - initialWeight).toFixed(1);
  const avgCal        = Math.round(calorieHistory.reduce((s, d) => s + d.calories, 0) / calorieHistory.length);
  const totalCalToday = todayMeals.reduce((s, m) => s + m.calories, 0);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  const animCal    = useCountUp(totalCalToday);
  const animAvg    = useCountUp(avgCal);
  const animBadges = useCountUp(unlockedCount);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(10px)', transition: 'all 0.5s ease' }}>

      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glowBlink { 0%,100%{opacity:.5} 50%{opacity:1} }
        .ac { animation: slideUp 0.45s ease both; }
        .ac:nth-child(1){animation-delay:.05s} .ac:nth-child(2){animation-delay:.12s}
        .ac:nth-child(3){animation-delay:.19s} .ac:nth-child(4){animation-delay:.26s}
      `}</style>

      {/* ── Header ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 8px var(--primary-glow)', animation: 'glowBlink 2s infinite' }} />
          <span className="hud-font" style={{ fontSize: '10px', color: 'var(--primary)', letterSpacing: '2px' }}>ANALYTICAL METRICS ENGINE</span>
        </div>
        <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>
          Nutrition &amp; Biometric&nbsp;
          <span style={{ background: 'linear-gradient(90deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Analytics</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
          Evaluate historical calorie intake, weight fluctuations, and macronutrient balance indices.
        </p>
      </div>

      {/* ── KPI Row ── */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <KPITile icon={Flame}    label="TODAY'S CALORIES" value={animCal}    sub={`Target: ${user.targetCalories} kcal`} color="var(--primary)"    trend={totalCalToday - user.targetCalories} delay={0}   />
        <KPITile icon={Activity} label="7-DAY AVG INTAKE"  value={animAvg}   sub="kcal / day"                             color="var(--accent)"     delay={80}  />
        <KPITile icon={TrendingDown} label="WEIGHT CHANGE" value={`${weightDelta > 0 ? '+' : ''}${weightDelta} kg`} sub={`${initialWeight}→${currentWeight} kg`} color={weightDelta <= 0 ? '#34d399' : '#f87171'} delay={160} />
        <KPITile icon={Trophy}   label="BADGES EARNED"     value={`${animBadges}/${achievements.length}`} sub="achievements unlocked" color="#eab308" delay={240} />
        <KPITile icon={Zap}      label="HEALTH SCORE"      value={`${user.healthScore}%`} sub="biometric index"           color="var(--secondary)"  delay={320} />
      </div>

      {/* ── Charts ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }} className="scanner-layout">

        {/* Calorie Chart */}
        <div className="glass-panel ac" style={{ padding: '22px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(168,85,247,0.03), transparent)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <span className="hud-font" style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '1.5px' }}>WEEKLY CALORIE HISTOGRAM</span>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>{avgCal} <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>kcal avg</span></div>
            </div>
            <div style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', fontSize: '11px', color: 'var(--primary)', fontFamily: 'var(--font-hud)' }}>
              TARGET: {user.targetCalories}
            </div>
          </div>
          <InteractiveChart type="line" data={calorieHistory} xKey="date" yKey="calories" targetValue={user.targetCalories} color="var(--primary)" glowColor="var(--primary-glow)" />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', fontSize: '11px', flexWrap: 'wrap', gap: '6px' }}>
            <div style={{ display: 'flex', gap: '14px' }}>
              {calorieHistory.slice(-3).map(d => (
                <div key={d.date} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: d.calories >= user.targetCalories ? '#34d399' : '#f87171' }}>{d.calories}</div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-hud)' }}>{d.date}</div>
                </div>
              ))}
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>7-day avg: {avgCal} kcal</span>
          </div>
        </div>

        {/* Weight Chart */}
        <div className="glass-panel ac" style={{ padding: '22px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(6,182,212,0.03), transparent)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <span className="hud-font" style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '1.5px' }}>BODY WEIGHT TIMELINE (kg)</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
                <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>{currentWeight} kg</span>
                <span style={{ fontSize: '11px', color: weightDelta <= 0 ? '#34d399' : '#f87171', fontWeight: 700 }}>
                  {weightDelta > 0 ? '+' : ''}{weightDelta} kg
                </span>
              </div>
            </div>
            <div style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', fontSize: '11px', color: 'var(--accent)', fontFamily: 'var(--font-hud)' }}>
              TARGET: 77 kg
            </div>
          </div>
          <InteractiveChart type="line" data={weightHistory} xKey="date" yKey="weight" targetValue={77} color="var(--accent)" glowColor="var(--accent-glow)" />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span>Start: <strong style={{ color: 'var(--text-primary)' }}>{initialWeight} kg</strong></span>
            <span>To goal: <strong style={{ color: 'var(--accent)' }}>{(currentWeight - 77).toFixed(1)} kg</strong></span>
          </div>
        </div>
      </div>

      {/* ── Macro Splits + Badges ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '18px' }} className="scanner-layout">

        {/* Macro Splits */}
        <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'slideUp 0.45s ease 0.3s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={13} style={{ color: 'var(--primary)' }} />
            <span className="hud-font" style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '1.5px' }}>MACRONUTRIENT BALANCE INDEX</span>
          </div>

          <MacroBar label="TODAY'S LOG" pPct={protPct} cPct={carbPct} fPct={fatPct} pG={totalProt} cG={totalCarb} fG={totalFat} delay={0} />
          <MacroBar label="TARGET SPLITS" pPct={tProtPct} cPct={tCarbPct} fPct={tFatPct} pG={user.targetMacros.protein} cG={user.targetMacros.carbs} fG={user.targetMacros.fats} dim delay={200} />

          {/* Delta indicators */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { label: 'Protein', got: totalProt, goal: user.targetMacros.protein, color: 'var(--primary)' },
              { label: 'Carbs',   got: totalCarb, goal: user.targetMacros.carbs,   color: 'var(--accent)'   },
              { label: 'Fats',    got: totalFat,  goal: user.targetMacros.fats,    color: 'var(--secondary)'},
            ].map(({ label, got, goal, color }) => {
              const pct = Math.min(100, Math.round((got / goal) * 100));
              const ok = pct >= 80;
              return (
                <div key={label} style={{ flex: 1, padding: '10px', borderRadius: '10px', background: ok ? `${color}12` : 'rgba(0,0,0,0.18)', border: `1px solid ${ok ? color : 'rgba(255,255,255,0.05)'}44`, textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color }}>{pct}%</div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-hud)', marginTop: '2px' }}>{label}</div>
                  <div style={{ fontSize: '9px', color: ok ? '#34d399' : '#f87171', marginTop: '3px' }}>{got}g / {goal}g</div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[['var(--primary)','Protein (4 kcal/g)'],['var(--accent)','Carbs (4 kcal/g)'],['var(--secondary)','Fats (9 kcal/g)']].map(([c, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: 'var(--text-secondary)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: c, boxShadow: `0 0 5px ${c}` }} />
                {l}
              </div>
            ))}
          </div>
        </div>

        {/* Badges Cabinet */}
        <div className="glass-panel" style={{ padding: '22px', animation: 'slideUp 0.45s ease 0.37s both' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trophy size={13} style={{ color: '#eab308' }} />
              <span className="hud-font" style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '1.5px' }}>TROPHY CABINET</span>
            </div>
            <div style={{ padding: '4px 10px', borderRadius: '99px', background: 'rgba(234,179,8,0.12)', border: '1px solid rgba(234,179,8,0.25)', fontSize: '10px', color: '#eab308', fontFamily: 'var(--font-hud)' }}>
              {unlockedCount}/{achievements.length} EARNED
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
            {achievements.map((ach, i) => (
              <BadgeCard key={ach.id} ach={ach} delay={380 + i * 60} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
