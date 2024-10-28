import React, { useEffect, useState } from 'react';
import {
    Grid,
    Pagination,
    CircularProgress,
    Card,
    CardContent,
    CardMedia,
    Typography, Box,
} from '@mui/material';
import { fetchProducts } from "../api/productService.ts";
import { logout } from "../api/logoutService.ts";
import {useLocation, useNavigate} from 'react-router-dom';
import logo from '../../logo.png';
import CreateProductModal from "../components/createProductModal.tsx";
import AppBarComponent from "../components/AppBarComponent.tsx";

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [totalProducts, setTotalProducts] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authTokens'));
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const token = localStorage.getItem('authTokens') || '';

    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const pageParam = params.get('page');
        const searchParam = params.get('search');

        if (pageParam) {
            setPage(Number(pageParam));
        }
        if (searchParam) {
            setSearchQuery(searchParam);
        }
    }, [location.search]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
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

    useEffect(() => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        if (searchQuery) {
            params.set('search', searchQuery);
        }
        navigate(`?${params.toString()}`, { replace: true });
    }, [page, searchQuery, navigate]);


    useEffect(() => {
        const adminStatus = localStorage.getItem('isAdmin') === 'true';
        setIsAdmin(adminStatus);
    }, [isLoggedIn]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPage(1);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setPage(1);
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };
    const handleLogout = async () => {
        try {
            const tokens = JSON.parse(localStorage.getItem('authTokens') || '{}');
            const refreshToken = tokens.refresh;

            await logout(refreshToken);

            localStorage.removeItem('authTokens');
            localStorage.removeItem('isAdmin');
            setIsLoggedIn(false);
            setIsAdmin(false);
            handleMenuClose();
        } catch (error: unknown) {
            console.error('Logout error:', error);
        }
    };

    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const truncateDescription = (text: string, wordLimit: number) => {
        const words = text.split(' ');
        return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
    };
    const handleCardClick = (productId: number) => {
        navigate(`/products/${productId}`);
    };




    return (
        <Box>
            <AppBarComponent
                logo={logo}
                isAdmin={isAdmin}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                clearSearch={clearSearch}
                handleAvatarClick={handleAvatarClick}
                anchorEl={anchorEl}
                handleMenuClose={handleMenuClose}
                isLoggedIn={isLoggedIn}
                handleLogout={handleLogout}
                setIsModalOpen={setIsModalOpen}
                navigate={navigate}
                isProductPage={false}
            />

            <Box sx={{ padding: '20px' }}>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <Grid container spacing={4}>
                            {products.map((product) => (
                                <Grid item xs={12} sm={6} md={4} key={product.id}>
                                    <Card sx={{
                                        maxWidth: 400,
                                        height: '100%',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                        },
                                    }}onClick={() => handleCardClick(product.id)}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={product.thumbnail}
                                            alt={product.name}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5">{product.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {truncateDescription(product.description, 4)}
                                            </Typography>
                                            <Typography variant="h6" color="primary">
                                                ${product.price.toFixed(2)}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </>
                )}

                <Pagination
                    count={Math.ceil(totalProducts / 6)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
                />
            </Box>

            <CreateProductModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                token={token}
            />
        </Box>
    );
};

export default ProductsPage;
