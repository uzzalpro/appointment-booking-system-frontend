export const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  PATIENT: 'patient'
};

export const hasRole = (user, role) => {
  return user?.user_type === role;
};

export const hasAnyRole = (user, roles) => {
  return roles.includes(user?.user_type);
};