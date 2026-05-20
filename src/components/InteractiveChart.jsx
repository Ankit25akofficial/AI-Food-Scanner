import React, { useState, useEffect, useRef } from 'react';

export default function InteractiveChart({ 
  type = 'line', 
  data = [], 
  xKey = 'date', 
  yKey = 'value', 
  targetValue = null, 
  color = 'var(--primary)',
  glowColor = 'var(--primary-glow)',
  height = 200
}) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(300);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const handleResize = () => {
      setWidth(containerRef.current.clientWidth);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Slight delay to ensure parent containers have calculated sizes
    const timer = setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  if (!data || data.length === 0) {
    return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No Data Available</div>;
  }

  // Padding inside the SVG
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Max and min calculation
  const yValues = data.map(d => Number(d[yKey]) || 0);
  let maxY = Math.max(...yValues, 100);
  if (targetValue) maxY = Math.max(maxY, targetValue);
  
  // Padding on top of max value so line doesn't clip
  maxY = maxY * 1.15;
  const minY = Math.min(...yValues, 0) * 0.9;

  // Conversion coordinates helper
  const getX = (index) => {
    if (data.length <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (index / (data.length - 1)) * chartWidth;
  };

  const getY = (val) => {
    const scale = chartHeight / (maxY - minY);
    return paddingTop + chartHeight - (val - minY) * scale;
  };

  // Generate SVG Path for Line Chart
  const getLinePath = () => {
    let path = '';
    data.forEach((d, i) => {
      const x = getX(i);
      const y = getY(d[yKey]);
      if (i === 0) path += `M ${x} ${y}`;
      else path += ` L ${x} ${y}`;
    });
    return path;
  };

  // Generate SVG Path for Gradient Fill Area
  const getAreaPath = () => {
    if (data.length === 0) return '';
    const firstX = getX(0);
    const lastX = getX(data.length - 1);
    const bottomY = getY(minY);
    
    let path = getLinePath();
    path += ` L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
    return path;
  };

  return (
    <div ref={containerRef} style={{ width: '100%', position: 'relative' }}>
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = paddingTop + ratio * chartHeight;
          const labelVal = Math.round(maxY - ratio * (maxY - minY));
          return (
            <g key={idx}>
              <line 
                x1={paddingLeft} 
                y1={y} 
                x2={width - paddingRight} 
                y2={y} 
                stroke="rgba(255, 255, 255, 0.05)" 
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text 
                x={paddingLeft - 8} 
                y={y + 4} 
                fill="var(--text-muted)" 
                fontSize="10" 
                textAnchor="end"
                className="hud-font"
              >
                {labelVal}
              </text>
            </g>
          );
        })}

        {/* Target Line Guide */}
        {targetValue && (
          <g>
            <line
              x1={paddingLeft}
              y1={getY(targetValue)}
              x2={width - paddingRight}
              y2={getY(targetValue)}
              stroke="var(--secondary)"
              strokeWidth="1.5"
              strokeDasharray="6 3"
              style={{ filter: 'drop-shadow(0 0 3px var(--secondary-glow))' }}
            />
            <text
              x={width - paddingRight - 8}
              y={getY(targetValue) - 6}
              fill="var(--secondary)"
              fontSize="10"
              textAnchor="end"
              className="hud-font"
              style={{ fontWeight: 600 }}
            >
              TARGET: {targetValue}
            </text>
          </g>
        )}

        {type === 'line' ? (
          <>
            {/* Area Fill */}
            <path 
              d={getAreaPath()} 
              fill="url(#chartGlow)" 
            />

            {/* Glowing Line */}
            <path 
              d={getLinePath()} 
              fill="none" 
              stroke={color} 
              strokeWidth="2.5" 
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
            />

            {/* Hover Guides & Nodes */}
            {data.map((d, i) => {
              const x = getX(i);
              const y = getY(d[yKey]);
              return (
                <g key={i}>
                  {hoveredIndex === i && (
                    <line 
                      x1={x} 
                      y1={paddingTop} 
                      x2={x} 
                      y2={paddingTop + chartHeight} 
                      stroke="rgba(255, 255, 255, 0.15)" 
                      strokeWidth="1"
                    />
                  )}
                  <circle 
                    cx={x} 
                    cy={y} 
                    r={hoveredIndex === i ? 6 : 4} 
                    fill="var(--bg-solid)" 
                    stroke={color} 
                    strokeWidth="2"
                    style={{ 
                      cursor: 'pointer',
                      filter: hoveredIndex === i ? `drop-shadow(0 0 8px ${color})` : 'none',
                      transition: 'r 0.2s ease, filter 0.2s ease'
                    }}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                </g>
              );
            })}
          </>
        ) : (
          /* Bar Chart Mode */
          data.map((d, i) => {
            const x = getX(i) - 10;
            const barY = getY(d[yKey]);
            const bottomY = getY(minY);
            const barWidth = 20;
            const barHeight = Math.max(2, bottomY - barY);
            const isHovered = hoveredIndex === i;

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill={isHovered ? 'var(--secondary)' : color}
                  rx="3"
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    filter: isHovered ? 'drop-shadow(0 0 8px var(--secondary-glow))' : `drop-shadow(0 0 4px ${glowColor})`
                  }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            );
          })
        )}

        {/* X Axis Labels */}
        {data.map((d, i) => {
          const x = getX(i);
          return (
            <text
              key={i}
              x={x}
              y={height - 8}
              fill="var(--text-secondary)"
              fontSize="10"
              textAnchor="middle"
              className="hud-font"
            >
              {d[xKey]}
            </text>
          );
        })}
      </svg>

      {/* Interactive Tooltip Card */}
      {hoveredIndex !== null && (
        <div className="glass-panel" style={{
          position: 'absolute',
          top: '0px',
          left: `${Math.min(width - 130, Math.max(10, getX(hoveredIndex) - 60))}px`,
          padding: '8px 12px',
          pointerEvents: 'none',
          fontSize: '11px',
          zIndex: 10,
          border: '1px solid var(--primary)',
          boxShadow: '0 0 10px var(--primary-glow)'
        }}>
          <div style={{ color: 'var(--text-secondary)', fontWeight: 500 }} className="hud-font">
            {data[hoveredIndex][xKey]}
          </div>
          <div style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 700, marginTop: '2px' }}>
            {data[hoveredIndex][yKey]} {yKey === 'weight' ? 'kg' : 'kcal'}
          </div>
        </div>
      )}
    </div>
  );
}
