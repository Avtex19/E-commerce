import axiosInstance from './axiosInstance.ts';


interface AccountUpdateData {
    username?: string;
    email?: string;
    old_password?: string;
    new_password?: string;
}

export const updateAccountDetails = async (updateData: AccountUpdateData): Promise<any> => {
    try {


        const response = await axiosInstance.patch('account/update/', updateData);

        console.log('Account updated:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error updating account:', error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || 'Failed to update account');
    }
};
