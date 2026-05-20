import React, { useContext, useState } from 'react';
import { 
  LayoutDashboard, Camera, History, BarChart3, Dumbbell, 
  Settings, ShieldAlert, FileSpreadsheet, Flame, LogOut, Menu, X, Zap, Heart, Trophy
} from 'lucide-react';
import { AppContext } from '../context/AppContext';

const THEMES = [
  { id: 'midnight', label: 'Midnight', color: '#8b5cf6', glow: 'rgba(139,92,246,0.5)' },
  { id: 'emerald',  label: 'Emerald',  color: '#10b981', glow: 'rgba(16,185,129,0.5)' },
  { id: 'cyberpunk',label: 'Amber',    color: '#eab308', glow: 'rgba(234,179,8,0.5)'  },
];

const MENU = [
  { id: 'dashboard', name: 'Dashboard',       icon: LayoutDashboard, badge: null },
  { id: 'scanner',   name: 'AI Scanner',      icon: Camera,          badge: 'AI' },
  { id: 'history',   name: 'Meal History',    icon: History,         badge: null },
  { id: 'analytics', name: 'Analytics',       icon: BarChart3,       badge: null },
  { id: 'fitness',   name: 'Fitness Logs',    icon: Dumbbell,        badge: null },
  { id: 'reports',   name: 'Coach & Reports', icon: FileSpreadsheet, badge: 'NEW' },
  { id: 'settings',  name: 'Goal Settings',   icon: Settings,        badge: null },
  { id: 'admin',     name: 'Admin Panel',     icon: ShieldAlert,     badge: null },
];

export default function Sidebar({ activePage, setActivePage }) {
  const { theme, setTheme, user, logoutUser, isAuthenticated } = useContext(AppContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  if (!isAuthenticated) return null;

  const handleNav = (id) => { setActivePage(id); setMobileOpen(false); };
  const xpPct = Math.round((user.experience / user.nextLevelExp) * 100);
  const healthPct = user.healthScore || 84;
  const circumference = 2 * Math.PI * 22; // r=22

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px 14px', gap: 0 }}>

      {/* ── Brand ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 16px var(--primary-glow)',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)'
          }} />
          <Zap size={18} style={{ color: 'white', fill: 'white' }} />
        </div>
        <div>
          <span className="hud-font" style={{ fontWeight: 800, fontSize: '17px', letterSpacing: '3px', color: 'var(--text-primary)' }}>
            AURA<span style={{ color: 'var(--secondary)' }}>.AI</span>
          </span>
          <div style={{ fontSize: '8px', letterSpacing: '2px', color: 'var(--text-muted)', fontFamily: 'var(--font-hud)', marginTop: '-2px' }}>
            NEURAL FITNESS OS
          </div>
        </div>
      </div>

      {/* ── Profile HUD Card ── */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(16,185,129,0.04) 100%)',
        border: '1px solid rgba(168,85,247,0.2)',
        borderRadius: '14px',
        padding: '14px',
        marginBottom: '20px',
        overflow: 'hidden',
      }}>
        {/* decorative top-right glow */}
        <div style={{
          position: 'absolute', top: '-20px', right: '-20px',
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.15), transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          {/* Avatar + health ring */}
          <div style={{ position: 'relative', width: '52px', height: '52px', flexShrink: 0 }}>
            <svg width="52" height="52" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
              <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
              <circle cx="26" cy="26" r="22" fill="none"
                stroke="url(#healthGrad)" strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (healthPct / 100) * circumference}
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
              <defs>
                <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="var(--secondary)" />
                </linearGradient>
              </defs>
            </svg>
            <img
              src={user.avatar}
              alt="Avatar"
              style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', position: 'absolute', top: '5px', left: '5px' }}
            />
          </div>

          {/* Name & level */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.username}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '9px', fontFamily: 'var(--font-hud)', letterSpacing: '1px',
                background: 'rgba(168,85,247,0.15)', color: 'var(--primary)',
                border: '1px solid rgba(168,85,247,0.3)', borderRadius: '4px',
                padding: '1px 6px'
              }}>LVL {user.level}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '10px', color: 'var(--secondary)', fontWeight: 600 }}>
                <Flame size={10} fill="var(--secondary)" />{user.streak}d streak
              </span>
            </div>
          </div>
        </div>

        {/* Stat row */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
          {[
            { icon: Heart, label: 'Health', value: `${healthPct}%`, color: '#f43f5e' },
            { icon: Trophy, label: 'Score', value: `${user.experience}XP`, color: '#eab308' },
            { icon: Zap, label: 'Goal', value: user.goalType?.toUpperCase() || 'CUT', color: 'var(--secondary)' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} style={{
              flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '8px',
              padding: '5px 4px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.04)'
            }}>
              <Icon size={11} style={{ color, marginBottom: '2px' }} />
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</div>
              <div style={{ fontSize: '8px', color: 'var(--text-muted)', fontFamily: 'var(--font-hud)' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* XP bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: 'var(--text-muted)', marginBottom: '4px', fontFamily: 'var(--font-hud)', letterSpacing: '1px' }}>
            <span>EXPERIENCE</span><span>{user.experience}/{user.nextLevelExp} XP</span>
          </div>
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${xpPct}%`,
              background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
              borderRadius: '99px',
              boxShadow: '0 0 8px var(--primary-glow)',
              transition: 'width 0.8s ease'
            }} />
          </div>
          <div style={{ fontSize: '8px', color: 'var(--text-muted)', marginTop: '3px', textAlign: 'right', fontFamily: 'var(--font-hud)' }}>
            {100 - xpPct}% TO NEXT LEVEL
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
        <div style={{ fontSize: '8px', letterSpacing: '2px', color: 'var(--text-muted)', fontFamily: 'var(--font-hud)', marginBottom: '6px', paddingLeft: '10px' }}>
          NAVIGATION
        </div>
        {MENU.map(({ id, name, icon: Icon, badge }) => {
          const isActive = activePage === id;
          const isHovered = hoveredItem === id;
          return (
            <button
              key={id}
              onClick={() => handleNav(id)}
              onMouseEnter={() => setHoveredItem(id)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', width: '100%', textAlign: 'left',
                fontSize: '13px', fontWeight: isActive ? 700 : 500,
                borderRadius: '10px', border: 'none',
                cursor: 'pointer', transition: 'all 0.2s ease',
                position: 'relative', overflow: 'hidden',
                color: isActive ? 'var(--primary)' : (isHovered ? 'var(--text-primary)' : 'var(--text-secondary)'),
                background: isActive
                  ? 'linear-gradient(90deg, rgba(168,85,247,0.15), rgba(168,85,247,0.05))'
                  : isHovered ? 'rgba(255,255,255,0.04)' : 'transparent',
                boxShadow: isActive ? 'inset 0 0 0 1px rgba(168,85,247,0.2)' : 'none',
              }}
            >
              {/* Active left accent bar */}
              {isActive && (
                <div style={{
                  position: 'absolute', left: 0, top: '20%', bottom: '20%',
                  width: '3px', background: 'linear-gradient(180deg, var(--primary), var(--secondary))',
                  borderRadius: '0 3px 3px 0', boxShadow: '0 0 8px var(--primary-glow)'
                }} />
              )}
              <Icon size={16} style={{
                color: isActive ? 'var(--primary)' : isHovered ? 'var(--text-primary)' : 'var(--text-muted)',
                transition: 'color 0.2s'
              }} />
              <span style={{ flex: 1 }}>{name}</span>
              {badge && (
                <span style={{
                  fontSize: '8px', fontFamily: 'var(--font-hud)', letterSpacing: '0.5px',
                  padding: '2px 5px', borderRadius: '4px',
                  background: badge === 'AI' ? 'rgba(168,85,247,0.2)' : 'rgba(16,185,129,0.15)',
                  color: badge === 'AI' ? 'var(--primary)' : 'var(--secondary)',
                  border: `1px solid ${badge === 'AI' ? 'rgba(168,85,247,0.3)' : 'rgba(16,185,129,0.25)'}`,
                }}>{badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Theme Switcher ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px', marginBottom: '12px', marginTop: '10px' }}>
        <div style={{ fontSize: '8px', letterSpacing: '2px', color: 'var(--text-muted)', fontFamily: 'var(--font-hud)', marginBottom: '8px' }}>
          VISUAL THEME
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              title={t.label}
              style={{
                flex: 1, height: '32px', borderRadius: '8px', cursor: 'pointer',
                border: theme === t.id ? `1.5px solid ${t.color}` : '1.5px solid rgba(255,255,255,0.06)',
                background: theme === t.id
                  ? `linear-gradient(135deg, ${t.color}, ${t.color}99)`
                  : `${t.color}30`,
                boxShadow: theme === t.id ? `0 0 12px ${t.glow}` : 'none',
                transition: 'all 0.25s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '7px', fontFamily: 'var(--font-hud)', letterSpacing: '0.5px',
                color: theme === t.id ? 'white' : t.color,
                fontWeight: 700
              }}
            >
              {t.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ── Logout ── */}
      <button
        onClick={logoutUser}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 14px', width: '100%',
          background: 'rgba(239,68,68,0.05)',
          color: '#f87171',
          border: '1px solid rgba(239,68,68,0.12)',
          borderRadius: '10px', textAlign: 'left',
          fontSize: '13px', fontWeight: 600,
          cursor: 'pointer', transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.05)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.12)'; }}
      >
        <LogOut size={15} />
        Disconnect Node
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="glass-panel desktop-sidebar-wrapper" style={{
        position: 'sticky', top: 0, height: '100vh',
        borderRadius: 0, borderRight: '1px solid var(--card-border)',
        borderLeft: 'none', borderTop: 'none', borderBottom: 'none',
        zIndex: 100, display: 'block', overflowY: 'auto', overflowX: 'hidden'
      }}>
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '56px',
        background: 'rgba(10,8,16,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--card-border)',
        display: 'none', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', zIndex: 99
      }} className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '26px', height: '26px', borderRadius: '7px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={14} style={{ color: 'white', fill: 'white' }} />
          </div>
          <span className="hud-font" style={{ fontWeight: 800, fontSize: '15px', letterSpacing: '2px' }}>AURA<span style={{ color: 'var(--secondary)' }}>.AI</span></span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(3,2,6,0.97)', zIndex: 98,
          paddingTop: '60px', display: 'block', overflowY: 'auto'
        }} className="mobile-sidebar-drawer animate-fade-in">
          <SidebarContent />
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar-wrapper { display: none !important; }
          .mobile-header { display: flex !important; }
          .app-layout { grid-template-columns: 1fr !important; padding-top: 56px; }
        }
        .desktop-sidebar-wrapper::-webkit-scrollbar { width: 3px; }
        .desktop-sidebar-wrapper::-webkit-scrollbar-track { background: transparent; }
        .desktop-sidebar-wrapper::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.3); border-radius: 99px; }
      `}</style>
    </>
  );
}
