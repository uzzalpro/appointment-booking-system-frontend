// src/pages/Dashboard/PatientDashboard.jsx
import { useState, useEffect } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { getPatientAppointments, bookAppointment } from '../../api/appointments';
import { useAuth } from '../../context/AuthContext';
import BookAppointmentModal from '../Appointments/BookAppointmentModal';

const statusColors = {
  pending: 'default',
  confirmed: 'primary',
  completed: 'success',
  cancelled: 'error'
};

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getPatientAppointments(user.id);
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    fetchAppointments();
  }, [user.id]);

  const handleBookAppointment = async (appointmentData) => {
    try {
      const newAppointment = await bookAppointment({
        ...appointmentData,
        patient_id: user.id
      });
      setAppointments([...appointments, newAppointment]);
      setOpenModal(false);
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Patient Dashboard</Typography>
      <Typography>Welcome, {user?.full_name}</Typography>
      
      <Button 
        variant="contained" 
        sx={{ my: 2 }}
        onClick={() => setOpenModal(true)}
      >
        Book New Appointment
      </Button>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Doctor</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Note</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>Dr. {appointment.id}</TableCell>
                <TableCell>{new Date(appointment.appointment_date).toLocaleString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={appointment.status} 
                    color={statusColors[appointment.status]} 
                  />
                </TableCell>
                <TableCell>{appointment.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <BookAppointmentModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleBookAppointment}
      />
    </Box>
  );
};

export default PatientDashboard;