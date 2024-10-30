import { useState, useEffect } from 'react';
import { logout as logoutApi } from '../api/logoutService';

const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authTokens'));
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        const adminStatus = localStorage.getItem('isAdmin') === 'true';
        setIsAdmin(adminStatus);
    }, [isLoggedIn]);

    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            const tokens = JSON.parse(localStorage.getItem('authTokens') || '{}');
            const refreshToken = tokens.refresh;

            await logoutApi(refreshToken);

            localStorage.removeItem('authTokens');
            localStorage.removeItem('isAdmin');
            setIsLoggedIn(false);
            setIsAdmin(false);
            handleMenuClose();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return {
        isLoggedIn,
        isAdmin,
        anchorEl,
        handleAvatarClick,
        handleMenuClose,
        handleLogout,
    };
};

export default useAuth;
