import React, { useState } from 'react';
import { Modal, Box, Typography, Snackbar, Alert } from '@mui/material';
import { createProduct } from '../../api/createProduct.ts';
import ProductForm from '../ProductForm/ProductForm.tsx';

interface CreateProductModalProps {
    open: boolean;
    onClose: () => void;
    token: string;



}

const CreateProductModal: React.FC<CreateProductModalProps> = ({ open, onClose }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleSubmit = async (productData: any) => {
        const createdProduct = await createProduct(productData);
        if (createdProduct) {
            console.log('Product created successfully:', createdProduct);
            setSnackbarMessage('Product created successfully!');
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
                <Box
                    sx={{
                        bgcolor: 'white',
                        borderRadius: '8px',
                        padding: '20px',
                        width: '400px',
                        margin: 'auto',
                        marginTop: '100px',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Create Product
                    </Typography>
                    <ProductForm onSubmit={handleSubmit} />
                </Box>
            </Modal>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default CreateProductModal;
