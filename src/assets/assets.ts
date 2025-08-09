// Images
import NavbarLogo from './images/NavbarLogo.png';
import logo2 from './images/logo2.png';
import banner1 from './images/banner/banner1.jpg';
import banner2 from './images/banner/banner2.jpg';
import banner3 from './images/banner/banner3.jpg';
import banner4 from './images/banner/banner4.jpg';
import banner5 from './images/banner/banner5.jpg';
import banner6 from './images/banner/banner6.jpg';
import banner7 from './images/banner/banner7.jpg';
import banner8 from './images/banner/banner8.jpg';
import banner9 from './images/banner/banner9.jpg';
import banner10 from './images/banner/banner10.jpg';
import banner11 from './images/banner/banner11.jpg';
import categoryBackground from './images/background/categoryBackground.jpg';

// Sample Product Images
import sampleProduct1 from './images/sampleProduct/image1.png';
import sampleProduct2 from './images/sampleProduct/image2.png';
import sampleProduct3 from './images/sampleProduct/image3.png';
import sampleProduct4 from './images/sampleProduct/image4.png';
import sampleProduct5 from './images/sampleProduct/image5.png';
import sampleProduct6 from './images/sampleProduct/image6.png';
import sampleProduct7 from './images/sampleProduct/image7.png';
import sampleProduct8 from './images/sampleProduct/image8.png';

export const Images = {
  NavbarLogo,
  logo2,
  banner1,
  banner2,
  banner3,
  banner4,
  banner5,
  banner6,
  banner7,
  banner8,
  banner9,
  banner10,
  banner11,
  categoryBackground,
  sampleProduct1,
  sampleProduct2,
  sampleProduct3,
  sampleProduct4,
  sampleProduct5,
  sampleProduct6,
  sampleProduct7,
  sampleProduct8,
} as const;

export const BannerImages = [
    Images.banner1,
    Images.banner2,
    Images.banner3,
    Images.banner4,
    Images.banner5,
    Images.banner6,
    Images.banner7,
    // Images.banner8,
    // Images.banner9,
    // Images.banner10,
    // Images.banner11
]

// Icons
import react from './icons/react.svg';
import accessories from './icons/accessories.png';
import casing from './icons/casing.png';
import cooling from './icons/cooling.png';
import desktop from './icons/desktop.png';
import gpu from './icons/gpu.png';
import keyboardMouse from './icons/keyboard & mouse.png';
import laptopAccessories from './icons/laptop accessories.png';
import monitor from './icons/monitor.png';
import motherboard from './icons/motherboard.png';
import networking from './icons/networking.png';
import nic from './icons/nic.png';
import penSd from './icons/pen & sd.png';
import printer from './icons/printer.png';
import processor from './icons/processor.png';
import ram from './icons/ram.png';
import sounds from './icons/sounds.png';
import ssd from './icons/ssd.png';
import storage from './icons/storage.png';

export const Icons = {
  reactIcon: react,
  accessories,
  casing,
  cooling,
  desktop,
  gpu,
  keyboardMouse,
  laptopAccessories,
  monitor,
  motherboard,
  networking,
  nic,
  penSd,
  printer,
  processor,
  ram,
  sounds,
  ssd,
  storage,
} as const;

// Videos
export const Videos = {
} as const;

// Type definitions (optional)
export type ImageKeys = keyof typeof Images;
export type IconKeys = keyof typeof Icons;
export type VideoKeys = keyof typeof Videos;

// Sample product data with real images
export const SampleProducts = [
  {
    id: "1",
    name: "Gaming Laptop ASUS ROG Strix G15",
    price: 150000,
    originalPrice: 180000,
    image: Images.sampleProduct1,
    category: "Laptops",
    inStock: true,
    rating: 4.5,
    reviewCount: 124,
  },
  {
    id: "2", 
    name: "Intel Core i7-12700K Processor",
    price: 45000,
    image: Images.sampleProduct2,
    category: "Processors",
    inStock: true,
    rating: 4.8,
    reviewCount: 89,
  },
  {
    id: "3",
    name: "NVIDIA GeForce RTX 3080 Graphics Card",
    price: 85000,
    originalPrice: 95000,
    image: Images.sampleProduct3,
    category: "Graphics Cards",
    inStock: false,
    rating: 4.7,
    reviewCount: 156,
  },
  {
    id: "4",
    name: "Corsair 16GB DDR4 RAM",
    price: 12000,
    image: Images.sampleProduct4,
    category: "Memory",
    inStock: true,
    rating: 4.6,
    reviewCount: 203,
  },
  {
    id: "5",
    name: "Samsung 1TB NVMe SSD",
    price: 18000,
    originalPrice: 22000,
    image: Images.sampleProduct5,
    category: "Storage",
    inStock: true,
    rating: 4.9,
    reviewCount: 301,
  },
  {
    id: "6",
    name: "ASUS TUF Gaming Motherboard",
    price: 25000,
    image: Images.sampleProduct6,
    category: "Motherboards",
    inStock: true,
    rating: 4.4,
    reviewCount: 67,
  },
  {
    id: "7",
    name: "Dell 27'' 4K Gaming Monitor",
    price: 65000,
    originalPrice: 75000,
    image: Images.sampleProduct7,
    category: "Monitors",
    inStock: true,
    rating: 4.6,
    reviewCount: 142,
  },
  {
    id: "8",
    name: "Logitech MX Master 3 Mouse",
    price: 8500,
    image: Images.sampleProduct8,
    category: "Accessories",
    inStock: true,
    rating: 4.8,
    reviewCount: 487,
  },
];