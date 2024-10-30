import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CircularProgress, Typography, IconButton } from '@mui/material';
import { getProductDetails } from "../api/getProductDetails";
import ProductCard from "../components/productCard";
import AppBarComponent from '../components/AppBarComponent';
import logo from "../../logo.png";
import useAuth from '../hooks/useAuth';

const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const { isLoggedIn, isAdmin, anchorEl, handleAvatarClick, handleMenuClose, handleLogout } = useAuth();

    useEffect(() => {
        const fetchProductDetails = async () => {
            const productDetails = await getProductDetails(Number(id));
            setProduct(productDetails);
            setLoading(false);
        };

        fetchProductDetails();
    }, [id]);

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (!product) {
        return <Typography variant="h6">Product not found</Typography>;
    }

    return (
        <div>
            <AppBarComponent
                logo={logo}
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                clearSearch={clearSearch}
                isAdmin={isAdmin}
                handleAvatarClick={handleAvatarClick}
                anchorEl={anchorEl}
                handleMenuClose={handleMenuClose}
                handleLogout={handleLogout}
                isLoggedIn={isLoggedIn}
                navigate={navigate}
                setIsModalOpen={() => {}}
                isProductPage={true}
            />
            <IconButton
                aria-label="home"
                onClick={() => navigate('/')}
                sx={{ position: 'absolute', top: 16, left: 16 }}
            >

            </IconButton>
            <ProductCard product={product} />
        </div>
    );
};

export default ProductDetails;
