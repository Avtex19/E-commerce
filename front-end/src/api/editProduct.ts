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
    additional_images: string[];
}

export const editProduct = async (id: number, productData: Product): Promise<Product | null> => {
    try {
        const tokens = JSON.parse(localStorage.getItem('authTokens') || '{}');
        const accessToken = tokens.access;

        const response = await axiosInstance.patch(`products/${id}/`, productData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log('Product updated:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error updating product:', error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || 'Failed to update product');
    }
};
