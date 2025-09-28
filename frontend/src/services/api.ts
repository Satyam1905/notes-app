import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const userInfo = localStorage.getItem("userInfo");
    if(userInfo) {
        const token = JSON.parse(userInfo).token;
        config.headers.authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;