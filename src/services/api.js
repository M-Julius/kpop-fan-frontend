import axios from 'axios';
export const HOST = "http://127.0.0.1:3000"

const api = axios.create({
  baseURL: `${HOST}/api`,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

api.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response?.data?.error === 'Invalid token.') {
    localStorage.removeItem('token');
    window.location = '/login';
    alert('Session expired. Please login again.');
  }
  return Promise.reject(error);
});

export default api;
