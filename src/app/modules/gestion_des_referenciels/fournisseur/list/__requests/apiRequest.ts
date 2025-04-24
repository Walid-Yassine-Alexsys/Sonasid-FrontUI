import axios from 'axios';
const baseUrl = "http://localhost:5173/metronic8/react/demo8/api/"

const axiosInstance = axios.create({
    baseURL : baseUrl,
    headers:{
        'Content-Type' : 'application/json',
    },
})

export default axiosInstance;