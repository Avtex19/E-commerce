import React from 'react';
import {
    AppBar,
    Toolbar,
    Box,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    TextField,
    InputAdornment,
    Badge,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

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
    cartItemCount?: number;
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
                                                             cartItemCount = 0,
                                                         }) => {
    return (
        <AppBar position="static" sx={{ backgroundColor: '#000000' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box
                    component="img"
                    src={logo}
                    alt="Logo"
                    sx={{ height: 100,width:160, cursor: 'pointer' }}
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
                        sx={{
                            mr: 2,
                            '&:hover': {
                                backgroundColor: '#333333',
                                borderRadius: '50%',
                            },
                        }}
                        onClick={() => navigate('/cart')}
                    >
                        <Badge badgeContent={cartItemCount} color="error">
                            <ShoppingCartIcon sx={{ fontSize: 24, color: 'white' }} />
                        </Badge>
                    </IconButton>


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
                        <Avatar alt="User Avatar" sx={{ backgroundColor: '#555555', color: 'white' }}>
                        </Avatar>
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
                        {isLoggedIn
                            ? [
                                <MenuItem key="account" onClick={() => navigate('/account')} sx={{ color: 'white' }}>Account Details</MenuItem>,
                                <MenuItem key="logout" onClick={handleLogout} sx={{ color: 'white' }}>Logout</MenuItem>,
                            ]
                            : <MenuItem onClick={() => navigate('/login')} sx={{ color: 'white' }}>Login</MenuItem>
                        }
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default AppBarComponent;
