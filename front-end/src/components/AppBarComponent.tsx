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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import logo from '../../logo.png';


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
                                                             isProductPage = false
                                                         }) => {
    return (
        <AppBar position="static" sx={{ backgroundColor: '#FF8C00' }}>
            <Toolbar>
                <img src={logo} alt="Logo" style={{ height: '60px', marginRight: '16px',cursor:'pointer' }}  onClick={() => navigate('/')} />

                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>


                    {!isProductPage && (
                        <Box sx={{ position: 'relative', width: '300px', marginRight: '16px' }}>
                            <TextField
                                placeholder="Search Products"
                                variant="outlined"
                                size="small"
                                value={searchQuery}
                                onChange={onSearchChange}
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
                    )}

                    {!isProductPage && isAdmin && (
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
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        {isLoggedIn ? [
                            <MenuItem key="account" onClick={() => navigate('/account')}>Account Details</MenuItem>,
                            <MenuItem key="logout" onClick={handleLogout}>Logout</MenuItem>
                        ] : (
                            <MenuItem onClick={() => navigate('/login')}>Login</MenuItem>
                        )}
                    </Menu>

                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default AppBarComponent;
