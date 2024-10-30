import axios from 'axios';

const base_url = 'http://localhost:8000/';

const axiosInstance = axios.create({
    baseURL: base_url,
});

export const logout = async (refreshToken: string) => {
    try {
        const tokens = JSON.parse(localStorage.getItem('authTokens') || '{}');
        const accessToken = tokens.access;

        const response = await axiosInstance.post(
            'account/logout/',
            {
                refresh_token: refreshToken,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (response.status !== 205) {
            throw new Error('Logout failed');
        }
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || 'Logout failed');
    }
};
