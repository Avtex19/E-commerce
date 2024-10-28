import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardMedia,
    CardContent,
    Button,
} from '@mui/material';

interface ProductCardProps {
    product: {
        name: string;
        description: string;
        price: number;
        thumbnail: string;
        quantity: number;
    };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <Box sx={{ padding: '20px' }}>
            <Card sx={{ maxWidth: 600, margin: 'auto' }}>
                <CardMedia
                    component="img"
                    height="400"
                    image={product.thumbnail}
                    alt={product.name}
                />
                <CardContent>
                    <Typography gutterBottom variant="h4">
                        {product.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {product.description}
                    </Typography>
                    <Typography variant="h5" color="primary" sx={{ marginTop: '10px' }}>
                        ${product.price.toFixed(2)}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            marginTop: '10px',
                            fontWeight: 'bold',
                            color: product.quantity > 0 ? 'green' : 'red',
                        }}
                    >
                        {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: '20px' }}
                    >
                        Add to Cart
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ProductCard;
