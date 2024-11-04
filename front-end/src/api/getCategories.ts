import axios from 'axios';

const base_url = 'http://localhost:8000/';

const axiosInstance = axios.create({
    baseURL: base_url,
});

interface Category {
    id: number;
    name: string;
}

interface CategoryResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Category[];
}

export const getCategories = async (): Promise<Category[] | null> => {
    try {
        const response = await axiosInstance.get<CategoryResponse>('categories/');
        console.log('Categories fetched:', response.data.results);
        return response.data.results;
    } catch (error: any) {
        console.error('Error fetching categories:', error.response?.data || error.message);
        return null;
    }
};
