// src/components/Appointments/BookAppointmentModal.jsx
import { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
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

const handleSubmit = async (e) => {
  e.preventDefault();
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
    console.error('Booking failed:', error);
    const message = error?.response?.data?.detail || 'Could not book appointment. Check your inputs and try again.';
    alert(message);  // Show actual backend error
  }
};




  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>Book New Appointment</Typography>
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
                    Dr. {doctor.full_name} - {doctor.specialization} (${doctor.consultation_fee})
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