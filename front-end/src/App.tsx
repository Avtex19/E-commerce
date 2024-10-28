import React from 'react';
import { Routes, Route} from 'react-router-dom';
import { Container } from '@mui/material';
import LoginPage from './pages/LoginPage';
import RegisterPage from "./pages/RegisterPage";
import ProductPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage.tsx";

const App: React.FC = () => {

    return (
        <>
            <Container>
                <Routes>
                    <Route path="/" element={<ProductPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage/>}/>
                    <Route path="/products/:id" element={<ProductDetailsPage />} />


                </Routes>
            </Container>
        </>
    );
};

export default App;
