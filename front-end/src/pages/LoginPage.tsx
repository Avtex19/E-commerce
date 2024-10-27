import React from 'react';
import { Container, Box } from '@mui/material';
import LoginForm from '../components/LoginForm';
import { getCurrentUserAdminStatus } from '../api/userService';

const LoginPage: React.FC = () => {
    const handleLoginSuccess = async (tokens: any) => {
        console.log('Tokens received:', tokens);
        localStorage.setItem('authTokens', JSON.stringify(tokens));

        const adminStatus = await getCurrentUserAdminStatus(tokens.access);
        console.log('Admin status:', adminStatus);

        if (adminStatus !== null) {
            localStorage.setItem('isAdmin', JSON.stringify(adminStatus));
        }

        console.log('Is current user admin?', adminStatus);
    };

    return (
        <Container maxWidth="sm" sx={{ padding: '1rem 0' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                }}
            >
                <LoginForm onLoginSuccess={handleLoginSuccess} />
            </Box>
        </Container>
    );
};

export default LoginPage;
