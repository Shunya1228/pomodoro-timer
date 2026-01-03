import { useState, useEffect } from 'react';

export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (newValue: T | ((prevValue: T) => T)) => void;
  removeValue: () => void;
}

/**
 * 型安全なlocalStorage統合フック
 *
 * @param key - localStorage キー
 * @param defaultValue - デフォルト値
 * @returns {UseLocalStorageReturn<T>} - value, setValue, removeValue
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): UseLocalStorageReturn<T> {
  // window未定義チェック（SSR対応）
  const isClient = typeof window !== 'undefined';

  // localStorageから初期値を取得
  const getStoredValue = (): T => {
    if (!isClient) {
      return defaultValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  };

  const [value, setValue] = useState<T>(getStoredValue);

  // localStorageへ保存
  useEffect(() => {
    if (!isClient) {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  }, [key, value, isClient]);

  // 値を削除
  const removeValue = () => {
    if (!isClient) {
      return;
    }

    try {
      window.localStorage.removeItem(key);
      setValue(defaultValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return { value, setValue, removeValue };
}
