import React from 'react';
import { Button, Typography, Container } from '@mui/material';

const App: React.FC = () => {
    return (
        <Container>
            <Typography variant="h3" gutterBottom>
                Welcome to My Vite + React + TypeScript Project!
            </Typography>
            <Button variant="contained" color="primary">
                Click Me
            </Button>
        </Container>
    );
};

export default App;
