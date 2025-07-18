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

export const searchDoctors = async (params) => {
  const response = await api.get(`/user-auth/api/v1/doctors/search`, {
    params: {
      specialization: params.specialization,
      keyword: params.keyword,
      division: params.division,
      district: params.district,
      thana: params.thana,
      is_available: params.is_available
    }
  });
  return response.data;
};

// patients