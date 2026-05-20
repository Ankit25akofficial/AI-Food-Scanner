import React, { useContext, useState } from 'react';
import { Calendar, Trash2, Plus, AlertCircle, Apple } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function HistoryPage() {
  const { meals, addMeal, deleteMeal } = useContext(AppContext);
  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Form states for manual logger
  const [showManualForm, setShowManualForm] = useState(false);
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [sugar, setSugar] = useState('');
  const [vitamins, setVitamins] = useState('');
  const [category, setCategory] = useState('Lunch');

  // Submit manual log
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!foodName || !calories) return;

    addMeal({
      name: foodName,
      calories: Number(calories),
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fats: Number(fats) || 0,
      sugar: Number(sugar) || 0,
      vitamins: vitamins || 'Vitamins standard',
      category: category
    });

    // Reset fields
    setFoodName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFats('');
    setSugar('');
    setVitamins('');
    setShowManualForm(false);
  };

  // Unique list of dates in the meals database to filter
  const dateOptions = Array.from(new Set(meals.map(m => m.date))).sort((a,b) => b.localeCompare(a));
  
  // Ensure today is always in the dropdown list
  const todayStr = new Date().toISOString().split('T')[0];
  if (!dateOptions.includes(todayStr)) {
    dateOptions.unshift(todayStr);
  }

  // Filtered meals
  const filteredMeals = meals.filter(m => {
    const dateMatch = m.date === selectedDate;
    const catMatch = filterCategory === 'All' || m.category === filterCategory;
    return dateMatch && catMatch;
  });

  // Calculate stats for selected day
  const totalCal = filteredMeals.reduce((s, m) => s + m.calories, 0);
  const totalProt = filteredMeals.reduce((s, m) => s + m.protein, 0);
  const totalCarb = filteredMeals.reduce((s, m) => s + m.carbs, 0);
  const totalFat = filteredMeals.reduce((s, m) => s + m.fats, 0);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span className="hud-font" style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>NUTRITIONAL LOG TIMELINE</span>
          <h2 style={{ fontSize: '28px', color: 'var(--text-primary)', marginTop: '4px' }}>Meal Ingestion <span className="glow-text">History</span></h2>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setShowManualForm(!showManualForm)}
        >
          <Plus size={16} /> {showManualForm ? 'Hide Logger' : 'Manual Entry'}
        </button>
      </div>

      {/* Manual Entry Modal Form */}
      {showManualForm && (
        <form onSubmit={handleManualSubmit} className="glass-panel animate-slide-up" style={{ padding: '24px', border: '1px solid var(--primary)' }}>
          <h3 className="hud-font" style={{ fontSize: '16px', color: 'var(--primary)', marginBottom: '16px' }}>MANUAL BIOMETRIC ENTRY REGISTER</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }} className="hud-font">Food Description</label>
              <input type="text" placeholder="e.g. Scrambled Eggs" value={foodName} onChange={(e) => setFoodName(e.target.value)} required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }} className="hud-font">Meal Slot</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }} className="hud-font">Calories (kcal)</label>
              <input type="number" placeholder="250" value={calories} onChange={(e) => setCalories(e.target.value)} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }} className="scanner-layout">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }} className="hud-font">Protein (g)</label>
              <input type="number" placeholder="15" value={protein} onChange={(e) => setProtein(e.target.value)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }} className="hud-font">Carbs (g)</label>
              <input type="number" placeholder="30" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }} className="hud-font">Fats (g)</label>
              <input type="number" placeholder="8" value={fats} onChange={(e) => setFats(e.target.value)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }} className="hud-font">Sugar (g)</label>
              <input type="number" placeholder="2" value={sugar} onChange={(e) => setSugar(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }} className="hud-font">Vitamins / Micro-nutrients</label>
              <input type="text" placeholder="e.g. Iron, Vitamin C" value={vitamins} onChange={(e) => setVitamins(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end', height: '42px' }}>
              Confirm & Log
            </button>
          </div>
        </form>
      )}

      {/* Filter and Date selection panel */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Calendar size={18} style={{ color: 'var(--primary)' }} />
          <select 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ padding: '6px 12px' }}
          >
            {dateOptions.map(d => (
              <option key={d} value={d}>
                {d === todayStr ? `Today (${d})` : d}
              </option>
            ))}
          </select>
        </div>

        {/* Category Toggles */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                borderRadius: '6px',
                border: '1px solid var(--card-border)',
                background: filterCategory === cat ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                color: filterCategory === cat ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Total Macros for Selected Day */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }} className="scanner-layout">
        <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }} className="hud-font">CALORIES</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '4px' }}>{totalCal} kcal</div>
        </div>
        <div className="glass-panel" style={{ padding: '16px', textAlign: 'center', borderBottom: '2px solid var(--primary)' }}>
          <div style={{ fontSize: '10px', color: 'var(--primary)' }} className="hud-font">PROTEIN</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '4px' }}>{totalProt}g</div>
        </div>
        <div className="glass-panel" style={{ padding: '16px', textAlign: 'center', borderBottom: '2px solid var(--accent)' }}>
          <div style={{ fontSize: '10px', color: 'var(--accent)' }} className="hud-font">CARBS</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '4px' }}>{totalCarb}g</div>
        </div>
        <div className="glass-panel" style={{ padding: '16px', textAlign: 'center', borderBottom: '2px solid var(--secondary)' }}>
          <div style={{ fontSize: '10px', color: 'var(--secondary)' }} className="hud-font">FATS</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '4px' }}>{totalFat}g</div>
        </div>
      </div>

      {/* Chronological List of Logged Items */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <span className="hud-font" style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '16px' }}>
          CHRONOLOGICAL LOG REGISTER
        </span>

        {filteredMeals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <Apple size={36} style={{ color: 'var(--card-border)', marginBottom: '12px', marginInline: 'auto' }} />
            <p style={{ fontSize: '13px' }}>No ingestion logs found matching these search criteria.</p>
            <p style={{ fontSize: '11px', marginTop: '4px' }}>Log foods via manual entry or the AI scanner.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredMeals.map((meal) => (
              <div 
                key={meal.id} 
                className="glass-panel glass-panel-hover" 
                style={{ 
                  padding: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  background: 'rgba(0,0,0,0.15)'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>{meal.name}</span>
                    <span className="hud-font" style={{ fontSize: '9px', padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      {meal.category}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', gap: '10px' }}>
                    <span>Logged at {meal.time}</span>
                    <span>•</span>
                    <span style={{ color: 'var(--accent)' }}>Vitamins: {meal.vitamins}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {/* Macros breakdown tags */}
                  <div style={{ display: 'flex', gap: '8px', fontSize: '11px' }} className="desktop-only-macros">
                    <span style={{ padding: '2px 6px', background: 'rgba(168, 85, 247, 0.05)', borderRadius: '4px', color: 'var(--primary)' }}>P: {meal.protein}g</span>
                    <span style={{ padding: '2px 6px', background: 'rgba(6, 182, 212, 0.05)', borderRadius: '4px', color: 'var(--accent)' }}>C: {meal.carbs}g</span>
                    <span style={{ padding: '2px 6px', background: 'rgba(236, 72, 153, 0.05)', borderRadius: '4px', color: 'var(--secondary)' }}>F: {meal.fats}g</span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '16px', color: 'var(--text-primary)' }}>{meal.calories} kcal</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }} className="hud-font">ENERGY VALUE</div>
                  </div>

                  <button 
                    onClick={() => deleteMeal(meal.id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px', transition: 'var(--transition)' }}
                    title="Delete log"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 600px) {
          .desktop-only-macros {
            display: none !important;
          }
        }
      `}</style>

    </div>
  );
}
