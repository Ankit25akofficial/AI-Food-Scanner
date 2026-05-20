import React, { useState, useEffect } from 'react';
import { Camera, Activity, ShieldCheck, Flame, ChevronRight, BarChart3, HelpCircle } from 'lucide-react';

export default function LandingPage({ onGetStarted }) {
  const [tickerCal, setTickerCal] = useState(0);

  useEffect(() => {
    // Dynamic counter simulator for the hero section
    const target = 1850;
    const duration = 2000;
    const stepTime = 30;
    const increment = Math.ceil(target / (duration / stepTime));
    
    const timer = setInterval(() => {
      setTickerCal(prev => {
        if (prev + increment >= target) {
          clearInterval(timer);
          return target;
        }
        return prev + increment;
      });
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '40px 24px',
      zIndex: 2
    }}>
      {/* Decorative Floating Neon Orbs */}
      <div style={{ position: 'absolute', top: '10%', left: '15%', width: '300px', height: '300px', borderRadius: '50%', background: 'var(--primary-glow)', filter: 'blur(120px)', pointerEvents: 'none', zIndex: -1 }}></div>
      <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: '350px', height: '350px', borderRadius: '50%', background: 'var(--secondary-glow)', filter: 'blur(140px)', pointerEvents: 'none', zIndex: -1 }}></div>

      {/* Header bar */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', marginInline: 'auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }} />
          <span className="hud-font" style={{ fontWeight: 800, fontSize: '20px', letterSpacing: '2px' }}>
            AURA<span style={{ color: 'var(--secondary)' }}>.AI</span>
          </span>
        </div>
        <button className="btn btn-secondary" onClick={onGetStarted}>
          ACCESS NODE
        </button>
      </header>

      {/* Hero Section */}
      <main style={{ maxWidth: '1200px', marginInline: 'auto', width: '100%', marginVertical: '60px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '48px', alignItems: 'center' }} className="hero-grid">
        {/* Hero Copy */}
        <div style={{ textAlign: 'left' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid var(--card-border)', borderRadius: '20px', marginBottom: '16px' }}>
            <Flame size={14} style={{ color: 'var(--secondary)' }} className="animate-pulse" />
            <span className="hud-font" style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>v3.5 NEURAL ENGINE ONLINE</span>
          </div>

          <h1 style={{ lineHeight: '1.1', fontSize: '54px', fontWeight: 800, letterSpacing: '-2px', color: 'white', marginBottom: '16px' }}>
            Transform Your Health With <span style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} className="glow-text">Neural Intelligence</span>
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '18px', lineHeight: '1.6', marginBottom: '32px', maxWidth: '520px' }}>
            Scan barcodes, upload food photos, or chat in natural language. AURA instantly deconstructs macros, logs hydration, and calculates workouts with biometric precision.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={onGetStarted} style={{ padding: '14px 28px', fontSize: '16px' }}>
              Initialize Tracker <ChevronRight size={18} />
            </button>
            <a href="#features" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '16px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              View Features
            </a>
          </div>
        </div>

        {/* Hero Interactive Hologram Widget */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          {/* Main Glass HUD */}
          <div className="glass-panel animate-float" style={{
            width: '320px',
            padding: '24px',
            position: 'relative',
            borderWidth: '1.5px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}>
            {/* Hologram Scanner Laser Line */}
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              right: '10px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
              boxShadow: '0 0 8px var(--accent-glow)',
              animation: 'laser-scan 3.5s infinite linear'
            }} />

            {/* Glowing circle HUD */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                border: '3px dashed var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px var(--primary-glow)'
              }} className="animate-spin-slow">
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  border: '1px solid var(--secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotate(-45deg)'
                }}>
                  <Camera size={32} style={{ color: 'var(--text-primary)' }} />
                </div>
              </div>
            </div>

            {/* Simulated Live Calories */}
            <div style={{ textAlign: 'center' }}>
              <span className="hud-font" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>BIOMETRIC INGESTION ACTIVE</span>
              <div style={{ fontSize: '32px', fontWeight: 'bold', fontFamily: 'var(--font-hud)', margin: '4px 0', color: 'var(--primary)' }}>
                {tickerCal} <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>kcal</span>
              </div>
              <div style={{ height: '1px', background: 'var(--card-border)', margin: '12px 0' }}></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontSize: '11px' }}>
                <div>
                  <div style={{ color: 'var(--primary)' }} className="hud-font">P: 125g</div>
                  <div style={{ height: '3px', background: 'var(--primary)', borderRadius: '2px', marginTop: '4px', width: '70%' }}></div>
                </div>
                <div>
                  <div style={{ color: 'var(--accent)' }} className="hud-font">C: 198g</div>
                  <div style={{ height: '3px', background: 'var(--accent)', borderRadius: '2px', marginTop: '4px', width: '85%' }}></div>
                </div>
                <div>
                  <div style={{ color: 'var(--secondary)' }} className="hud-font">F: 52g</div>
                  <div style={{ height: '3px', background: 'var(--secondary)', borderRadius: '2px', marginTop: '4px', width: '50%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sub HUD floating tags */}
          <div className="glass-panel animate-float" style={{
            position: 'absolute',
            top: '-20px',
            right: '-10px',
            padding: '10px 16px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animationDelay: '-2s'
          }}>
            <Activity size={14} style={{ color: 'var(--accent)' }} />
            <span>AI SCAN COMPLETE</span>
          </div>

          <div className="glass-panel animate-float" style={{
            position: 'absolute',
            bottom: '-20px',
            left: '-20px',
            padding: '10px 16px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animationDelay: '-4s'
          }}>
            <ShieldCheck size={14} style={{ color: 'var(--primary)' }} />
            <span>98.7% MATCH</span>
          </div>
        </div>
      </main>

      {/* Features grid */}
      <section id="features" style={{ maxWidth: '1200px', marginInline: 'auto', width: '100%', marginTop: '60px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '40px' }}>
          Explore The <span style={{ color: 'var(--primary)' }}>NEXUS Engine</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div className="glass-panel glass-panel-hover" style={{ padding: '24px' }}>
            <Camera size={24} style={{ color: 'var(--primary)', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Holographic Scanner</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              Scan barcodes or upload snapshots. Our mock computer vision and natural language deconstruct meals with absolute precision.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover" style={{ padding: '24px' }}>
            <BarChart3 size={24} style={{ color: 'var(--accent)', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Glowing Analytics</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              Analyze macros splits, calorie curves, and weight tracking history through interactive custom SVG dashboards.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover" style={{ padding: '24px' }}>
            <Flame size={24} style={{ color: 'var(--secondary)', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Gamified Streaks</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              Level up, earn experience points (XP), unlock achievements, and commit to health challenges to build permanent fitness habits.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover" style={{ padding: '24px' }}>
            <HelpCircle size={24} style={{ color: 'var(--primary)', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Dietary Customization</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              Modify caloric limits, macro splits, weight goals, and visual dashboard interfaces directly within the profile setting nodes.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: '80px', borderTop: '1px solid var(--card-border)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
        <span>© 2026 AURA.AI Technologies. All systems nominal.</span>
        <span>SECURITY ENCRYPTED PROTOCOL</span>
      </footer>

      {/* Responsive layout styles */}
      <style>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .hero-grid > div {
            text-align: center !important;
            marginInline: auto;
          }
          .hero-grid p {
            margin-inline: auto;
          }
          .hero-grid div {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
