'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Product type definition
type Product = {
  id: number;
  name: string;
  price: string;
  category: string[];
  image: string;
  bestseller: boolean;
  new: boolean;
};

// Sample products data
const products: Product[] = [
  {
    id: 1,
    name: "Royal Heritage Gift Box",
    price: "₹8,500",
    category: ["Wedding", "Luxury"],
    image: "/assets/gift1.jpg",
    bestseller: true,
    new: false
  },
  {
    id: 2,
    name: "Diwali Celebration Hamper",
    price: "₹12,000",
    category: ["Festive", "Corporate"],
    image: "/assets/gift2.jpg",
    bestseller: true,
    new: false
  },
  {
    id: 3,
    name: "Personalized Anniversary Set",
    price: "₹15,500",
    category: ["Anniversary", "Personalized"],
    image: "/assets/gift3.jpg",
    bestseller: false,
    new: true
  },
  {
    id: 4,
    name: "Corporate Excellence Award",
    price: "₹9,250",
    category: ["Corporate", "Executive"],
    image: "/assets/gift4.jpg",
    bestseller: false,
    new: true
  },
  {
    id: 5,
    name: "Luxury Tea & Treats Hamper",
    price: "₹7,800",
    category: ["Festive", "Gourmet"],
    image: "/assets/gift5.jpg",
    bestseller: true,
    new: false
  },
  {
    id: 6,
    name: "Artisanal Wellness Basket",
    price: "₹11,200",
    category: ["Birthday", "Wellness"],
    image: "/assets/gift6.jpg",
    bestseller: false,
    new: true
  },
  {
    id: 7,
    name: "Premium Wine Gift Set",
    price: "₹18,500",
    category: ["Corporate", "Luxury"],
    image: "/assets/gift7.jpg",
    bestseller: true,
    new: false
  },
  {
    id: 8,
    name: "Handcrafted Jewelry Box",
    price: "₹21,000",
    category: ["Wedding", "Luxury"],
    image: "/assets/gift8.jpg",
    bestseller: false,
    new: true
  },
  {
    id: 9,
    name: "Festival of Lights Collection",
    price: "₹14,500",
    category: ["Festive", "Personalized"],
    image: "/assets/gift9.jpg",
    bestseller: true,
    new: false
  },
  {
    id: 10,
    name: "Executive Success Briefcase",
    price: "₹25,000",
    category: ["Corporate", "Executive"],
    image: "/assets/gift10.jpg",
    bestseller: false,
    new: true
  },
  {
    id: 11,
    name: "Celebration Gift Tower",
    price: "₹16,750",
    category: ["Birthday", "Anniversary"],
    image: "/assets/gift11.jpg",
    bestseller: true,
    new: false
  },
  {
    id: 12,
    name: "Gourmet Chocolate Collection",
    price: "₹9,800",
    category: ["Gourmet", "Personalized"],
    image: "/assets/gift12.jpg",
    bestseller: false,
    new: true
  }
];

// All available categories
const allCategories = ["All", "Wedding", "Corporate", "Festive", "Birthday", "Anniversary", "Luxury", "Personalized", "Gourmet", "Executive", "Wellness"];

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  // Filter products based on active category
  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(product => product.category.includes(activeCategory));
  
  // Sort products based on selected sorting option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "priceHigh") {
      return parseInt(b.price.replace(/[^\d]/g, '')) - parseInt(a.price.replace(/[^\d]/g, ''));
    } else if (sortBy === "priceLow") {
      return parseInt(a.price.replace(/[^\d]/g, '')) - parseInt(b.price.replace(/[^\d]/g, ''));
    } else if (sortBy === "newest") {
      return a.new ? -1 : b.new ? 1 : 0;
    } else {
      // Default: featured - bestsellers first
      return a.bestseller ? -1 : b.bestseller ? 1 : 0;
    }
  });

  return (
    <>
      <Header />
      <main className="flex flex-col min-h-screen pt-[90px]">
        {/* Hero Section */}
        <section className="bg-charcoal text-ivory py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute w-full h-full bg-gradient-to-r from-gold/30 to-blush/30"></div>
          </div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-playfair mb-6">
                Exquisite Gifts For Every Occasion
              </h1>
              <p className="text-xl md:text-2xl text-ivory/80 mb-10">
                Discover our curated collection of handcrafted luxury gifts that leave a lasting impression
              </p>
            </motion.div>
          </div>
        </section>

        {/* Shop Section */}
        <section className="py-16 container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
            {/* Categories */}
            <div className="w-full md:w-64 bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-charcoal mb-4">Categories</h3>
              <ul className="space-y-2">
                {allCategories.map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => setActiveCategory(category)}
                      className={`w-full text-left px-4 py-2 rounded-md transition-all ${
                        activeCategory === category
                          ? "bg-gold/10 text-gold font-medium"
                          : "text-charcoal/80 hover:bg-gold/5"
                      }`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-playfair font-bold text-charcoal">
                  {activeCategory === "All" ? "All Products" : activeCategory}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-charcoal/70">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-charcoal/20 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={product.image || "/assets/placeholder.jpg"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.bestseller && (
                        <div className="absolute top-4 left-4 bg-gold text-charcoal text-xs font-medium px-2 py-1 rounded">
                          Bestseller
                        </div>
                      )}
                      {product.new && (
                        <div className="absolute top-4 left-4 bg-blush text-white text-xs font-medium px-2 py-1 rounded">
                          New Arrival
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-playfair font-semibold text-charcoal mb-2">
                        {product.name}
                      </h3>
                      <div className="flex justify-between items-center">
                        <p className="text-gold font-medium">{product.price}</p>
                        <Link
                          href={`/shop/product/${product.id}`}
                          className="text-sm text-charcoal/70 hover:text-gold transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Custom Gift Section */}
        <section className="bg-charcoal/5 py-16">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-r from-charcoal to-charcoal/90 rounded-3xl p-8 md:p-12 text-center text-ivory relative overflow-hidden"
            >
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-6">
                  Looking for Something <span className="text-gold">Unique</span>?
                </h2>
                <p className="text-lg md:text-xl text-ivory/80 mb-8 max-w-2xl mx-auto">
                  Our artisans can create custom gifts for your special occasions. From personalized engravings to bespoke gift hampers.
                </p>
                <Link
                  href="/concierge"
                  className="magnetic-button inline-flex items-center justify-center px-6 py-3 bg-gold text-charcoal font-medium rounded-md hover:bg-gold/90 transition-all duration-300"
                >
                  Explore Custom Orders
                </Link>
              </div>
              <div className="absolute top-0 right-0 w-96 h-full opacity-10">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#FFD700" d="M34.5,-59.6C45.9,-53.2,57.4,-45.7,65.2,-34.9C73,-24.1,77.2,-10,76.9,3.7C76.6,17.4,71.9,30.6,64.4,42.2C56.9,53.8,46.5,63.8,34.5,69.5C22.4,75.3,8.7,76.8,-4.3,74C-17.4,71.2,-29.8,64.3,-40.7,55.5C-51.6,46.7,-61,36,-67.4,23.3C-73.9,10.6,-77.3,-4.1,-75.3,-18.2C-73.2,-32.4,-65.7,-46,-54.4,-53.1C-43.1,-60.1,-28,-60.4,-15.1,-62.9C-2.3,-65.3,8.4,-69.9,19.6,-69.1C30.8,-68.3,42.5,-62,45.9,-53.2C49.3,-44.3,44.1,-33.1,40.8,-23.3C37.5,-13.5,36.1,-5.1,38.1,4.5C40.1,14.2,45.5,25.1,44.6,34.4C43.8,43.6,36.7,51.3,27.8,58.8C18.9,66.3,8.3,73.7,-1.6,76.1C-11.5,78.5,-20.4,75.9,-28.6,70.9C-36.8,65.9,-44.3,58.3,-50.8,49.8C-57.3,41.2,-62.8,31.5,-66.6,20.9C-70.4,10.2,-72.4,-1.4,-70.1,-11.7C-67.8,-22,-61.1,-31,-53.4,-38.9C-45.6,-46.8,-36.8,-53.5,-27,-59.8C-17.2,-66,-8.6,-71.7,1.5,-74.2C11.5,-76.8,23.1,-75.9,34.5,-71.9C45.9,-67.8,57.2,-60.5,63.7,-50.5C70.1,-40.5,71.8,-27.7,69.5,-16C67.2,-4.3,61,-6.6,56.4,1.9C51.9,10.3,49,19.3,44.2,28.2C39.4,37.1,32.7,46,24,52.1C15.4,58.3,4.8,61.6,-6.4,65.3C-17.6,68.9,-29.6,72.9,-39.9,69.3C-50.2,65.7,-58.8,54.6,-62.8,42.6C-66.8,30.5,-66.1,17.5,-67.7,4.3C-69.3,-9,-73.2,-22.5,-71.5,-35.3C-69.7,-48.1,-62.3,-60.3,-51.1,-67.9C-40,-75.5,-25.1,-78.6,-10.7,-78.5C3.8,-78.5,18.8,-75.4,30.9,-67.9Z" transform="translate(100 100)" />
                </svg>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
} 