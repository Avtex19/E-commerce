import React, { useEffect, useState } from 'react';
import {
    AppBar,
    Toolbar,
    Box,
    Grid,
    Pagination,
    TextField,
    CircularProgress,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    InputAdornment,
    Avatar,
    Menu,
    MenuItem,
    Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { fetchProducts } from "../api/productService.ts";
import { logout } from "../api/logoutService.ts";
import { useNavigate } from 'react-router-dom';

import logo from '../../logo.png';

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [totalProducts, setTotalProducts] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authTokens'));
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();

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
        if (page) params.set('page', page.toString());
        if (searchQuery) params.set('search', searchQuery);

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
    }, [page, searchQuery]);

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
            setIsLoggedIn(false);
            handleMenuClose();
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Logout error:', error.message);
            } else {
                console.error('Logout error: An unknown error occurred');
            }
        }
    };

    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box>
            <AppBar position="static" sx={{ backgroundColor: '#3f51b5' }}>
                <Toolbar>
                    <img src={logo} alt="Tech Mix Logo" style={{ height: '60px', marginRight: '16px' }} />
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ position: 'relative', width: '300px' }}>
                        <TextField
                            placeholder="Search Products"
                            variant="outlined"
                            size="small"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            sx={{
                                backgroundColor: 'white',
                                borderRadius: '20px',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '20px',
                                    '& input': {
                                        padding: '8px 14px',
                                    },
                                },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {searchQuery && (
                                            <IconButton onClick={clearSearch} sx={{ padding: '5px' }}>
                                                <ClearIcon />
                                            </IconButton>
                                        )}
                                        <IconButton>
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    <IconButton onClick={handleAvatarClick} color="inherit">
                        <Avatar alt="User Avatar" />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        PaperProps={{
                            sx: {
                                backgroundColor: '#ffffff',
                                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                                '& .MuiMenuItem-root': {
                                    padding: '10px 20px',
                                    fontSize: '16px',
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5',
                                    },
                                },
                            },
                        }}
                    >
                        {isLoggedIn ? (
                            <>
                                <MenuItem key="account" onClick={() => navigate('/account')}>Account Details</MenuItem>
                                <MenuItem key="logout" onClick={handleLogout}>Logout</MenuItem>
                            </>
                        ) : (
                            <MenuItem onClick={() => navigate('/login')}>Login</MenuItem>
                        )}
                    </Menu>
                </Toolbar>
            </AppBar>

            <Box sx={{ padding: '20px' }}>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <Grid container spacing={4}>
                        {products.map((product) => (
                            <Grid item xs={12} sm={6} md={4} key={product.id}>
                                <Card sx={{ maxWidth: 400, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={product.thumbnail}
                                        alt={product.name}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5">{product.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {product.description}
                                        </Typography>
                                        <Typography variant="h6" color="primary" sx={{ marginTop: 'auto' }}>
                                            ${product.price.toFixed(2)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                <Pagination
                    count={Math.ceil(totalProducts / 6)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
                />
            </Box>
        </Box>
    );
};

export default ProductsPage;
