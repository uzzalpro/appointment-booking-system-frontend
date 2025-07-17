import { useState, useEffect } from 'react';
import {
  Box, TextField, Typography, Button, Paper, Divider
} from '@mui/material';
import { searchDoctors } from '../../api/search';

const DoctorPatientSearch = () => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await searchDoctors(keyword);
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(); // optional: search on mount
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>Search Doctors and Patients</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Search by name, email, or mobile"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
        />
        <Button variant="contained" onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {results.length === 0 ? (
        <Typography>No results found.</Typography>
      ) : (
        results.map((user) => (
          <Paper key={user.id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1"><strong>{user.full_name}</strong></Typography>
            <Typography>Email: {user.email}</Typography>
            <Typography>Mobile: {user.mobile}</Typography>
            <Typography>User: {user.user_type}</Typography>
             {/* Show specializations only if user is a doctor and has specializations */}
            {user.user_type === 'doctor' && user.specializations?.length > 0 && (
                <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle2">Specializations:</Typography>
                {user.specializations.map((spec, index) => (
                    <Typography key={index} sx={{ ml: 2 }}>
                    • <strong>{spec.specialized}</strong>: {spec.description}
                    </Typography>
                ))}
                </Box>
            )}
            
          </Paper>
        ))
      )}
    </Box>
  );
};

export default DoctorPatientSearch;
