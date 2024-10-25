import React, { useEffect, useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
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
} from '@mui/material';
import { fetchProducts } from "../api/productService.ts";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { logout } from "../api/logoutService.ts";

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [totalProducts, setTotalProducts] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authTokens'));

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
        if (page) {
            params.set('page', page.toString());
        }
        if (searchQuery) {
            params.set('search', searchQuery);
        }

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

            console.log("Logging out with refresh token:", refreshToken);

            await logout(refreshToken);

            localStorage.removeItem('authTokens');

            setIsLoggedIn(false);
            console.log('Logged out successfully');
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Logout error:', error.message);
            } else {
                console.error('Logout error: An unknown error occurred');
            }
        }
    };

    const truncateDescription = (description: string, maxLength: number = 50) => {
        return description.length > maxLength ? description.substring(0, maxLength) + '...' : description;
    };

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Product Store
                    </Typography>
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
                    {isLoggedIn ? (
                        <Button color="inherit" onClick={handleLogout}>Logout</Button>
                    ) : (
                        <Button color="inherit" onClick={() => window.location.href='/login'}>Login</Button>
                    )}
                </Toolbar>
            </AppBar>

            <Box sx={{ padding: '20px' }}>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <Grid container spacing={4}>
                        {products.map((product) => (
                            <Grid item xs={12} sm={6} md={4} key={product.id}>
                                <Card
                                    sx={{
                                        maxWidth: 400,
                                        transition: '0.3s',
                                        '&:hover': {
                                            boxShadow: 20,
                                        },
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100%',
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={product.thumbnail}
                                        alt={product.name}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {product.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {truncateDescription(product.description, 50)}
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
