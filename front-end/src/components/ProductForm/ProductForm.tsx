
import React, { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Select,
    MenuItem,
    IconButton, Snackbar, Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { getCategories } from '../../api/getCategories.ts';


interface Category {
    id: number;
    name: string;
}

interface ProductFormProps {
    initialProduct?: {
        category: number | null;
        name: string;
        description: string;
        price: number;
        quantity: number;
        thumbnail?: string;
        additionalImages?: string[];
    };
    onSubmit: (data: any) => Promise<void>;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialProduct, onSubmit }) => {
    const [category, setCategory] = useState<number | null>(initialProduct?.category || null);
    const [name, setName] = useState(initialProduct?.name || '');
    const [description, setDescription] = useState(initialProduct?.description || '');
    const [price, setPrice] = useState(initialProduct?.price || 0);
    const [quantity, setQuantity] = useState(initialProduct?.quantity || 1);
    const [thumbnail, setThumbnail] = useState(initialProduct?.thumbnail || '');
    const [additionalImages, setAdditionalImages] = useState<string[]>(initialProduct?.additionalImages || []);
    const [categories, setCategories] = useState<Category[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');


    useEffect(() => {
        const fetchCategories = async () => {
            const categoryList = await getCategories();
            if (categoryList) {
                setCategories(categoryList);
            }
        };
        fetchCategories();
    }, []);

    const handleAddImage = () => {
        setAdditionalImages([...additionalImages, '']);
    };

    const handleRemoveImage = (index: number) => {
        const newImages = additionalImages.filter((_, i) => i !== index);
        setAdditionalImages(newImages);
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...additionalImages];
        newImages[index] = value;
        setAdditionalImages(newImages);
    };

    const handleSubmit = async () => {
        setSnackbarMessage('');
        setSnackbarOpen(false);

        if (category && name && description && price > 0 && quantity > 0) {
            const productData = {
                category,
                name,
                description,
                price,
                quantity,
                thumbnail: thumbnail || null,
                additional_images: additionalImages.length > 0 ? additionalImages : null,
            };
            await onSubmit(productData);
        } else {
            setSnackbarMessage('Please fill in all required fields.');
            setSnackbarOpen(true);
        }
    };


    return (
        <Box sx={{ overflowY: 'auto', maxHeight: '60vh', paddingRight: '10px' }}>
            <Select
                fullWidth
                value={category ?? ''}
                onChange={(e) => setCategory(Number(e.target.value))}
                displayEmpty
                sx={{ marginBottom: '16px' }}
            >
                <MenuItem value="" disabled>Select a Category</MenuItem>
                {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                    </MenuItem>
                ))}
            </Select>

            <TextField
                label="Product Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <TextField
                label="Description"
                variant="outlined"
                fullWidth
                margin="normal"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
                sx={{
                    '& textarea': {
                        minHeight: '50px',
                    },
                }}
            />

            <TextField
                label="Price"
                variant="outlined"
                fullWidth
                margin="normal"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                sx={{
                    '& input[type="number"]': {
                        '-moz-appearance': 'textfield',
                        '::-webkit-outer-spin-button': {
                            display: 'none',
                        },
                        '::-webkit-inner-spin-button': {
                            display: 'none',
                        },
                    },
                }}
            />
            <TextField
                label="Quantity"
                variant="outlined"
                fullWidth
                margin="normal"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                sx={{
                    '& input[type="number"]': {
                        '-moz-appearance': 'textfield',
                        '::-webkit-outer-spin-button': {
                            display: 'none',
                        },
                        '::-webkit-inner-spin-button': {
                            display: 'none',
                        },
                    },
                }}
            />

            <TextField
                label="Thumbnail URL"
                variant="outlined"
                fullWidth
                margin="normal"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
            />

            <Typography variant="subtitle1" sx={{ marginTop: '20px' }}>
                Additional Images
            </Typography>
            {additionalImages.map((image, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        value={image}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        placeholder="Image URL"
                    />
                    <IconButton onClick={() => handleRemoveImage(index)} color="error" aria-label="remove">
                        <RemoveIcon />
                    </IconButton>
                </Box>
            ))}
            <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddImage}
                sx={{ marginTop: '10px' }}
            >
                Add Another Image
            </Button>


            <Box sx={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

        </Box>
    );
};

export default ProductForm;
