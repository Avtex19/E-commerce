import React, { useState } from 'react';
import { Modal, Box, Typography, Snackbar, Alert } from '@mui/material';
import { editProduct } from '../api/editProduct';
import ProductForm from "./productForm.tsx";

interface Product {
    id: number;
    category: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    thumbnail?: string;
    additional_images?: string[];
}

interface EditProductModalProps {
    open: boolean;
    onClose: () => void;
    product: Product;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ open, onClose, product }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleSubmit = async (productData: any) => {
        const updatedProduct = await editProduct(product.id, productData);
        if (updatedProduct) {
            console.log('Product updated successfully:', updatedProduct);
            setSnackbarMessage('Product updated successfully!');
            setSnackbarOpen(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        }
    };

    const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={{
                    bgcolor: 'white',
                    borderRadius: '8px',
                    padding: '20px',
                    width: '400px',
                    margin: 'auto',
                    marginTop: '100px',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <Typography variant="h6" gutterBottom>
                        Edit Product
                    </Typography>
                    <ProductForm initialProduct={product} onSubmit={handleSubmit} />
                </Box>
            </Modal>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default EditProductModal;
