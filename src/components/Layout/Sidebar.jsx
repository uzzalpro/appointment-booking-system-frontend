import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  CalendarToday as AppointmentsIcon,
  Assignment as ReportsIcon,
  Schedule as ScheduleIcon,
  Person as ProfileIcon
} from '@mui/icons-material';

const Sidebar = () => {
  const { user } = useAuth();

  const patientItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/patient/dashboard' },
    { text: 'Appointments', icon: <AppointmentsIcon />, path: '/patient/appointments' },
    { text: 'Profile', icon: <ProfileIcon />, path: '/profile' }
  ];

  const doctorItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/doctor/dashboard' },
    { text: 'Schedule', icon: <ScheduleIcon />, path: '/doctor/schedule' },
    { text: 'Profile', icon: <ProfileIcon />, path: '/profile' }
  ];

  const adminItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Doctors', icon: <PeopleIcon />, path: '/admin/doctors' },
    { text: 'Reports', icon: <ReportsIcon />, path: '/admin/reports' }
  ];

  const items = user?.user_type === 'admin' ? adminItems : 
               user?.user_type === 'doctor' ? doctorItems : patientItems;

  return (
    <Drawer variant="permanent" anchor="left">
      <List>
        {items.map((item) => (
          <ListItem button key={item.text} component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </Drawer>
  );
};

export default Sidebar;