import axiosInstance from "./axiosInstance.ts";


interface Product {
    category: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    thumbnail: string;
    additional_images: string[];
}

export const createProduct = async (productData: Product): Promise<Product | null> => {
    try {

        const response = await axiosInstance.post('products/', productData);
        console.log('Product created:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error creating product:', error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || 'Failed to create product');
    }
};
