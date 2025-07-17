import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { bookAppointment } from '../../api/appointments';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { SuccessAlert, ErrorAlert } from '../../components/common/Alert';

const BookAppointment = () => {
  const { user, userId, userType } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    doctor_id: '',
    date_time: '',
    notes: '',
  });
  const [doctors, setDoctors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (err) {
        setError('Failed to load doctors');
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await bookAppointment({
        ...formData,
        patient_id: userId
      });
      setSuccess(true);
      setTimeout(() => navigate('/patient/appointments'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to book appointment');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Book Appointment</Typography>
        
        {success && <SuccessAlert open={true} message="Appointment booked successfully!" />}
        {error && <ErrorAlert open={true} message={error} onClose={() => setError('')} />}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Doctor</InputLabel>
            <Select
              value={formData.doctor_id}
              label="Doctor"
              onChange={(e) => setFormData({...formData, doctor_id: e.target.value})}
            >
              {doctors.map(doctor => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  Dr. {doctor.full_name} - {doctor.specialization || 'General'} (${doctor.consultation_fee})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            margin="normal"
            required
            fullWidth
            label="Date & Time"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={formData.date_time}
            onChange={(e) => setFormData({...formData, date_time: e.target.value})}
          />
          
          <TextField
            margin="normal"
            fullWidth
            label="Notes/Symptoms"
            multiline
            rows={4}
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Book Appointment
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default BookAppointment;