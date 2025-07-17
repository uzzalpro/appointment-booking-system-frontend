import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPatientAppointments } from '../../api/appointments';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Chip } from '@mui/material';

const statusColors = {
  pending: 'default',
  confirmed: 'primary',
  completed: 'success',
  cancelled: 'error'
};

const AppointmentList = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>My Appointments</Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Doctor</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Fee</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>Dr. {appointment.doctor_name}</TableCell>
                <TableCell>{new Date(appointment.date_time).toLocaleString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={appointment.status} 
                    color={statusColors[appointment.status]} 
                  />
                </TableCell>
                <TableCell>${appointment.consultation_fee}</TableCell>
                <TableCell>{appointment.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AppointmentList;