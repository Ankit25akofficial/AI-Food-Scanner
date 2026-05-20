import React, { useContext, useState } from 'react';
import { Flame, Droplet, Trophy, Star, CheckCircle2, ChevronRight, Apple, Zap } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import ProgressRing from '../components/ProgressRing';

export default function DashboardPage({ setActivePage }) {
  const { 
    user, 
    meals, 
    waterIntake, 
    logWater, 
    achievements, 
    challenges,
    toggleChallengeActive
  } = useContext(AppContext);

  // Filter meals logged today
  const todayStr = new Date().toISOString().split('T')[0];
  const todayMeals = meals.filter(m => m.date === todayStr);

  // Compute sums
  const totalCalories = todayMeals.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = todayMeals.reduce((sum, item) => sum + item.protein, 0);
  const totalCarbs = todayMeals.reduce((sum, item) => sum + item.carbs, 0);
  const totalFats = todayMeals.reduce((sum, item) => sum + item.fats, 0);

  // Get current day's water intake
  const todayWater = waterIntake.find(w => w.date === todayStr)?.amount || 0;

  // Add water utility
  const handleAddWater = (amount) => {
    logWater(amount);
  };

  // Water percentage calculation
  const waterPct = Math.min(100, Math.round((todayWater / user.targetWater) * 100));

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Welcome Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span className="hud-font" style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>NEXUS PORTAL DIRECTIVE</span>
          <h2 style={{ fontSize: '28px', color: 'var(--text-primary)', marginTop: '4px' }}>
            Welcome back, <span className="glow-text">{user.username}</span>
          </h2>
        </div>
        
        {/* Day Streak and Health Index indicators */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--secondary)' }}>
            <Flame size={16} fill="var(--secondary)" style={{ color: 'var(--secondary)' }} className="animate-pulse" />
            <div style={{ fontSize: '12px' }}>
              <div style={{ color: 'var(--text-secondary)' }} className="hud-font">STREAK</div>
              <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{user.streak} DAYS</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--accent)' }}>
            <Zap size={16} style={{ color: 'var(--accent)' }} />
            <div style={{ fontSize: '12px' }}>
              <div style={{ color: 'var(--text-secondary)' }} className="hud-font">HEALTH IDX</div>
              <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{user.healthScore}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Core Widgets Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Calorie Progress HUD */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '260px' }}>
          <span className="hud-font" style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px', alignSelf: 'flex-start' }}>CALORIE INGESTION TRACKER</span>
          <div style={{ marginInline: 'auto' }}>
            <ProgressRing 
              value={totalCalories} 
              target={user.targetCalories} 
              size={190} 
              strokeWidth={14}
            />
          </div>
        </div>

        {/* Macros Breakdown HUD */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <span className="hud-font" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>MACRONUTRIENT RATIO SPLITS</span>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
            {/* Protein */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: 'var(--primary)' }} className="hud-font">Protein</span>
                <span style={{ color: 'var(--text-secondary)' }}>{totalProtein}g / {user.targetMacros.protein}g</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ 
                  height: '100%', 
                  background: 'var(--primary)', 
                  boxShadow: '0 0 8px var(--primary-glow)',
                  width: `${Math.min(100, (totalProtein / user.targetMacros.protein) * 100)}%`,
                  transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
              </div>
            </div>

            {/* Carbs */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: 'var(--accent)' }} className="hud-font">Carbohydrates</span>
                <span style={{ color: 'var(--text-secondary)' }}>{totalCarbs}g / {user.targetMacros.carbs}g</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ 
                  height: '100%', 
                  background: 'var(--accent)', 
                  boxShadow: '0 0 8px var(--accent-glow)',
                  width: `${Math.min(100, (totalCarbs / user.targetMacros.carbs) * 100)}%`,
                  transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
              </div>
            </div>

            {/* Fats */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: 'var(--secondary)' }} className="hud-font">Lipids (Fats)</span>
                <span style={{ color: 'var(--text-secondary)' }}>{totalFats}g / {user.targetMacros.fats}g</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ 
                  height: '100%', 
                  background: 'var(--secondary)', 
                  boxShadow: '0 0 8px var(--secondary-glow)',
                  width: `${Math.min(100, (totalFats / user.targetMacros.fats) * 100)}%`,
                  transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* Water Hydration HUD */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="hud-font" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>HYDRATION FLOW</span>
            <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '13px' }} className="hud-font">{todayWater} ml / {user.targetWater} ml</span>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1 }}>
            {/* Holographic Water Cylinder container */}
            <div style={{
              width: '50px',
              height: '120px',
              borderRadius: '25px',
              border: '2px solid var(--accent)',
              boxShadow: '0 0 10px var(--accent-glow)',
              position: 'relative',
              overflow: 'hidden',
              background: 'rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'flex-end'
            }}>
              {/* Fluid Fill */}
              <div style={{
                width: '100%',
                height: `${waterPct}%`,
                background: 'linear-gradient(0deg, #0e7490, var(--accent))',
                transition: 'height 0.6s ease',
                position: 'relative'
              }}>
                {/* Glowing bubbles / wave effect */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'rgba(255, 255, 255, 0.5)', filter: 'blur(1px)' }}></div>
              </div>
            </div>

            {/* Quick Add buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <button className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '12px' }} onClick={() => handleAddWater(250)}>
                <Droplet size={12} style={{ color: 'var(--accent)' }} /> +250 ml (Cup)
              </button>
              <button className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '12px' }} onClick={() => handleAddWater(500)}>
                <Droplet size={12} style={{ color: 'var(--accent)' }} /> +500 ml (Bottle)
              </button>
              <button className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '12px', color: '#ef4444' }} onClick={() => handleAddWater(-250)}>
                Reset last drink
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gamification Hub: Challenges & Achievements */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }} className="scanner-layout">
        
        {/* Achievements list */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span className="hud-font" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>BIOMETRIC SYSTEM ACHIEVEMENTS</span>
            <span style={{ fontSize: '11px', color: 'var(--primary)', cursor: 'pointer' }} className="hud-font" onClick={() => setActivePage('analytics')}>
              View Badges
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {achievements.slice(0, 3).map(ach => (
              <div key={ach.id} className="glass-panel" style={{ 
                padding: '12px 16px', 
                background: ach.unlocked ? 'rgba(168, 85, 247, 0.05)' : 'rgba(0,0,0,0.15)',
                border: ach.unlocked ? '1px solid rgba(168, 85, 247, 0.2)' : '1px solid var(--card-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: ach.unlocked ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: ach.unlocked ? '0 0 10px var(--primary-glow)' : 'none'
                }}>
                  <Trophy size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: ach.unlocked ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {ach.title}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {ach.description}
                  </div>
                </div>
                {ach.unlocked ? (
                  <span style={{ color: 'var(--primary)', fontSize: '10px', fontWeight: 600 }} className="hud-font">
                    UNLOCKED
                  </span>
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontSize: '10px' }} className="hud-font">
                    LOCKED
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Daily Challenges */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <span className="hud-font" style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '16px' }}>
            ACTIVE HYPERFIT CHALLENGES
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {challenges.map(chal => (
              <div key={chal.id} className="glass-panel" style={{ 
                padding: '12px 14px', 
                border: chal.active ? '1px solid var(--card-border-hover)' : '1px solid var(--card-border)',
                background: chal.active ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>{chal.title}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }} className="hud-font">{chal.daysLeft}d left</span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{chal.description}</p>
                
                {/* Progress bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'var(--accent)', width: `${chal.progress}%` }} />
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }} className="hud-font">{chal.progress}%</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button 
                    className="btn" 
                    style={{ 
                      padding: '4px 8px', 
                      fontSize: '10px', 
                      background: chal.active ? 'rgba(6, 182, 212, 0.1)' : 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--card-border)',
                      color: chal.active ? 'var(--accent)' : 'var(--text-secondary)'
                    }}
                    onClick={() => toggleChallengeActive(chal.id)}
                  >
                    {chal.active ? 'Active' : 'Engage Challenge'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Access CTAs */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Apple size={24} style={{ color: 'var(--primary)' }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: '15px' }}>Need to log food or scans?</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Launch the AURA neural scanning engine to identify nutritional facts instantly.</div>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setActivePage('scanner')}>
          Launch AI Scanner <ChevronRight size={14} />
        </button>
      </div>

    </div>
  );
}
