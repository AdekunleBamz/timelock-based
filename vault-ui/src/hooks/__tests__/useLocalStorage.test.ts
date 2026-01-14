import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with default value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('updated'));
  });

  it('should read existing value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('existing'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    
    expect(result.current[0]).toBe('existing');
  });

  it('should handle complex objects', () => {
    const { result } = renderHook(() => 
      useLocalStorage('test-obj', { count: 0, name: 'test' })
    );

    act(() => {
      result.current[1]({ count: 1, name: 'updated' });
    });

    expect(result.current[0]).toEqual({ count: 1, name: 'updated' });
  });
});
