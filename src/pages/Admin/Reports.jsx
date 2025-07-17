import { useState } from 'react';
import { getReports, generateReports } from '../../api/reports';
import { Table, Alert, Button, TextField, Box, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material';

const Reports = () => {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReports(month, year);
      setReports(data);
    } catch (err) {
      setError('Failed to fetch reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReports = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const newReports = await generateReports(month, year);
      setReports(newReports);
      setSuccess('Reports generated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate reports');
    } finally {
      setLoading(false);
    }
  };

  const handleCurrentMonth = () => {
    const now = new Date();
    setMonth(now.getMonth() + 1);
    setYear(now.getFullYear());
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Monthly Reports</Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <TextField
          label="Month"
          type="number"
          value={month}
          onChange={(e) => setMonth(Math.max(1, Math.min(12, parseInt(e.target.value) || 1)))}
          inputProps={{ min: 1, max: 12 }}
          sx={{ width: 100 }}
        />
        <TextField
          label="Year"
          type="number"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value) || new Date().getFullYear())}
          sx={{ width: 100 }}
        />
        <Button 
          variant="outlined" 
          onClick={handleCurrentMonth}
          sx={{ ml: 1 }}
        >
          Current Month
        </Button>
        <Button 
          variant="contained" 
          onClick={handleFetchReports}
          disabled={loading}
          sx={{ ml: 1 }}
        >
          {loading ? 'Loading...' : 'Get Reports'}
        </Button>
        <Button 
          variant="contained" 
          color="secondary"
          onClick={handleGenerateReports}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate New'}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Doctor</TableCell>
              <TableCell>Month/Year</TableCell>
              <TableCell>Patient Visits</TableCell>
              <TableCell>Appointments</TableCell>
              <TableCell>Earnings</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.doctor_name || `Doctor ${report.doctor_id}`}</TableCell>
                  <TableCell>{report.month}/{report.year}</TableCell>
                  <TableCell>{report.total_patient_visits}</TableCell>
                  <TableCell>{report.total_appointments}</TableCell>
                  <TableCell>${report.total_earnings?.toFixed(2) || '0.00'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No reports found for {month}/{year}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Reports;