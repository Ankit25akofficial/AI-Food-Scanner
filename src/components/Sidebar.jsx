import React, { useContext, useState } from 'react';
import { 
  LayoutDashboard, Camera, History, BarChart3, Dumbbell, 
  Settings, ShieldAlert, FileSpreadsheet, Flame, LogOut, Menu, X, User
} from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function Sidebar({ activePage, setActivePage }) {
  const { theme, setTheme, user, logoutUser, isAuthenticated } = useContext(AppContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isAuthenticated) return null;

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'scanner', name: 'AI Scanner', icon: Camera },
    { id: 'history', name: 'Meal History', icon: History },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'fitness', name: 'Fitness Logs', icon: Dumbbell },
    { id: 'reports', name: 'AI Coach & Reports', icon: FileSpreadsheet },
    { id: 'settings', name: 'Goal Settings', icon: Settings },
    { id: 'admin', name: 'Admin Panel', icon: ShieldAlert },
  ];

  const handleNav = (id) => {
    setActivePage(id);
    setMobileOpen(false);
  };

  const currentThemeLabel = () => {
    if (theme === 'emerald') return 'Emerald Synth';
    if (theme === 'cyberpunk') return 'Cyber Amber';
    return 'Midnight Void';
  };

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px 16px' }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 10px var(--primary-glow)'
        }}>
          <span style={{ fontWeight: 'bold', fontSize: '18px', color: 'white', fontFamily: 'var(--font-hud)' }}>A</span>
        </div>
        <span className="hud-font" style={{ fontWeight: 700, fontSize: '18px', letterSpacing: '2px', color: 'var(--text-primary)' }}>
          AURA<span style={{ color: 'var(--secondary)' }}>.AI</span>
        </span>
      </div>

      {/* User XP Profile HUD */}
      <div className="glass-panel" style={{ padding: '12px', marginBottom: '24px', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <img 
            src={user.avatar} 
            alt="Avatar" 
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--primary)' }} 
          />
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.username}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>LVL {user.level}</span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--secondary)', fontWeight: 600 }}>
                <Flame size={10} fill="var(--secondary)" /> {user.streak} Days
              </span>
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: 'var(--text-muted)', marginBottom: '3px' }} className="hud-font">
            <span>EXPERIENCE</span>
            <span>{user.experience}/{user.nextLevelExp} XP</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              background: 'linear-gradient(90deg, var(--primary), var(--secondary))', 
              width: `${(user.experience / user.nextLevelExp) * 100}%`,
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Main Nav Items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                width: '100%',
                background: isActive ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                border: 'none',
                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                borderRadius: '0 8px 8px 0',
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 500,
                transition: 'var(--transition)'
              }}
              className={isActive ? 'glow-text' : ''}
            >
              <Icon size={18} style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)' }} />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Theme Customizer Panel */}
      <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '16px', marginBottom: '16px' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '8px' }} className="hud-font">
          SYSTEM VISUAL THEME
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '8px' }}>
          {['midnight', 'emerald', 'cyberpunk'].map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              style={{
                flex: 1,
                height: '24px',
                borderRadius: '6px',
                border: theme === t ? '1px solid var(--primary)' : '1px solid transparent',
                background: t === 'midnight' ? '#8b5cf6' : t === 'emerald' ? '#10b981' : '#eab308',
                cursor: 'pointer',
                opacity: theme === t ? 1 : 0.6,
                transition: 'var(--transition)'
              }}
              title={t.toUpperCase()}
            />
          ))}
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px', textAlign: 'center' }}>
          {currentThemeLabel()}
        </div>
      </div>

      {/* Log Out */}
      <button
        onClick={logoutUser}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 14px',
          width: '100%',
          background: 'rgba(239, 68, 68, 0.05)',
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.1)',
          borderRadius: '8px',
          textAlign: 'left',
          fontSize: '14px',
          fontWeight: 600,
          transition: 'var(--transition)'
        }}
      >
        <LogOut size={16} />
        Disconnect Node
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="glass-panel desktop-sidebar-wrapper" style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        borderRadius: 0,
        borderRight: '1px solid var(--card-border)',
        borderLeft: 'none',
        borderTop: 'none',
        borderBottom: 'none',
        zIndex: 100,
        display: 'block',
      }}>
        <SidebarContent />
      </aside>

      {/* Mobile Top Navbar & Trigger */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '56px',
        background: 'rgba(10, 8, 16, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--card-border)',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 99
      }} className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }} />
          <span className="hud-font" style={{ fontWeight: 700, fontSize: '15px' }}>AURA.AI</span>
        </div>

        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)' }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(3, 2, 6, 0.95)',
          zIndex: 98,
          paddingTop: '60px',
          display: 'block'
        }} className="mobile-sidebar-drawer animate-fade-in">
          <SidebarContent />
        </div>
      )}

      {/* Responsive Toggle CSS Hack */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar-wrapper {
            display: none !important;
          }
          .mobile-header {
            display: flex !important;
          }
          .app-layout {
            grid-template-columns: 1fr !important;
            padding-top: 56px;
          }
        }
      `}</style>
    </>
  );
}
