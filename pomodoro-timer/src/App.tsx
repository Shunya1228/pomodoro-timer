import { useEffect } from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import { Timer as TimerIcon } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Timer } from './components/Timer';
import { ModeSelector } from './components/ModeSelector';
import { Settings } from './components/Settings';
import { useTimer } from './hooks/useTimer';
import { useSettings } from './hooks/useSettings';
import { useNotifications } from './hooks/useNotifications';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    success: {
      main: '#84fab0',
    },
    warning: {
      main: '#ff9800',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Noto Sans JP", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  const {
    workDuration,
    breakDuration,
    soundEnabled,
    updateWorkDuration,
    updateBreakDuration,
    toggleSound,
  } = useSettings();

  const { requestPermission, notify } = useNotifications(soundEnabled);

  // 設定が有効かチェック（空文字列でなく、かつ1以上の数値）
  const isValidSettings =
    typeof workDuration === 'number' && workDuration >= 1 &&
    typeof breakDuration === 'number' && breakDuration >= 1;

  // 無効な設定の場合は0を使用（タイマーを0分で表示）
  const validWorkDuration = typeof workDuration === 'number' && workDuration >= 1 ? workDuration : 0;
  const validBreakDuration = typeof breakDuration === 'number' && breakDuration >= 1 ? breakDuration : 0;

  const { remainingTime, isRunning, mode, start, pause, reset, setMode } = useTimer({
    workDuration: validWorkDuration,
    breakDuration: validBreakDuration,
    onComplete: () => {},
  });

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={10}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* ヘッダー */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                py: 3,
                px: 4,
                textAlign: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <TimerIcon sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h3" fontWeight="bold">
                  Pomodoro Timer
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                集中力を高めて、生産性をアップ
              </Typography>
            </Box>

            {/* メインコンテンツ */}
            <Box sx={{ p: 4 }}>
              <ModeSelector mode={mode} onModeChange={setMode} />
              <Timer
                remainingTime={remainingTime}
                isRunning={isRunning}
                mode={mode}
                onStart={start}
                onPause={pause}
                onReset={reset}
                onNotify={notify}
                disabled={!isValidSettings}
              />
              <Settings
                workDuration={workDuration}
                breakDuration={breakDuration}
                soundEnabled={soundEnabled}
                onWorkDurationChange={updateWorkDuration}
                onBreakDurationChange={updateBreakDuration}
                onSoundToggle={toggleSound}
              />
            </Box>

            {/* フッター */}
            <Box
              sx={{
                textAlign: 'center',
                py: 2,
                bgcolor: 'rgba(0, 0, 0, 0.02)',
                borderTop: '1px solid rgba(0, 0, 0, 0.08)',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Made with ❤️ using React + TypeScript + Material-UI
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
