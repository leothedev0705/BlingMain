'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Types for our products data
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

type Collection = {
  id: string;
  title: string;
  description: string;
  image: string;
  products: string[];
};

type ProductData = {
  collections: Collection[];
  products: Product[];
};

export default function AdminProductsPage() {
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'stock'>('name');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Fetch product data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProductData(data);
      } catch (error) {
        console.error("Failed to fetch product data:", error);
        // Fallback to local import if API fails
        import('@/data/products.json')
          .then((module) => {
            setProductData(module.default);
          })
          .catch((err) => {
            console.error("Failed to load local data:", err);
          });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get unique categories from products
  const getCategories = () => {
    if (!productData?.products) return [];
    
    const categories = new Set<string>();
    productData.products.forEach(product => {
      product.categories.forEach(category => {
        categories.add(category);
      });
    });
    
    return Array.from(categories);
  };

  // Filter products based on search and category
  const getFilteredProducts = () => {
    if (!productData?.products) return [];

    return productData.products.filter(product => {
      // Search filter
      const matchesSearch = searchQuery.trim() === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const matchesCategory = categoryFilter === 'all' ||
        product.categories.includes(categoryFilter);

      return matchesSearch && matchesCategory;
    });
  };

  // Sort products
  const getSortedProducts = () => {
    const filtered = getFilteredProducts();
    
    switch (sortBy) {
      case 'name':
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      case 'price-asc':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...filtered].sort((a, b) => b.price - a.price);
      case 'stock':
        return [...filtered].sort((a, b) => b.stock - a.stock);
      default:
        return filtered;
    }
  };

  // Toggle product selection
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Select all products
  const toggleSelectAll = () => {
    if (selectedProducts.length === getFilteredProducts().length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(getFilteredProducts().map(p => p.id));
    }
  };

  // Delete selected products
  const deleteSelectedProducts = async () => {
    if (selectedProducts.length === 0 || !productData) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedProducts.length} products? This action cannot be undone.`)) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Delete products one by one
      for (const productId of selectedProducts) {
        await fetch(`/api/products?id=${productId}`, {
          method: 'DELETE',
        });
      }
      
      // Refresh product list
      const response = await fetch('/api/products');
      const data = await response.json();
      setProductData(data);
      
      setSelectedProducts([]);
    } catch (error) {
      console.error('Error deleting products:', error);
      alert('Failed to delete some products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format price as currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gold border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      </div>
    );
  }

  const sortedProducts = getSortedProducts();
  const categories = getCategories();

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-bold text-charcoal"
        >
          Manage Products
        </motion.h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center px-4 py-2 bg-gold text-white rounded-md hover:bg-gold/90 transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Product
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm p-4 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-grow">
            <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 text-sm focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-white px-4 py-2 text-charcoal">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Category filter */}
          <div className="w-full md:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Sort options */}
          <div className="w-full md:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'price-asc' | 'price-desc' | 'stock')}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="stock">Sort by Stock</option>
            </select>
          </div>
        </div>

        {/* Bulk actions (only visible when products are selected) */}
        {selectedProducts.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="select-all"
                checked={selectedProducts.length === getFilteredProducts().length && getFilteredProducts().length > 0}
                onChange={toggleSelectAll}
                className="h-4 w-4 text-gold focus:ring-gold/50 border-gray-300 rounded"
              />
              <label htmlFor="select-all" className="ml-2 text-sm text-charcoal">
                {selectedProducts.length} {selectedProducts.length === 1 ? 'product' : 'products'} selected
              </label>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedProducts([])}
                className="px-3 py-1 text-sm text-charcoal/70 hover:text-charcoal transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteSelectedProducts}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Product listing */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {sortedProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 mx-auto text-charcoal/20 mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="text-lg font-bold text-charcoal mb-1">No Products Found</h3>
            <p className="text-sm text-charcoal/70 mb-4">
              {searchQuery || categoryFilter !== 'all'
                ? `No products match your search/filter criteria`
                : "You haven't added any products yet"}
            </p>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center px-4 py-2 bg-gold text-white rounded-md hover:bg-gold/90 transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-sm">
              <thead className="bg-gray-50 text-charcoal/70 text-sm">
                <tr>
                  <th className="p-4 text-left w-12">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === sortedProducts.length && sortedProducts.length > 0}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 text-gold focus:ring-gold/50 border-gray-300 rounded"
                    />
                  </th>
                  <th className="p-4 text-left">Product</th>
                  <th className="p-4 text-right">Price</th>
                  <th className="p-4 text-center">Stock</th>
                  <th className="p-4 text-left">Categories</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleProductSelection(product.id)}
                        className="h-4 w-4 text-gold focus:ring-gold/50 border-gray-300 rounded"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 relative bg-gray-100 rounded-md mr-3 flex-shrink-0">
                          <Image
                            src={product.images[0] || '/assets/placeholder.jpg'}
                            alt={product.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-charcoal">{product.name}</h3>
                          <p className="text-xs text-charcoal/60 max-w-xs truncate">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {product.discount_price ? (
                        <div>
                          <span className="font-medium text-charcoal">{formatPrice(product.discount_price)}</span>
                          <span className="text-xs text-charcoal/50 line-through ml-2">{formatPrice(product.price)}</span>
                        </div>
                      ) : (
                        <span className="font-medium text-charcoal">{formatPrice(product.price)}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.stock > 10 
                            ? 'bg-green-100 text-green-800' 
                            : product.stock > 0 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {product.categories.slice(0, 2).map((category) => (
                          <span 
                            key={category} 
                            className="inline-block px-2 py-1 bg-gray-100 text-charcoal/70 rounded text-xs"
                          >
                            {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </span>
                        ))}
                        {product.categories.length > 2 && (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-charcoal/70 rounded text-xs">
                            +{product.categories.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => toggleProductSelection(product.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
} 