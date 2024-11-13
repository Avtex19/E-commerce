import axiosInstance from './axiosInstance';

export const logout = async (): Promise<void> => {
    try {
        const tokens = JSON.parse(localStorage.getItem('authTokens') || '{}');
        const refreshToken = tokens.refresh;

        if (!refreshToken) {
            throw new Error('No refresh token found');
        }

        const response = await axiosInstance.post('account/logout/', {
            refresh_token: refreshToken,
        });

        if (response.status !== 205) {
            throw new Error('Logout failed');
        }


        console.log('User logged out successfully');
    } catch (error: any) {
        console.error('Error during logout:', error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || 'Logout failed');
    }
};
