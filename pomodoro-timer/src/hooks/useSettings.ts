import { useLocalStorage } from './useLocalStorage';

export interface UseSettingsReturn {
  workDuration: number | '';
  breakDuration: number | '';
  soundEnabled: boolean;
  updateWorkDuration: (minutes: number | '') => void;
  updateBreakDuration: (minutes: number | '') => void;
  toggleSound: () => void;
}

// デフォルト設定
const DEFAULT_WORK_DURATION = 25; // 分
const DEFAULT_BREAK_DURATION = 5; // 分
const DEFAULT_SOUND_ENABLED = true;

// バリデーション関数
const validateWorkDuration = (value: number): boolean => {
  return value >= 1 && value <= 60;
};

const validateBreakDuration = (value: number): boolean => {
  return value >= 1 && value <= 30;
};

/**
 * 設定管理フック
 * 作業時間、休憩時間、音声通知の設定を管理し、localStorageに個別キーで保存
 */
export function useSettings(): UseSettingsReturn {
  // 各設定を個別のキーで管理
  const { value: workDuration, setValue: setWorkDuration } = useLocalStorage<number | ''>(
    'pomodoro_workDuration',
    DEFAULT_WORK_DURATION
  );

  const { value: breakDuration, setValue: setBreakDuration } = useLocalStorage<number | ''>(
    'pomodoro_breakDuration',
    DEFAULT_BREAK_DURATION
  );

  const { value: soundEnabled, setValue: setSoundEnabled } = useLocalStorage<boolean>(
    'pomodoro_soundEnabled',
    DEFAULT_SOUND_ENABLED
  );

  // 作業時間を更新（バリデーション付き）
  const updateWorkDuration = (minutes: number | '') => {
    if (minutes === '') {
      setWorkDuration('');
    } else if (validateWorkDuration(minutes)) {
      setWorkDuration(minutes);
    } else {
      console.warn(`Invalid work duration: ${minutes}. Must be between 1-60 minutes.`);
    }
  };

  // 休憩時間を更新（バリデーション付き）
  const updateBreakDuration = (minutes: number | '') => {
    if (minutes === '') {
      setBreakDuration('');
    } else if (validateBreakDuration(minutes)) {
      setBreakDuration(minutes);
    } else {
      console.warn(`Invalid break duration: ${minutes}. Must be between 1-30 minutes.`);
    }
  };

  // 音声通知ON/OFF切り替え
  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  return {
    workDuration,
    breakDuration,
    soundEnabled,
    updateWorkDuration,
    updateBreakDuration,
    toggleSound,
  };
}
