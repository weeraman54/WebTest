// Sample cart data for testing
export const sampleCartItems = [
  {
    id: "1",
    name: "Gaming Laptop RTX 4060",
    image: "/src/assets/images/sampleProduct/image1.png",
    price: 1299.99,
    quantity: 1,
  },
  {
    id: "2", 
    name: "Mechanical Keyboard RGB",
    image: "/src/assets/images/sampleProduct/image2.png",
    price: 159.99,
    quantity: 2,
  },
  {
    id: "3",
    name: "4K Gaming Monitor 27inch",
    image: "/src/assets/images/sampleProduct/image3.png", 
    price: 449.99,
    quantity: 1,
  },
];

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalCost: number;
}
