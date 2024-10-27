import React, { useState, useEffect } from 'react';
import {
    Modal,
    Box,
    TextField,
    Button,
    Typography,
    Select,
    MenuItem,
} from '@mui/material';
import { createProduct } from "../api/createProduct";
import { getCategories } from "../api/getCategories";

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
    const [additionalImages, setAdditionalImages] = useState<Record<string, any>>({});
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
        setAdditionalImages({});
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                bgcolor: 'white',
                borderRadius: '8px',
                padding: '20px',
                width: '400px',
                margin: 'auto',
                marginTop: '100px'
            }}>
                <Typography variant="h6" gutterBottom>
                    Create Product
                </Typography>

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
                <TextField
                    label="Additional Images"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={JSON.stringify(additionalImages)}
                    onChange={(e) => setAdditionalImages(JSON.parse(e.target.value) || {})}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{ marginTop: '20px' }}
                >
                    Create
                </Button>
            </Box>
        </Modal>
    );
};

export default CreateProductModal;
