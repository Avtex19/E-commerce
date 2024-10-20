import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    AppBar,
    Toolbar,
    Card,
    CardMedia,
    CardContent,
    CircularProgress,
    Pagination,
    IconButton,
    Grid,
    TextField,
} from '@mui/material';
import { products } from '../api/productService';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import MenuIcon from '@mui/icons-material/Menu';
import { Global, css } from '@emotion/react';

interface ProductData {
    id: number;
    category: string;
    subcategory: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    thumbnail: string;
}

interface ProductResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ProductData[];
}

const ProductPage: React.FC = () => {
    const [productList, setProductList] = useState<ProductData[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const itemsPerPage = 6;
    const page = parseInt(searchParams.get('page') || '1', 10);

    useEffect(() => {
        const authTokens = localStorage.getItem('authTokens');
        if (authTokens) {
            const parsedTokens = JSON.parse(authTokens);
            setIsLoggedIn(!!parsedTokens.access);
        }
    }, []);

    const fetchProducts = async (page: string | null, searchQuery: string) => {
        try {
            const data: ProductResponse = await products(page, searchQuery);
            setProductList(data.results);
            setTotalPages(Math.ceil(data.count / itemsPerPage));
        } catch (error: any) {
            setError('Failed to fetch products');
        }
    };

    useEffect(() => {
        fetchProducts(searchParams.get('page'), searchQuery);
    }, [page, searchQuery]);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
        setSearchParams({ page: newPage.toString() });
    };

    const handleLogout = async () => {
        try {
            const authTokens = localStorage.getItem('authTokens');
            if (authTokens) {
                const parsedTokens = JSON.parse(authTokens);
                const response = await axios.post(
                    'http://localhost:8000/api/logout/',
                    { refresh_token: parsedTokens.refresh },
                    {
                        headers: {
                            Authorization: `Bearer ${parsedTokens.access}`,
                        },
                    }
                );

                if (response.status === 205) {
                    localStorage.removeItem('authTokens');
                    setIsLoggedIn(false);
                }
            }
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    return (
        <>
            <Global
                styles={css`
                    .MuiContainer-root.MuiContainer-maxWidthLg {
                        max-width: none !important;
                    }
                `}
            />
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                Techno Mix
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                placeholder="Search Products"
                                variant="outlined"
                                size="small"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                sx={{
                                    backgroundColor: 'white',
                                    borderRadius: 1,
                                    marginRight: 2,
                                    width: '300px',
                                }}
                            />
                            <Button
                                color="inherit"
                                component={Link}
                                to={isLoggedIn ? '#' : '/login'}
                                onClick={isLoggedIn ? handleLogout : undefined}
                                sx={{
                                    backgroundColor: '#1976d2',
                                    borderRadius: '20px',
                                    padding: '6px 16px',
                                    '&:hover': { backgroundColor: '#125ca8' },
                                }}
                            >
                                {isLoggedIn ? 'Logout' : 'Login'}
                            </Button>
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>

            <Box sx={{ padding: 4, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
                <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', marginBottom: 4 }}>
                    Discover Our Latest Products
                </Typography>

                {error && (
                    <Typography color="error" sx={{ marginBottom: 2, textAlign: 'center' }}>
                        {error}
                    </Typography>
                )}

                <Grid container spacing={4} justifyContent="center">
                    {productList.length > 0 ? (
                        productList.map((product) => (
                            <Grid item xs={12} sm={6} md={4} key={product.id}>
                                <Card sx={{ boxShadow: 4, transition: 'transform 0.3s ease-in-out', '&:hover': { transform: 'scale(1.05)' } }}>
                                    <CardMedia
                                        component="img"
                                        alt={product.name}
                                        height="200"
                                        image={product.thumbnail}
                                        sx={{ borderRadius: '4px 4px 0 0' }}
                                    />
                                    <CardContent>
                                        <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 600 }}>
                                            {product.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" noWrap sx={{ height: 40 }}>
                                            {product.description}
                                        </Typography>
                                        <Typography variant="h5" color="text.primary" sx={{ marginTop: 2 }}>
                                            ${product.price}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                            <CircularProgress />
                        </Box>
                    )}
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        shape="rounded"
                        sx={{
                            '& .MuiPaginationItem-root': {
                                color: '#1976d2',
                                fontWeight: 'bold',
                            },
                        }}
                    />
                </Box>
            </Box>
        </>
    );
};

export default ProductPage;
