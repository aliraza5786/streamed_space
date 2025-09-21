import api from "../libs/api";

export const login = (payload: { u_email: string; u_password: string }) => {
  console.log('Login request payload:', payload);
  return api.post("/auth/login", payload).then((res) => {
    console.log('Login response:', res.data);
    return res.data;
  }).catch((err) => {
    console.error('Login service error:', err);
    throw err;
  });
};
  
export const register = (payload: {
  u_full_name: string;
  u_email: string;
  u_password: string;
}) => api.post("/auth/signup", payload).then((res) => res.data);

export const verifyOtp = (payload: { u_email: string; otp: string }) =>
  api.post("/auth/verify-otp", payload).then((res) => res.data);

export const resendOtp = (payload: { u_email: string }) =>
  api.post("/auth/resend-otp", payload).then((res) => res.data);

export const socailLogin = (payload: {
  u_email: string;
  u_password?: string;
  u_social_id?: string;
  u_social_type?: string;
  u_full_name?: string;
}) => api.post('/auth/login', payload).then(res => res.data);



