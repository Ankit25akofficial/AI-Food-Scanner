import React, { useEffect, useState } from 'react';

export default function ProgressRing({ 
  value = 0, 
  target = 2000, 
  size = 180, 
  strokeWidth = 12, 
  color = 'var(--primary)', 
  glowColor = 'var(--primary-glow)',
  title = 'Calories'
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min(100, Math.max(0, (value / target) * 100));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const [count, setCount] = useState(0);

  useEffect(() => {
    // Smooth number count-up effect
    let start = 0;
    const end = Math.round(value);
    if (start === end) {
      setCount(end);
      return;
    }

    const duration = 800; // ms
    const increment = (end - start) / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(Math.round(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="progress-ring-container" style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={strokeWidth}
        />
        {/* Glowing Neon Bar */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: `drop-shadow(0 0 6px ${glowColor})`
          }}
        />
      </svg>
      {/* HUD Centered Metrics */}
      <div style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <span className="hud-font" style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
          {title}
        </span>
        <span className="hud-font glow-text" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0' }}>
          {count}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          / {target} kcal
        </span>
      </div>
    </div>
  );
}
