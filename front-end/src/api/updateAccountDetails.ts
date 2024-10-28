import axios from 'axios';

const base_url = 'http://localhost:8000/';

const axiosInstance = axios.create({
    baseURL: base_url,
});

interface AccountUpdateData {
    username?: string;
    email?: string;
    old_password?: string;
    new_password?: string;
}

export const updateAccountDetails = async (updateData: AccountUpdateData): Promise<any> => {
    try {
        const tokens = JSON.parse(localStorage.getItem('authTokens') || '{}');
        const accessToken = tokens.access;

        const response = await axiosInstance.patch('api/account/update/', updateData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log('Account updated:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error updating account:', error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || 'Failed to update account');
    }
};
