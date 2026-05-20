import React, { useState, useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import ParticleBackground from './components/ParticleBackground';
import Sidebar from './components/Sidebar';

// Page Nodes
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ScannerPage from './pages/ScannerPage';
import HistoryPage from './pages/HistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import FitnessPage from './pages/FitnessPage';
import SettingsPage from './pages/SettingsPage';
import AdminPanel from './pages/AdminPanel';
import ReportsPage from './pages/ReportsPage';

import './App.css';

function MainApp() {
  const { isAuthenticated } = useContext(AppContext);
  const [activePage, setActivePage] = useState('dashboard');
  const [showLogin, setShowLogin] = useState(false);

  // Layout selection for Unauthenticated vs Authenticated views
  if (!isAuthenticated) {
    if (showLogin) {
      return (
        <div style={{ width: '100%' }} className="animate-fade-in">
          <ParticleBackground />
          <LoginPage />
          {/* Portal navigation back-link */}
          <button 
            onClick={() => setShowLogin(false)}
            style={{
              position: 'fixed',
              top: '24px',
              left: '24px',
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid var(--card-border)',
              color: 'var(--text-secondary)',
              padding: '8px 14px',
              fontSize: '12px',
              borderRadius: '8px',
              cursor: 'pointer',
              zIndex: 1000,
              fontFamily: 'var(--font-hud)',
              letterSpacing: '1px',
              transition: 'var(--transition)'
            }}
            onMouseEnter={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.color = 'var(--text-primary)'; }}
            onMouseLeave={(e) => { e.target.style.borderColor = 'var(--card-border)'; e.target.style.color = 'var(--text-secondary)'; }}
          >
            ← ACCESS TERMINAL INDEX
          </button>
        </div>
      );
    }
    return (
      <div style={{ width: '100%' }} className="animate-fade-in">
        <ParticleBackground />
        <LandingPage onGetStarted={() => setShowLogin(true)} />
      </div>
    );
  }

  // Dynamic Routing Resolver
  const renderActiveNode = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage setActivePage={setActivePage} />;
      case 'scanner':
        return <ScannerPage />;
      case 'history':
        return <HistoryPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'fitness':
        return <FitnessPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <DashboardPage setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="app-layout">
      <ParticleBackground />
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="app-content page-transition-wrapper" key={activePage}>
        {renderActiveNode()}
      </main>
    </div>
  );
}

export default function App() {
  // Setup HTML attributes on load
  React.useEffect(() => {
    document.title = "AURA.AI // Smart Nutrition & Fitness Core";
    
    // Add full page responsive layout class to body based on viewport size checks
    const rootEl = document.getElementById('root');
    if (rootEl) {
      rootEl.className = ''; // remove initial template class
    }
  }, []);

  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
