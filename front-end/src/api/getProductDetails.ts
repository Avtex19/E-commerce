import axios from 'axios';

const base_url = 'http://localhost:8000/';

const axiosInstance = axios.create({
    baseURL: base_url,
});

interface Product {
    id: number;
    category: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    thumbnail: string;
    additional_images: string[];
}

export const getProductDetails = async (id: number): Promise<Product | null> => {
    try {
        const response = await axiosInstance.get<Product>(`/api/products/${id}/`);
        console.log('Product details fetched:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching product details:', error.response?.data || error.message);
        return null;
    }
};