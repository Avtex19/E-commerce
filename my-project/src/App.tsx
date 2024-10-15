import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Container } from '@mui/material';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import RegisterPage from "./pages/RegisterPage";

const App: React.FC = () => {
    const location = useLocation();

    return (
        <>
            {location.pathname !== '/login' && location.pathname !== '/register' && <Header />}


            <Container>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Routes>
            </Container>
        </>
    );
};

export default App;
