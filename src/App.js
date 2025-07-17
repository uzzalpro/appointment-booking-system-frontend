// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/Layout/PrivateRoute';
import Navbar from './components/Layout/Navbar';
import Login from './components/ Auth/Login';
import Register from './components/ Auth/Register';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import DoctorDashboard from './pages/Dashboard/DoctorDashboard';
import PatientDashboard from './pages/Dashboard/PatientDashboard';
import UserProfile from './pages/Profile/UserProfile';
// import Unauthorized from './pages/Unauthorized';
import DoctorsList from './pages/Admin/DoctorsList';
import ReportsPage from './pages/Admin/Reports';
import AppointmentList from './pages/Appointments/AppointmentListPatient';
import ScheduleManager from './pages/Doctor/ScheduleManager';


function App() {
  return (
  
      <AuthProvider>
        <Navbar />
        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
          
          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/doctors" element={<DoctorsList />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
          </Route>
          
          {/* Doctor Routes */}
          <Route element={<PrivateRoute allowedRoles={['doctor']} />}>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/schedule" element={<ScheduleManager />} />
          </Route>
          
          {/* Patient Routes */}
          <Route element={<PrivateRoute allowedRoles={['patient']} />}>
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/appointments" element={<AppointmentList />} />
          </Route>
          
          {/* Common Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<UserProfile />} />
          </Route>
        </Routes>
      </AuthProvider>
  );
}

export default App;