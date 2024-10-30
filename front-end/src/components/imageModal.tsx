import React, { useState, useEffect } from 'react';
import {
    Box,
    IconButton,
    Modal,
    Typography,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';

interface ImageModalProps {
    open: boolean;
    onClose: () => void;
    images: string[];
}

const ImageModal: React.FC<ImageModalProps> = ({ open, onClose, images }) => {
    const [mainImageIndex, setMainImageIndex] = useState(0);

    const handleNextImage = () => {
        setMainImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrevImage = () => {
        setMainImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowRight') {
            handleNextImage();
        } else if (event.key === 'ArrowLeft') {
            handlePrevImage();
        } else if (event.key === 'Escape') {
            onClose();
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (open) {
            const modalContent = document.getElementById('modal-content');
            modalContent?.focus();
        }
    }, [open]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            disableScrollLock
        >
            <Box
                id="modal-content"
                tabIndex={0}
                sx={{
                    position: 'relative',
                    maxWidth: '600px',
                    overflow: 'hidden',
                    borderRadius: '16px',
                    backgroundColor: 'white',
                    boxShadow: 3,
                    p: 2,
                    outline: 'none'
                }}
            >
                <IconButton onClick={onClose} sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>
                    <CloseIcon />
                </IconButton>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={handlePrevImage} sx={{ zIndex: 1 }}>
                        <ArrowBackIosIcon />
                    </IconButton>
                    <Box
                        component="img"
                        src={images[mainImageIndex]}
                        alt="Product"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '16px',
                            marginBottom: 1,
                        }}
                    />
                    <IconButton onClick={handleNextImage} sx={{ zIndex: 1 }}>
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Box>

                <Box sx={{ textAlign: 'center', marginTop: 1 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: '500',
                            fontSize: '18px',
                            color: '#333',
                            letterSpacing: '0.5px',
                            lineHeight: '1.5',
                        }}
                    >
                        Image {mainImageIndex + 1} of {images.length}
                    </Typography>
                </Box>

                {images.length > 1 && (
                    <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', paddingY: 1, marginTop: 1 }}>
                        {images.map((image, index) => (
                            <Box
                                key={index}
                                component="img"
                                src={image}
                                alt={`Additional Image ${index + 1}`}
                                onClick={() => setMainImageIndex(index)}
                                sx={{
                                    width: 70,
                                    height: 70,
                                    borderRadius: '4px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s',
                                    border: mainImageIndex === index ? '2px solid orange' : 'none',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                    },
                                }}
                            />
                        ))}
                    </Box>
                )}
            </Box>
        </Modal>
    );
};

export default ImageModal;
