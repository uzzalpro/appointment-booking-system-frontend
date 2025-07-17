import api from './axios';

export const getReports = async (month, year) => {
  const response = await api.get('/user-auth/api/v1/monthly', {
    params: { month, year }
  });
  return response.data;
};

// Modified API function to include request body if needed
export const generateReports = async (month, year) => {
  const monthNum = Number(month);
  const yearNum = Number(year);

  const response = await api.post(
    '/user-auth/api/v1/generate-monthly',
    {}, // empty body
    {
      params: { month: monthNum, year: yearNum }, // ✅ correct way
    }
  );
  return response.data;
};

 

export const getDoctorReports = async (doctorId) => {
  const response = await api.get(`/reports/doctor/${doctorId}`);
  return response.data;
};