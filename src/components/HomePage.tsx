'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from './Header';
import Image from 'next/image';
import Footer from './Footer';

const featuredProducts = [
  {
    id: 1,
    title: 'Royal Diwali Collection',
    description: 'Premium gift hamper with artisanal sweets, handcrafted diyas & more',
    price: '₹15,999',
    originalPrice: '₹18,999',
    imageUrl: '/collections/diwali.jpg',
    bgColor: 'bg-blush',
    badge: 'Best Seller',
    category: 'Festive'
  },
  {
    id: 2,
    title: 'Wedding Memory Box',
    description: 'Personalized keepsake collection with premium gifts for the couple',
    price: '₹24,999',
    originalPrice: '₹29,999',
    imageUrl: '/collections/wedding.jpg',
    bgColor: 'bg-rich-green/20',
    badge: 'New',
    category: 'Wedding'
  },
  {
    id: 3,
    title: 'Executive Gift Trunk',
    description: 'Luxury corporate gifting solution with personalized premium items',
    price: '₹35,999',
    originalPrice: '₹39,999',
    imageUrl: '/collections/corporate.jpg',
    bgColor: 'bg-gold/30',
    badge: 'Limited',
    category: 'Corporate'
  },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[90vh] overflow-hidden bg-charcoal">
          <div className="absolute inset-0 z-0 silk-texture opacity-10"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10 h-full">
            <div className="flex flex-col md:flex-row items-center justify-between h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-xl md:max-w-2xl"
              >
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-blush/20 text-blush text-sm font-medium rounded-full">New Collection Launch</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory mb-6 font-playfair">
                  Luxury Gifts <br />
                  <span className="text-gold">Worth Celebrating</span>
                </h1>
                <p className="text-lg md:text-xl text-ivory/90 mb-8 max-w-2xl">
                  Discover our exclusive collection of premium gift experiences for every occasion. Free shipping on orders above ₹10,000.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/shop"
                    className="magnetic-button gold-gradient inline-flex items-center justify-center px-6 py-3 text-charcoal font-medium rounded-md hover:shadow-lg transition-all duration-300"
                  >
                    Shop Now
                  </Link>
                  <Link
                    href="/collections"
                    className="magnetic-button inline-flex items-center justify-center px-6 py-3 bg-transparent border border-gold text-ivory font-medium rounded-md hover:bg-gold/10 transition-all duration-300"
                  >
                    View Collections
                  </Link>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="hidden md:block relative mt-8 md:mt-0"
              >
                <div className="relative w-[450px] h-[450px]">
                  <Image 
                    src="/assets/Img1234.png" 
                    alt="Luxury Gift Box" 
                    width={450} 
                    height={450}
                    className="object-contain"
                    priority
                  />
                  <div className="absolute -inset-4 rounded-full bg-gold/10 -z-10 animate-pulse"></div>
                </div>
              </motion.div>
            </div>
          </div>
          {/* Add subtle animated background elements for a more contemporary feel */}
          <motion.div 
            className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-blush/10"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ 
              repeat: Infinity,
              duration: 8,
            }}
          />
          <motion.div 
            className="absolute top-20 left-10 w-24 h-24 rounded-full bg-gold/10"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ 
              repeat: Infinity,
              duration: 10,
              delay: 1,
            }}
          />
        </section>

        {/* Product Categories */}
        <section className="py-16 bg-ivory">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {['Wedding', 'Corporate', 'Festive', 'Personalized'].map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Link href={`/shop/${category.toLowerCase()}`} className="block p-6 text-center">
                    <h3 className="text-lg font-semibold text-charcoal font-playfair mb-2">{category}</h3>
                    <p className="text-charcoal/70 text-sm mb-4">Shop Collection</p>
                    <div className="flex justify-center">
                      <div className="w-10 h-10 rounded-full bg-blush/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blush" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-ivory">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-12">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl font-bold text-charcoal mb-4 font-playfair"
              >
                Featured Collections
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-lg text-charcoal/80 max-w-2xl"
              >
                Our most popular premium gift boxes, curated with exclusive items
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`group relative luxury-card hover-grow overflow-hidden ${product.bgColor}`}
                  whileHover={{ y: -5 }}
                >
                  <div className="h-64 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent z-10" />
                    
                    {/* Badge */}
                    {product.badge && (
                      <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-gold text-charcoal text-xs font-bold rounded-full">
                        {product.badge}
                      </div>
                    )}
                    
                    <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-ivory/80 text-sm mb-1">{product.category}</p>
                          <h3 className="text-xl font-bold text-ivory font-playfair">{product.title}</h3>
                          <p className="text-ivory/90 mt-1 mb-3 text-sm line-clamp-2">{product.description}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-gold font-bold">{product.price}</span>
                            {product.originalPrice && (
                              <span className="text-ivory/60 text-sm line-through">{product.originalPrice}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex gap-2">
                        <Link
                          href={`/product/${product.id}`}
                          className="flex-1 text-center py-2 bg-ivory/10 backdrop-blur-sm text-ivory text-sm font-medium rounded hover:bg-ivory/20 transition-colors"
                        >
                          View Details
                        </Link>
                        <button
                          className="flex-none p-2 bg-gold text-charcoal rounded hover:bg-gold/90 transition-colors"
                          aria-label="Add to cart"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-6 py-3 border border-charcoal text-charcoal font-medium rounded-md hover:bg-charcoal hover:text-ivory transition-all duration-300"
              >
                View All Products
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Personalized Gift Quote */}
        <section className="py-12 bg-blush/10">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto bg-white p-8 md:p-10 rounded-xl shadow-md border border-blush/20 text-center"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-4 font-playfair">Shop with Confidence</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-ivory flex items-center justify-center rounded-full mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blush" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-charcoal mb-1">Secure Checkout</h3>
                  <p className="text-sm text-charcoal/70">Multiple payment options</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-ivory flex items-center justify-center rounded-full mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blush" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-charcoal mb-1">Free Shipping</h3>
                  <p className="text-sm text-charcoal/70">On orders above ₹10,000</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-ivory flex items-center justify-center rounded-full mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blush" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-charcoal mb-1">Customer Support</h3>
                  <p className="text-sm text-charcoal/70">24/7 dedicated assistance</p>
                </div>
              </div>
              <p className="text-lg text-charcoal/80 mb-6">
                Need custom orders? Call us at <span className="text-blush font-semibold">+91 98765 43210</span> for exclusive personalized gifting solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/shop/custom"
                  className="magnetic-button inline-flex items-center justify-center px-6 py-3 bg-charcoal text-ivory font-medium rounded-md hover:bg-charcoal/90 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Custom Orders
                </Link>
                <Link
                  href="/contact"
                  className="magnetic-button inline-flex items-center justify-center px-6 py-3 border border-charcoal text-charcoal font-medium rounded-md hover:bg-charcoal hover:text-ivory transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Contact Support
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Gift Concierge */}
        <section className="py-24 bg-charcoal silk-texture relative">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="bg-ivory/5 backdrop-blur-sm border border-gold/20 rounded-2xl p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-ivory mb-6 font-playfair">
                    Gift <span className="text-gold">Concierge</span>
                  </h2>
                  <p className="text-lg text-ivory/90 mb-8">
                    Not sure what to buy? Our smart recommendation engine will help you find the perfect gift based on occasion, recipient, and budget. <span className="text-gold font-medium">The AI powered gift finder is our concierge only!</span>
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/concierge"
                      className="magnetic-button gold-gradient inline-flex items-center justify-center px-6 py-3 text-charcoal font-medium rounded-md hover:shadow-lg transition-all duration-300"
                    >
                      Find Perfect Gift
                    </Link>
                    <Link
                      href="/shop/trending"
                      className="magnetic-button inline-flex items-center justify-center px-6 py-3 bg-transparent border border-gold text-ivory font-medium rounded-md hover:bg-gold/10 transition-all duration-300"
                    >
                      View Trending Gifts
                    </Link>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="bg-charcoal/40 backdrop-blur-sm rounded-xl p-6 border border-gold/10"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-blush"></div>
                    <div className="w-3 h-3 rounded-full bg-gold"></div>
                    <div className="w-3 h-3 rounded-full bg-rich-green"></div>
                    <div className="text-ivory/60 text-sm ml-2">Gift Concierge</div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-ivory/80">Occasion: <span className="text-gold">Anniversary</span></p>
                    <p className="text-ivory/80">Recipient: <span className="text-gold">Spouse, 5 years</span></p>
                    <p className="text-ivory/80">Budget: <span className="text-gold">₹30,000 - ₹50,000</span></p>
                    <p className="text-ivory/80">Preferences: <span className="text-gold">Jewelry, Experiences</span></p>
                    <div className="h-px bg-gold/20 my-6"></div>
                    <div className="bg-ivory/5 p-4 rounded-lg">
                      <p className="text-ivory font-medium">Recommended: "Eternal Bliss Collection"</p>
                      <p className="text-ivory/70 text-sm mt-2 mb-4">A customized jewelry piece paired with a private dining experience at a luxury restaurant.</p>
                      <button className="w-full py-2 bg-gold/20 hover:bg-gold/30 text-gold text-sm font-medium rounded transition-colors">
                        Add to Cart - ₹45,999
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-ivory">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-4 font-playfair">Subscribe for Exclusive Offers</h2>
              <p className="text-charcoal/80 mb-8">Sign up to receive updates on new collections, special discounts, and early access to sales.</p>
              
              <form className="flex flex-col sm:flex-row gap-3 mb-6">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                />
                <button 
                  type="submit"
                  className="px-6 py-3 bg-charcoal text-ivory font-medium rounded-md hover:bg-charcoal/90 transition-all duration-300"
                >
                  Subscribe
                </button>
              </form>
              
              <p className="text-xs text-charcoal/60">By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
} 