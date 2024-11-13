import { useState, useEffect } from 'react';
import { logout as logoutApi } from '../api/logoutService';

const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authTokens'));
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        const tokens = JSON.parse(localStorage.getItem('authTokens') || '{}');
        const isValid = tokens && tokens.access && tokens.refresh;

        if (!isValid) {
            setIsLoggedIn(false);
        }

        const adminStatus = localStorage.getItem('isAdmin') === 'true';
        setIsAdmin(adminStatus);
    }, []);
    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            await logoutApi();
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
