import axiosInstance from "./axiosInstance.ts";

interface User {
    is_superuser: boolean;
    username: string;
    email: string;
}

export const getCurrentUserAdminStatus = async (): Promise<boolean | null> => {
    try {
        const response = await axiosInstance.get('account/info/');

        console.log('Fetched user:', response.data);

        const currentUser: User = response.data;

        console.log('Current user found:', currentUser);
        return currentUser.is_superuser;
    } catch (error: any) {
        console.error('Error fetching user status:', error);
        return null;
    }
};
