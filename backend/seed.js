import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';

dotenv.config();

const products = [
  {
    name: 'HAVIT HV-G92 Gamepad',
    description: 'High-performance gamepad with ergonomic design, dual vibration motors, and precise analog sticks for the ultimate gaming experience.',
    price: 120, originalPrice: 160,
    category: 'Gaming',
    images: ['https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=400'],
    colors: ['black', 'red'], sizes: [],
    stock: 50, rating: 4.5, numReviews: 88, flashSale: true, isNew: false,
    tags: ['gamepad', 'controller', 'gaming'],
  },
  {
    name: 'AK-900 Wired Keyboard',
    description: 'Mechanical gaming keyboard with RGB backlighting, anti-ghosting technology, and durable keycaps for competitive gaming.',
    price: 960, originalPrice: 1160,
    category: 'Gaming',
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400'],
    colors: ['black'], sizes: [],
    stock: 30, rating: 4.5, numReviews: 75, flashSale: true, isNew: false,
    tags: ['keyboard', 'mechanical', 'gaming'],
  },
  {
    name: 'IPS LCD Gaming Monitor',
    description: '27-inch IPS display with 165Hz refresh rate, 1ms response time, and HDR support for an immersive gaming experience.',
    price: 370, originalPrice: 400,
    category: 'Gaming',
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400'],
    colors: ['black'], sizes: [],
    stock: 20, rating: 4.5, numReviews: 99, flashSale: true, isNew: false,
    tags: ['monitor', 'gaming', 'display'],
  },
  {
    name: 'S-Series Comfort Chair',
    description: 'Ergonomic gaming chair with lumbar support, adjustable armrests, and premium leather upholstery for all-day comfort.',
    price: 375, originalPrice: 400,
    category: 'Home & Lifestyle',
    images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400'],
    colors: ['black', 'red', 'blue'], sizes: [],
    stock: 15, rating: 4.8, numReviews: 99, flashSale: true,
    tags: ['chair', 'gaming', 'ergonomic'],
  },
  {
    name: 'The North Coat',
    description: 'Premium winter coat with thermal insulation, water-resistant outer shell, and stylish design for cold weather adventures.',
    price: 260, originalPrice: 360,
    category: "Women's Fashion",
    images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400'],
    colors: ['#ff6b6b', '#4a4a4a'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 40, rating: 5, numReviews: 95, isFeatured: true,
    tags: ['coat', 'winter', 'fashion'],
  },
  {
    name: 'Gucci Duffle Bag',
    description: 'Luxury duffle bag crafted from genuine leather with iconic GG pattern, multiple compartments, and gold-tone hardware.',
    price: 960, originalPrice: 1160,
    category: "Women's Fashion",
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'],
    colors: ['#8B6914', '#1a1a1a'], sizes: [],
    stock: 10, rating: 4.5, numReviews: 335, isFeatured: true,
    tags: ['bag', 'luxury', 'gucci'],
  },
  {
    name: 'RGB Liquid CPU Cooler',
    description: 'All-in-one liquid cooling solution with 240mm radiator, RGB fans, and quiet pump for exceptional thermal performance.',
    price: 160, originalPrice: 170,
    category: 'Computers',
    images: ['https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=400'],
    colors: ['black'], sizes: [],
    stock: 25, rating: 4.7, numReviews: 65, isFeatured: true,
    tags: ['cooler', 'pc', 'rgb'],
  },
  {
    name: 'Small BookShelf',
    description: 'Modern 5-tier bookshelf with industrial design, sturdy metal frame, and wood-look shelves perfect for home or office.',
    price: 360,
    category: 'Home & Lifestyle',
    images: ['https://images.unsplash.com/photo-1529480680136-5c27a5ec5f5d?w=400'],
    colors: ['#8B6914', '#4a4a4a'], sizes: [],
    stock: 20, rating: 5, numReviews: 65, isFeatured: true,
    tags: ['furniture', 'bookshelf', 'home'],
  },
  {
    name: 'ASUS FHD Gaming Laptop',
    description: 'High-performance gaming laptop with 15.6" FHD display, Intel Core i7, NVIDIA RTX 3060, 16GB RAM, and 512GB NVMe SSD.',
    price: 960, originalPrice: 1160,
    category: 'Computers',
    images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400'],
    colors: ['#1a1a1a'], sizes: [],
    stock: 15, rating: 5, numReviews: 65,
    tags: ['laptop', 'gaming', 'asus'],
  },
  {
    name: 'Canon EOS DSLR Camera',
    description: 'Professional DSLR camera with 24.2MP sensor, 4K video recording, dual pixel autofocus, and Wi-Fi connectivity.',
    price: 360,
    category: 'Camera',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400'],
    colors: ['black'], sizes: [],
    stock: 12, rating: 4.8, numReviews: 95,
    tags: ['camera', 'dslr', 'canon'],
  },
  {
    name: 'GP11 Shooter USB Gamepad',
    description: 'Versatile USB gamepad compatible with PC and most consoles, featuring precision joysticks and programmable buttons.',
    price: 550,
    category: 'Gaming',
    images: ['https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400'],
    colors: ['black', 'red'], sizes: [],
    stock: 35, rating: 4.8, numReviews: 55, isNew: true,
    tags: ['gamepad', 'controller', 'usb'],
  },
  {
    name: 'Quilted Satin Jacket',
    description: 'Stylish quilted satin jacket with bomber silhouette, ribbed cuffs, and premium satin finish for a luxurious look.',
    price: 750,
    category: "Men's Fashion",
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'],
    colors: ['#1a5f3a', '#1a1a1a'], sizes: ['S', 'M', 'L', 'XL'],
    stock: 20, rating: 4.5, numReviews: 55, isNew: true,
    tags: ['jacket', 'fashion', 'satin'],
  },
  {
    name: 'Kids Electric Toy Car',
    description: 'Battery-powered ride-on toy car for kids 3-8 years, with remote control, LED lights, and horn sound effects.',
    price: 960, originalPrice: 1100,
    category: "Baby's & Toys",
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
    colors: ['red', '#ff6b6b'], sizes: [],
    stock: 10, rating: 5, numReviews: 65,
    tags: ['toy', 'kids', 'electric'],
  },
  {
    name: 'Jr. Zoom Soccer Cleats',
    description: 'Lightweight junior soccer cleats with firm ground studs, breathable mesh upper, and reinforced toe cap.',
    price: 1160, originalPrice: 1200,
    category: 'Sports & Outdoor',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
    colors: ['#f5a623', 'black'], sizes: ['6', '7', '8', '9', '10'],
    stock: 30, rating: 4.5, numReviews: 35,
    tags: ['soccer', 'cleats', 'sports'],
  },
  {
    name: 'Havic HV-G92 Gamepad',
    description: 'Next-gen USB gamepad with vibration feedback, 10-hour battery life, and cross-platform compatibility.',
    price: 560,
    category: 'Gaming',
    images: ['https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=400'],
    colors: ['black', 'red'], sizes: [],
    stock: 45, rating: 5, numReviews: 65, isNew: true,
    tags: ['gamepad', 'gaming'],
  },
  {
    name: 'Curology Product Set',
    description: 'Complete skincare set including cleanser, moisturizer, and targeted treatment formulated by dermatologists.',
    price: 500,
    category: 'Health & Beauty',
    images: ['https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400'],
    colors: [], sizes: [],
    stock: 60, rating: 4.5, numReviews: 145,
    tags: ['skincare', 'beauty', 'health'],
  },
  {
    name: 'Apple iPhone 14 Pro',
    description: 'Latest iPhone with Dynamic Island, 48MP camera system, A16 Bionic chip, and all-day battery life.',
    price: 999, originalPrice: 1099,
    category: 'Phones',
    images: ['https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400'],
    colors: ['#1a1a1a', '#fff', '#8B6914', 'purple'], sizes: ['128GB', '256GB', '512GB'],
    stock: 30, rating: 5, numReviews: 500, isFeatured: true, flashSale: true,
    tags: ['iphone', 'apple', 'smartphone'],
  },
  {
    name: 'Samsung Galaxy Watch',
    description: 'Advanced smartwatch with health monitoring, GPS, sleep tracking, and 5-day battery life in a sleek design.',
    price: 299, originalPrice: 399,
    category: 'SmartWatch',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
    colors: ['#1a1a1a', 'silver', 'gold'], sizes: ['40mm', '44mm'],
    stock: 25, rating: 4.7, numReviews: 230, isFeatured: true,
    tags: ['smartwatch', 'samsung', 'wearable'],
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancelling headphones with 30-hour battery, multipoint connection, and crystal-clear calls.',
    price: 348, originalPrice: 399,
    category: 'HeadPhones',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
    colors: ['#1a1a1a', 'silver'], sizes: [],
    stock: 40, rating: 4.9, numReviews: 410, isFeatured: true,
    tags: ['headphones', 'sony', 'noise-cancelling'],
  },
  {
    name: 'Breed Dry Dog Food',
    description: 'Nutritionally complete dry dog food made with real chicken, brown rice, and wholesome vegetables for healthy dogs.',
    price: 100,
    category: 'Groceries & Pets',
    images: ['https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'],
    colors: [], sizes: ['2kg', '5kg', '10kg'],
    stock: 100, rating: 4, numReviews: 35,
    tags: ['pet', 'dog', 'food'],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exclusive');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@exclusive.com',
      password: 'admin123',
      role: 'admin',
      phone: '+8801511112222',
      address: '111 Bijoy sarani, Dhaka, DH 1515, Bangladesh',
    });
    console.log(`👤 Admin created: admin@exclusive.com / admin123`);

    // Create test user
    await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'user@exclusive.com',
      password: 'user123',
      role: 'user',
    });
    console.log(`👤 Test user created: user@exclusive.com / user123`);

    // Insert products
    const created = await Product.insertMany(products);
    console.log(`📦 ${created.length} products seeded`);

    console.log('\n✨ Database seeded successfully!');
    console.log('─────────────────────────────────');
    console.log('Admin:     admin@exclusive.com / admin123');
    console.log('Test User: user@exclusive.com / user123');
    console.log('─────────────────────────────────');
  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedDB();
