import api from './axios';

export const login = async (credentials) => {
  const response = await api.post('/user-auth/api/v1/login', credentials);
  return response.data;
};

// export const register = async (userData) => {
//   const response = await api.post('/user-register', userData);
//   return response.data;
// };

export const register = async (userData) => {
  // Remove undefined/null values and convert to pure JSON
  const payload = Object.keys(userData).reduce((acc, key) => {
    if (userData[key] !== undefined && userData[key] !== null) {
      acc[key] = userData[key];
    }
    return acc;
  }, {});

  const response = await api.post('/user-auth/api/v1/user-register', payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};


export const logout = () => {
  // Clear token from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = async () => {
  const response = await api.get('/user-auth/api/v1/users/me');
  return response.data;
};