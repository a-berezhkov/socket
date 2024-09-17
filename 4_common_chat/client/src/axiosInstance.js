
import axios from "axios";


const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let accessToken = "";

const SetAccessToken = (token) => {
  accessToken = token;
};

axiosInstance.interceptors.request.use((config) => {
  if (!config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      console.log(error);
      const prevRequest = error.config;
      if (error.response.status === 403 && !prevRequest.sent) {
        const response = await axios('/api/tokens/refresh');
        accessToken = response.data.accessToken;
        prevRequest.sent = true;
        prevRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(prevRequest);
      }
      return Promise.reject(error);
    },
  );
  
  
  
  export { SetAccessToken, accessToken };
  export default axiosInstance;
  
