import React from 'react';
import { Typography, Container } from '@mui/material';

const About: React.FC = () => {
    return (
        <Container>
            <Typography variant="h3" gutterBottom>
                About Page
            </Typography>
            <Typography variant="body1">
                This is the About Page for the Vite + React + TypeScript app.
            </Typography>
        </Container>
    );
};

export default About;
