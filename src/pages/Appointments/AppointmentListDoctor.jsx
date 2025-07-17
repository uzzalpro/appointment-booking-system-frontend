import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, Chip, IconButton, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Snackbar, Alert
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import {getAppointmentsByDoctor, updateAppointmentStatus} from '../../api/appointments';

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'completed' },
];

const AppointmentListDoctor = () => {
  const { user, userType } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchAppointments();
  }, [user.id]);

  const fetchAppointments = async () => {
    try {
      const data = await getAppointmentsByDoctor();
      setAppointments(data);
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    }
  };

  const handleEditClick = (appointment) => {
    setCurrentAppointment({ ...appointment });
    setOpenEditDialog(true);
  };


  const handleInputChange = (e) => {
    setCurrentAppointment((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditSubmit = async () => {
    try {
      const payload = {
        status: currentAppointment.status,
      };
      await updateAppointmentStatus(currentAppointment.id, payload);
      fetchAppointments();
      setOpenEditDialog(false);
      showSnackbar('Appointment status updated successfully', 'success');
    } catch (error) {
      console.error('Error updating appointment:', error);
      showSnackbar('Failed to update status', 'error');
    }
  };


  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        My Appointments
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Patient ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.id}</TableCell>
                <TableCell>{appointment.patient_id}</TableCell>
                <TableCell>
                  {new Date(appointment.appointment_date).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Chip label={appointment.status} color={
                    appointment.status === 'scheduled' ? 'primary' :
                    appointment.status === 'completed' ? 'success' : 'error'
                  } />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEditClick(appointment)} color="primary">
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Update Appointment Status</DialogTitle>
        <DialogContent>
          {currentAppointment && (
            <TextField
              margin="dense"
              label="Status"
              select
              fullWidth
              variant="outlined"
              name="status"
              value={currentAppointment.status}
              onChange={handleInputChange}
              sx={{ mt: 2 }}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}


      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AppointmentListDoctor;
