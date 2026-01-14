import './PerformanceChart.css';
import { useEffect, useRef } from 'react';

interface DataPoint {
  timestamp: number;
  value: number;
}

interface PerformanceChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  showGrid?: boolean;
}

export function PerformanceChart({
  data,
  height = 200,
  color = 'var(--color-primary)',
  showGrid = true,
}: PerformanceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const padding = 20;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Get min/max values
    const values = data.map((d) => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue || 1;

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = 'rgba(128, 128, 128, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = padding + (height - 2 * padding) * (i / 4);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
      }
    }

    // Draw line
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.beginPath();
    data.forEach((point, index) => {
      const x = padding + ((width - 2 * padding) * index) / (data.length - 1);
      const normalizedValue = (point.value - minValue) / range;
      const y = height - padding - normalizedValue * (height - 2 * padding);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw gradient fill
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, color.replace(')', ', 0.2)').replace('var(', 'rgba(99, 102, 241'));
    gradient.addColorStop(1, color.replace(')', ', 0)').replace('var(', 'rgba(99, 102, 241'));
    ctx.fillStyle = gradient;
    ctx.fill();
  }, [data, height, color, showGrid]);

  return (
    <div className="performance-chart">
      <canvas ref={canvasRef} style={{ width: '100%', height: `${height}px` }} />
    </div>
  );
}
