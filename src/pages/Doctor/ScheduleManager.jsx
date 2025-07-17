import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateUser } from '../../api/users';
// import { TextField, Button, Container, Typography, Box, Chip } from '@mui/material';
import {
  Container, Typography, Box, Button, Chip, TextField, Grid
} from '@mui/material';
import { SuccessAlert, ErrorAlert } from '../../components/common/Alert';



const ScheduleManager = () => {
  const { user, setUser, availableTimeslots, fullName, userId } = useAuth();
  const [timeRanges, setTimeRanges] = useState([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Load existing timeslots
  useEffect(() => {
    if (availableTimeslots) {
      const slots = availableTimeslots.split(',').map(s => s.trim());
      setTimeRanges(slots);
    }
  }, [user]);

  const handleAddTimeRange = () => {
    if (start && end) {
      const newSlot = `${start}-${end}`;
      if (!timeRanges.includes(newSlot)) {
        setTimeRanges(prev => [...prev, newSlot]);
        setStart('');
        setEnd('');
      }
    }
  };

  const handleRemoveTimeRange = (index) => {
    setTimeRanges(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedTimeslots = timeRanges.join(', ');
    try {
      const updatedUser = await updateUser(userId, { available_timeslots: updatedTimeslots });
      setUser(updatedUser);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update schedule');
    }
  };

  return (
     <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Manage Schedule
        </Typography>

        {success && <SuccessAlert open={true} message="Schedule updated successfully!" />}
        {error && <ErrorAlert open={true} message={error} onClose={() => setError('')} />}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Typography variant="body1" gutterBottom>
            Select your available time ranges:
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              <TextField
                label="Start Time"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="End Time"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="outlined"
                onClick={handleAddTimeRange}
                fullWidth
              >
                Add Time Range
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Existing Available Time Ranges:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {timeRanges.map((slot, index) => (
                  <Chip
                    key={index}
                    label={slot}
                    onDelete={() => handleRemoveTimeRange(index)}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 4 }}
          >
            Update Schedule
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ScheduleManager;
