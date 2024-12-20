import React, { useEffect, useState, useCallback } from 'react';
import {
    Grid,
    Pagination,
    CircularProgress,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
} from '@mui/material';
import { fetchProducts } from '../api/productService';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../logo1.png';
import CreateProductModal from '../components/CreateProductModal/createProductModal.tsx';
import {AppBarComponent} from '../components/AppBar';
import useAuth from '../hooks/useAuth';
import {Product} from "../types/types.ts";
import useCart from "../hooks/useCart.ts";

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchingForProduct, setSearchingForProduct] = useState<string>('')
    const [searchQuery, setSearchQuery] = useState('');
    const [totalProducts, setTotalProducts] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { isLoggedIn, isAdmin, anchorEl, handleAvatarClick, handleMenuClose, handleLogout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const productsPerPage = 6;

    const { cartItems,setCartItems, handleAddToCart, handleRemoveFromCart } = useCart();





    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const pageParam = params.get('page');
        const searchParam = params.get('search');

        if (pageParam) setPage(Number(pageParam));
        if (searchParam) setSearchQuery(searchParam);
    }, []);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const data = await fetchProducts(page, searchQuery);
                setProducts(data.results);
                setTotalProducts(data.count);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, [page, searchQuery]);

    const syncUrlWithState = useCallback(() => {
        const params = new URLSearchParams(location.search);
        const pageParam = params.get('page');
        const searchParam = params.get('search');

        if (pageParam !== String(page) || searchParam !== searchQuery) {
            const newParams = new URLSearchParams();
            newParams.set('page', String(page));
            if (searchQuery) newParams.set('search', searchQuery);
            navigate(`?${newParams.toString()}`, { replace: true });
        }
    }, [page, searchQuery, location.search, navigate]);

    useEffect(() => {
        syncUrlWithState();
    }, [syncUrlWithState]);



    useEffect(() => {
        const timeOutForSearch = setTimeout(() => {
            setSearchQuery(searchingForProduct);
            setPage(1);
        }, 300);
        return () => clearTimeout(timeOutForSearch);
    }, [searchingForProduct]);

    const clearSearch = () => {
        setSearchingForProduct('');
        setPage(1);
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleCardClick = (productId: number) => {
        navigate(`/products/${productId}`);
    };

    const truncateDescription = (text: string, wordLimit: number) => {
        const words = text.split(' ');
        return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
    };

    return (
        <Box sx={{ backgroundColor: '#f4f4f9', minHeight: '100vh' }}>
            <AppBarComponent
                logo={logo}
                isAdmin={isAdmin}
                cartItems={cartItems}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                searchQuery={searchingForProduct}
                onSearchChange={(e) => setSearchingForProduct(e.target.value)}
                clearSearch={clearSearch}
                handleAvatarClick={handleAvatarClick}
                anchorEl={anchorEl}
                handleMenuClose={handleMenuClose}
                isLoggedIn={isLoggedIn}
                handleLogout={handleLogout}
                setIsModalOpen={setIsModalOpen}
                navigate={navigate}
                isProductPage={false}
                setCartItems={setCartItems}
            />

            <Box sx={{ padding: '20px' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {products.slice(0, productsPerPage).map((product) => (
                            <Grid item xs={12} sm={6} md={4} key={product.id}>
                                <Card
                                    sx={{
                                        maxWidth: 500,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                                        },
                                    }}
                                    onClick={() => handleCardClick(product.id)}
                                >
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            width: '100%',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            image={product.thumbnail}
                                            alt={product.name}
                                            sx={{
                                                height: '100%',
                                                width: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </Box>
                                    <CardContent sx={{ padding: '16px' }}>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {product.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {truncateDescription(product.description, 10)}
                                        </Typography>
                                        <Typography variant="h6" color="primary" sx={{ marginTop: '8px' }}>
                                            ${product.price.toFixed(2)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
                <Box sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                        count={Math.ceil(totalProducts / productsPerPage)}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        sx={{ padding: '16px 0' }}
                    />
                </Box>
            </Box>

            <CreateProductModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                token={localStorage.getItem('authTokens') || ''}
            />
        </Box>
    );
};

export default ProductsPage;
