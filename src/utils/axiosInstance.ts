import axios from "axios";
// import Router from 'next/navigation';

// Axios instance
const axiosInstance = axios.create({
  baseURL: "",
  // Axios configuration options here
});

// Interceptor to handle 301 redirects
axiosInstance.interceptors.response.use(
  response => {
    // If the response is successful, just return the response
    return response;
  },
  error => {
    const { response } = error;
    if (response && response.status === 403) {
      // Router.useRouter().push("/forbidden")
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;