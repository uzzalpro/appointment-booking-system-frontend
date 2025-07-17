import api from './axios';

// export const searchDoctors = async (filters) => {
//   const params = new URLSearchParams(filters);
//   const response = await api.get(`/user-auth/api/v1/doctors/search?${params.toString()}`);
//   return response.data;
// };

export const searchPatients = async (search) => {
  const response = await api.get(`/user-auth/api/v1/patients/search?search=${search}`);
  return response.data;
};

export const searchDoctors = async (keyword) => {
  const response = await api.get(`/user-auth/api/v1/doctors/search`, {
    params: { keyword }
  });
  return response.data;
};

// patients