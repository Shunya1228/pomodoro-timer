// Timer Types
export type TimerMode = 'work' | 'break';

export interface TimerState {
  remainingTime: number; // 残り時間（秒）
  isRunning: boolean; // タイマー実行中フラグ
  mode: TimerMode; // 現在のモード
  startTime: number | null; // カウントダウン開始時のタイムスタンプ
}

// Settings Types
export interface SettingsState {
  workDuration: number; // 作業時間（分）1-60
  breakDuration: number; // 休憩時間（分）1-30
  soundEnabled: boolean; // 音声通知有効フラグ
}

// Notification Types
export interface BeepSoundConfig {
  type: OscillatorType; // 'sine' - 柔らかい音
  frequency: number; // 600Hz - 中程度の高さ
  duration: number; // 0.3秒
  volume: number; // 0.3 (30%)
}
