import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://669b3f09276e45187d34eb4e.mockapi.io/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize error shape
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong. Please try again.';

    return Promise.reject({
      ...error,
      message,
    });
  }
);

export default axiosClient;

