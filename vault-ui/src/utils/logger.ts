/**
 * Logger utility with different log levels
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 100;
  private enabled: boolean;

  constructor() {
    this.enabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true';
  }

  private log(level: LogLevel, message: string, data?: unknown) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
    };

    this.logs.push(entry);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    if (!this.enabled && level !== 'error') return;

    const prefix = `[${entry.timestamp}] [${level.toUpperCase()}]`;
    const style = this.getStyle(level);

    if (data) {
      console.log(`%c${prefix} ${message}`, style, data);
    } else {
      console.log(`%c${prefix} ${message}`, style);
    }
  }

  private getStyle(level: LogLevel): string {
    const styles = {
      debug: 'color: #888',
      info: 'color: #0ea5e9',
      warn: 'color: #f59e0b',
      error: 'color: #ef4444; font-weight: bold',
    };
    return styles[level];
  }

  debug(message: string, data?: unknown) {
    this.log('debug', message, data);
  }

  info(message: string, data?: unknown) {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown) {
    this.log('warn', message, data);
  }

  error(message: string, data?: unknown) {
    this.log('error', message, data);
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Clear all logs
   */
  clear() {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Download logs as file
   */
  downloadLogs() {
    const content = this.exportLogs();
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `logs-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const logger = new Logger();

// Make logger available globally in development
if (import.meta.env.DEV) {
  (window as any).logger = logger;
}
