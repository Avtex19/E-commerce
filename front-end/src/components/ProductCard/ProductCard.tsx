import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    IconButton,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ImageModal from "../ImageModal/ImageModal.tsx";
import { getCategories } from '../../api/getCategories.ts';
import DeleteIcon from "@mui/icons-material/Delete";
import { EditProductModal } from "../EditProductModal";

interface Product {
    id: number;
    category: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    thumbnail: string;
    additional_images: string[];
}

interface ProductCardProps {
    product: Product;
    onDelete: (id: number) => Promise<void>;
    onAddToCart: () => void;
    isInCart: boolean;
}


const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete, onAddToCart,isInCart }) => {
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [categoryName, setCategoryName] = useState<string>('');
    const isAdmin = JSON.parse(localStorage.getItem('isAdmin') || 'false');

    const allImages = [product.thumbnail, ...(product.additional_images || [])];
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const mainImage = allImages[mainImageIndex];
    const [carouselIndex, setCarouselIndex] = useState(0);
    const visibleImagesCount = 4;

    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            const fetchedCategories = await getCategories();
            if (fetchedCategories) {
                setCategories(fetchedCategories);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (categories.length > 0) {
            const foundCategory = categories.find(category => category.id === product.category);
            setCategoryName(foundCategory ? foundCategory.name : 'Unknown Category');
        }
    }, [categories, product.category]);

    useEffect(() => {
        if (mainImageIndex < carouselIndex) {
            setCarouselIndex(mainImageIndex);
        } else if (mainImageIndex >= carouselIndex + visibleImagesCount) {
            setCarouselIndex(mainImageIndex - visibleImagesCount + 1);
        }
    }, [mainImageIndex]);



    const handleNextImage = () => {
        setMainImageIndex((prevIndex) => (prevIndex + 1) % allImages.length);
    };

    const handlePrevImage = () => {
        setMainImageIndex((prevIndex) => (prevIndex - 1 + allImages.length) % allImages.length);
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            await onDelete(product.id);
        }
    };

    const handleAddToCart = () => {
        onAddToCart();
    };

    return (
        <>
            <Grid container spacing={2} sx={{ maxWidth: 1200, margin: 'auto', padding: '20px' }}>
                <Grid item xs={12} sm={5} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {allImages.length > 1 && (
                            <IconButton
                                onClick={handlePrevImage}
                                sx={{ position: 'absolute', left: 0, zIndex: 1 }}
                            >
                                <ArrowBackIosIcon />
                            </IconButton>
                        )}

                        <Box
                            component="img"
                            src={mainImage}
                            alt={product.name}
                            sx={{
                                width: '100%',
                                maxWidth: 400,
                                height: 'auto',
                                borderRadius: '8px',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                                cursor: 'pointer',
                            }}
                            onClick={() => setModalOpen(true)}
                        />

                        {allImages.length > 1 && (
                            <IconButton
                                onClick={handleNextImage}
                                sx={{ position: 'absolute', right: 0, zIndex: 1 }}
                            >
                                <ArrowForwardIosIcon />
                            </IconButton>
                        )}
                    </Box>

                    {allImages.length >= 1 && (
                        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', paddingY: 1, width: '100%', marginTop: 2 }}>
                            {allImages.slice(carouselIndex, carouselIndex + visibleImagesCount).map((image, index) => (
                                <Box
                                    key={index}
                                    component="img"
                                    src={image}
                                    alt={`Additional Image ${index + 1}`}
                                    onClick={() => setMainImageIndex(carouselIndex + index)}
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s',
                                        border: mainImageIndex === carouselIndex + index ? '2px solid orange' : 'none',
                                    }}
                                />
                            ))}
                        </Box>
                    )}
                </Grid>

                <Grid item xs={12} sm={7} md={8}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
                            {product.name}
                        </Typography>
                        {isAdmin && (
                            <IconButton
                                aria-label="delete"
                                onClick={handleDelete}
                                color="error"
                            >
                                <DeleteIcon sx={{ fontSize: '2rem' }} />
                            </IconButton>
                        )}
                    </Box>

                    <Typography variant="subtitle1" color="text.secondary" sx={{ marginBottom: '8px' }}>
                        Category: {categoryName}
                    </Typography>

                    <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', marginBottom: '12px' }}>
                        ${product.price.toFixed(2)}
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            whiteSpace: 'pre-line',
                            marginBottom: '16px',
                        }}
                    >
                        {product.description}
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 'bold',
                            color: product.quantity > 0 ? 'green' : 'red',
                            marginBottom: '20px',
                        }}
                    >
                        {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleAddToCart}
                        sx={{
                            paddingX: '24px',
                            paddingY: '10px',
                            borderRadius: '25px',
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                        }}
                        disabled={product.quantity === 0 || isInCart}
                    >
                        Add to Cart
                    </Button>

                    {isAdmin && (
                        <Button
                            variant="outlined"
                            color="primary"
                            size="large"
                            sx={{
                                paddingX: '24px',
                                paddingY: '10px',
                                borderRadius: '25px',
                                textTransform: 'uppercase',
                                fontWeight: 'bold',
                            }}
                            onClick={() => setEditModalOpen(true)}
                        >
                            Edit
                        </Button>
                    )}
                </Grid>
            </Grid>

            <ImageModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                images={allImages}
            />
            <EditProductModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                product={product}
            />
        </>
    );
};

export default ProductCard;
