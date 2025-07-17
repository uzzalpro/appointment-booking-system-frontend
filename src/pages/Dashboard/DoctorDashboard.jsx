// src/pages/Dashboard/DoctorDashboard.jsx
import { useState, useEffect } from 'react';
import { Box, Typography, Button,Tabs, Tab } from '@mui/material';
import AppointmentListDoctor from '../Appointments/AppointmentListDoctor';
import ScheduleManager from '../Doctor/ScheduleManager';
import { useAuth } from '../../context/AuthContext';


const DoctorDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const { user, fullName, availableTimeslots } = useAuth();
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Doctor Dashboard</Typography>
      <Typography>Welcome, Dr. {fullName}</Typography>
      
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
        <Tab label="Schedule Manager" />
        <Tab label="All Appointments" />
      </Tabs>
      
      {tabValue === 0 && <ScheduleManager />}
      {tabValue === 1 && <AppointmentListDoctor />}
    </Box>
  );
};

export default DoctorDashboard;