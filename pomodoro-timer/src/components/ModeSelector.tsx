import { ToggleButton, ToggleButtonGroup, Box } from '@mui/material';
import { Work, LocalCafe } from '@mui/icons-material';
import type { TimerMode } from '../types';

interface ModeSelectorProps {
  mode: TimerMode;
  onModeChange: (mode: TimerMode) => void;
}

export function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={(_, newMode) => {
          if (newMode !== null) {
            onModeChange(newMode);
          }
        }}
        sx={{
          boxShadow: 2,
          borderRadius: 3,
          '& .MuiToggleButton-root': {
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 'bold',
            textTransform: 'none',
            border: 'none',
            borderRadius: 3,
            '&.Mui-selected': {
              boxShadow: 3,
            },
            '&:hover': {
              transform: 'scale(1.05)',
            },
            transition: 'all 0.3s',
          },
        }}
      >
        <ToggleButton
          value="work"
          sx={{
            '&.Mui-selected': {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              },
            },
          }}
        >
          <Work sx={{ mr: 1 }} />
          作業
        </ToggleButton>
        <ToggleButton
          value="break"
          sx={{
            '&.Mui-selected': {
              background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
              },
            },
          }}
        >
          <LocalCafe sx={{ mr: 1 }} />
          休憩
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
