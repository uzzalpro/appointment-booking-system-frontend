import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDoctorAppointments, updateAppointmentStatus } from '../../api/appointments';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Select, MenuItem } from '@mui/material';

const ManageAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getDoctorAppointments(user.id);
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    fetchAppointments();
  }, [user.id]);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      setAppointments(appointments.map(appt => 
        appt.id === appointmentId ? { ...appt, status: newStatus } : appt
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Manage Appointments</Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.patient_name}</TableCell>
                <TableCell>{new Date(appointment.date_time).toLocaleString()}</TableCell>
                <TableCell>
                  <Select
                    value={appointment.status}
                    onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                    size="small"
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="confirmed">Confirmed</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  {/* Add additional actions if needed */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManageAppointments;