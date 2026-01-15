/**
 * Chart and data visualization helpers
 */

export interface ChartDataPoint {
  x: number | string;
  y: number;
  label?: string;
}

export interface ChartConfig {
  width: number;
  height: number;
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

/**
 * Calculate chart dimensions
 */
export function getChartDimensions(config: ChartConfig) {
  const { width, height, padding } = config;
  
  return {
    chartWidth: width - padding.left - padding.right,
    chartHeight: height - padding.top - padding.bottom,
    offsetX: padding.left,
    offsetY: padding.top,
  };
}

/**
 * Get min/max values from data
 */
export function getDataExtent(data: ChartDataPoint[]): { min: number; max: number } {
  const values = data.map(d => d.y);
  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

/**
 * Create scale function
 */
export function createScale(
  domain: [number, number],
  range: [number, number]
): (value: number) => number {
  const [d1, d2] = domain;
  const [r1, r2] = range;
  const scale = (r2 - r1) / (d2 - d1);
  
  return (value: number) => r1 + (value - d1) * scale;
}

/**
 * Generate tick values
 */
export function generateTicks(min: number, max: number, count: number = 5): number[] {
  const range = max - min;
  const step = range / (count - 1);
  
  return Array.from({ length: count }, (_, i) => min + step * i);
}

/**
 * Format axis label
 */
export function formatAxisLabel(value: number, type: 'number' | 'currency' | 'percentage' = 'number'): string {
  switch (type) {
    case 'currency':
      if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
      return `$${value.toFixed(2)}`;
    
    case 'percentage':
      return `${value.toFixed(1)}%`;
    
    default:
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
      return value.toFixed(0);
  }
}

/**
 * Create SVG path for line chart
 */
export function createLinePath(
  data: ChartDataPoint[],
  scaleX: (value: number) => number,
  scaleY: (value: number) => number
): string {
  if (data.length === 0) return '';
  
  const points = data.map((d, i) => {
    const x = scaleX(typeof d.x === 'number' ? d.x : i);
    const y = scaleY(d.y);
    return { x, y };
  });
  
  let path = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`;
  }
  
  return path;
}

/**
 * Create smooth curve path (Catmull-Rom)
 */
export function createSmoothPath(
  data: ChartDataPoint[],
  scaleX: (value: number) => number,
  scaleY: (value: number) => number,
  tension: number = 0.5
): string {
  if (data.length === 0) return '';
  if (data.length === 1) {
    const x = scaleX(typeof data[0].x === 'number' ? data[0].x : 0);
    const y = scaleY(data[0].y);
    return `M ${x} ${y}`;
  }
  
  const points = data.map((d, i) => ({
    x: scaleX(typeof d.x === 'number' ? d.x : i),
    y: scaleY(d.y),
  }));
  
  let path = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];
    
    const cp1x = p1.x + (p2.x - p0.x) / 6 * tension;
    const cp1y = p1.y + (p2.y - p0.y) / 6 * tension;
    const cp2x = p2.x - (p3.x - p1.x) / 6 * tension;
    const cp2y = p2.y - (p3.y - p1.y) / 6 * tension;
    
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  
  return path;
}

/**
 * Create area path
 */
export function createAreaPath(
  data: ChartDataPoint[],
  scaleX: (value: number) => number,
  scaleY: (value: number) => number,
  baseline: number = 0
): string {
  if (data.length === 0) return '';
  
  const linePath = createLinePath(data, scaleX, scaleY);
  const baselineY = scaleY(baseline);
  const lastX = scaleX(typeof data[data.length - 1].x === 'number' ? data[data.length - 1].x : data.length - 1);
  const firstX = scaleX(typeof data[0].x === 'number' ? data[0].x : 0);
  
  return `${linePath} L ${lastX} ${baselineY} L ${firstX} ${baselineY} Z`;
}

/**
 * Calculate bar positions
 */
export function calculateBarPositions(
  data: ChartDataPoint[],
  chartWidth: number,
  barGap: number = 0.2
): Array<{ x: number; width: number; y: number; height: number }> {
  const barWidth = chartWidth / data.length;
  const actualBarWidth = barWidth * (1 - barGap);
  const gap = barWidth * barGap / 2;
  
  return data.map((d, i) => ({
    x: i * barWidth + gap,
    width: actualBarWidth,
    y: 0, // Will be calculated based on scale
    height: 0, // Will be calculated based on scale
  }));
}

/**
 * Generate color scale
 */
export function generateColorScale(count: number): string[] {
  const hueStep = 360 / count;
  return Array.from({ length: count }, (_, i) => {
    const hue = i * hueStep;
    return `hsl(${hue}, 70%, 50%)`;
  });
}

/**
 * Interpolate color
 */
export function interpolateColor(
  color1: string,
  color2: string,
  factor: number
): string {
  // Simple RGB interpolation
  const c1 = color1.match(/\d+/g)?.map(Number) || [0, 0, 0];
  const c2 = color2.match(/\d+/g)?.map(Number) || [0, 0, 0];
  
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * factor);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * factor);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * factor);
  
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Create gradient definition
 */
export function createGradient(
  id: string,
  colors: string[],
  direction: 'vertical' | 'horizontal' = 'vertical'
): string {
  const [x1, y1, x2, y2] = direction === 'vertical' 
    ? ['0%', '0%', '0%', '100%']
    : ['0%', '0%', '100%', '0%'];
  
  const stops = colors.map((color, i) => {
    const offset = (i / (colors.length - 1)) * 100;
    return `<stop offset="${offset}%" stop-color="${color}" />`;
  }).join('');
  
  return `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops}</linearGradient>`;
}

/**
 * Aggregate data by time period
 */
export function aggregateByPeriod(
  data: Array<{ timestamp: number; value: number }>,
  period: 'hour' | 'day' | 'week' | 'month'
): ChartDataPoint[] {
  const periodInSeconds = {
    hour: 3600,
    day: 86400,
    week: 604800,
    month: 2592000,
  };
  
  const buckets = new Map<number, number[]>();
  
  data.forEach(({ timestamp, value }) => {
    const bucket = Math.floor(timestamp / periodInSeconds[period]) * periodInSeconds[period];
    if (!buckets.has(bucket)) {
      buckets.set(bucket, []);
    }
    buckets.get(bucket)!.push(value);
  });
  
  return Array.from(buckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([timestamp, values]) => ({
      x: timestamp,
      y: values.reduce((sum, v) => sum + v, 0) / values.length,
    }));
}
