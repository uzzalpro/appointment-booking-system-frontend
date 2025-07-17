import api from './axios';
import axios from 'axios'; // if you're using raw axios directly

export const getDoctors = async () => {
  const response = await api.get('/user-auth/api/v1/get-doctor-list');
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get('/user-auth/api/v1/users');
  return response.data;
};

// export const getUserById = async (userId) => {
//   const response = await api.get(`/user-auth/api/v1/get-user/${userId}`);
//   return response.data;
// };
export const getUserById = async (userId) => {
  const response = await api.get(`/user-auth/api/v1/get-user/${userId}`);
  
  // Add full image URL to the response if profile_image exists
  if (response.data.profile_image) {
    response.data.imageUrl = `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'}/static/uploads/${response.data.profile_image}`;
  }
  
  return response.data;
};
// export const updateUser = async (userId, userData) => {
//   const response = await api.patch(`/user-auth/api/v1/update-user/${userId}`, userData);
//   return response.data;
// };
// export const updateUser = async (userId, userData) => {
//   const formData = new FormData();

//   for (const key in userData) {
//     if (userData[key] !== undefined && userData[key] !== null) {
//       formData.append(key, userData[key]);
//     }
//   }

//   const response = await api.put(
//     `/user-auth/api/v1/update-user/${userId}`,
//     formData,
//     {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     }
//   );

//   return response.data;
// };

export const updateUser = async (userId, formData, config = {}) => {
  try {
    const response = await api.put(
      `/user-auth/api/v1/update-user/${userId}`,
      formData,
      {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config.headers,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateDoctor = async (userId, userData) => {
  const formData = new FormData();

  for (const key in userData) {
    if (userData[key] !== undefined && userData[key] !== null) {
      formData.append(key, userData[key]);
    }
  }

  const response = await api.put(
    `/user-auth/api/v1/doctors/${userId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/user-auth/api/v1/users/${userId}`);
  return response.data;
};