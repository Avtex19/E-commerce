import React, { useState } from 'react';
import { Button, TextField, Typography, Alert, Box } from '@mui/material';
import { login } from '../api/loginService';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

interface LoginFormProps {
    onLoginSuccess: (tokens: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const tokens = await login({ username, password });
            setSuccessMessage('Login successful!');
            setError(null);
            onLoginSuccess(tokens);
            navigate('/');
        } catch (err: any) {
            setError(err.message);
            setSuccessMessage(null);
        }
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    const handleToRegisterPage = () => {
        navigate('/register');
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 2,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: 'white',
                position: 'relative',
                width: '400px',
                maxWidth: '100%',
                margin: '0 auto',
            }}
        >
            <HomeIcon
                color="primary"
                onClick={handleBackToHome}
                sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    cursor: 'pointer',
                    fontSize: 40,
                }}
            />
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>

            {error && (
                <Alert severity="error" sx={{ width: '100%', marginBottom: 2 }}>
                    {error}
                </Alert>
            )}
            {successMessage && (
                <Alert severity="success" sx={{ width: '100%', marginBottom: 2 }}>
                    {successMessage}
                </Alert>
            )}

            <form onSubmit={handleLogin} style={{ width: '100%' }}>
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: 2 }}
                >
                    Login
                </Button>
            </form>

            <Typography variant="body2" sx={{ marginTop: 2 }}>
                Don't have an account?{' '}
                <span
                    onClick={handleToRegisterPage}
                    style={{ textDecoration: 'underline', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    Sign up
                </span>
            </Typography>
        </Box>
    );
};

export default LoginForm;
