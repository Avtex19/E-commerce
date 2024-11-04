import { useState, useEffect } from 'react';
import { Product } from '../types/types';
import { addToCart, getCart, removeFromCart } from '../stores/cartStore';

const useCart = () => {
    const [cartItems, setCartItems] = useState<Product[]>(getCart());

    const handleAddToCart = (product: Product) => {
        addToCart(product);
        setCartItems(getCart());
    };

    const handleRemoveFromCart = (productId: number) => {
        removeFromCart(productId);
        setCartItems(getCart());
    };

    useEffect(() => {
        setCartItems(getCart());
    }, []);

    return { cartItems, setCartItems,handleAddToCart, handleRemoveFromCart };
};

export default useCart;
