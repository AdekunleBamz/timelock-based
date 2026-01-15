/**
 * Performance monitoring utilities
 */

interface PerformanceMetrics {
  name: string;
  duration: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private marks: Map<string, number> = new Map();

  /**
   * Start a performance measurement
   */
  start(name: string) {
    this.marks.set(name, performance.now());
  }

  /**
   * End a performance measurement and record it
   */
  end(name: string): number | null {
    const startTime = this.marks.get(name);
    if (!startTime) {
      console.warn(`No start mark found for: ${name}`);
      return null;
    }

    const duration = performance.now() - startTime;
    this.marks.delete(name);

    this.metrics.push({
      name,
      duration,
      timestamp: Date.now(),
    });

    // Log slow operations
    if (duration > 1000) {
      console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  /**
   * Measure a function execution time
   */
  async measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.start(name);
    try {
      return await fn();
    } finally {
      this.end(name);
    }
  }

  /**
   * Get all recorded metrics
   */
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * Get metrics by name
   */
  getMetricsByName(name: string): PerformanceMetrics[] {
    return this.metrics.filter(m => m.name === name);
  }

  /**
   * Get average duration for a metric
   */
  getAverageDuration(name: string): number | null {
    const metrics = this.getMetricsByName(name);
    if (metrics.length === 0) return null;

    const total = metrics.reduce((sum, m) => sum + m.duration, 0);
    return total / metrics.length;
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics = [];
    this.marks.clear();
  }

  /**
   * Get Web Vitals
   */
  getWebVitals() {
    if (!performance.getEntriesByType) return null;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    return {
      // Time to First Byte
      ttfb: navigation ? navigation.responseStart - navigation.requestStart : null,
      
      // First Contentful Paint
      fcp: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || null,
      
      // DOM Content Loaded
      domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : null,
      
      // Load Complete
      loadComplete: navigation ? navigation.loadEventEnd - navigation.loadEventStart : null,
      
      // Total Load Time
      totalLoadTime: navigation ? navigation.loadEventEnd - navigation.fetchStart : null,
    };
  }

  /**
   * Log performance summary
   */
  logSummary() {
    console.group('Performance Summary');
    
    const vitals = this.getWebVitals();
    if (vitals) {
      console.log('Web Vitals:', vitals);
    }

    const uniqueNames = [...new Set(this.metrics.map(m => m.name))];
    uniqueNames.forEach(name => {
      const avg = this.getAverageDuration(name);
      const count = this.getMetricsByName(name).length;
      console.log(`${name}: ${avg?.toFixed(2)}ms average (${count} calls)`);
    });

    console.groupEnd();
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Log performance summary on page unload in development
if (import.meta.env.DEV) {
  window.addEventListener('beforeunload', () => {
    performanceMonitor.logSummary();
  });
}
