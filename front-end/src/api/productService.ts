import axios from 'axios';

const base_url = 'http://localhost:8000/';

const axiosInstance = axios.create({
    baseURL: base_url,
});

export const products = async (page?: string | null, searchQuery?: string) => {
    try {
        const url = searchQuery
            ? `/api/products?page=${page}&search=${searchQuery}`
            : `/api/products?page=${page}`;

        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error: any) {
        return error;
    }
};
