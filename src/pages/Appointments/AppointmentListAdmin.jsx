import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAppointmentsByAdmin, updateAppointment, deleteAppointment } from '../../api/appointments';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Typography, Box, Chip, IconButton, Button, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Snackbar, Alert 
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const statusColors = {
  pending: 'default',
  confirmed: 'primary',
  completed: 'success',
  cancelled: 'error'
};

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

// const formatDateTimeForBackend = (dateTimeString) => {
//   const date = new Date(dateTimeString);
//   // Convert to ISO string and ensure it has timezone information
//   return date.toISOString();
// };

const formatDateTimeForBackend = (dateTimeString) => {
  const date = new Date(dateTimeString);
  // Ensure the date is treated as local time and converted to UTC
  const utcDate = new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes()
    )
  );
  return utcDate.toISOString();
};

const AppointmentListAdmin = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchAppointments();
  }, [user.id]);

  const fetchAppointments = async () => {
    try {
      const data = await getAppointmentsByAdmin();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      showSnackbar('Failed to fetch appointments', 'error');
    }
  };

  const handleEditClick = (appointment) => {
    // Convert the appointment date to local datetime format for the input
    const localDateTime = new Date(appointment.appointment_date);
    const offset = localDateTime.getTimezoneOffset() * 60000;
    const localISOTime = new Date(localDateTime - offset).toISOString().slice(0, 16);
    
    setCurrentAppointment({
      ...appointment,
      appointment_date: localISOTime
    });
    setOpenEditDialog(true);
  };

  const handleDeleteClick = (appointment) => {
    setCurrentAppointment(appointment);
    setOpenDeleteDialog(true);
  };

const handleEditSubmit = async () => {
  try {
    const utcDate = new Date(currentAppointment.appointment_date).toISOString(); // UTC-aware ISO

    const payload = {
      appointment_date: utcDate,
      notes: currentAppointment.notes,
      status: currentAppointment.status
    };

    await updateAppointment(currentAppointment.id, payload);
    fetchAppointments();
    setOpenEditDialog(false);
    showSnackbar('Appointment updated successfully', 'success');
  } catch (error) {
  console.error('Error updating appointment:', error);
  let msg = 'Failed to update appointment';

  const detail = error?.response?.data?.detail;

  if (Array.isArray(detail)) {
    // Use the first message or combine all
    msg = detail.map(err => err.msg).join(', ');
  } else if (typeof detail === 'string') {
    msg = detail;
  }

  showSnackbar(msg, 'error');
}

};


  const handleDeleteConfirm = async () => {
    try {
      await deleteAppointment(currentAppointment.id);
      fetchAppointments();
      setOpenDeleteDialog(false);
      showSnackbar('Appointment deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting appointment:', error);
      showSnackbar('Failed to delete appointment', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAppointment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Appointments List</Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Doctor ID</TableCell>
              <TableCell>Patient ID</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.id}</TableCell>
                <TableCell>{appointment.doctor_id}</TableCell>
                <TableCell>{appointment.patient_id}</TableCell>
                <TableCell>{new Date(appointment.appointment_date).toLocaleString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={appointment.status} 
                    color={statusColors[appointment.status]} 
                  />
                </TableCell>
                <TableCell>{appointment.notes}</TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    onClick={() => handleEditClick(appointment)}
                    aria-label="edit"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDeleteClick(appointment)}
                    aria-label="delete"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Appointment</DialogTitle>
        <DialogContent>
          {currentAppointment && (
            <>
              <TextField
                margin="dense"
                label="Appointment Date"
                type="datetime-local"
                fullWidth
                variant="outlined"
                name="appointment_date"
                value={currentAppointment.appointment_date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                sx={{ mt: 2 }}
              />
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
              <TextField
                margin="dense"
                label="Notes"
                fullWidth
                variant="outlined"
                name="notes"
                value={currentAppointment.notes}
                onChange={handleInputChange}
                multiline
                rows={4}
                sx={{ mt: 2 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this appointment?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AppointmentListAdmin;