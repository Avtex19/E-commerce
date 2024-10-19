import React, { useState } from 'react';
import { Button, TextField, Typography, Alert, Box } from '@mui/material';
import { register } from '../api/registerService';
import { useNavigate } from 'react-router-dom';
import HomeIcon from "@mui/icons-material/Home";

interface RegisterFormProps {
    onRegisterSuccess: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();

        const data = { username, email, password, password2};

        try {
            await register(data);
            setSuccessMessage('Registration successful!');
            setError(null);
            onRegisterSuccess();
            navigate('/login');
        } catch (err: any) {
            setError(err.message);
            setSuccessMessage(null);
        }
    };
    const handleBackToHome = () => {
        navigate('/');
    };
    const handleToLoginPage = () => {
        navigate('/login');
    }

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
                Register
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

            <form onSubmit={handleRegister} style={{ width: '100%' }}>
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
                    label="Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <TextField
                    label="Confirm Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: 2 }}
                >
                    Register
                </Button>
            </form>
            <Typography variant="body2" sx={{ marginTop: 2,}} >
                Already have an account?{' '}
                <Typography
                    variant="body2"
                    sx={{ display: 'inline',color:'primary', textDecoration: 'underline', fontWeight: 'bold' ,cursor:'pointer'}}
                    onClick={handleToLoginPage}
                >
                    Sign In
                </Typography>
            </Typography>
        </Box>
    );
};

export default RegisterForm;
