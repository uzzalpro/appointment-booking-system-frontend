// src/components/Appointments/BookAppointmentModal.jsx
import { useState, useEffect } from 'react';
import { Modal, Box, Typography, Alert, TextField, Button, Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { getDoctors} from '../../api/users';
import {  bookAppointment } from '../../api/appointments';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const BookAppointmentModal = ({ open, onClose, onSubmit }) => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctor_id: '',
    appointment_date: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };
    fetchDoctors();
  }, []);

useEffect(() => {
  if (success) {
    const timer = setTimeout(() => setSuccess(''), 4000);
    return () => clearTimeout(timer);
  }
}, [success]);

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  try {
    const utcDate = new Date(formData.appointment_date).toISOString();

    const payload = {
      ...formData,
      appointment_date: utcDate,
    };

    const response = await bookAppointment(payload);

    
    if (onSubmit) onSubmit(response);
    onClose();
  } catch (error) {
    const data = error?.response?.data;
    console.error('Booking failed:', data);

    let err = 'Could not book appointment. Check your inputs and try again.';

    if (Array.isArray(data?.detail)) {
      const rawMsg = data.detail[0]?.msg || '';
      err = rawMsg.replace(/^Value error,\s*/i, '').trim();
    } else if (typeof data?.detail === 'string') {
      err = data.detail;
    }

    setError(err);
  }
};


  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>Book New Appointment</Typography>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Doctor</InputLabel>
              <Select
                value={formData.doctor_id}
                label="Doctor"
                onChange={(e) => setFormData({...formData, doctor_id: e.target.value})}
                required
              >
                {doctors.map(doctor => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    Dr. {doctor.full_name} - {doctor.specializations.map((s) => s.specialized).join(', ') || 'General'} ({doctor.available_timeslots})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              label="Date & Time"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={formData.date_time}
              onChange={(e) => setFormData({...formData, appointment_date: e.target.value})}
              required
            />
            
            <TextField
              label="Notes/Symptoms"
              multiline
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
            
            <Button type="submit" variant="contained" fullWidth>
              Book Appointment
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default BookAppointmentModal;