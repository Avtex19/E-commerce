import React from 'react';
import { Typography, Button, Container } from '@mui/material';

const Home: React.FC = () => {
    return (
        <Container>
            <Typography variant="h3" gutterBottom>
                Home Page
            </Typography>
            <Button variant="contained" color="primary">
                Go to About
            </Button>
        </Container>
    );
};

export default Home;
