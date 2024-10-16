import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

interface ProductProps {
    id: number;
    category: string;
    subcategory: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    thumbnail: string;
}

const Product: React.FC<ProductProps> = ({
                                             name,
                                             description,
                                             price,
                                             thumbnail,
                                             category,
                                             subcategory,
                                         }) => {
    return (
        <Card sx={{ maxWidth: 345, boxShadow: 'none' }}>
            <CardMedia
                component="img"
                height="200"
                image={thumbnail}
                alt={name}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
                <Typography variant="body1" color="text.primary">
                    ${price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Category: {category} / Subcategory: {subcategory}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default Product;
