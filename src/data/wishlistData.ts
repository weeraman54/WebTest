// Sample wishlist data for testing
export const sampleWishlistItems = [
  {
    id: "w1",
    name: "Wireless Gaming Headset",
    image: "/src/assets/images/sampleProduct/image4.png",
    price: 89.99,
    originalPrice: 119.99,
    category: "Audio",
    inStock: true,
  },
  {
    id: "w2", 
    name: "RGB Mechanical Keyboard",
    image: "/src/assets/images/sampleProduct/image5.png",
    price: 129.99,
    category: "Peripherals",
    inStock: true,
  },
];

export interface WishlistItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  category: string;
  inStock?: boolean;
}

export interface WishlistState {
  items: WishlistItem[];
  totalItems: number;
  totalCost: number;
}
