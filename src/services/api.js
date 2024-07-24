import axios from 'axios';
export const HOST = "http://127.0.0.1:3000"

const api = axios.create({
  baseURL: `${HOST}/api`,
});

api.interceptors.request.use(config => {
    console.log("REQUEST CONFIG",config)
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

export default api;
