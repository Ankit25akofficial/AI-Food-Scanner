import React, { useState, useContext } from 'react';
import { Shield, Fingerprint, Lock, Mail, ArrowRight } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function LoginPage() {
  const { loginUser } = useContext(AppContext);
  const [email, setEmail] = useState('apex@aurafit.io');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setScanMessage('Verifying certificates...');
    
    // Simulate server delay
    setTimeout(() => {
      loginUser(email, password);
      setLoading(false);
    }, 1200);
  };

  const handleBiometricScan = () => {
    setScanning(true);
    setScanMessage('Scanning fingerprint index...');
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        clearInterval(interval);
        setScanMessage('Match confirmed! Handshaking host...');
        setTimeout(() => {
          loginUser('biometric-guest@aurafit.io', 'pass');
          setScanning(false);
        }, 800);
      }
    }, 300);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      zIndex: 2
    }}>
      {/* Laser line overlay during biometric scan */}
      {scanning && (
        <div style={{
          position: 'fixed',
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
          boxShadow: '0 0 15px var(--primary)',
          animation: 'laser-scan 1.5s infinite linear',
          zIndex: 1000,
          pointerEvents: 'none'
        }} />
      )}

      <div className="glass-panel animate-slide-up" style={{
        width: '420px',
        maxWidth: '100%',
        padding: '32px',
        borderWidth: '1px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
        position: 'relative'
      }}>
        {/* Futuristic HUD details */}
        <div style={{ position: 'absolute', top: 12, right: 16, fontSize: '10px', color: 'var(--text-muted)' }} className="hud-font">
          SECURE PROTOCOL v3.2
        </div>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(168, 85, 247, 0.1)',
            border: '1px solid var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginInline: 'auto',
            marginBottom: '16px',
            boxShadow: '0 0 15px var(--primary-glow)'
          }} className="animate-pulse">
            <Shield size={24} style={{ color: 'var(--primary)' }} />
          </div>
          <h2 style={{ fontSize: '24px', color: 'var(--text-primary)' }}>NEXUS IDENTIFICATION</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px' }}>
            Input terminal credentials or supply fingerprint.
          </p>
        </div>

        {scanning ? (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'rgba(168, 85, 247, 0.1)',
              border: '2px solid var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginInline: 'auto',
              marginBottom: '20px',
              boxShadow: '0 0 20px var(--primary-glow)'
            }} className="animate-pulse">
              <Fingerprint size={48} style={{ color: 'var(--primary)' }} />
            </div>
            <div className="hud-font glow-text" style={{ fontSize: '13px', color: 'var(--primary)' }}>
              {scanMessage}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }} className="hud-font">
                EMAIL NODE
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', paddingLeft: '36px' }}
                  placeholder="apex@aurafit.io"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }} className="hud-font">
                PASSPHRASE MATRIX
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', paddingLeft: '36px' }}
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            {/* Login button */}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} disabled={loading}>
              {loading ? 'Decrypting Credentials...' : 'Access Portal'} <ArrowRight size={16} />
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }}></div>
              <span className="hud-font" style={{ padding: '0 10px', fontSize: '10px', color: 'var(--text-muted)' }}>OR BIOMETRICS</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }}></div>
            </div>

            {/* Biometric trigger */}
            <button 
              type="button" 
              className="btn btn-secondary" 
              style={{ width: '100%', justifyContent: 'center', gap: '8px', border: '1px dashed var(--primary)' }}
              onClick={handleBiometricScan}
            >
              <Fingerprint size={16} style={{ color: 'var(--primary)' }} /> Scan Biometric Index
            </button>
          </form>
        )}

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
          System credentials matching standard bypass protocols.<br />
          Click <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Access Portal</span> directly to evaluate.
        </div>
      </div>
    </div>
  );
}
