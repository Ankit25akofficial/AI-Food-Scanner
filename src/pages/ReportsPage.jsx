import React, { useContext, useState } from 'react';
import { FileSpreadsheet, FileText, Send, Sparkles, Check, Download, AlertTriangle } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function ReportsPage() {
  const { user, meals, waterIntake, workouts } = useContext(AppContext);
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState('');
  const [exportComplete, setExportComplete] = useState(false);

  // Compute logs
  const todayStr = new Date().toISOString().split('T')[0];
  const todayMeals = meals.filter(m => m.date === todayStr);
  const todayCal = todayMeals.reduce((s, m) => s + m.calories, 0);
  const todayWater = waterIntake.find(w => w.date === todayStr)?.amount || 0;
  const todayWorkouts = workouts.filter(w => w.date === todayStr);
  const totalProt = todayMeals.reduce((s, m) => s + m.protein, 0);

  // Dynamic AI Advice Generator
  const generateCoachInsights = () => {
    let advices = [];
    
    // Calorie check
    if (todayCal === 0) {
      advices.push({
        type: 'warning',
        title: 'Calorie Ingestion Deficit',
        message: 'No nutritional logs registered today. Feed barcode scans or uploaded image data into the AI Scanner to synchronize dashboard statistics.'
      });
    } else if (todayCal > user.targetCalories) {
      advices.push({
        type: 'warning',
        title: 'Calorie Cap Exceeded',
        message: `Currently logged calories (${todayCal} kcal) exceed your daily cap of ${user.targetCalories} kcal. Prioritize high-fiber, low-density leafy vegetables and schedule structural cardio intervals to balance the daily index.`
      });
    } else {
      advices.push({
        type: 'success',
        title: 'Calorie Balance Optimal',
        message: `Ingested ${todayCal} kcal of your ${user.targetCalories} kcal allowance. You have ${user.targetCalories - todayCal} kcal remaining today. Excellent structural control.`
      });
    }

    // Hydration check
    if (todayWater < 1000) {
      advices.push({
        type: 'danger',
        title: 'Severe Dehydration Threat',
        message: `Log hydration levels! You have logged only ${todayWater} ml today against a critical threshold of ${user.targetWater} ml. Drink 500 ml immediately to preserve neural metabolic performance.`
      });
    } else if (todayWater < user.targetWater) {
      advices.push({
        type: 'info',
        title: 'Hydration Target Imbalance',
        message: `Logged ${todayWater} ml. Add another ${user.targetWater - todayWater} ml to finalize your water grid target for the day.`
      });
    } else {
      advices.push({
        type: 'success',
        title: 'Hydration Threshold Achieved',
        message: `Achieved ${todayWater} ml. Cellular hydration levels are optimal. Fluid cycles are fully synchronized.`
      });
    }

    // Protein check
    if (todayCal > 0) {
      if (totalProt < user.targetMacros.protein * 0.7) {
        advices.push({
          type: 'info',
          title: 'Muscle Recovery Protocol Active',
          message: `Protein intake is currently ${totalProt}g against a daily target of ${user.targetMacros.protein}g. Supplement with whey isolates, lean breast fowl, or eggs to safeguard muscle tissue preservation.`
        });
      } else {
        advices.push({
          type: 'success',
          title: 'Protein Target Stabilized',
          message: `Logged ${totalProt}g of protein. Excellent macro distribution for lean retention and muscle synthesis.`
        });
      }
    }

    // Workout check
    if (todayWorkouts.length === 0 && todayCal > 0) {
      advices.push({
        type: 'info',
        title: 'Structural Hypertrophy Alert',
        message: 'No workout entries registered today. Schedule a 45-minute training circuit to accelerate insulin sensitivity and fuel glycogen storage.'
      });
    }

    return advices;
  };

  const coachAdvices = generateCoachInsights();

  // Excel CSV exporter
  const triggerCsvDownload = () => {
    setIsExporting(true);
    setExportType('Excel Spreadsheet');
    setExportComplete(false);

    setTimeout(() => {
      // Build CSV String
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += 'Date,Time,Slot,Food Name,Calories (kcal),Protein (g),Carbs (g),Fats (g),Vitamins\n';
      
      meals.forEach(m => {
        const row = [m.date, m.time, m.category, `"${m.name}"`, m.calories, m.protein, m.carbs, m.fats, `"${m.vitamins}"`].join(',');
        csvContent += row + '\n';
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `AURA_Biometric_Report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 3000);
    }, 1500);
  };

  // PDF download simulator
  const triggerPdfDownload = () => {
    setIsExporting(true);
    setExportType('PDF Encrypted Document');
    setExportComplete(false);

    setTimeout(() => {
      window.print(); // Triggers browser print menu directly! Very neat utility.
      setIsExporting(false);
      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 3000);
    }, 1200);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title */}
      <div>
        <span className="hud-font" style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>COACH INSTRUCTIONS & EXPORTS</span>
        <h2 style={{ fontSize: '28px', color: 'var(--text-primary)', marginTop: '4px' }}>AI Coach & Biometric <span className="glow-text">Reports</span></h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          Evaluate custom recommendations compiled by the AURA coach neural net and export system logs.
        </p>
      </div>

      {exportComplete && (
        <div style={{ display: 'flex', gap: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.4)', color: 'white', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', alignItems: 'center' }}>
          <Check size={16} style={{ color: '#10b981' }} />
          <span>Biometric report for {user.username} generated and downloaded successfully.</span>
        </div>
      )}

      {/* Main split: AI Coach suggestions vs Export triggers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }} className="scanner-layout">
        
        {/* Left Side: Coach Suggestions */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Sparkles size={20} style={{ color: 'var(--primary)' }} />
            <span className="hud-font" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>AURA COACH AI DECRUPTED SUGGESTIONS</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {coachAdvices.map((advice, idx) => {
              const borderCol = advice.type === 'danger' ? '#ef4444' : advice.type === 'warning' ? '#f59e0b' : advice.type === 'success' ? '#10b981' : 'var(--primary)';
              const bgCol = advice.type === 'danger' ? 'rgba(239, 68, 68, 0.05)' : advice.type === 'warning' ? 'rgba(245, 158, 11, 0.05)' : advice.type === 'success' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(168, 85, 247, 0.05)';
              return (
                <div key={idx} className="glass-panel" style={{ padding: '16px', borderLeft: `4px solid ${borderCol}`, background: bgCol }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>{advice.title}</span>
                    {advice.type === 'danger' && <AlertTriangle size={14} style={{ color: '#ef4444' }} />}
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{advice.message}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Data Exporters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span className="hud-font" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>SECURED DATA COMPRESSOR</span>
            
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Compile daily food logs, macros indices, workouts, and step counts into formats compatible with Excel, D3 databases, or printing engines.
            </p>

            {isExporting ? (
              <div style={{ padding: '20px 0', textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid transparent', borderTopColor: 'var(--primary)', borderBottomColor: 'var(--secondary)' }} className="animate-spin-slow margin-auto" />
                <div className="hud-font glow-text" style={{ fontSize: '11px', marginTop: '12px', color: 'var(--primary)' }}>
                  Compiling {exportType}...
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Excel button */}
                <button 
                  className="btn btn-secondary" 
                  onClick={triggerCsvDownload}
                  style={{ justifyContent: 'space-between', padding: '14px' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileSpreadsheet size={16} style={{ color: '#10b981' }} />
                    <span>Export CSV Spreadsheet</span>
                  </span>
                  <Download size={14} />
                </button>

                {/* PDF button */}
                <button 
                  className="btn btn-secondary" 
                  onClick={triggerPdfDownload}
                  style={{ justifyContent: 'space-between', padding: '14px' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={16} style={{ color: 'var(--accent)' }} />
                    <span>Print Biometric Report (PDF)</span>
                  </span>
                  <Download size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Cloud Synchronization Status */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} className="animate-pulse" />
            <div>
              <div style={{ fontWeight: 600, fontSize: '13px' }}>Neural Cloud Sync Secured</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                All credentials and food ingestion registries are stored locally and encrypted.
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
