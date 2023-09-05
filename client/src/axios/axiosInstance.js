import axios from "axios";


const axiosInstance = axios.create({
    baseURL : process.env.REACT_APP_BASE_URL,
    withCredentials : true,
})


axiosInstance.interceptors.response.use(
    async(response)=>{
        return response
    },
    async(err)=>{
        console.log(err)
        if (err.response?.status === 401) {
            try {
                await axiosInstance.post('/auth/refresh-token');
                console.log("new access token generated");
                  
                const originalRequest = err.config;
                return axiosInstance(originalRequest);
            } catch (refreshErr) {
                console.log(refreshErr);
                console.log("Failed to regenerate new access token")
                
            }
        }

        return Promise.reject(err);
    }
);


export default axiosInstance;