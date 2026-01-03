import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Stack,
} from '@mui/material';
import { Settings as SettingsIcon, Timer, Coffee, VolumeUp } from '@mui/icons-material';

interface SettingsProps {
  workDuration: number | '';
  breakDuration: number | '';
  soundEnabled: boolean;
  onWorkDurationChange: (minutes: number | '') => void;
  onBreakDurationChange: (minutes: number | '') => void;
  onSoundToggle: () => void;
}

export function Settings({
  workDuration,
  breakDuration,
  soundEnabled,
  onWorkDurationChange,
  onBreakDurationChange,
  onSoundToggle,
}: SettingsProps) {
  return (
    <Card
      sx={{
        mt: 4,
        borderRadius: 3,
        boxShadow: 3,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <SettingsIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" fontWeight="bold">
            設定
          </Typography>
        </Box>

        <Stack spacing={3}>
          {/* 作業時間 */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Timer sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
              <Typography variant="body1" fontWeight="bold">
                作業時間
              </Typography>
            </Box>
            <TextField
              type="number"
              value={workDuration}
              onChange={(e) => {
                const value = e.target.value;
                onWorkDurationChange(value === '' ? '' : Number(value));
              }}
              inputProps={{ min: 1, max: 60 }}
              size="small"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'white',
                },
              }}
              InputProps={{
                endAdornment: <Typography sx={{ ml: 1, color: 'text.secondary' }}>分</Typography>,
              }}
            />
          </Box>

          <Divider />

          {/* 休憩時間 */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Coffee sx={{ mr: 1, color: 'success.main', fontSize: 20 }} />
              <Typography variant="body1" fontWeight="bold">
                休憩時間
              </Typography>
            </Box>
            <TextField
              type="number"
              value={breakDuration}
              onChange={(e) => {
                const value = e.target.value;
                onBreakDurationChange(value === '' ? '' : Number(value));
              }}
              inputProps={{ min: 1, max: 30 }}
              size="small"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'white',
                },
              }}
              InputProps={{
                endAdornment: <Typography sx={{ ml: 1, color: 'text.secondary' }}>分</Typography>,
              }}
            />
          </Box>

          <Divider />

          {/* 音声通知 */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <VolumeUp sx={{ mr: 1, color: 'warning.main', fontSize: 20 }} />
                <Typography variant="body1" fontWeight="bold">
                  音声通知
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={soundEnabled}
                    onChange={onSoundToggle}
                    color="primary"
                  />
                }
                label={soundEnabled ? 'ON' : 'OFF'}
                labelPlacement="start"
                sx={{ m: 0 }}
              />
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
