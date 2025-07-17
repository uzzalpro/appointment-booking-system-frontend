// src/api/appointments.js
import api from './axios';

export const getPatientAppointments = async (patientId) => {
  const response = await api.get(`/user-auth/api/v1/get_appointment_list_by_user`);
  return response.data;
};

export const bookAppointment = async (appointmentData) => {
  const response = await api.post('/user-auth/api/v1/book_appointment', appointmentData);
  return response.data;
};

// export const updateAppointmentStatus = async (appointmentId, status) => {
//   const response = await api.patch(`/appointments/${appointmentId}/status`, { status });
//   return response.data;
// };

// export const getAppointments = async () => {
//   const response = await api.get(`/user-auth/api/v1/get_appointment_list`);
//   return response.data;
// };

export const getAppointmentsByAdmin = async () => {
  const response = await api.get(`/user-auth/api/v1/get_appointment_list?skip=0&limit=10`);
  return response.data;
};

export const getAppointmentsByDoctor = async () => {
  const response = await api.get(`/user-auth/api/v1/doctor/appointments?skip=0&limit=10`);
  return response.data;
};

export const updateAppointment = async (id, appointmentData) => {
  const response = await api.put(`/user-auth/api/v1/update_appointment/${id}`, appointmentData);
  return response.data;
};

export const updateAppointmentStatus = async (id, appointmentData) => {
  const response = await api.put(`/user-auth/api/v1/doctor/update_appointment_status/${id}`, appointmentData);
  return response.data;
};

export const deleteAppointment = async (id) => {
  const response = await api.delete(`/user-auth/api/v1/delete_appointment/${id}`);
  return response.data;
};