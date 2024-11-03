type Product = {
    id: number;
    category: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    thumbnail: string;
    additional_images: string[];
}
type CartItem = {
    id: number;
    name: string;
    quantity: number;
    price: number;
    thumbnail: string;
}

export type {Product,CartItem};