import { useState, useEffect } from 'react';
import type { BeepSoundConfig } from '../types';

export interface UseNotificationsReturn {
  permission: NotificationPermission;
  requestPermission: () => Promise<NotificationPermission>;
  notify: (title: string, body: string) => void;
}

// ビープ音の設定
const BEEP_CONFIG: BeepSoundConfig = {
  type: 'sine',
  frequency: 600,
  duration: 0.3,
  volume: 0.3,
};

/**
 * 通知管理フック
 * 音声通知（Web Audio API）とブラウザ通知（Notifications API）を管理
 */
export function useNotifications(soundEnabled: boolean): UseNotificationsReturn {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  // 初期化: 通知許可状態を取得
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // 通知許可をリクエスト
  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      console.warn('Notification API is not supported in this browser.');
      return 'denied';
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  };

  // 音声通知を再生（Web Audio API）
  const playSound = () => {
    if (!soundEnabled) {
      return;
    }

    try {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = BEEP_CONFIG.type;
      oscillator.frequency.setValueAtTime(
        BEEP_CONFIG.frequency,
        audioContext.currentTime
      );

      gainNode.gain.setValueAtTime(BEEP_CONFIG.volume, audioContext.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + BEEP_CONFIG.duration);

      // クリーンアップ
      oscillator.onended = () => {
        audioContext.close();
      };
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  // ブラウザ通知を表示
  const showBrowserNotification = (title: string, body: string) => {
    if (!('Notification' in window)) {
      return;
    }

    if (permission === 'granted') {
      try {
        new Notification(title, { body });
      } catch (error) {
        console.error('Error showing notification:', error);
      }
    }
  };

  // 通知を実行（音声 + ブラウザ）
  const notify = (title: string, body: string) => {
    playSound();
    showBrowserNotification(title, body);
  };

  return {
    permission,
    requestPermission,
    notify,
  };
}
