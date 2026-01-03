import { useEffect, useState } from 'react';
import { Box, Button, Typography, Fade, Chip } from '@mui/material';
import { PlayArrow, Pause, Refresh } from '@mui/icons-material';
import { formatTime } from '../utils/formatTime';
import type { TimerMode } from '../types';

interface TimerProps {
  remainingTime: number;
  isRunning: boolean;
  mode: TimerMode;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onNotify: (title: string, body: string) => void;
  disabled?: boolean;
}

export function Timer({
  remainingTime,
  isRunning,
  mode,
  onStart,
  onPause,
  onReset,
  onNotify,
  disabled = false,
}: TimerProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasEverRun, setHasEverRun] = useState(false);

  // タイマーが実行されたことを記録
  useEffect(() => {
    if (isRunning) {
      setHasEverRun(true);
    }
  }, [isRunning]);

  // タイマー完了を検出
  useEffect(() => {
    // タイマーが実行されていて、0になった場合のみ通知
    if (remainingTime === 0 && !isRunning && hasEverRun) {
      setIsCompleted(true);
      setHasEverRun(false); // リセット
      if (mode === 'work') {
        onNotify('作業完了！', '休憩時間です。リフレッシュしましょう。');
      } else {
        onNotify('休憩完了！', '作業を再開しましょう。集中して頑張りましょう！');
      }
    } else if (remainingTime > 0) {
      setIsCompleted(false);
    }
  }, [remainingTime, isRunning, hasEverRun, mode, onNotify]);

  const modeColor = mode === 'work' ? 'primary' : 'success';
  const modeGradient = mode === 'work'
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)';

  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      {/* タイマー表示 */}
      <Box
        sx={{
          background: modeGradient,
          borderRadius: 4,
          p: 6,
          mb: 4,
          boxShadow: mode === 'work'
            ? '0 20px 60px rgba(102, 126, 234, 0.4)'
            : '0 20px 60px rgba(132, 250, 176, 0.4)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {isRunning && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.5 },
              },
            }}
          >
            <Chip
              label="実行中"
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.3)',
                color: 'white',
                fontWeight: 'bold',
              }}
            />
          </Box>
        )}

        <Typography
          variant="h1"
          sx={{
            fontFamily: 'monospace',
            fontSize: { xs: '4rem', md: '7rem' },
            fontWeight: 'bold',
            color: 'white',
            letterSpacing: '0.05em',
          }}
        >
          {formatTime(remainingTime)}
        </Typography>
      </Box>

      {/* 制御ボタン */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3 }}>
        {!isRunning ? (
          <Button
            variant="contained"
            size="large"
            color={modeColor}
            startIcon={<PlayArrow />}
            onClick={onStart}
            disabled={disabled}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s',
            }}
          >
            開始
          </Button>
        ) : (
          <Button
            variant="contained"
            size="large"
            color="warning"
            startIcon={<Pause />}
            onClick={onPause}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s',
            }}
          >
            停止
          </Button>
        )}
        <Button
          variant="outlined"
          size="large"
          startIcon={<Refresh />}
          onClick={onReset}
          disabled={disabled}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 3,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            textTransform: 'none',
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s',
          }}
        >
          リセット
        </Button>
      </Box>

      {/* 完了メッセージ */}
      <Fade in={isCompleted}>
        <Box
          sx={{
            background: modeGradient,
            color: 'white',
            px: 4,
            py: 2,
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {mode === 'work'
              ? '🎉 休憩時間に切り替えますか？'
              : '💪 作業を再開しますか？'}
          </Typography>
        </Box>
      </Fade>
    </Box>
  );
}
