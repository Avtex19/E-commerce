import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Button, AppBar, Toolbar, Pagination } from '@mui/material';
import { Link } from 'react-router-dom';
import { products } from '../api/productService';
import { useSearchParams } from 'react-router-dom';
import Product from "../components/Products.tsx";
import axios from 'axios';

interface ProductData {
    id: number;
    category: string;
    subcategory: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    thumbnail: string;
}

interface ProductResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ProductData[];
}

const ProductPage: React.FC = () => {
    const [productList, setProductList] = useState<ProductData[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const itemsPerPage = 6;
    const page = parseInt(searchParams.get('page') || '1', 10);

    useEffect(() => {
        const authTokens = localStorage.getItem('authTokens');
        if (authTokens) {
            const parsedTokens = JSON.parse(authTokens);
            setIsLoggedIn(!!parsedTokens.access);
        }
    }, []);

    const fetchProducts = async (url: string | null) => {
        try {
            const data: ProductResponse = await products(url);
            setProductList(data.results);
            setTotalPages(Math.ceil(data.count / itemsPerPage));
        } catch (error: any) {
            setError('Failed to fetch products');
        }
    };

    useEffect(() => {
        const url = `http://localhost:8000/api/products/?limit=${itemsPerPage}&offset=${(page - 1) * itemsPerPage}`;
        fetchProducts(url);
    }, [page]);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
        setSearchParams({ page: newPage.toString() });
    };

    useEffect(() => {
        const handleStorageChange = () => {
            const authTokens = localStorage.getItem('authTokens');
            if (authTokens) {
                const parsedTokens = JSON.parse(authTokens);
                setIsLoggedIn(!!parsedTokens.access);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleLogout = async () => {
        console.log("Logout button clicked");
        try {
            const authTokens = localStorage.getItem('authTokens');
            if (authTokens) {
                const parsedTokens = JSON.parse(authTokens);
                console.log("Sending logout request with refresh token:", parsedTokens.refresh);

                const response = await axios.post(
                    'http://localhost:8000/api/logout/',
                    {
                        refresh_token: parsedTokens.refresh,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${parsedTokens.access}`,
                        }
                    }
                );

                if (response.status === 205) {
                    localStorage.removeItem('authTokens');
                    console.log("Tokens removed from localStorage");
                    setIsLoggedIn(false);
                }
            }
        } catch (error) {
            console.error('Logout failed', error);
        }
    };


    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Box display="flex" justifyContent="space-between" width="100%">
                        <Typography variant="h6">Products Store</Typography>
                        <Button
                            color="inherit"
                            component={Link}
                            to={isLoggedIn ? '#' : '/login'}
                            onClick={isLoggedIn ? handleLogout : undefined}
                        >
                            {isLoggedIn ? 'Logout' : 'Login'}
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Container>
                <Box sx={{ padding: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Products List
                    </Typography>

                    {error && (
                        <Typography color="error" sx={{ marginBottom: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            gap: '20px',
                        }}
                    >
                        {productList.map((product) => (
                            <div
                                key={product.id}
                                style={{
                                    flex: '1 1 calc(33.333% - 20px)',
                                    boxSizing: 'border-box',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                }}
                            >
                                <Product
                                    id={product.id}
                                    category={product.category}
                                    subcategory={product.subcategory}
                                    name={product.name}
                                    description={product.description}
                                    price={product.price}
                                    quantity={product.quantity}
                                    thumbnail={product.thumbnail}
                                />
                            </div>
                        ))}
                    </div>

                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                            shape="rounded"
                        />
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default ProductPage;
