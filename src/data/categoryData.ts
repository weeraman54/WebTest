import { Images } from '../assets/assets';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  isOnSale?: boolean;
  isWishlisted?: boolean;
  brand: string;
  availability: string;
  description?: string;
  specs?: Record<string, string>;
}

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'MSI CYBORG 15 A13UDX i5 13TH GEN RTX 3050 6GB',
    price: 254900,
    originalPrice: 269900,
    image: Images.sampleProduct1,
    category: 'LAPTOPS',
    inStock: true,
    isOnSale: true,
    isWishlisted: false,
    brand: 'MSI',
    availability: 'In Stock',
    description: 'High-performance gaming laptop with RTX 3050 graphics card designed for gamers and content creators. Features advanced cooling system and RGB backlit keyboard.',
    specs: {
      'Model Number': 'CYBORG 15 A13UDX',
      'Processor': 'Intel® Core™ i5-13420H, 8C (4P + 4E) / 12T, P-core 2.1 / 4.6GHz, E-core 1.5 / 3.4GHz, 12MB',
      'RAM': '16GB DDR5-5200MHz',
      'Storage': '512GB PCIe® NVMe™ M.2 SSD',
      'Graphics Card': 'NVIDIA® GeForce RTX™ 3050 Laptop GPU 6GB GDDR6 96-bit',
      'Display': '15.6" FHD (1920x1080), 144Hz, IPS Level',
      'Front Camera': 'HD Type (30fps@720p)',
      'AUDIO': '2x 2W Speaker',
      'AUDIO JACK': '3x Mic-in/Headphone-out Combo Jack'
    }
  },
  {
    id: '2',
    name: 'Asus Vivobook X1504VA i5 13th Gen',
    price: 176900,
    image: Images.sampleProduct2,
    category: 'LAPTOPS',
    inStock: true,
    isWishlisted: false,
    brand: 'ASUS',
    availability: 'In Stock',
    description: 'Reliable everyday laptop for work and entertainment',
    specs: {
      'Processor': 'Intel Core i5 13th Gen',
      'Graphics': 'Intel Iris Xe',
      'RAM': '8GB DDR4',
      'Storage': '512GB SSD'
    }
  },
  {
    id: '3',
    name: 'HP 250 G10 i5 13th Gen',
    price: 175900,
    originalPrice: 185000,
    image: Images.sampleProduct3,
    category: 'LAPTOPS',
    inStock: true,
    isOnSale: true,
    isWishlisted: false,
    brand: 'HP',
    availability: 'In Stock',
    description: 'Professional laptop designed for business use',
    specs: {
      'Processor': 'Intel Core i5 13th Gen',
      'Graphics': 'Intel UHD Graphics',
      'RAM': '8GB DDR4',
      'Storage': '256GB SSD'
    }
  },
  {
    id: '4',
    name: 'HP 250 G10 i3 13th Gen',
    price: 139900,
    image: Images.sampleProduct4,
    category: 'LAPTOPS',
    inStock: true,
    isWishlisted: false,
    brand: 'HP',
    availability: 'In Stock',
    description: 'Budget-friendly laptop for basic computing needs',
    specs: {
      'Processor': 'Intel Core i3 13th Gen',
      'Graphics': 'Intel UHD Graphics',
      'RAM': '4GB DDR4',
      'Storage': '256GB SSD'
    }
  },
  {
    id: '5',
    name: 'Asus Vivobook F1502ZA i5 12th Gen (H)',
    price: 165900,
    image: Images.sampleProduct5,
    category: 'LAPTOPS',
    inStock: true,
    isWishlisted: false,
    brand: 'ASUS',
    availability: 'In Stock',
    description: 'Versatile laptop with excellent performance',
    specs: {
      'Processor': 'Intel Core i5 12th Gen',
      'Graphics': 'Intel Iris Xe',
      'RAM': '8GB DDR4',
      'Storage': '512GB SSD'
    }
  },
  {
    id: '6',
    name: 'Asus Vivobook X1504V i3 13th Gen',
    price: 145900,
    image: Images.sampleProduct6,
    category: 'LAPTOPS',
    inStock: true,
    isWishlisted: false,
    brand: 'ASUS',
    availability: 'In Stock',
    description: 'Affordable laptop with modern features',
    specs: {
      'Processor': 'Intel Core i3 13th Gen',
      'Graphics': 'Intel UHD Graphics',
      'RAM': '4GB DDR4',
      'Storage': '256GB SSD'
    }
  },
  {
    id: '7',
    name: 'MSI Modern 15 F13MG i5 13th Gen',
    price: 185900,
    image: Images.sampleProduct7,
    category: 'LAPTOPS',
    inStock: true,
    isWishlisted: false,
    brand: 'MSI',
    availability: 'In Stock',
    description: 'Modern design laptop for professionals',
    specs: {
      'Processor': 'Intel Core i5 13th Gen',
      'Graphics': 'Intel Iris Xe',
      'RAM': '16GB DDR4',
      'Storage': '512GB SSD'
    }
  },
  {
    id: '8',
    name: 'Used Lenovo T490 i7 8th Gen',
    price: 125900,
    originalPrice: 180000,
    image: Images.sampleProduct8,
    category: 'LAPTOPS',
    inStock: true,
    isOnSale: true,
    isWishlisted: false,
    brand: 'LENOVO',
    availability: 'In Stock',
    description: 'Refurbished ThinkPad with excellent build quality',
    specs: {
      'Processor': 'Intel Core i7 8th Gen',
      'Graphics': 'Intel UHD Graphics',
      'RAM': '16GB DDR4',
      'Storage': '512GB SSD'
    }
  },
  {
    id: '9',
    name: 'Dell Inspiron 15 3000 i5 11th Gen',
    price: 158900,
    image: Images.sampleProduct1,
    category: 'LAPTOPS',
    inStock: true,
    isWishlisted: false,
    brand: 'DELL',
    availability: 'In Stock',
    description: 'Reliable laptop for everyday computing',
    specs: {
      'Processor': 'Intel Core i5 11th Gen',
      'Graphics': 'Intel Iris Xe',
      'RAM': '8GB DDR4',
      'Storage': '256GB SSD'
    }
  },
  {
    id: '10',
    name: 'Acer Aspire 5 i5 12th Gen',
    price: 172900,
    image: Images.sampleProduct2,
    category: 'LAPTOPS',
    inStock: false,
    isWishlisted: false,
    brand: 'ACER',
    availability: 'Out of Stock',
    description: 'Balanced laptop for work and entertainment',
    specs: {
      'Processor': 'Intel Core i5 12th Gen',
      'Graphics': 'Intel Iris Xe',
      'RAM': '8GB DDR4',
      'Storage': '512GB SSD'
    }
  },
  {
    id: '11',
    name: 'Custom Gaming Desktop PC i7 12th Gen',
    price: 185000,
    image: Images.sampleProduct3,
    category: 'DESKTOPS',
    inStock: true,
    isWishlisted: false,
    brand: 'CUSTOM',
    availability: 'In Stock',
    description: 'High-performance gaming desktop with RTX 3060',
    specs: {
      'Processor': 'Intel Core i7 12th Gen',
      'Graphics': 'RTX 3060 8GB',
      'RAM': '16GB DDR4',
      'Storage': '1TB SSD'
    }
  },
  {
    id: '12',
    name: 'Used Dell OptiPlex 7010 Desktop',
    price: 45000,
    originalPrice: 65000,
    image: Images.sampleProduct4,
    category: 'USED-DESKTOP',
    inStock: true,
    isOnSale: true,
    isWishlisted: false,
    brand: 'DELL',
    availability: 'In Stock',
    description: 'Refurbished desktop computer for office use',
    specs: {
      'Processor': 'Intel Core i5 3rd Gen',
      'Graphics': 'Intel HD Graphics',
      'RAM': '8GB DDR3',
      'Storage': '500GB HDD'
    }
  },
  {
    id: '13',
    name: 'Intel Core i5 13th Gen Processor',
    price: 28500,
    image: Images.sampleProduct5,
    category: 'PROCESSORS',
    inStock: true,
    isWishlisted: false,
    brand: 'INTEL',
    availability: 'In Stock',
    description: 'Latest 13th generation Intel processor',
    specs: {
      'Cores': '6 Performance + 4 Efficient',
      'Base Clock': '2.5 GHz',
      'Boost Clock': '4.6 GHz',
      'Socket': 'LGA 1700'
    }
  },
  {
    id: '14',
    name: 'ASUS ROG Strix Z790-E Gaming Motherboard',
    price: 42000,
    image: Images.sampleProduct6,
    category: 'MOTHERBOARDS',
    inStock: true,
    isWishlisted: false,
    brand: 'ASUS',
    availability: 'In Stock',
    description: 'High-end gaming motherboard with WiFi 6E',
    specs: {
      'Socket': 'LGA 1700',
      'Chipset': 'Intel Z790',
      'RAM Slots': '4x DDR5',
      'Max RAM': '128GB'
    }
  },
  {
    id: '15',
    name: 'Corsair Vengeance LPX 16GB DDR4 3200MHz',
    price: 8500,
    image: Images.sampleProduct7,
    category: 'MEMORY',
    inStock: true,
    isWishlisted: false,
    brand: 'CORSAIR',
    availability: 'In Stock',
    description: 'High-performance DDR4 memory kit',
    specs: {
      'Capacity': '16GB (2x8GB)',
      'Speed': '3200MHz',
      'Latency': 'CL16',
      'Type': 'DDR4'
    }
  },
  {
    id: '16',
    name: 'Samsung 24" Curved Gaming Monitor',
    price: 25000,
    originalPrice: 30000,
    image: Images.sampleProduct8,
    category: 'MONITORS',
    inStock: true,
    isOnSale: true,
    isWishlisted: false,
    brand: 'SAMSUNG',
    availability: 'In Stock',
    description: '144Hz curved gaming monitor with AMD FreeSync',
    specs: {
      'Size': '24 inches',
      'Resolution': '1920x1080',
      'Refresh Rate': '144Hz',
      'Panel Type': 'VA'
    }
  },
  {
    id: '17',
    name: 'Kingston NV2 1TB NVMe SSD',
    price: 12500,
    image: Images.sampleProduct1,
    category: 'SSD',
    inStock: true,
    isWishlisted: false,
    brand: 'KINGSTON',
    availability: 'In Stock',
    description: 'High-speed NVMe SSD for faster boot times',
    specs: {
      'Capacity': '1TB',
      'Interface': 'PCIe 4.0 NVMe',
      'Read Speed': '3,500 MB/s',
      'Write Speed': '2,100 MB/s'
    }
  },
  {
    id: '18',
    name: 'Logitech MX Master 3S Wireless Mouse',
    price: 8900,
    image: Images.sampleProduct2,
    category: 'KEYBOARD-MOUSE',
    inStock: true,
    isWishlisted: false,
    brand: 'LOGITECH',
    availability: 'In Stock',
    description: 'Advanced wireless mouse for productivity',
    specs: {
      'DPI': '8000',
      'Connectivity': 'Bluetooth + USB-C',
      'Battery Life': '70 days',
      'Buttons': '7'
    }
  },
];

export const filterData = {
  brands: [
    { id: 'dell', name: 'DELL', count: 2 },
    { id: 'hp', name: 'HP', count: 2 },
    { id: 'asus', name: 'ASUS', count: 4 },
    { id: 'msi', name: 'MSI', count: 2 },
    { id: 'lenovo', name: 'LENOVO', count: 1 },
    { id: 'acer', name: 'ACER', count: 1 },
    { id: 'custom', name: 'CUSTOM', count: 1 },
    { id: 'intel', name: 'INTEL', count: 1 },
    { id: 'corsair', name: 'CORSAIR', count: 1 },
    { id: 'samsung', name: 'SAMSUNG', count: 1 },
    { id: 'kingston', name: 'KINGSTON', count: 1 },
    { id: 'logitech', name: 'LOGITECH', count: 1 },
    { id: 'unknown', name: 'UNKNOWN', count: 0 },
  ],
  availability: [
    { id: 'in-stock', name: 'In Stock', count: 17 },
    { id: 'out-of-stock', name: 'Out of Stock', count: 1 },
    { id: 'coming-soon', name: 'Coming Soon', count: 0 },
    { id: 'new-arrival', name: 'New Arrival', count: 0 },
    { id: 'pre-order', name: 'Pre Order', count: 0 },
  ],
  categories: [
    { id: 'laptops', name: 'Laptops', count: 10 },
    { id: 'desktops', name: 'Desktops', count: 1 },
    { id: 'used-desktop', name: 'Used Desktop', count: 1 },
    { id: 'processors', name: 'Processors', count: 1 },
    { id: 'motherboards', name: 'Motherboards', count: 1 },
    { id: 'memory', name: 'Memory', count: 1 },
    { id: 'monitors', name: 'Monitors', count: 1 },
    { id: 'ssd', name: 'SSD', count: 1 },
    { id: 'keyboard-mouse', name: 'Keyboard & Mouse', count: 1 },
  ]
};

export const priceRange = {
  min: 0,
  max: 2000000
};
