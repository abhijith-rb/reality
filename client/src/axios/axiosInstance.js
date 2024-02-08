// import axios from 'axios';
// const BASE_URL = process.env.REACT_APP_BASE_URL;

// export const axiosPublic = axios.create({
//     baseURL: BASE_URL
// });

// export default axios.create({
//     baseURL: BASE_URL,
//     headers: { 'Content-Type': 'application/json' },
//     withCredentials: true
// });

// import axios from "axios";

// const axiosInstance = axios.create({
//     baseURL : process.env.REACT_APP_BASE_URL,
//     withCredentials : true,
// })


// axiosInstance.interceptors.response.use(
//   async (response) => {
//     return response;
//   },
//   async (err) => {
//     console.log(err);

//     let retryCount = 0;
//     const maxRetries = 3;

//     if (err.response?.status === 401) {
//       if (retryCount < maxRetries) {
//         try {
//           if(err.config.url !== '/auth/refresh-token'){
//             await axiosInstance.post('/auth/refresh-token');
//             console.log("New access token generated");
//             console.log("Retry count",retryCount)
  
//             const originalRequest = err.config;
//             retryCount++; 
//             return axiosInstance(originalRequest);
//           }else{
//             console.log("Error in refresh token generating")
//           }
//         } catch (refreshErr) {
//           console.log(refreshErr);
//           console.log("Failed to regenerate new access token");
//         }
//       } else {
//         console.log("Maximum retry limit reached. Aborting.");
//       }
//     }

//     return Promise.reject(err);
//   }
// );



// export default axiosInstance;