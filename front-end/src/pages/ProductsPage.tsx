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
import CreateProductModal from "../components/createProductModal.tsx";
import AddIcon from '@mui/icons-material/Add';

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


    return (
        <Box>
            <AppBar position="static" sx={{ backgroundColor: '#FF8C00' }}>
                <Toolbar>
                    <img src={logo} alt="Logo" style={{ height: '60px', marginRight: '16px' }} />

                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Box sx={{ position: 'relative', width: '300px', marginRight: '16px' }}>
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

                        {isAdmin && (
                            <IconButton
                                color="secondary"
                                onClick={() => setIsModalOpen(true)}
                                sx={{
                                    backgroundColor: '#0a7044',
                                    borderRadius: '50%',
                                    width: '28px',
                                    height: '28px',
                                    marginRight: '16px',
                                    '&:hover': {
                                        backgroundColor: '#005b08',
                                    },
                                }}
                            >
                                <AddIcon sx={{ color: 'white', fontSize: '24px' }} />
                            </IconButton>
                        )}

                        <IconButton onClick={handleAvatarClick} color="inherit">
                            <Avatar alt="User Avatar" />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            {isLoggedIn
                                ? [
                                    <MenuItem key="account" onClick={() => navigate('/account')}>Account Details</MenuItem>,
                                    <MenuItem key="logout" onClick={handleLogout}>Logout</MenuItem>
                                ]
                                : <MenuItem onClick={() => navigate('/login')}>Login</MenuItem>
                            }
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>



            <Box sx={{ padding: '20px' }}>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <Grid container spacing={4}>
                            {products.map((product) => (
                                <Grid item xs={12} sm={6} md={4} key={product.id}>
                                    <Card sx={{ maxWidth: 400, height: '100%' }}>
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
