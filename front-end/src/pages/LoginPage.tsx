import React from 'react';
import { Container, Box, } from '@mui/material';
import LoginForm from '../components/LoginForm';

const LoginPage: React.FC = () => {

    const handleLoginSuccess = (tokens: any) => {
        console.log('Tokens received:', tokens);
        localStorage.setItem('authTokens', JSON.stringify(tokens));
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
