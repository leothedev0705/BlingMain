'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Collection and Product type definitions
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

export default function CollectionsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  
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

  // Available filters
  const getCollectionTags = () => {
    const tags = new Set<string>();
    productData?.collections.forEach(collection => {
      tags.add(collection.id);
    });
    return Array.from(tags);
  };

  const filters = [
    { id: 'all', name: 'All Collections' },
    ...(getCollectionTags().map(tag => ({ id: tag, name: tag.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') })))
  ];
  
  // Filter collections based on active filter
  const filteredCollections = activeFilter === 'all' 
    ? productData?.collections 
    : productData?.collections.filter(collection => collection.id === activeFilter);

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <main className="flex flex-col min-h-screen pt-[90px]">
          <div className="container mx-auto px-4 py-24 text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gold border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-lg text-charcoal">Loading collections...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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
                Curated <span className="text-gold">Collections</span>
              </h1>
              <p className="text-xl md:text-2xl text-ivory/80 mb-10">
                Explore our meticulously curated gift collections designed for every occasion and sentiment
              </p>
            </motion.div>
          </div>
        </section>

        {/* Collections Section */}
        <section className="py-16 container mx-auto px-4 md:px-6">
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-6 py-2 rounded-full transition-all ${
                    activeFilter === filter.id
                      ? "bg-gold text-charcoal font-medium"
                      : "bg-charcoal/5 text-charcoal/70 hover:bg-charcoal/10"
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-12">
              {filteredCollections?.map((collection, index) => {
                // Count the products in this collection
                const collectionProductCount = collection.products.length;
                
                // Get a few product categories as tags
                const productTags = productData?.products
                  .filter(product => collection.products.includes(product.id))
                  .flatMap(product => product.categories)
                  .filter((tag, index, self) => self.indexOf(tag) === index)
                  .slice(0, 3)
                  .map(tag => tag.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')) || [];
                
                return (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                  >
                    <Link href={`/collections/${collection.id}`}>
                      <div className="relative h-72 md:h-80 overflow-hidden rounded-xl mb-6">
                        <Image
                          src={collection.image || "/assets/placeholder.jpg"}
                          alt={collection.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                        <div className="absolute bottom-0 left-0 p-6 md:p-8">
                          <h3 className="text-2xl md:text-3xl font-playfair font-bold text-white mb-2 group-hover:text-gold transition-colors">
                            {collection.title}
                          </h3>
                          <div className="flex gap-2">
                            {productTags.map((tag, i) => (
                              <span key={i} className="text-xs uppercase bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-white/90">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="md:px-2">
                      <p className="text-charcoal/80 mb-4">
                        {collection.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-charcoal/60">
                          {collectionProductCount} Products
                        </span>
                        <Link
                          href={`/collections/${collection.id}`}
                          className="text-gold font-medium hover:text-gold/80 transition-colors flex items-center gap-2"
                        >
                          Explore Collection
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Collection Process */}
        <section className="py-16 bg-charcoal/5">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-charcoal mb-4">
                How We Curate Our <span className="text-gold">Collections</span>
              </h2>
              <p className="text-lg text-charcoal/70 max-w-3xl mx-auto">
                Each collection is meticulously designed by our expert curators who travel across India to source the finest artisanal products and create meaningful gift experiences.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Thoughtful Selection",
                  description: "Our team carefully selects products that align with the collection's theme, ensuring quality, authenticity, and cultural significance.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  )
                },
                {
                  title: "Artisanal Excellence",
                  description: "We partner with skilled artisans and craftspeople who bring exceptional artistry and technical mastery to each product in our collections.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  )
                },
                {
                  title: "Luxurious Presentation",
                  description: "Each item is beautifully presented with premium packaging that enhances the gifting experience and creates a memorable unboxing moment.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  )
                }
              ].map((process, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-xl shadow-sm"
                >
                  <div className="mb-5">{process.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-charcoal">{process.title}</h3>
                  <p className="text-charcoal/70">{process.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gold/10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl p-8 md:p-12 shadow-sm">
              <div className="mb-6 md:mb-0">
                <h3 className="text-2xl md:text-3xl font-playfair font-bold text-charcoal mb-3">
                  Need Help Finding the Perfect Gift?
                </h3>
                <p className="text-lg text-charcoal/70 max-w-2xl">
                  Our gift concierge service helps you select the ideal gifts based on the recipient's preferences and your occasion.
                </p>
              </div>
              <Link 
                href="/concierge"
                className="px-8 py-3 bg-gold text-white font-medium rounded-lg hover:bg-gold/90 transition-colors whitespace-nowrap"
              >
                Try Gift Concierge
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
} 