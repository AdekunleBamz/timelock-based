/**
 * Testing utilities and helpers
 */

/**
 * Wait for condition to be true
 */
export async function waitFor(
  condition: () => boolean,
  timeout: number = 5000,
  interval: number = 100
): Promise<void> {
  const startTime = Date.now();

  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Timeout waiting for condition');
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
}

/**
 * Mock localStorage for testing
 */
export function createMockStorage(): Storage {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
}

/**
 * Mock fetch for testing
 */
export function createMockFetch(
  responses: Record<string, any>
): typeof fetch {
  return async (url: string | URL | Request) => {
    const urlStr = typeof url === 'string' ? url : url.toString();
    const response = responses[urlStr];

    if (!response) {
      throw new Error(`No mock response for ${urlStr}`);
    }

    return {
      ok: response.ok !== false,
      status: response.status || 200,
      json: async () => response.data,
      text: async () => JSON.stringify(response.data),
      blob: async () => new Blob([JSON.stringify(response.data)]),
    } as Response;
  };
}

/**
 * Generate test data
 */
export function generateTestDeposits(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    depositId: `deposit-${i}`,
    amount: (Math.random() * 1000 + 100).toFixed(2),
    depositTime: Math.floor(Date.now() / 1000) - Math.random() * 86400 * 30,
    lockDuration: Math.floor(Math.random() * 86400 * 90),
    isEmergency: Math.random() > 0.8,
  }));
}

/**
 * Generate test transactions
 */
export function generateTestTransactions(count: number) {
  const types = ['deposit', 'withdraw', 'emergency', 'approve'] as const;
  const statuses = ['pending', 'confirmed', 'failed'] as const;

  return Array.from({ length: count }, (_, i) => ({
    hash: `0x${Math.random().toString(16).slice(2)}`,
    type: types[Math.floor(Math.random() * types.length)],
    amount: Math.random() > 0.3 ? (Math.random() * 1000).toFixed(2) : undefined,
    timestamp: Math.floor(Date.now() / 1000) - Math.random() * 86400 * 7,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    depositId: Math.random() > 0.5 ? `deposit-${Math.floor(Math.random() * 10)}` : undefined,
  }));
}

/**
 * Spy on console methods
 */
export function spyOnConsole() {
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  const logs: string[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  console.log = (...args) => logs.push(args.join(' '));
  console.warn = (...args) => warnings.push(args.join(' '));
  console.error = (...args) => errors.push(args.join(' '));

  return {
    logs,
    warnings,
    errors,
    restore: () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    },
  };
}

/**
 * Mock window.matchMedia
 */
export function mockMatchMedia(matches: boolean = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

/**
 * Create mock IntersectionObserver
 */
export function mockIntersectionObserver() {
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
}

/**
 * Flush promises
 */
export async function flushPromises(): Promise<void> {
  return new Promise(resolve => setImmediate(resolve));
}
