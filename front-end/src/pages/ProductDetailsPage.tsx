import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CircularProgress, Typography, Snackbar, Alert } from '@mui/material';
import { getProductDetails } from "../api/getProductDetails";
import { deleteProduct } from "../api/deleteProduct";
import { ProductCard } from "../components/ProductCard";
import { AppBarComponent } from '../components/AppBar';
import logo from "../../logo1.png";
import useAuth from '../hooks/useAuth';
import {addToCart, getCart, removeFromCart} from "../stores/cartStore.ts";
import {Product} from "../types/types.ts";

const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [cartItems, setCartItems] = useState<Product[]>(getCart());


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

    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
            setCartItems(getCart());

            setSnackbarMessage('Product added to cart successfully.');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        }
    };

    const handleRemoveFromCart = (productId: number) => {
        removeFromCart(productId);
        setCartItems(getCart());

        setSnackbarMessage('Product removed from cart!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);

        setProduct((prevProduct: Product | null) =>
            prevProduct ? { ...prevProduct, isInCart: false } : prevProduct
        );
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
                onRemoveFromCart={handleRemoveFromCart}
                cartItems={getCart()}
                onAddToCart={handleAddToCart}


            />

            <ProductCard
                product={{ ...product, isInCart: cartItems.some(item => item.id === product.id) }} // Add isInCart based on current cart state
                onDelete={handleDelete}
                onAddToCart={handleAddToCart}
                isInCart={cartItems.some(item => item.id === product.id)} // Pass isInCart state
            />

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ProductDetails;
