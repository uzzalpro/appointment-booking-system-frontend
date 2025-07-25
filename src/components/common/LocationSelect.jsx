// src/components/common/LocationSelect.jsx
import { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import api from '../../api/axios';

const LocationSelect = ({ value, onChange }) => {
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);

  useEffect(() => {
    api.get('/user-auth/api/v1/divisions').then(res => {
      setDivisions(res.data.divisions);
    });
  }, []);

  useEffect(() => {
    if (value.division) {
      api.get(`/user-auth/api/v1/districts/${value.division}`).then(res => {
        setDistricts(res.data.districts);
      });
    }
  }, [value.division]);

  useEffect(() => {
    if (value.division && value.district) {
      api.get(`/user-auth/api/v1/upazilas/${value.division}/${value.district}`).then(res => {
        setUpazilas(res.data.upazilas);
      });
    }
  }, [value.division, value.district]);

  return (
  <Grid container spacing={2}>
    <Grid item xs={12} sm={4}>
      <FormControl fullWidth sx={{ minWidth: 180 }}>
        <InputLabel>Division</InputLabel>
        <Select
          value={value.division || ''}
          label="Division"
          onChange={(e) => onChange({ ...value, division: e.target.value, district: '', thana: '' })}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300 // Limit dropdown height
              }
            }
          }}
        >
          {divisions.map(div => (
            <MenuItem 
              key={div} 
              value={div}
              sx={{ whiteSpace: 'normal' }} // Allows text wrapping
            >
              {div}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
    <Grid item xs={12} sm={4}>
      <FormControl fullWidth sx={{ minWidth: 180 }}>
        <InputLabel>District</InputLabel>
        <Select
          value={value.district || ''}
          label="District"
          disabled={!value.division}
          onChange={(e) => onChange({ ...value, district: e.target.value, thana: '' })}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300
              }
            }
          }}
        >
          {districts.map(dist => (
            <MenuItem 
              key={dist} 
              value={dist}
              sx={{ whiteSpace: 'normal' }}
            >
              {dist}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
    <Grid item xs={12} sm={4}>
      <FormControl fullWidth sx={{ minWidth: 180 }}>
        <InputLabel>Thana/Upazila</InputLabel>
        <Select
          value={value.thana || ''}
          label="Thana/Upazila"
          disabled={!value.district}
          onChange={(e) => onChange({ ...value, thana: e.target.value })}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300
              }
            }
          }}
        >
          {upazilas.map(upa => (
            <MenuItem 
              key={upa} 
              value={upa}
              sx={{ whiteSpace: 'normal' }}
            >
              {upa}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  </Grid>
);
};

export default LocationSelect;