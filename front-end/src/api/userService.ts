import axios from 'axios';

const base_url = 'http://localhost:8000/';

const axiosInstance = axios.create({
    baseURL: base_url,
});

interface User {
    is_superuser: boolean;
    username: string;
    email: string;
}

export const getCurrentUserAdminStatus = async (token: string): Promise<boolean | null> => {
    try {
        const response = await axiosInstance.get('api/user/info/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log('Fetched user:', response.data);

        const currentUser: User = response.data;

        console.log('Current user found:', currentUser);
        return currentUser.is_superuser;
    } catch (error: any) {
        console.error('Error fetching user status:', error);
        return null;
    }
};
