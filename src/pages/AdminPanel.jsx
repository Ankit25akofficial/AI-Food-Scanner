import React, { useContext, useState } from 'react';
import { ShieldAlert, Server, Database, Plus, Trash2, Cpu, Check, Activity } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function AdminPanel() {
  const { adminStats, foodBank, addFoodToDatabase } = useContext(AppContext);

  // States for new food editor
  const [name, setName] = useState('');
  const [barcode, setBarcode] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [sugar, setSugar] = useState('');
  const [vitamins, setVitamins] = useState('');

  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !calories) return;

    addFoodToDatabase({
      name,
      barcode,
      calories: Number(calories),
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fats: Number(fats) || 0,
      sugar: Number(sugar) || 0,
      vitamins: vitamins || 'General nutrients'
    });

    setFeedback(`Food item "${name}" appended to neural food bank list successfully.`);
    setTimeout(() => setFeedback(''), 4500);

    // Reset
    setName('');
    setBarcode('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFats('');
    setSugar('');
    setVitamins('');
  };

  // Mock server load charts
  const serverLoadHistory = [
    { hour: '08:00', load: 32 },
    { hour: '10:00', load: 58 },
    { hour: '12:00', load: 84 },
    { hour: '14:00', load: 72 },
    { hour: '16:00', load: 45 },
    { hour: '18:00', load: 68 },
    { hour: '20:00', load: 91 },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title */}
      <div>
        <span className="hud-font" style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>SYSTEM ARCHITECTURE MONITOR</span>
        <h2 style={{ fontSize: '28px', color: 'var(--text-primary)', marginTop: '4px' }}>Neural Engine <span className="glow-text">Admin Panel</span></h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          Monitor simulated microservice requests, active computer vision streams, and manage local OCR food banks.
        </p>
      </div>

      {feedback && (
        <div style={{ display: 'flex', gap: '8px', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', color: 'white', alignItems: 'center', fontSize: '13px' }}>
          <Check size={16} style={{ color: '#10b981' }} />
          <span>{feedback}</span>
        </div>
      )}

      {/* Server hardware specs grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Server size={24} style={{ color: 'var(--primary)' }} />
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }} className="hud-font">SYSTEM UPTIME</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{adminStats.uptime}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Database size={24} style={{ color: 'var(--accent)' }} />
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }} className="hud-font">FOOD BANK SIZE</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{adminStats.dbItemsCount.toLocaleString()}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Activity size={24} style={{ color: 'var(--secondary)' }} />
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }} className="hud-font">VISION HITS (TODAY)</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{adminStats.activeVisionScans.toLocaleString()}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Cpu size={24} style={{ color: 'var(--primary)' }} />
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }} className="hud-font">LATENCY RATE</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{adminStats.avgProcessingTime} ms</div>
          </div>
        </div>
      </div>

      {/* Main split grid: Server load vs Food Database append form */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }} className="scanner-layout">
        
        {/* Append food bank item */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <span className="hud-font" style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '16px' }}>
            APPEND NEW NEURAL DATABASE FOOD DEF
          </span>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="scanner-layout">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }} className="hud-font">Product Title</label>
                <input type="text" placeholder="e.g. Protein Granola" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }} className="hud-font">UPC Barcode (12 digit)</label>
                <input type="text" placeholder="e.g. 192000102938" value={barcode} onChange={(e) => setBarcode(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }} className="scanner-layout">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '10px', color: 'var(--text-secondary)' }} className="hud-font">Calories</label>
                <input type="number" placeholder="kcal" value={calories} onChange={(e) => setCalories(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '10px', color: 'var(--text-secondary)' }} className="hud-font">Protein</label>
                <input type="number" placeholder="grams" value={protein} onChange={(e) => setProtein(e.target.value)} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '10px', color: 'var(--text-secondary)' }} className="hud-font">Carbs</label>
                <input type="number" placeholder="grams" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '10px', color: 'var(--text-secondary)' }} className="hud-font">Fats</label>
                <input type="number" placeholder="grams" value={fats} onChange={(e) => setFats(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="scanner-layout">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }} className="hud-font">Sugar Content</label>
                <input type="number" placeholder="grams" value={sugar} onChange={(e) => setSugar(e.target.value)} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }} className="hud-font">Vitamins Profile</label>
                <input type="text" placeholder="e.g. Calcium, Niacin" value={vitamins} onChange={(e) => setVitamins(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
              <Plus size={14} /> Commit Entry to Database
            </button>
          </form>
        </div>

        {/* Server metrics activity logs */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <span className="hud-font" style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '16px' }}>
            MICROSERVICE TRAFFIC & CPU LOAD (%)
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, justifyContent: 'center' }}>
            {serverLoadHistory.map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  <span>Hour {item.hour}</span>
                  <span style={{ color: item.load > 80 ? 'var(--secondary)' : 'var(--accent)' }}>{item.load}% load</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    background: item.load > 80 ? 'var(--secondary)' : 'var(--accent)',
                    width: `${item.load}%`
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
