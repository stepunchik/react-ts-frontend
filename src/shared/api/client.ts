import axios from 'axios';

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;
        if (response?.status === 401) {
            localStorage.removeItem('ACCESS_TOKEN');
        }

        return Promise.reject(error);
    }
);

export const GET = (url: string, config = {}) => axiosClient.get(url, config);
export const POST = (url: string, data = {}, config = {}) => axiosClient.post(url, data, config);
export const PUT = (url: string, data = {}, config = {}) => axiosClient.put(url, data, config);
export const PATCH = (url: string, data = {}, config = {}) => axiosClient.patch(url, data, config);
export const DELETE = (url: string, config = {}) => axiosClient.delete(url, config);

export default axiosClient;
