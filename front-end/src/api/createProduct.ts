import axios from 'axios';

const base_url = 'http://localhost:8000/';

const axiosInstance = axios.create({
    baseURL: base_url,
});

interface Product {
    category: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    thumbnail: string;
    additional_images: Record<string, any>;
}

export const createProduct = async (productData: Product): Promise<Product | null> => {
    try {
        const tokens = JSON.parse(localStorage.getItem('authTokens') || '{}');
        const accessToken = tokens.access;

        const response = await axiosInstance.post('products/', productData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log('Product created:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error creating product:', error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || 'Failed to create product');
    }
};
