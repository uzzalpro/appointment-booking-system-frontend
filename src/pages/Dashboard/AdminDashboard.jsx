// src/pages/Dashboard/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { getReports } from '../../api/reports';

import DoctorsList from '../Admin/DoctorsList';
import Reports from '../Admin/Reports';
import AppointmentListAdmin from '../Appointments/AppointmentListAdmin';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReports();
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };
    fetchReports();
  }, []);

  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Admin Dashboard</Typography>
      <Typography>Welcome, {user?.full_name}</Typography>
      
      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
        <Tab label="Monthly Reports" />
        <Tab label="Doctor Management" />
        <Tab label="All Appointments" />
      </Tabs>
      
      {tabValue === 0 && (
        <Reports/>
      )}
      {tabValue === 1 && <DoctorsList />}
      {tabValue === 2 && <AppointmentListAdmin />}
    </Box>
  );
};

export default AdminDashboard;