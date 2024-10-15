import React from 'react';
import {Typography, Container, Button} from '@mui/material';

const Home: React.FC = () => {
    return (
        <Container>
            <Typography variant="h3" gutterBottom>
                Home Page
            </Typography>
            <Button variant="contained">Hello world</Button>
        </Container>

    );
};

export default Home;
