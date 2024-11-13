import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
});

axiosInstance.interceptors.request.use(
    (config) => {
        const authTokens = JSON.parse(localStorage.getItem('authTokens') || '{}');

        if (authTokens.access) {
            config.headers['Authorization'] = `Bearer ${authTokens.access}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response && error.response.status === 401) {
            const authTokens = JSON.parse(localStorage.getItem('authTokens') || '{}');
            const refreshToken = authTokens.refresh;

            if (refreshToken) {
                try {
                    const refreshResponse = await axiosInstance.post('/api/token/refresh/', {
                        refresh_token: refreshToken,
                    });

                    const newAccessToken = refreshResponse.data.access_token;

                    localStorage.setItem('authTokens', JSON.stringify({
                        access: newAccessToken,
                        refresh: refreshToken,
                    }));

                    error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;

                    return axiosInstance(error.config);
                } catch (refreshError) {
                    localStorage.removeItem('authTokens');
                }
            } else {
                localStorage.removeItem('authTokens');
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
