// src/pages/Home.tsx
import React from 'react';
import { Button } from '@mui/material';

const Home: React.FC = () => {
    return (
        <div>
            <h1>Welcome to the Home Page!</h1>
            <Button variant="contained" color="primary">
                Click Me
            </Button>
        </div>
    );
};

export default Home;
