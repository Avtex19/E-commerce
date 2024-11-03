// CartPopover.tsx
import React from 'react';
import {
    Box,
    Popover,
    Typography,
    Button,
    IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {CartItem} from "../../types/types.ts";



interface CartPopoverProps {
    anchorEl: null | HTMLElement;
    onClose: () => void;
    cartItems: CartItem[];
    onRemoveFromCart: (itemId: number) => void;
    onChangeQuantity: (itemId: number, action: 'increase' | 'decrease') => void;
    navigate: (path: string) => void;
}

const CartPopover: React.FC<CartPopoverProps> = ({
                                                     anchorEl,
                                                     onClose,
                                                     cartItems,
                                                     onRemoveFromCart,
                                                     onChangeQuantity,
                                                     navigate,
                                                 }) => {
    return (
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            disableRestoreFocus
            onMouseLeave={onClose}
        >
            <Box sx={{ p: 2, minWidth: 250 }}>
                <Typography variant="h6">Cart Items</Typography>

                {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                        <Box
                            key={item.id}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                py: 1,
                                borderBottom: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '8px',
                                backgroundColor: '#f9f9f9',
                                marginBottom: '8px',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box
                                    component="img"
                                    src={item.thumbnail}
                                    alt={item.name}
                                    sx={{ width: 40, height: 40, borderRadius: '4px', marginRight: 1 }}
                                />
                                <Box>
                                    <Typography variant="body1">{item.name}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        ${item.price.toFixed(2)}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton
                                    size="small"
                                    onClick={() => onChangeQuantity(item.id, 'decrease')}
                                    disabled={item.quantity <= 1}
                                >
                                    -
                                </IconButton>
                                <Typography variant="body1" sx={{ mx: 1 }}>
                                    {item.quantity}
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={() => onChangeQuantity(item.id, 'increase')}
                                >
                                    +
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={() => onRemoveFromCart(item.id)}
                                    sx={{ ml: 1 }}
                                >
                                    <DeleteIcon color="error" />
                                </IconButton>
                            </Box>
                        </Box>
                    ))
                ) : (
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Your cart is empty.
                    </Typography>
                )}

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/cart')}
                    sx={{
                        borderRadius: '20px',
                        padding: '6px 6px',
                        minWidth: '120px',
                        display: 'block',
                        margin: '20px auto 0',
                    }}
                >
                    Go to Cart
                </Button>
            </Box>
        </Popover>
    );
};

export default CartPopover;
