'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products?id=${id}`);
        
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const productData = await response.json();
        setProduct(productData);
        setSelectedImage(productData.images[0] || null);
        
        // Fetch related products
        if (productData.related_products && productData.related_products.length > 0) {
          const allProductsResponse = await fetch('/api/products');
          const allProductsData = await allProductsResponse.json();
          
          const related = allProductsData.products.filter(
            (p: Product) => productData.related_products.includes(p.id)
          );
          
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Product not found or an error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Format price as currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format category for display
  const formatCategory = (category: string) => {
    return category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <>
      <Header />
      <main className="flex flex-col min-h-screen pt-[90px]">
        {/* Product Detail Section */}
        <section className="py-16 container mx-auto px-4 md:px-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gold border-r-transparent align-[-0.125em]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-charcoal mb-4">Error</h2>
              <p className="text-charcoal/70 mb-6">{error}</p>
              <Link
                href="/shop"
                className="inline-block px-6 py-3 bg-gold text-white rounded-md hover:bg-gold/90 transition-colors"
              >
                Back to Shop
              </Link>
            </div>
          ) : product ? (
            <>
              <div className="flex justify-start mb-6">
                <Link
                  href="/shop"
                  className="text-charcoal/70 hover:text-charcoal transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Shop
                </Link>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Product Images */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={selectedImage || product.images[0] || '/assets/placeholder.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-4">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(image)}
                          className={`relative aspect-square rounded-md overflow-hidden bg-gray-100 ${
                            selectedImage === image ? 'ring-2 ring-gold' : 'hover:opacity-80'
                          }`}
                        >
                          <Image
                            src={image}
                            alt={`${product.name} - Image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
                
                {/* Product Details */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col"
                >
                  <div className="pb-6 mb-6 border-b border-gray-200">
                    <h1 className="text-3xl font-bold text-charcoal mb-4 font-playfair">{product.name}</h1>
                    
                    <div className="flex items-center mb-6">
                      {product.discount_price ? (
                        <>
                          <span className="text-2xl text-gold font-bold">{formatPrice(product.discount_price)}</span>
                          <span className="ml-3 text-charcoal/50 text-lg line-through">{formatPrice(product.price)}</span>
                          <span className="ml-3 px-2 py-1 bg-red-100 text-red-700 text-sm rounded">
                            Save {Math.round((1 - product.discount_price / product.price) * 100)}%
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl text-gold font-bold">{formatPrice(product.price)}</span>
                      )}
                    </div>
                    
                    <p className="text-charcoal/80 leading-relaxed mb-6">{product.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {product.categories.map((category) => (
                        <Link
                          key={category}
                          href={`/shop?category=${category}`}
                          className="px-3 py-1 bg-gray-100 text-charcoal/70 rounded-md text-sm hover:bg-gray-200 transition-colors"
                        >
                          {formatCategory(category)}
                        </Link>
                      ))}
                    </div>
                    
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        product.stock > 10
                          ? 'bg-green-100 text-green-800'
                          : product.stock > 0
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 10
                          ? 'In Stock'
                          : product.stock > 0
                          ? `Only ${product.stock} left`
                          : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Features */}
                  {product.features.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-charcoal mb-4">Product Features</h3>
                      <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-charcoal/80">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Call to action */}
                  <div className="mt-auto">
                    <button
                      className={`w-full py-3 px-6 rounded-md text-white font-medium mb-4 ${
                        product.stock > 0
                          ? 'bg-gold hover:bg-gold/90'
                          : 'bg-gray-400 cursor-not-allowed'
                      } transition-colors`}
                      disabled={product.stock <= 0}
                    >
                      {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    
                    <button className="w-full py-3 px-6 border border-charcoal/20 rounded-md text-charcoal hover:bg-gray-50 transition-colors">
                      Add to Wishlist
                    </button>
                  </div>
                </motion.div>
              </div>
              
              {/* Related Products */}
              {relatedProducts.length > 0 && (
                <div className="mt-16 pt-12 border-t border-gray-200">
                  <h2 className="text-2xl font-bold text-charcoal mb-8 font-playfair">Related Products</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedProducts.map((relatedProduct) => (
                      <motion.div
                        key={relatedProduct.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="relative h-64 bg-gray-100">
                          <Image
                            src={relatedProduct.images[0] || '/assets/placeholder.jpg'}
                            alt={relatedProduct.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-charcoal mb-2">
                            {relatedProduct.name}
                          </h3>
                          <div className="flex items-center mb-3">
                            {relatedProduct.discount_price ? (
                              <>
                                <span className="text-gold font-bold">{formatPrice(relatedProduct.discount_price)}</span>
                                <span className="ml-2 text-charcoal/50 text-sm line-through">{formatPrice(relatedProduct.price)}</span>
                              </>
                            ) : (
                              <span className="text-gold font-bold">{formatPrice(relatedProduct.price)}</span>
                            )}
                          </div>
                          <Link
                            href={`/product/${relatedProduct.id}`}
                            className="block w-full text-center py-2 px-4 bg-charcoal text-white rounded-md hover:bg-charcoal/90 transition-colors"
                          >
                            View Details
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </section>
      </main>
      <Footer />
    </>
  );
} 