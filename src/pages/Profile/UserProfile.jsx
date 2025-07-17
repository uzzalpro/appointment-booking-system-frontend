import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateUser, getUserById } from '../../api/users';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { SuccessAlert, ErrorAlert } from '../../components/common/Alert';

const UserProfile = () => {
  const { userId } = useAuth();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    mobile: '',
    division: '',
    district: '',
    thana: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const data = await getUserById(userId);
        setFormData({
          full_name: data.full_name || '',
          email: data.email || '',
          mobile: data.mobile || '',
          division: data.division || '',
          district: data.district || '',
          thana: data.thana || '',
        });
        
        if (data.profile_image) {
          setExistingImage(`${process.env.REACT_APP_API_BASE_URL}/static/uploads/${data.profile_image}`);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load user data');
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Only JPEG or PNG images are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setImageFile(file);
    setError('');

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError('');
    setUploadProgress(0);

    try {
      const formDataToSend = new FormData();
      
      // Explicitly append each field (including empty strings)
      formDataToSend.append('full_name', formData.full_name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('mobile', formData.mobile);
      formDataToSend.append('division', formData.division);
      formDataToSend.append('district', formData.district);
      formDataToSend.append('thana', formData.thana);

      // Debug: Log FormData contents
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      // Append image file if selected
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      };

      const updatedUser = await updateUser(userId, formDataToSend, config);
      console.log('Backend response:', updatedUser);
      
      if (updatedUser.profile_image) {
        const newImageUrl = `${process.env.REACT_APP_API_BASE_URL}/static/uploads/${updatedUser.profile_image}?${Date.now()}`;
        setExistingImage(newImageUrl);
        setImagePreview(null);
        setImageFile(null);
      }

      setSuccess(true);
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to update profile');
    } finally {
      setUploadProgress(0);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ position: 'relative', mb: 2 }}>
          <Avatar
            sx={{ 
              width: 120, 
              height: 120, 
              fontSize: '3rem',
              bgcolor: 'primary.main'
            }}
            src={imagePreview || (existingImage ? `${existingImage}?${Date.now()}` : undefined)}
          >
            {!imagePreview && !existingImage && formData.full_name?.charAt(0)}
          </Avatar>
          
          {uploadProgress > 0 && uploadProgress < 100 && (
            <CircularProgress
              variant="determinate"
              value={uploadProgress}
              size={124}
              sx={{
                position: 'absolute',
                top: -2,
                left: -2,
                zIndex: 1,
              }}
            />
          )}
        </Box>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg, image/png"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
        
        <Button
          variant="outlined"
          size="small"
          onClick={handleImageClick}
          sx={{ mb: 2 }}
        >
          {existingImage ? 'Change Image' : 'Upload Image'}
        </Button>

        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>

        {success && (
          <SuccessAlert 
            open 
            message="Profile updated successfully!" 
            onClose={() => setSuccess(false)}
          />
        )}
        {error && (
          <ErrorAlert
            open
            message={error}
            onClose={() => setError('')}
          />
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 3, width: '100%' }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            label="Full Name"
            value={formData.full_name}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Mobile"
            value={formData.mobile}
            onChange={(e) =>
              setFormData({ ...formData, mobile: e.target.value })
            }
          />

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Location
            </Typography>
            <TextField
              margin="normal"
              fullWidth
              label="Division"
              value={formData.division}
              onChange={(e) =>
                setFormData({ ...formData, division: e.target.value })
              }
            />
            <TextField
              margin="normal"
              fullWidth
              label="District"
              value={formData.district}
              onChange={(e) =>
                setFormData({ ...formData, district: e.target.value })
              }
            />
            <TextField
              margin="normal"
              fullWidth
              label="Thana/Upazila"
              value={formData.thana}
              onChange={(e) =>
                setFormData({ ...formData, thana: e.target.value })
              }
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={uploadProgress > 0 && uploadProgress < 100}
          >
            {uploadProgress > 0 && uploadProgress < 100 ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Update Profile'
            )}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UserProfile;