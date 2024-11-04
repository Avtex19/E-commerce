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
type CartItems = {
    id: number;
    name: string;
    quantity: number;
    price: number;
    thumbnail: string;
}

export type {Product,CartItems};