import React, { useContext } from 'react';
import { Camera, Check, Calendar } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import HologramScanner from '../components/HologramScanner';

export default function ScannerPage() {
  const { addMeal, meals } = useContext(AppContext);

  // Filter meals logged today
  const todayStr = new Date().toISOString().split('T')[0];
  const todayMeals = meals.filter(m => m.date === todayStr);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Page Title */}
      <div>
        <span className="hud-font" style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>NEURAL RECOGNITION INTERFACE</span>
        <h2 style={{ fontSize: '28px', color: 'var(--text-primary)', marginTop: '4px' }}>
          AI Food & Barcode <span className="glow-text">Scanner</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          Upload high-resolution food images, point the camera, or input raw barcodes. The AURA vision analyzer parses nutrition facts in real-time.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }} className="scanner-layout">
        {/* Hologram Scanner */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <HologramScanner onAddMeal={addMeal} />
        </div>

        {/* Quick Session Summary */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span className="hud-font" style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} /> SESSION LOGS TODAY
          </span>

          {todayMeals.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '160px', color: 'var(--text-muted)', fontSize: '12px', border: '1px dashed var(--card-border)', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
              No meals logged today yet. Scan food to initialize intake log.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
              {todayMeals.map((meal) => (
                <div key={meal.id} className="glass-panel" style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>{meal.name}</span>
                    <span className="hud-font" style={{ fontSize: '9px', padding: '2px 4px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                      {meal.category}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    <span>{meal.time}</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{meal.calories} kcal</span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', fontSize: '10px', borderTop: '1px solid rgba(255,255,255,0.02)', paddingTop: '4px', color: 'var(--text-muted)' }}>
                    <span>P: {meal.protein}g</span>
                    <span>•</span>
                    <span>C: {meal.carbs}g</span>
                    <span>•</span>
                    <span>F: {meal.fats}g</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick confirmation tip */}
          {todayMeals.length > 0 && (
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)', padding: '8px', borderRadius: '6px' }}>
              <Check size={14} style={{ color: '#10b981' }} />
              <span>Calorie indices automatically updated on the main dashboard.</span>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
