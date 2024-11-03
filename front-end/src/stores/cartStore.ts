import Cookies from 'js-cookie';
import { Product } from '../types/types';

let cart: Product[] = JSON.parse(Cookies.get('cart') || '[]');

const updateCart = (newCart: Product[]) => {
    cart = newCart;
    Cookies.set('cart', JSON.stringify(cart), { expires: 7 });
};

const getCart = () => cart;

const removeFromCart = (itemId: number) => {
    cart = cart.filter(item => item.id !== itemId);
    updateCart(cart);
};

const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart(cart);
};

export { updateCart, getCart, removeFromCart, addToCart };
