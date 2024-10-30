import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CircularProgress, Typography, Snackbar, Alert } from '@mui/material';
import { getProductDetails } from "../api/getProductDetails";
import { deleteProduct } from "../api/deleteProduct";
import ProductCard from "../components/productCard";
import AppBarComponent from '../components/AppBarComponent';
import logo from "../../logo1.png";
import useAuth from '../hooks/useAuth';

const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

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

    const handleDelete = async (productId: number) => {
        try {
            await deleteProduct(productId);
            setSnackbarMessage('Product deleted successfully.');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (error) {
            setSnackbarMessage('Failed to delete product.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
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

            <ProductCard product={product} onDelete={handleDelete} />

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ProductDetails;
