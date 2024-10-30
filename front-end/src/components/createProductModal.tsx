import React, { useState, useEffect } from 'react';
import {
    Modal,
    Box,
    TextField,
    Button,
    Typography,
    Select,
    MenuItem,
    IconButton,
} from '@mui/material';
import { createProduct } from "../api/createProduct";
import { getCategories } from "../api/getCategories";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface CreateProductModalProps {
    open: boolean;
    onClose: () => void;
    token: string;
}

interface Category {
    id: number;
    name: string;
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({ open, onClose }) => {
    const [category, setCategory] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [thumbnail, setThumbnail] = useState('');
    const [additionalImages, setAdditionalImages] = useState<string[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        if (open) {
            const fetchCategories = async () => {
                const categoryList = await getCategories();
                if (categoryList) {
                    setCategories(categoryList);
                }
            };
            fetchCategories();
        }
    }, [open]);

    const handleSubmit = async () => {
        if (category && name && description && price > 0 && quantity > 0 && thumbnail) {
            const productData = {
                category,
                name,
                description,
                price,
                quantity,
                thumbnail,
                additional_images: additionalImages,
            };
            const createdProduct = await createProduct(productData);

            if (createdProduct) {
                console.log('Product created successfully:', createdProduct);
                onClose();
                resetForm();
            }
        }
    };

    const resetForm = () => {
        setCategory(null);
        setName('');
        setDescription('');
        setPrice(0);
        setQuantity(1);
        setThumbnail('');
        setAdditionalImages(['']);
    };

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

    return (
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
                height: 'auto',
                maxHeight: '80vh',
                overflow: 'hidden',
            }}>
                <Typography variant="h6" gutterBottom>
                    Create Product
                </Typography>

                <Box sx={{
                    overflowY: 'auto',
                    maxHeight: '60vh',
                    paddingRight: '10px'
                }}>
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
                </Box>

                <Box sx={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        sx={{ marginTop: '20px' }}
                    >
                        Create
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default CreateProductModal;
