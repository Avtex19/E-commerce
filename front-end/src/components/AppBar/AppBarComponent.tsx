import React, { useState } from 'react';
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
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LoginIcon from '@mui/icons-material/Login';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Product } from "../../types/types.ts";


import CartPopover from "../CartPopOver/CartPopOver.tsx";
import {saveCart} from "../../stores/cartStore.ts";

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
    cartItems: Product[];
    setCartItems: React.Dispatch<React.SetStateAction<Product[]>>;

    onAddToCart: (product: Product) => void;
    onRemoveFromCart: (productId: number) => void;
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
                                                             cartItems,
                                                             onAddToCart,
                                                             onRemoveFromCart,
                                                             setCartItems
                                                         }) => {
    const [cartPopoverAnchor, setCartPopoverAnchor] = useState<null | HTMLElement>(null);


    const handleCartMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
        setCartPopoverAnchor(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setCartPopoverAnchor(null);
    };


    const handleChangeQuantity = (itemId: number, action: 'increase' | 'decrease') => {
        const item = cartItems.find(item => item.id === itemId);
        if (item) {
            if (action === 'increase') {
                onAddToCart(item);
            } else if (action === 'decrease' && item.quantity > 1) {
                const updatedItem = { ...item, quantity: item.quantity - 1 };
                const updatedCart = cartItems.map(cartItem =>
                    cartItem.id === itemId ? updatedItem : cartItem
                );

                saveCart(updatedCart);
                setCartItems(updatedCart)
            } else {
                onRemoveFromCart(itemId);
            }
        }
    };


    const handleRemoveFromCart = (id: number) => {
        onRemoveFromCart(id);
    }
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
                        onChangeQuantity={handleChangeQuantity}
                        onRemoveFromCart={handleRemoveFromCart}
                        navigate={navigate}
                    />

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
                        {isLoggedIn ? [
                            <MenuItem key="account" onClick={() => navigate('/account')} sx={{ color: 'white' }}>
                                <AccountCircleIcon sx={{ mr: 1 }} /> Account Details
                            </MenuItem>,
                            <MenuItem key="logout" onClick={handleLogout} sx={{ color: 'white' }}>
                                <ExitToAppIcon sx={{ mr: 1 }} /> Logout
                            </MenuItem>
                        ] : (
                            <MenuItem key="login" onClick={() => navigate('/login')} sx={{ color: 'white' }}>
                                <LoginIcon sx={{ mr: 1 }} /> Login
                            </MenuItem>
                        )}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default AppBarComponent;