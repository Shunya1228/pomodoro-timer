import { useState, useEffect, useCallback } from 'react';
import type { TimerMode, TimerState } from '../types';

export interface UseTimerReturn {
  remainingTime: number;
  isRunning: boolean;
  mode: TimerMode;
  start: () => void;
  pause: () => void;
  reset: () => void;
  setMode: (mode: TimerMode) => void;
}

interface UseTimerProps {
  workDuration: number; // 分
  breakDuration: number; // 分
  onComplete?: () => void;
}

/**
 * タイマーロジックフック
 * カウントダウン、開始/停止/リセット、モード管理を提供
 */
export function useTimer({
  workDuration,
  breakDuration,
  onComplete,
}: UseTimerProps): UseTimerReturn {
  const [timerState, setTimerState] = useState<TimerState>({
    remainingTime: workDuration * 60, // 秒に変換
    isRunning: false,
    mode: 'work',
    startTime: null,
  });

  // モードに応じた初期時間を取得
  const getInitialTime = useCallback(
    (mode: TimerMode): number => {
      return mode === 'work' ? workDuration * 60 : breakDuration * 60;
    },
    [workDuration, breakDuration]
  );

  // タイマー開始
  const start = () => {
    setTimerState((prev) => ({
      ...prev,
      isRunning: true,
      startTime: Date.now() - (getInitialTime(prev.mode) - prev.remainingTime) * 1000,
    }));
  };

  // タイマー一時停止
  const pause = () => {
    setTimerState((prev) => ({
      ...prev,
      isRunning: false,
      startTime: null,
    }));
  };

  // タイマーリセット
  const reset = () => {
    setTimerState((prev) => ({
      remainingTime: getInitialTime(prev.mode),
      isRunning: false,
      mode: prev.mode,
      startTime: null,
    }));
  };

  // モード切り替え
  const setMode = (mode: TimerMode) => {
    setTimerState({
      remainingTime: getInitialTime(mode),
      isRunning: false,
      mode,
      startTime: null,
    });
  };

  // カウントダウンロジック（setIntervalのドリフト防止）
  useEffect(() => {
    if (!timerState.isRunning || timerState.startTime === null) {
      return;
    }

    const startTime = timerState.startTime;
    const initialMode = timerState.mode;
    const totalDuration = getInitialTime(initialMode);

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const newRemainingTime = totalDuration - elapsed;

      if (newRemainingTime <= 0) {
        clearInterval(interval);
        // タイマー完了
        setTimerState((prev) => ({
          ...prev,
          remainingTime: 0,
          isRunning: false,
          startTime: null,
        }));

        // 完了コールバックを実行
        if (onComplete) {
          onComplete();
        }
      } else {
        setTimerState((prev) => ({
          ...prev,
          remainingTime: newRemainingTime,
        }));
      }
    }, 100); // より正確な更新のため100msに変更

    return () => clearInterval(interval);
  }, [timerState.isRunning, timerState.startTime, timerState.mode, getInitialTime, onComplete]);

  // 設定変更時にタイマーをリセット（実行中でない場合のみ）
  useEffect(() => {
    if (!timerState.isRunning) {
      setTimerState((prev) => ({
        ...prev,
        remainingTime: getInitialTime(prev.mode),
      }));
    }
  }, [workDuration, breakDuration, getInitialTime]);

  return {
    remainingTime: timerState.remainingTime,
    isRunning: timerState.isRunning,
    mode: timerState.mode,
    start,
    pause,
    reset,
    setMode,
  };
}
