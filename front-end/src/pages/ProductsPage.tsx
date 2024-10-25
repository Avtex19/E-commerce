import React, { useEffect, useState } from 'react';
import { Box, Grid, Pagination, TextField, CircularProgress } from '@mui/material';
import { fetchProducts } from "../api/productService.ts";
import Product from "../components/Products.tsx";

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [totalProducts, setTotalProducts] = useState(0);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                const data = await fetchProducts(page, searchQuery);
                setProducts(data.results);
                setTotalProducts(data.count);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [page, searchQuery]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (page) {
            params.set('page', page.toString());
        }
        if (searchQuery) {
            params.set('search', searchQuery);
        }

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
    }, [page, searchQuery]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPage(1);
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <Box sx={{ padding: '20px' }}>
            <TextField
                label="Search Products"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ marginBottom: '20px' }}
            />

            {loading ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={3}>
                    {products.map((product) => (
                        <Grid item xs={12} sm={6} md={4} key={product.id}>
                            <Product
                                id={product.id}
                                name={product.name}
                                description={product.description}
                                price={product.price}
                                thumbnail={product.thumbnail}
                                category={product.category}
                                subcategory={product.subcategory || ''}
                                quantity={product.quantity || ''}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            <Pagination
                count={Math.ceil(totalProducts / 6)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
            />
        </Box>
    );
};

export default ProductsPage;
