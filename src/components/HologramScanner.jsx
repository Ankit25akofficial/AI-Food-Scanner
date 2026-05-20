import React, { useState, useEffect, useRef, useContext } from 'react';
import { Camera, Upload, Search, Barcode, Flame, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { analyzeFoodImage, analyzeFoodText } from '../utils/gemini';

export default function HologramScanner({ onAddMeal }) {
  const { simulateBarcodeScan, parseMealText, foodBank } = useContext(AppContext);

  // States
  const [scanMode, setScanMode] = useState('camera'); // 'camera' | 'upload' | 'barcode' | 'text'
  const [isStreaming, setIsStreaming] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState(null);
  
  // Input fields
  const [barcodeInput, setBarcodeInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [selectedMockFile, setSelectedMockFile] = useState('2'); // default: Grilled Chicken Breast
  const [uploadedImage, setUploadedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [pendingFileItem, setPendingFileItem] = useState(null);
  const [scanError, setScanError] = useState(null);

  // Refs
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Stop camera feed when changing modes or unmounting
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [scanMode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const constraints = { video: { width: 640, height: 480, facingMode: 'environment' } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.warn('Webcam not accessible:', err);
      setCameraError('Webcam not accessible. Running simulated scanner.');
      setIsStreaming(true); // fall-back simulation
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  };

  // Triggers the holographic scanning animation
  const runScanningAnimation = (callbackData) => {
    setIsScanning(true);
    setScanResult(null);
    setScanProgress(0);

    const duration = 2500; // 2.5s analysis
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setScanProgress(Math.min(100, Math.round((step / steps) * 100)));

      if (step >= steps) {
        clearInterval(timer);
        setIsScanning(false);
        setScanResult(callbackData);
      }
    }, intervalTime);
  };

  // Upload/Vision Sim
  const handleMockUploadScan = () => {
    // Locate match in foodBank
    const foodItem = foodBank.find(f => f.id === selectedMockFile) || foodBank[0];
    
    // Create random mock image for preview
    const foodImages = {
      '1': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400', // Salad
      '2': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=400', // Chicken
      '3': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400', // Salmon
      '4': 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=400', // Protein Shake
      '5': 'https://images.unsplash.com/photo-1517881917430-e70dfb3610aa?auto=format&fit=crop&q=80&w=400', // Oatmeal
      '6': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400', // Yogurt
      '7': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400', // Burger
      '8': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=400', // Banana
    };

    setUploadedImage(foodImages[selectedMockFile]);
    
    runScanningAnimation({
      ...foodItem,
      confidence: Math.round(85 + Math.random() * 14),
      source: 'AI Computer Vision'
    });
  };

  // Real file uploader listener
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setUploadedImage(uploadEvent.target.result);
        setScanResult(null); // Clear previous results on new upload
        
        // Smarter simulated matching based on filename keywords!
        let matchedItem = null;
        if (fileName.includes('burger') || fileName.includes('hamburger') || fileName.includes('cheese') || fileName.includes('beef') || fileName.includes('patty')) {
          matchedItem = foodBank.find(f => f.id === '7'); // Double Cheeseburger
        } else if (fileName.includes('chicken') || fileName.includes('poultry') || fileName.includes('breast')) {
          matchedItem = foodBank.find(f => f.id === '2'); // Grilled Chicken Breast
        } else if (fileName.includes('salad') || fileName.includes('avocado') || fileName.includes('green') || fileName.includes('veg')) {
          matchedItem = foodBank.find(f => f.id === '1'); // Avocado Salad
        } else if (fileName.includes('salmon') || fileName.includes('fish') || fileName.includes('fillet')) {
          matchedItem = foodBank.find(f => f.id === '3'); // Salmon Fillet
        } else if (fileName.includes('shake') || fileName.includes('protein') || fileName.includes('whey')) {
          matchedItem = foodBank.find(f => f.id === '4'); // Whey Protein Shake
        } else if (fileName.includes('oat') || fileName.includes('porridge') || fileName.includes('berry') || fileName.includes('berries')) {
          matchedItem = foodBank.find(f => f.id === '5'); // Oatmeal Bowl
        } else if (fileName.includes('yogurt') || fileName.includes('curd') || fileName.includes('greek')) {
          matchedItem = foodBank.find(f => f.id === '6'); // Greek Yogurt Bowl
        } else if (fileName.includes('banana') || fileName.includes('yellow') || fileName.includes('fruit')) {
          matchedItem = foodBank.find(f => f.id === '8'); // Golden Banana
        } else if (fileName.includes('fries') || fileName.includes('french') || fileName.includes('potato') || fileName.includes('chips')) {
          matchedItem = foodBank.find(f => f.id === '9'); // French Fries
        }

        // Fallback to random if no keyword matches
        if (!matchedItem) {
          matchedItem = foodBank[Math.floor(Math.random() * foodBank.length)];
        }

        setPendingFileItem({
          ...matchedItem,
          confidence: Math.round(88 + Math.random() * 10),
          source: 'AI Neural Analyzer'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadScanExecute = async () => {
    if (!uploadedImage) return;

    setIsScanning(true);
    setScanResult(null);
    setScanProgress(0);
    setScanError(null);

    let animationDone = false;
    let apiData = null;

    const duration = 2500;
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setScanProgress(Math.min(100, Math.round((step / steps) * 100)));
      if (step >= steps) {
        clearInterval(timer);
        animationDone = true;
        checkCompletion();
      }
    }, intervalTime);

    try {
      apiData = await analyzeFoodImage(uploadedImage);
    } catch (err) {
      console.warn("Real Gemini analysis failed, using high-fidelity fallback:", err);
      setScanError(err.message || "API connection failed");
      apiData = pendingFileItem || foodBank[Math.floor(Math.random() * foodBank.length)];
    }

    function checkCompletion() {
      if (animationDone && apiData) {
        setIsScanning(false);
        setScanResult(apiData);
        setPendingFileItem(null);
      }
    }

    checkCompletion();
  };

  // Barcode Submission
  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    if (!barcodeInput) return;

    simulateBarcodeScan(barcodeInput).then(item => {
      runScanningAnimation({
        ...item,
        confidence: 100,
        source: 'Global Barcode Registry'
      });
    });
  };

  const handleQuickBarcodeClick = (code) => {
    setBarcodeInput(code);
    simulateBarcodeScan(code).then(item => {
      runScanningAnimation({
        ...item,
        confidence: 100,
        source: 'Global Barcode Registry'
      });
    });
  };

  // Text Prompt Analyzer
  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!textInput) return;

    setIsScanning(true);
    setScanResult(null);
    setScanProgress(0);
    setScanError(null);

    let animationDone = false;
    let apiData = null;

    const duration = 2000;
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setScanProgress(Math.min(100, Math.round((step / steps) * 100)));
      if (step >= steps) {
        clearInterval(timer);
        animationDone = true;
        checkCompletion();
      }
    }, intervalTime);

    try {
      apiData = await analyzeFoodText(textInput);
    } catch (err) {
      console.warn("Gemini text analysis failed, using fallback:", err);
      setScanError(err.message || "API connection failed");
      const analyzedItem = parseMealText(textInput);
      apiData = {
        ...analyzedItem,
        confidence: 90,
        source: 'AURA NLP Estimator'
      };
    }

    function checkCompletion() {
      if (animationDone && apiData) {
        setIsScanning(false);
        setScanResult(apiData);
      }
    }

    checkCompletion();
  };

  // Helper to extract current frame from active webcam stream
  const captureCameraFrame = () => {
    if (!videoRef.current) return null;
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg');
    } catch (e) {
      console.warn("Could not capture frame from video stream:", e);
      return null;
    }
  };

  // Live Camera Scan Trigger
  const handleCameraSnap = async () => {
    let capturedDataUrl = null;
    if (isStreaming) {
      capturedDataUrl = captureCameraFrame();
    }

    if (capturedDataUrl) {
      setUploadedImage(capturedDataUrl);
    }

    setIsScanning(true);
    setScanResult(null);
    setScanProgress(0);
    setScanError(null);

    let animationDone = false;
    let apiData = null;

    const duration = 2500;
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setScanProgress(Math.min(100, Math.round((step / steps) * 100)));
      if (step >= steps) {
        clearInterval(timer);
        animationDone = true;
        checkCompletion();
      }
    }, intervalTime);

    try {
      if (capturedDataUrl) {
        apiData = await analyzeFoodImage(capturedDataUrl);
      } else {
        throw new Error("No video stream active to capture frame");
      }
    } catch (err) {
      console.warn("Gemini camera analysis failed, using fallback:", err);
      setScanError(err.message || "API connection failed");
      const randomItem = foodBank[Math.floor(Math.random() * foodBank.length)];
      apiData = {
        ...randomItem,
        confidence: Math.round(92 + Math.random() * 7),
        source: 'Live Vision Frame Capture'
      };
    }

    function checkCompletion() {
      if (animationDone && apiData) {
        setIsScanning(false);
        setScanResult(apiData);
      }
    }

    checkCompletion();
  };

  const [mealCategory, setMealCategory] = useState('Lunch');

  const handleLogConfirm = () => {
    if (!scanResult) return;
    onAddMeal({
      name: scanResult.name,
      calories: scanResult.calories,
      protein: scanResult.protein,
      carbs: scanResult.carbs,
      fats: scanResult.fats,
      sugar: scanResult.sugar || 5,
      vitamins: scanResult.vitamins,
      category: mealCategory
    });
    setScanResult(null);
    setUploadedImage(null);
    setTextInput('');
    setBarcodeInput('');
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', overflow: 'hidden' }}>
      {/* AI Vision Sub-Banner */}
      <div style={{ 
        background: 'rgba(168, 85, 247, 0.05)', 
        border: '1px solid rgba(168, 85, 247, 0.15)', 
        borderRadius: '8px', 
        padding: '12px 16px', 
        marginBottom: '20px',
        fontSize: '13px',
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'var(--primary)',
          boxShadow: '0 0 8px var(--primary-glow)'
        }} className="animate-pulse" />
        <div>
          <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-hud)', letterSpacing: '0.5px' }}>AURA.AI VISION ENGINE ACTIVE:</strong> Upload an image or use the camera. The AI will scan the frame, detect food contours, and extract the macro breakdown.
        </div>
      </div>

      {scanError && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          padding: '10px 14px',
          marginBottom: '20px',
          fontSize: '12px',
          color: '#f87171',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={14} style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ fontFamily: 'var(--font-hud)', letterSpacing: '0.5px' }}>API STATUS WARNING:</strong> {scanError}. Using offline local database fallback.
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button 
          className={`btn ${scanMode === 'camera' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => { setScanMode('camera'); setScanResult(null); }}
        >
          <Camera size={16} /> Live Scanner
        </button>
        <button 
          className={`btn ${scanMode === 'upload' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => { setScanMode('upload'); setScanResult(null); }}
        >
          <Upload size={16} /> Food Photo
        </button>
        <button 
          className={`btn ${scanMode === 'barcode' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => { setScanMode('barcode'); setScanResult(null); }}
        >
          <Barcode size={16} /> Barcode Scan
        </button>
        <button 
          className={`btn ${scanMode === 'text' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => { setScanMode('text'); setScanResult(null); }}
        >
          <Search size={16} /> AI Text Log
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', minHeight: '340px' }} className="scanner-layout">
        {/* Left Side: Scan Frame */}
        <div style={{ 
          position: 'relative', 
          background: 'rgba(0,0,0,0.4)', 
          borderRadius: '12px', 
          border: '1px solid var(--card-border)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '340px'
        }}>
          {scanMode === 'camera' && (
            <>
              {isStreaming ? (
                <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {cameraError ? (
                    <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', gap: '8px', padding: '10px', background: 'rgba(234, 179, 8, 0.15)', border: '1px solid var(--primary)', borderRadius: '6px', fontSize: '11px', zIndex: 10 }}>
                      <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{cameraError}</span>
                    </div>
                  ) : null}
                  
                  {videoRef.current ? (
                    <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    // Mock graphic simulator if browser block camera
                    <div className="animate-spin-slow" style={{ width: '120px', height: '120px', borderRadius: '50%', border: '2px dashed var(--primary)', margin: 'auto' }} />
                  )}

                  {/* High Tech Scanner Brackets */}
                  <div style={{ position: 'absolute', top: '15px', left: '15px', width: '20px', height: '20px', borderTop: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)' }}></div>
                  <div style={{ position: 'absolute', top: '15px', right: '15px', width: '20px', height: '20px', borderTop: '2px solid var(--primary)', borderRight: '2px solid var(--primary)' }}></div>
                  <div style={{ position: 'absolute', bottom: '15px', left: '15px', width: '20px', height: '20px', borderBottom: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)' }}></div>
                  <div style={{ position: 'absolute', bottom: '15px', right: '15px', width: '20px', height: '20px', borderBottom: '2px solid var(--primary)', borderRight: '2px solid var(--primary)' }}></div>

                  {/* Pulsing Target Overlay */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '160px', height: '160px', borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '1px dashed var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="animate-spin-slow">
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent)' }} />
                    </div>
                  </div>

                  {/* Scanning Laser Line */}
                  <div style={{ 
                    position: 'absolute', 
                    left: 0, 
                    right: 0, 
                    height: '2px', 
                    background: 'linear-gradient(90deg, transparent, var(--primary), transparent)', 
                    boxShadow: '0 0 12px var(--primary)',
                    animation: 'laser-scan 4s infinite linear',
                    pointerEvents: 'none'
                  }}></div>

                  {/* Bounding Box during Live Scan simulation */}
                  {isScanning && (
                    <div style={{
                      position: 'absolute',
                      top: '30%',
                      left: '25%',
                      width: '50%',
                      height: '40%',
                      border: '2px dashed var(--primary)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: 'pulse 1s infinite',
                      pointerEvents: 'none',
                      zIndex: 8
                    }}>
                      <div className="hud-font" style={{ fontSize: '10px', color: 'var(--primary)', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '4px' }}>
                        ACQUIRING NEURAL TARGET...
                      </div>
                    </div>
                  )}

                  {!isScanning && scanResult && (
                    <div style={{
                      position: 'absolute',
                      top: '30%',
                      left: '25%',
                      width: '50%',
                      height: '40%',
                      border: '2px solid var(--accent)',
                      boxShadow: '0 0 15px var(--accent-glow)',
                      borderRadius: '8px',
                      animation: 'pulse 2s infinite',
                      pointerEvents: 'none',
                      zIndex: 8
                    }}>
                      <div className="hud-font" style={{
                        position: 'absolute',
                        top: '-20px',
                        left: '-2px',
                        padding: '1px 6px',
                        background: 'var(--accent)',
                        color: 'black',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        borderRadius: '2px'
                      }}>
                        {scanResult.name.toUpperCase()} ({scanResult.confidence}%)
                      </div>
                    </div>
                  )}

                  <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 10 }}>
                    <button className="btn btn-primary" onClick={handleCameraSnap} disabled={isScanning}>
                      <Camera size={14} /> Snap & Scan
                    </button>
                    <button className="btn btn-secondary" onClick={stopCamera}>
                      Stop Feed
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Camera size={48} style={{ color: 'var(--primary)', marginBottom: '12px' }} />
                  <h4>Holographic Camera Stream</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '8px 0 16px' }}>
                    Initiate neural network camera scan of items.
                  </p>
                  <button className="btn btn-primary" onClick={startCamera}>
                    Activate Scanner
                  </button>
                </div>
              )}
            </>
          )}

          {scanMode === 'upload' && (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              {uploadedImage ? (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '8px', overflow: 'hidden' }}>
                    <img src={uploadedImage} alt="Scanning preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {isScanning && (
                      <>
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9 }}>
                          <div style={{ textAlign: 'center' }}>
                            <div className="hud-font glow-text" style={{ fontSize: '14px', marginBottom: '8px' }}>Analyzing Matrix...</div>
                            <div style={{ width: '120px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', background: 'var(--primary)', width: `${scanProgress}%`, transition: 'width 0.1s ease' }} />
                            </div>
                          </div>
                        </div>
                        <div style={{ 
                          position: 'absolute', 
                          left: 0, 
                          right: 0, 
                          height: '2px', 
                          background: 'linear-gradient(90deg, transparent, var(--secondary), transparent)', 
                          boxShadow: '0 0 10px var(--secondary-glow)',
                          animation: 'laser-scan 2.5s infinite linear',
                          pointerEvents: 'none',
                          zIndex: 9
                        }}></div>
                      </>
                    )}

                    {!isScanning && scanResult && (
                      <div style={{
                        position: 'absolute',
                        top: '25%',
                        left: '20%',
                        width: '60%',
                        height: '55%',
                        border: '2.5px solid var(--accent)',
                        boxShadow: '0 0 20px var(--accent-glow)',
                        borderRadius: '8px',
                        pointerEvents: 'none',
                        animation: 'pulse 2s infinite',
                        zIndex: 8
                      }}>
                        <div className="hud-font" style={{
                          position: 'absolute',
                          top: '-22px',
                          left: '-2px',
                          padding: '2px 8px',
                          background: 'var(--accent)',
                          color: '#000000',
                          fontSize: '10px',
                          fontWeight: 800,
                          borderRadius: '4px 4px 0 0',
                          letterSpacing: '1px'
                        }}>
                          {scanResult.name.toUpperCase()} : {scanResult.confidence}% MATCH
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Action row when preview is loaded but not yet scanned */}
                  {!isScanning && !scanResult && pendingFileItem && (
                    <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                      <button className="btn btn-primary" onClick={handleUploadScanExecute} style={{ flex: 1, justifyContent: 'center' }}>
                        <Flame size={16} className="animate-pulse" /> SCAN WITH AI
                      </button>
                      <button className="btn btn-secondary" onClick={() => { setUploadedImage(null); setPendingFileItem(null); }} style={{ padding: '10px' }}>
                        Clear
                      </button>
                    </div>
                  )}

                  {/* Reset option if scan is finished */}
                  {scanResult && (
                    <button className="btn btn-secondary" onClick={() => { setUploadedImage(null); setScanResult(null); setPendingFileItem(null); }} style={{ width: '100%', justifyContent: 'center' }}>
                      Upload Another Image
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', width: '100%' }}>
                  <Upload size={40} style={{ color: 'var(--accent)', marginBottom: '12px' }} />
                  <h4>Food Image Recognition</h4>
                  
                  <div style={{ margin: '15px 0' }}>
                    <label className="btn btn-secondary" style={{ display: 'inline-flex', cursor: 'pointer' }}>
                      <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                      Choose Local Image
                    </label>
                  </div>

                  <div style={{ height: '1px', background: 'var(--card-border)', margin: '16px auto', width: '80%' }}></div>
                  
                  {/* Mock tester selector */}
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }} className="hud-font">
                    Or select mockup sample food:
                  </span>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'center' }}>
                    <select 
                      value={selectedMockFile} 
                      onChange={(e) => setSelectedMockFile(e.target.value)}
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      <option value="1">Avocado Salad</option>
                      <option value="2">Grilled Chicken Breast</option>
                      <option value="3">Salmon Fillet</option>
                      <option value="4">Whey Protein Shake</option>
                      <option value="5">Oatmeal Bowl with Berries</option>
                      <option value="6">Greek Yogurt Bowl</option>
                      <option value="7">Double Cheeseburger</option>
                      <option value="8">Banana</option>
                    </select>
                    <button className="btn btn-primary" onClick={handleMockUploadScan} style={{ padding: '6px 12px', fontSize: '12px' }}>
                      Analyze Sample
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {scanMode === 'barcode' && (
            <form onSubmit={handleBarcodeSubmit} style={{ padding: '30px', textAlign: 'center', width: '100%' }}>
              <Barcode size={48} style={{ color: 'var(--primary)', marginBottom: '16px', marginInline: 'auto' }} />
              <h4>Input Barcode</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '8px 0 16px' }}>
                Search using a numeric UPC.
              </p>
              
              <div style={{ display: 'flex', gap: '8px', maxWidth: '300px', marginInline: 'auto' }}>
                <input 
                  type="text" 
                  placeholder="e.g. 737622440022" 
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px' }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>
                  Scan
                </button>
              </div>

              <div style={{ marginTop: '24px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  QUICK DEMO SHORTCUTS:
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button 
                    type="button" 
                    onClick={() => handleQuickBarcodeClick('737622440022')}
                    style={{
                      background: 'rgba(168, 85, 247, 0.08)',
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      fontSize: '11px',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    🍗 Chicken Breast
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleQuickBarcodeClick('012000000133')}
                    style={{
                      background: 'rgba(168, 85, 247, 0.08)',
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      fontSize: '11px',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    🐟 Salmon Fillet
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleQuickBarcodeClick('028400070566')}
                    style={{
                      background: 'rgba(168, 85, 247, 0.08)',
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      fontSize: '11px',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    🥤 Protein Shake
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleQuickBarcodeClick('123456789012')}
                    style={{
                      background: 'rgba(168, 85, 247, 0.08)',
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      fontSize: '11px',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    🍔 Cheeseburger
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleQuickBarcodeClick('011111222223')}
                    style={{
                      background: 'rgba(168, 85, 247, 0.08)',
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      fontSize: '11px',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    🍟 French Fries
                  </button>
                </div>
              </div>
            </form>
          )}

          {scanMode === 'text' && (
            <form onSubmit={handleTextSubmit} style={{ padding: '24px', width: '100%', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <Search size={32} style={{ color: 'var(--accent)', marginBottom: '8px' }} />
                <h4>Smart NLP Estimator</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                  Describe your meal in natural language.
                </p>
              </div>

              <textarea 
                rows="3"
                placeholder="e.g., '2 eggs, a slice of toast, and a cup of oatmeal'"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                style={{ width: '100%', resize: 'none', marginBottom: '12px' }}
              />

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Deconstruct Meal
              </button>
            </form>
          )}

          {isScanning && scanMode !== 'upload' && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '3px solid transparent', borderTopColor: 'var(--primary)', borderBottomColor: 'var(--secondary)' }} className="animate-spin-slow" />
              <span className="hud-font glow-text" style={{ marginTop: '12px', fontSize: '14px', color: 'var(--primary)' }}>
                AI Analysis Progress: {scanProgress}%
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Log / Analyzer Results */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {scanResult ? (
            <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="hud-font" style={{ fontSize: '10px', padding: '2px 6px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid var(--accent)', color: 'var(--accent)', borderRadius: '4px' }}>
                      {scanResult.source}
                    </span>
                    <h3 style={{ marginTop: '6px', fontSize: '20px', color: 'var(--text-primary)' }}>{scanResult.name}</h3>
                    
                    {/* Identification Correction Dropdown */}
                    <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Wrong item?</span>
                      <select 
                        value={scanResult.id || ''}
                        onChange={(e) => {
                          const corrected = foodBank.find(f => f.id === e.target.value);
                          if (corrected) {
                            setScanResult({
                              ...scanResult,
                              ...corrected,
                              name: corrected.name,
                              id: corrected.id
                            });
                          }
                        }}
                        style={{ padding: '2px 6px', fontSize: '10px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid var(--card-border)', borderRadius: '4px', color: 'var(--text-secondary)' }}
                      >
                        <option value="" disabled>Correct match...</option>
                        {foodBank.map(f => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {scanResult.confidence && (
                    <div style={{ textAlign: 'right' }}>
                      <div className="hud-font" style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary)' }}>{scanResult.confidence}%</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>CONFIDENCE</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Nutrition breakdown cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)' }} className="hud-font">CALORIES</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '4px' }}>{scanResult.calories}</div>
                  <div style={{ fontSize: '8px', color: 'var(--text-muted)' }}>kcal</div>
                </div>
                <div style={{ background: 'rgba(168, 85, 247, 0.05)', padding: '10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(168, 85, 247, 0.1)' }}>
                  <div style={{ fontSize: '9px', color: 'var(--primary)' }} className="hud-font">PROTEIN</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '4px' }}>{scanResult.protein}g</div>
                  <div style={{ fontSize: '8px', color: 'var(--text-muted)' }}>{Math.round(scanResult.protein * 4)} kcal</div>
                </div>
                <div style={{ background: 'rgba(6, 182, 212, 0.05)', padding: '10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(6, 182, 212, 0.1)' }}>
                  <div style={{ fontSize: '9px', color: 'var(--accent)' }} className="hud-font">CARBS</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '4px' }}>{scanResult.carbs}g</div>
                  <div style={{ fontSize: '8px', color: 'var(--text-muted)' }}>{Math.round(scanResult.carbs * 4)} kcal</div>
                </div>
                <div style={{ background: 'rgba(236, 72, 153, 0.05)', padding: '10px', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(236, 72, 153, 0.1)' }}>
                  <div style={{ fontSize: '9px', color: 'var(--secondary)' }} className="hud-font">FATS</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '4px' }}>{scanResult.fats}g</div>
                  <div style={{ fontSize: '8px', color: 'var(--text-muted)' }}>{Math.round(scanResult.fats * 9)} kcal</div>
                </div>
              </div>

              {/* Extra Details */}
              <div className="glass-panel" style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Sugar Content:</span>
                  <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>{scanResult.sugar || 5}g</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Detected Vitamins & Minerals:</span>
                  <span style={{ color: 'var(--accent)', textAlign: 'right' }}>{scanResult.vitamins || 'B-Complex, Iron'}</span>
                </div>
              </div>

              {/* Log options */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }} className="hud-font">Meal Category</label>
                  <select 
                    value={mealCategory} 
                    onChange={(e) => setMealCategory(e.target.value)}
                    style={{ width: '100%', padding: '6px 10px', fontSize: '12px' }}
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '8px', paddingTop: '18px' }}>
                  <button className="btn btn-secondary" onClick={() => { setScanResult(null); setUploadedImage(null); }} style={{ padding: '8px' }}>
                    <RefreshCw size={16} />
                  </button>
                  <button className="btn btn-primary" onClick={handleLogConfirm}>
                    <Check size={16} /> Log Meal
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
              <Flame size={32} style={{ color: 'var(--card-border)', marginBottom: '8px', marginInline: 'auto' }} />
              <p style={{ fontSize: '13px' }}>Awaiting neural food data feed.</p>
              <p style={{ fontSize: '11px', marginTop: '4px' }}>
                Use one of the scanner modes on the left to capture nutrition details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
