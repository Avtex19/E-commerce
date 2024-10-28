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
    additional_images: Record<string, any>; // Adjust the type based on the structure of additional_images
}

export const getProductDetails = async (id: number): Promise<Product | null> => {
    try {
        const tokens = JSON.parse(localStorage.getItem('authTokens') || '{}');
        const accessToken = tokens.access;

        const response = await axiosInstance.get<Product>(`/api/products/${id}/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log('Product details fetched:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching product details:', error.response?.data || error.message);
        return null;
    }
};
