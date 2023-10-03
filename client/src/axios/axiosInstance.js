import axios from "axios";


const axiosInstance = axios.create({
    baseURL : process.env.REACT_APP_BASE_URL,
    withCredentials : true,
})


axiosInstance.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (err) => {
    console.log(err);

    let retryCount = 0;
    const maxRetries = 6;

    if (err.response?.status === 401) {
      if (retryCount < maxRetries) {
        try {
          await axiosInstance.post('/auth/refresh-token');
          console.log("New access token generated");

          const originalRequest = err.config;
          retryCount++; 
          return axiosInstance(originalRequest);
        } catch (refreshErr) {
          console.log(refreshErr);
          console.log("Failed to regenerate new access token");
        }
      } else {
        console.log("Maximum retry limit reached. Aborting.");
      }
    }

    return Promise.reject(err);
  }
);



export default axiosInstance;