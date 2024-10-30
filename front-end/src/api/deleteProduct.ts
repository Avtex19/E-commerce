import axios from 'axios';

const base_url = 'http://localhost:8000/';

const axiosInstance = axios.create({
    baseURL: base_url,
});

export const deleteProduct = async (id: number): Promise<void> => {
    try {
        const tokens = JSON.parse(localStorage.getItem('authTokens') || '{}');
        const accessToken = tokens.access;

        const response = await axiosInstance.delete(`products/${id}/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (response.status !== 204) {
            throw new Error('Delete failed');
        }
    } catch (error: any) {
        console.error('Error deleting product:', error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || 'Error deleting product');
    }
};
