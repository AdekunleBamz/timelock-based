/**
 * Performance monitoring service
 */

export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

class PerformanceService {
  private metrics: PerformanceMetric[] = [];
  private marks: Map<string, number> = new Map();

  /**
   * Start measuring
   */
  start(name: string): void {
    this.marks.set(name, performance.now());
  }

  /**
   * End measuring
   */
  end(name: string, metadata?: Record<string, any>): number | null {
    const startTime = this.marks.get(name);
    if (!startTime) return null;

    const duration = performance.now() - startTime;
    this.marks.delete(name);

    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: Date.now(),
      metadata,
    };

    this.metrics.push(metric);
    this.reportMetric(metric);

    return duration;
  }

  /**
   * Measure function execution time
   */
  async measure<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    this.start(name);
    try {
      const result = await fn();
      this.end(name, { ...metadata, success: true });
      return result;
    } catch (error) {
      this.end(name, { ...metadata, success: false, error });
      throw error;
    }
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get average duration for metric
   */
  getAverageDuration(name: string): number {
    const filtered = this.metrics.filter(m => m.name === name);
    if (filtered.length === 0) return 0;

    const total = filtered.reduce((sum, m) => sum + m.duration, 0);
    return total / filtered.length;
  }

  /**
   * Clear metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Get performance report
   */
  getReport(): {
    total: number;
    byName: Record<string, {
      count: number;
      average: number;
      min: number;
      max: number;
    }>;
  } {
    const byName: Record<string, PerformanceMetric[]> = {};

    this.metrics.forEach(metric => {
      if (!byName[metric.name]) {
        byName[metric.name] = [];
      }
      byName[metric.name].push(metric);
    });

    const report: any = {
      total: this.metrics.length,
      byName: {},
    };

    Object.entries(byName).forEach(([name, metrics]) => {
      const durations = metrics.map(m => m.duration);
      report.byName[name] = {
        count: metrics.length,
        average: durations.reduce((a, b) => a + b, 0) / durations.length,
        min: Math.min(...durations),
        max: Math.max(...durations),
      };
    });

    return report;
  }

  /**
   * Report metric to monitoring service
   */
  private reportMetric(metric: PerformanceMetric): void {
    // In production, send to monitoring service
    if (metric.duration > 1000) {
      console.warn('[Performance] Slow operation:', metric);
    }
  }
}

export const performanceMonitor = new PerformanceService();
