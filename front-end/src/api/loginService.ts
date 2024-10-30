import axios from 'axios';

const base_url = 'http://localhost:8000/';

const axiosInstance = axios.create({
    baseURL: base_url,
});

interface LoginData {
    username: string;
    password: string;
}

export const login = async (data: LoginData) => {
    try {
        const response = await axiosInstance.post('account/login/', data);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            throw new Error('Invalid credentials');
        } else {
            throw new Error('Something went wrong');
        }
    }
};
