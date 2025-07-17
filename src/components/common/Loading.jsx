import { CircularProgress, Box } from '@mui/material';

const Loading = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <CircularProgress size={80} />
    </Box>
  );
};

export default Loading;