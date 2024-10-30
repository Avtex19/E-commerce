import axios from 'axios';

const base_url = 'http://localhost:8000/';

const axiosInstance = axios.create({
    baseURL: base_url,
});

export const fetchProducts = async (page: number | null = 1, searchQuery: string = '') => {
    try {
        let url = 'products/?limit=6';

        if (searchQuery) {
            url += `&search=${searchQuery}`;
        }
        else if (page && page > 1) {
            url += `&offset=${(page - 1) * 6}`;
        }

        const response = await axiosInstance.get(url);
        console.log('Response data:', response.data);
        console.log("Fetching URL: ", url);

        return response.data;
    } catch (error: any) {
        console.error("Error fetching products:", error.response || error.message);
        throw new Error('Failed to fetch products');
    }
};
