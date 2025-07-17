import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  TextField, Button, Container, Typography, Box, 
  FormControl, InputLabel, Select, MenuItem, Link, Alert 
} from '@mui/material';
import LocationSelect from '../common/LocationSelect';

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    mobile: '',
    password: '',
    confirm_password: '',
    user_type: 'patient',
    division: '',
    district: '',
    thana: '',
    license_number: '',
    experience_years: '',
    consultation_fee: '',
    available_timeslots: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirm_password) newErrors.confirm_password = 'Passwords do not match';
    
    // Mobile format validation
    if (!formData.mobile.startsWith('+') || !/^\+\d+$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile must start with + and contain only digits';
    }
    
    // Password complexity validation
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least 1 uppercase letter';
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = 'Password must contain at least 1 digit';
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least 1 special character';
    }
    
    // Doctor specific validation
    if (formData.user_type === 'doctor') {
      if (!formData.license_number.trim()) newErrors.license_number = 'License number is required';
      if (formData.experience_years === '') newErrors.experience_years = 'Experience years is required';
      else if (Number(formData.experience_years) < 0) newErrors.experience_years = 'Must be 0 or greater';
      if (formData.consultation_fee === '') newErrors.consultation_fee = 'Consultation fee is required';
      else if (Number(formData.consultation_fee) < 0) newErrors.consultation_fee = 'Must be 0 or greater';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare payload exactly matching your working cURL example
      const payload = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        password: formData.password,
        user_type: formData.user_type,
        division: formData.division,
        district: formData.district,
        thana: formData.thana,
        license_number: formData.user_type === 'doctor' ? formData.license_number.trim() : "",
        experience_years: formData.user_type === 'doctor' ? Number(formData.experience_years) : null,
        consultation_fee: formData.user_type === 'doctor' ? Number(formData.consultation_fee) : null,
        available_timeslots: formData.available_timeslots || "",
        status: "active"
      };

      console.log('Submitting payload:', payload);

      await register(payload);
      
      setSuccessMessage('Registration successful! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Registration error:', err.response?.data || err);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.response?.status === 400) {
        if (err.response.data?.detail?.includes("Email already registered")) {
          errorMessage = "This email is already registered. Please use a different email.";
        } else if (err.response.data?.detail?.includes("Mobile number already in use")) {
          errorMessage = "This mobile number is already registered. Please use a different number.";
        } else if (err.response.data?.detail) {
          errorMessage = err.response.data.detail;
        }
      }
      
      setApiError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        mt: 8, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        boxShadow: 3,
        p: 4,
        borderRadius: 2,
        backgroundColor: 'background.paper'
      }}>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Create an Account
        </Typography>
        
        {apiError && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {apiError}
          </Alert>
        )}
        
        {successMessage && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="full_name"
            label="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            error={!!errors.full_name}
            helperText={errors.full_name}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="mobile"
            label="Mobile (+880XXXXXXXXXX)"
            value={formData.mobile}
            onChange={handleChange}
            error={!!errors.mobile}
            helperText={errors.mobile}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirm_password"
            label="Confirm Password"
            type="password"
            value={formData.confirm_password}
            onChange={handleChange}
            error={!!errors.confirm_password}
            helperText={errors.confirm_password}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>User Type</InputLabel>
            <Select
              name="user_type"
              value={formData.user_type}
              onChange={handleChange}
              label="User Type"
            >
              <MenuItem value="patient">Patient</MenuItem>
              <MenuItem value="doctor">Doctor</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          <LocationSelect
            value={{
              division: formData.division,
              district: formData.district,
              thana: formData.thana
            }}
            onChange={({ division, district, thana }) => {
              setFormData(prev => ({ ...prev, division, district, thana }));
            }}
          />

          {formData.user_type === 'doctor' && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                name="license_number"
                label="License Number"
                value={formData.license_number}
                onChange={handleChange}
                error={!!errors.license_number}
                helperText={errors.license_number}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="experience_years"
                label="Experience Years"
                type="number"
                value={formData.experience_years}
                onChange={handleChange}
                error={!!errors.experience_years}
                helperText={errors.experience_years}
                inputProps={{ min: 0 }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="consultation_fee"
                label="Consultation Fee"
                type="number"
                value={formData.consultation_fee}
                onChange={handleChange}
                error={!!errors.consultation_fee}
                helperText={errors.consultation_fee}
                inputProps={{ min: 0 }}
              />
            </>
          )}

          <TextField
            margin="normal"
            fullWidth
            name="available_timeslots"
            label="Available Timeslots (comma separated)"
            value={formData.available_timeslots}
            onChange={handleChange}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </Button>
          
          <Box sx={{ textAlign: 'center' }}>
            <Link href="/login" variant="body2">
              Already have an account? Sign in
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;