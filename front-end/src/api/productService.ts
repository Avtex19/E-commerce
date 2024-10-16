import axios from 'axios';

const base_url = 'http://localhost:8000/';

const axiosInstance = axios.create({
    baseURL: base_url,
});

export const products = async (page?: string | null) => {
    try {
        const response = await axiosInstance.get(`/api/products?page=${page}`);
        return response.data;
    } catch (error: any) {
        return error;
    }
};
