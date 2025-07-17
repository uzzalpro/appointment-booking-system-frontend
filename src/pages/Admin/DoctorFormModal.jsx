import { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Stack,
  Button
} from '@mui/material';
import LocationSelect from '../../components/common/LocationSelect';
import {updateDoctor} from '../../api/users';

const DoctorFormModal = ({ open, onClose, doctor, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    specialization: '',
    experience_years: '',
    consultation_fee: '',
    division: '',
    district: '',
    thana: ''
  });

  // Initialize form when doctor prop changes or modal opens
  useEffect(() => {
    if (doctor) {
      setFormData({
        full_name: doctor.full_name || '',
        specialization:
          doctor.specializations && doctor.specializations.length > 0
            ? doctor.specializations.map((s) => s.specialized).join(', ')
            : '',
        experience_years: doctor.experience_years || '',
        consultation_fee: doctor.consultation_fee || '',
        division: doctor.division || '',
        district: doctor.district || '',
        thana: doctor.thana || ''
      });
    } else {
      setFormData({
        full_name: '',
        specialization: '',
        experience_years: '',
        consultation_fee: '',
        division: '',
        district: '',
        thana: ''
      });
    }
  }, [doctor, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (location) => {
    setFormData((prev) => ({
      ...prev,
      division: location.division,
      district: location.district,
      thana: location.thana
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { specialization, ...otherFields } = formData;

      const userData = {
        ...otherFields,
        experience_years: Number(formData.experience_years),
        consultation_fee: Number(formData.consultation_fee),
        specializations: specialization
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
          .map((specialized) => ({
            specialized,
            description: ''
          }))
      };

      if (doctor?.id) {
        await updateDoctor(doctor.id, userData);
      } else {
        // You can later plug in `createDoctor(userData)`
        console.log('Create doctor (not yet implemented)', userData);
      }

      onSubmitSuccess();
    } catch (error) {
      console.error('Error saving doctor:', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 1,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <Typography variant="h6" gutterBottom>
          {doctor ? 'Edit Doctor' : 'Add New Doctor'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Full Name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              margin="normal"
            />

            <TextField
              fullWidth
              label="Specializations (comma-separated)"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              
              margin="normal"
            />

            <TextField
              fullWidth
              label="Experience (Years)"
              name="experience_years"
              type="number"
              value={formData.experience_years}
              onChange={handleChange}
              required
              margin="normal"
              inputProps={{ min: 0 }}
            />

            <TextField
              fullWidth
              label="Consultation Fee"
              name="consultation_fee"
              type="number"
              value={formData.consultation_fee}
              onChange={handleChange}
              required
              margin="normal"
              inputProps={{ min: 0 }}
            />

            {/* Location Select Component */}
            <LocationSelect
              value={{
                division: formData.division,
                district: formData.district,
                thana: formData.thana
              }}
              onChange={handleLocationChange}
            />

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button onClick={onClose} variant="outlined">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {doctor ? 'Update' : 'Create'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default DoctorFormModal;
