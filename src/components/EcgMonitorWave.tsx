import React, { useEffect, useRef } from 'react';

interface EcgMonitorWaveProps {
  bpm: number;
  rhythm?: 'sinusal' | 'taquicardia_sinusal' | 'bradicardia' | 'taqui_ventricular' | 'recuperacao';
  color?: string;
  height?: number;
}

export const EcgMonitorWave: React.FC<EcgMonitorWaveProps> = ({
  bpm,
  rhythm = 'taquicardia_sinusal',
  color = '#89f5e7',
  height = 54,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let x = 0;
    const width = canvas.width;
    const ch = canvas.height;
    const midY = ch / 2;

    // Clear initial
    ctx.fillStyle = '#070c14';
    ctx.fillRect(0, 0, width, ch);

    // Draw subtle grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let gx = 0; gx < width; gx += 20) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, ch);
      ctx.stroke();
    }
    for (let gy = 0; gy < ch; gy += 10) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(width, gy);
      ctx.stroke();
    }

    let cyclePos = 0;
    // Speed depends on bpm
    const cycleLength = Math.max(30, Math.floor(1800 / bpm));

    const render = () => {
      // Clear a small vertical slice ahead to create sweep effect
      const clearWidth = 8;
      ctx.fillStyle = '#070c14';
      ctx.fillRect(x, 0, clearWidth, ch);

      // Redraw grid slice
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      if (x % 20 < 2) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, ch);
        ctx.stroke();
      }

      // Calculate ECG amplitude at this cycle position
      let yOffset = 0;
      const normPos = cyclePos / cycleLength; // 0 to 1

      if (rhythm === 'taqui_ventricular') {
        // Wide polymorphic wave
        yOffset = Math.sin(normPos * Math.PI * 4) * (ch * 0.4);
      } else {
        // P-Q-R-S-T pattern
        if (normPos > 0.1 && normPos < 0.2) {
          // P wave
          yOffset = -Math.sin(((normPos - 0.1) / 0.1) * Math.PI) * (ch * 0.12);
        } else if (normPos >= 0.28 && normPos < 0.3) {
          // Q wave
          yOffset = 4;
        } else if (normPos >= 0.3 && normPos < 0.36) {
          // R spike
          yOffset = -Math.sin(((normPos - 0.3) / 0.06) * Math.PI) * (ch * 0.44);
        } else if (normPos >= 0.36 && normPos < 0.4) {
          // S depression
          yOffset = Math.sin(((normPos - 0.36) / 0.04) * Math.PI) * (ch * 0.16);
        } else if (normPos >= 0.4 && normPos < 0.55) {
          // ST segment elevation (characteristic of Carlos's inferior/anterior STEMI)
          yOffset = -4 + Math.sin(((normPos - 0.4) / 0.15) * Math.PI) * 2;
        } else if (normPos >= 0.55 && normPos < 0.72) {
          // T wave
          yOffset = -Math.sin(((normPos - 0.55) / 0.17) * Math.PI) * (ch * 0.2);
        }
      }

      const targetY = midY + yOffset;

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.moveTo(x - 1 < 0 ? 0 : x - 1, targetY);
      ctx.lineTo(x, targetY);
      ctx.stroke();

      x += 2;
      if (x >= width) {
        x = 0;
      }

      cyclePos++;
      if (cyclePos >= cycleLength) {
        cyclePos = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [bpm, rhythm, color]);

  return (
    <div className="relative w-full rounded-md overflow-hidden bg-[#070c14] border border-[#1b2a43]/50">
      <canvas
        ref={canvasRef}
        width={340}
        height={height}
        className="w-full block"
        style={{ height: `${height}px` }}
      />
      <div className="absolute top-1 left-2 flex items-center gap-1.5 text-[9px] font-mono tracking-wider text-[#89f5e7]/80">
        <span className="w-1.5 h-1.5 rounded-full bg-[#89f5e7] animate-ping" />
        <span>DII RITMO MONITORADO · 25mm/s</span>
      </div>
    </div>
  );
};
