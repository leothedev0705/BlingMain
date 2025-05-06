'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Product type definition
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  images: string[];
  categories: string[];
  tags: string[];
  features: string[];
  stock: number;
  related_products: string[];
};

type ProductData = {
  collections: any[];
  products: Product[];
};

export default function ShopPage() {
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProductData(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get all unique categories from products
  const allCategories = productData?.products
    ? ["all", ...Array.from(new Set(productData.products.flatMap(product => product.categories)))]
    : ["all"];

  // Format categories for display
  const formatCategory = (category: string) => {
    return category === "all" 
      ? "All Products"
      : category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Filter products based on active category
  const filteredProducts = !productData?.products
    ? []
    : activeCategory === "all"
      ? productData.products
      : productData.products.filter(product => product.categories.includes(activeCategory));
  
  // Sort products based on selected sorting option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "priceHigh") {
      return b.price - a.price;
    } else if (sortBy === "priceLow") {
      return a.price - b.price;
    } else if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else {
      // Default: featured - we'll use stock as a proxy for bestsellers (lower stock = more popular)
      return a.stock - b.stock;
    }
  });

  // Format price as currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

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
                      {formatCategory(category)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div className="flex-1">
              {/* Sorting and Results */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <p className="text-charcoal/70 text-sm">
                  Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
                </p>
                <div className="flex items-center">
                  <label className="text-sm text-charcoal/70 mr-2">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border-0 bg-white rounded-md py-2 pr-8 pl-3 text-sm focus:ring-2 focus:ring-gold/30 text-charcoal shadow-sm"
                  >
                    <option value="featured">Featured</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="py-20 flex items-center justify-center">
                  <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-gold border-r-transparent align-[-0.125em]"></div>
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-xl text-charcoal/70">No products found in this category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sortedProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="relative h-64 bg-gray-100">
                        <Image
                          src={product.images?.[0] || '/assets/placeholder.jpg'}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                        {product.stock < 5 && product.stock > 0 && (
                          <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs px-2 py-1 rounded-md">
                            Low Stock
                          </div>
                        )}
                        {product.stock === 0 && (
                          <div className="absolute top-4 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
                            Sold Out
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="font-semibold text-lg text-charcoal mb-2">{product.name}</h3>
                        <div className="flex items-center mb-4">
                          {product.discount_price ? (
                            <>
                              <span className="text-gold font-bold text-lg">{formatPrice(product.discount_price)}</span>
                              <span className="ml-2 text-charcoal/50 text-sm line-through">{formatPrice(product.price)}</span>
                            </>
                          ) : (
                            <span className="text-gold font-bold text-lg">{formatPrice(product.price)}</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {product.categories.slice(0, 3).map((category) => (
                            <span
                              key={category}
                              className="bg-gray-100 text-charcoal/70 text-xs px-2 py-1 rounded"
                            >
                              {formatCategory(category)}
                            </span>
                          ))}
                        </div>
                        <Link
                          href={`/product/${product.id}`}
                          className="block w-full py-2 px-4 bg-charcoal text-ivory text-center rounded-md hover:bg-charcoal/90 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
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