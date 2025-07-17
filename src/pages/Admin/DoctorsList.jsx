import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton,
  Button
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { getDoctors, deleteUser } from '../../api/users';
import DoctorFormModal from './DoctorFormModal';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const data = await getDoctors();
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleEdit = (doctor) => {
    setCurrentDoctor(doctor);
    setOpenModal(true);
  };

  const handleAddNew = () => {
    setCurrentDoctor(null); // Reset to null for new doctor
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      fetchDoctors(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentDoctor(null);
  };

  const handleSubmitSuccess = () => {
    fetchDoctors(); // Refresh the list after successful edit/add
    handleCloseModal();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>Doctors List</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAddNew}
        >
          Add New Doctor
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Consultation Fee</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>Dr. {doctor.full_name}</TableCell>
                <TableCell>
                  {doctor.specializations.length > 0
                    ? doctor.specializations.map((s) => s.specialized).join(', ')
                    : 'General'}
                </TableCell>

                <TableCell>{doctor.experience_years} years</TableCell>
                <TableCell>${doctor.consultation_fee}</TableCell>
                <TableCell>
                  {doctor.division}, {doctor.district}, {doctor.thana}
                </TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    onClick={() => handleEdit(doctor)}
                    aria-label="edit"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(doctor.id)}
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

      {/* Doctor Form Modal */}
      <DoctorFormModal
        open={openModal}
        onClose={handleCloseModal}
        doctor={currentDoctor}
        onSubmitSuccess={handleSubmitSuccess}
      />
    </Box>
  );
};

export default DoctorsList;