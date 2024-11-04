import { Product } from '../types/types';

const getCart = (): Product[] => {
    try {
        const cartData = localStorage.getItem('cart');
        return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
        console.error("Error parsing cart from local storage:", error);
        return [];
    }
};

const saveCart = (cart: Product[]) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

const addToCart = (product: Product) => {
    const cart = getCart();
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
};

const removeFromCart = (itemId: number) => {
    const cart = getCart().filter(item => item.id !== itemId);
    saveCart(cart);
};

export { getCart, addToCart, removeFromCart,saveCart };
