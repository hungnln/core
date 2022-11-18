import axios from 'axios';

// ----------------------------------------------------------------------
export const DOMAIN = 'https://convenient-way.azurewebsites.net'
export const ACCESSTOKEN = 'accessToken'
export const token = localStorage.getItem(ACCESSTOKEN)
const axiosInstance = axios.create({
  baseURL: DOMAIN,
  timeout: 30000,
});

axiosInstance.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    ['Authorization']: token ? `Bearer ${token}` : '',

  }
  return config;
}, (error) => { return Promise.reject(error) })

export default axiosInstance;
