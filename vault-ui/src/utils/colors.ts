/**
 * Color utilities for themes and data visualization
 */

/**
 * Convert hex to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Lighten a color
 */
export function lighten(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const { r, g, b } = rgb;
  const newR = Math.min(255, r + amount);
  const newG = Math.min(255, g + amount);
  const newB = Math.min(255, b + amount);
  
  return rgbToHex(newR, newG, newB);
}

/**
 * Darken a color
 */
export function darken(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const { r, g, b } = rgb;
  const newR = Math.max(0, r - amount);
  const newG = Math.max(0, g - amount);
  const newB = Math.max(0, b - amount);
  
  return rgbToHex(newR, newG, newB);
}

/**
 * Add opacity to hex color
 */
export function addOpacity(hex: string, opacity: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const { r, g, b } = rgb;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Get contrasting text color (black or white) for a background
 */
export function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#000000';
  
  const { r, g, b } = rgb;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

/**
 * Generate color palette
 */
export function generatePalette(baseHex: string, count: number = 5): string[] {
  const palette: string[] = [baseHex];
  const step = Math.floor(200 / (count - 1));
  
  for (let i = 1; i < count; i++) {
    if (i % 2 === 0) {
      palette.push(lighten(baseHex, step * (i / 2)));
    } else {
      palette.push(darken(baseHex, step * Math.ceil(i / 2)));
    }
  }
  
  return palette;
}

/**
 * Color scheme presets
 */
export const COLOR_SCHEMES = {
  success: {
    light: '#10b981',
    main: '#059669',
    dark: '#047857',
  },
  error: {
    light: '#ef4444',
    main: '#dc2626',
    dark: '#b91c1c',
  },
  warning: {
    light: '#f59e0b',
    main: '#d97706',
    dark: '#b45309',
  },
  info: {
    light: '#3b82f6',
    main: '#2563eb',
    dark: '#1d4ed8',
  },
  primary: {
    light: '#6366f1',
    main: '#4f46e5',
    dark: '#4338ca',
  },
} as const;

/**
 * Get color for value (e.g., for charts)
 */
export function getColorForValue(
  value: number,
  min: number,
  max: number,
  colorStart: string = '#10b981',
  colorEnd: string = '#ef4444'
): string {
  const startRgb = hexToRgb(colorStart);
  const endRgb = hexToRgb(colorEnd);
  
  if (!startRgb || !endRgb) return colorStart;
  
  const ratio = (value - min) / (max - min);
  
  const r = Math.round(startRgb.r + (endRgb.r - startRgb.r) * ratio);
  const g = Math.round(startRgb.g + (endRgb.g - startRgb.g) * ratio);
  const b = Math.round(startRgb.b + (endRgb.b - startRgb.b) * ratio);
  
  return rgbToHex(r, g, b);
}
