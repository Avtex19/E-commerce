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

export const editProduct = async (id: number, productData: Product): Promise<Product | null> => {
    try {
        const response = await axiosInstance.patch(`products/${id}/`, productData);

        console.log('Product updated:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error updating product:', error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || 'Failed to update product');
    }
};
