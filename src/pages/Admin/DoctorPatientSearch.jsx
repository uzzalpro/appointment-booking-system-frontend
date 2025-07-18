import { useState, useEffect } from 'react';
import {
  Box, TextField, Typography, Button, Paper, Divider,
  Grid, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel
} from '@mui/material';
import { searchDoctors } from '../../api/search';
import LocationSelect from '../../components/common/LocationSelect';

const DoctorPatientSearch = () => {
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    specialization: '',
    isAvailable: false,
    location: {
      division: '',
      district: '',
      thana: ''
    }
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // These would ideally come from your API or constants
  const specializations = [
    'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics',
    'Orthopedics', 'Gynecology', 'General Practice'
  ];

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Prepare params for API call
      const params = {
        keyword: searchParams.keyword || undefined,
        specialization: searchParams.specialization || undefined,
        division: searchParams.location.division || undefined,
        district: searchParams.location.district || undefined,
        thana: searchParams.location.thana || undefined,
        is_available: searchParams.isAvailable || undefined
      };

      const data = await searchDoctors(params);
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLocationChange = (location) => {
    setSearchParams(prev => ({
      ...prev,
      location
    }));
  };


  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>Find Doctors</Typography>

      {/* Main Search Bar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Search by name, email, or mobile"
          name="keyword"
          value={searchParams.keyword}
          onChange={handleChange}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
        />
        <Button variant="contained" onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
        <Button
          variant="outlined"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </Box>

      {/* Advanced Filters */}
      {showFilters && (
  <Paper sx={{ p: 3, mb: 3 }}>
    <Typography variant="subtitle1" gutterBottom>Advanced Filters</Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={4}>
        <FormControl fullWidth>
          <InputLabel>Specialization</InputLabel>
          <Select
            name="specialization"
            value={searchParams.specialization}
            onChange={handleChange}
            label="Specialization"
            sx={{
              '& .MuiSelect-select': {
                minWidth: '120px', // Adjust as needed
                whiteSpace: 'normal'
              }
            }}
          >
            <MenuItem value="">Any</MenuItem>
            {specializations.map(spec => (
              <MenuItem 
                key={spec} 
                value={spec}
                sx={{
                  whiteSpace: 'normal' // Allows text to wrap
                }}
              >
                {spec}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <LocationSelect
          value={searchParams.location}
          onChange={handleLocationChange}
          sx={{
            '& .MuiFormControl-root': {
              minWidth: '150px' // Adjust as needed
            },
            '& .MuiInputBase-root': {
              minWidth: '150px' // Adjust as needed
            }
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              name="isAvailable"
              checked={searchParams.isAvailable}
              onChange={handleChange}
            />
          }
          label="Show only available doctors"
          sx={{ ml: 0 }} // Adjust alignment if needed
        />
      </Grid>
    </Grid>
  </Paper>
)}

      <Divider sx={{ mb: 2 }} />

      {/* Results */}
      {results.length === 0 ? (
        <Typography>No doctors found. Try adjusting your search criteria.</Typography>
      ) : (
        results.map((doctor) => (
          <Paper key={doctor.id} sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" color="primary">{doctor.full_name}</Typography>
            <Typography>Specialization: {doctor.specialization || 'Not specified'}</Typography>
            <Typography>Location: {[doctor.thana, doctor.district, doctor.division].filter(Boolean).join(', ')}</Typography>
            <Typography>Contact: {doctor.mobile} | {doctor.email}</Typography>
                        {doctor.user_type === 'doctor' && doctor.specializations?.length > 0 && (
                <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle2">Specializations:</Typography>
                {doctor.specializations.map((spec, index) => (
                    <Typography key={index} sx={{ ml: 2 }}>
                    • <strong>{spec.specialized}</strong>: {spec.description}
                    </Typography>
                ))
                }
                </Box>
            )}
            

          </Paper>
        ))
      )}
    </Box>
  );
};

export default DoctorPatientSearch;