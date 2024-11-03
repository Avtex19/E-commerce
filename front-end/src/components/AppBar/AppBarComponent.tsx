import React, {useEffect, useState} from 'react';
import {
    AppBar,
    Avatar,
    Badge,
    Box,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    TextField,
    Toolbar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {Product} from "../../types/types.ts";
import CartPopover from "../CartPopOver/CartPopOver.tsx";
import { getCart, updateCart, removeFromCart } from "../../stores/cartStore.ts";

interface AppBarComponentProps {
    logo: string;
    searchQuery: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    clearSearch: () => void;
    isAdmin: boolean;
    handleAvatarClick: (event: React.MouseEvent<HTMLElement>) => void;
    anchorEl: null | HTMLElement;
    handleMenuClose: () => void;
    handleLogout: () => void;
    isLoggedIn: boolean;
    navigate: (path: string) => void;
    setIsModalOpen: (open: boolean) => void;
    isProductPage?: boolean;
}

const AppBarComponent: React.FC<AppBarComponentProps> = ({
                                                             logo,
                                                             searchQuery,
                                                             onSearchChange,
                                                             clearSearch,
                                                             isAdmin,
                                                             handleAvatarClick,
                                                             anchorEl,
                                                             handleMenuClose,
                                                             handleLogout,
                                                             isLoggedIn,
                                                             navigate,
                                                             setIsModalOpen,
                                                             isProductPage = false,
                                                         }) => {
    const [cartPopoverAnchor, setCartPopoverAnchor] = useState<null | HTMLElement>(null);
    const [cartItems, setCartItems] = useState<Product[]>(getCart()); // Initialize cart items from cookies

    useEffect(() => {
        updateCart(cartItems);
    }, [cartItems]);

    const handleCartMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
        setCartPopoverAnchor(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setCartPopoverAnchor(null);
    };

    const handleQuantityChange = (itemId: number, action: 'increase' | 'decrease') => {
        setCartItems((prevItems) => {
            const updatedItems = prevItems.map((item) => {
                if (item.id === itemId) {
                    const newQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
                    return { ...item, quantity: Math.max(newQuantity, 1) };
                }
                return item;
            });
            return updatedItems;
        });
    };

    const handleRemoveFromCart = (itemId: number) => {
        removeFromCart(itemId);
        setCartItems(getCart());
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: '#000000' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box
                    component="img"
                    src={logo}
                    alt="Logo"
                    sx={{ height: 100, width: 160, cursor: 'pointer' }}
                    onClick={() => navigate('/')}
                />

                {/* Search Field */}
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                    {!isProductPage && (
                        <TextField
                            placeholder="Search Products"
                            variant="outlined"
                            size="small"
                            value={searchQuery}
                            onChange={onSearchChange}
                            sx={{
                                width: '300px',
                                backgroundColor: '#ffffff',
                                borderRadius: '20px',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'gray',
                                    },
                                    borderRadius: '20px',
                                },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {searchQuery && (
                                            <IconButton onClick={clearSearch} sx={{ padding: '5px', color: 'black' }}>
                                                X
                                            </IconButton>
                                        )}
                                        <IconButton sx={{ color: 'black' }}>
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                </Box>

                {/* Cart and User Avatar */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        color="inherit"
                        sx={{ mr: 2 }}
                        onMouseEnter={handleCartMouseEnter}
                    >
                        <Badge badgeContent={cartItems.reduce((acc, item) => acc + item.quantity, 0)} color="error">
                            <ShoppingCartIcon sx={{ fontSize: 24, color: 'white' }} />
                        </Badge>
                    </IconButton>

                    <CartPopover
                        anchorEl={cartPopoverAnchor}
                        onClose={handlePopoverClose}
                        cartItems={cartItems}
                        onRemoveFromCart={handleRemoveFromCart}
                        onChangeQuantity={handleQuantityChange}
                        navigate={navigate}
                    />

                    {/* Admin Add Button */}
                    {!isProductPage && isAdmin && (
                        <IconButton
                            color="inherit"
                            onClick={() => setIsModalOpen(true)}
                            sx={{
                                backgroundColor: '#444444',
                                borderRadius: '50%',
                                width: 36,
                                height: 36,
                                marginRight: 2,
                                '&:hover': {
                                    backgroundColor: '#555555',
                                },
                            }}
                        >
                            <AddIcon sx={{ color: 'white', fontSize: 20 }} />
                        </IconButton>
                    )}

                    {/* User Avatar */}
                    <IconButton
                        onClick={handleAvatarClick}
                        sx={{
                            ml: 1,
                            '&:hover': {
                                backgroundColor: '#666666',
                                borderRadius: '50%',
                            },
                        }}
                    >
                        <Avatar alt="User Avatar" sx={{ backgroundColor: '#555555', color: 'white' }} />
                    </IconButton>

                    {/* User Menu */}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        sx={{
                            '& .MuiPaper-root': {
                                mt: 1.5,
                                backgroundColor: '#333333',
                                color: 'white',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                borderRadius: '8px',
                                minWidth: '180px',
                            },
                        }}
                    >
                        {isLoggedIn
                            ? [
                                <MenuItem key="account" onClick={() => navigate('/account')} sx={{ color: 'white' }}>
                                    Account Details
                                </MenuItem>,
                                <MenuItem key="logout" onClick={handleLogout} sx={{ color: 'white' }}>
                                    Logout
                                </MenuItem>
                            ]
                            : (
                                <MenuItem onClick={() => navigate('/login')} sx={{ color: 'white' }}>
                                    Login
                                </MenuItem>
                            )}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default AppBarComponent;
