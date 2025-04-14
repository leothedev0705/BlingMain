'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Collection type definition
type Collection = {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  featured: boolean;
  tags: string[];
};

// Collections data
const collections: Collection[] = [
  {
    id: 'wedding',
    name: 'Royal Wedding Collection',
    description: 'Exquisite gift hampers and bespoke items to celebrate the sacred union. Features handcrafted pieces with traditional motifs and contemporary designs.',
    image: '/assets/collection-wedding.jpg',
    productCount: 24,
    featured: true,
    tags: ['Wedding', 'Luxury', 'Handcrafted']
  },
  {
    id: 'festive',
    name: 'Festive Celebrations',
    description: 'Illuminate your celebrations with our curated collection of festive gift hampers, artisanal decorations, and premium gourmet selections.',
    image: '/assets/collection-festive.jpg',
    productCount: 32,
    featured: true,
    tags: ['Festive', 'Diwali', 'Holi', 'Handcrafted']
  },
  {
    id: 'corporate',
    name: 'Corporate Excellence',
    description: 'Impress your clients and colleagues with sophisticated corporate gifts that reflect professionalism and premium quality.',
    image: '/assets/collection-corporate.jpg',
    productCount: 18,
    featured: true,
    tags: ['Corporate', 'Executive', 'Professional']
  },
  {
    id: 'personalized',
    name: 'Personalized Treasures',
    description: 'Create meaningful connections with custom-designed gifts featuring monograms, special messages, and bespoke creations.',
    image: '/assets/collection-personalized.jpg',
    productCount: 26,
    featured: false,
    tags: ['Personalized', 'Custom', 'Bespoke']
  },
  {
    id: 'anniversary',
    name: 'Anniversary Celebrations',
    description: 'Commemorate special milestones with our curated selection of luxurious gift sets designed to create lasting memories.',
    image: '/assets/collection-anniversary.jpg',
    productCount: 15,
    featured: false,
    tags: ['Anniversary', 'Romance', 'Celebration']
  },
  {
    id: 'luxury',
    name: 'Luxury Indulgence',
    description: 'Discover the epitome of opulence with our exclusive luxury gift collection featuring handpicked premium items.',
    image: '/assets/collection-luxury.jpg',
    productCount: 20,
    featured: true,
    tags: ['Luxury', 'Premium', 'Exclusive']
  },
  {
    id: 'wellness',
    name: 'Wellness & Self-Care',
    description: 'Curated gift boxes featuring artisanal wellness products that promote relaxation, mindfulness, and self-care.',
    image: '/assets/collection-wellness.jpg',
    productCount: 22,
    featured: false,
    tags: ['Wellness', 'Self-Care', 'Relaxation']
  },
  {
    id: 'gourmet',
    name: 'Gourmet Delights',
    description: 'Premium food and beverage collections featuring artisanal chocolates, exotic teas, fine wines, and gourmet delicacies.',
    image: '/assets/collection-gourmet.jpg',
    productCount: 28,
    featured: false,
    tags: ['Gourmet', 'Food', 'Beverage']
  }
];

export default function CollectionsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Filter collections based on active filter
  const filteredCollections = activeFilter === 'all' 
    ? collections 
    : activeFilter === 'featured'
      ? collections.filter(collection => collection.featured)
      : collections.filter(collection => collection.tags.includes(activeFilter));

  // Available filters
  const filters = [
    { id: 'all', name: 'All Collections' },
    { id: 'featured', name: 'Featured' },
    { id: 'Wedding', name: 'Wedding' },
    { id: 'Festive', name: 'Festive' },
    { id: 'Corporate', name: 'Corporate' },
    { id: 'Personalized', name: 'Personalized' }
  ];

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
              {filteredCollections.map((collection, index) => (
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
                        alt={collection.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {collection.featured && (
                        <div className="absolute top-4 right-4 bg-gold text-charcoal text-xs font-medium px-3 py-1 rounded-full">
                          Featured Collection
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                      <div className="absolute bottom-0 left-0 p-6 md:p-8">
                        <h3 className="text-2xl md:text-3xl font-playfair font-bold text-white mb-2 group-hover:text-gold transition-colors">
                          {collection.name}
                        </h3>
                        <div className="flex gap-2">
                          {collection.tags.slice(0, 3).map((tag, i) => (
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
                        {collection.productCount} Products
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
              ))}
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
                  title: "Artisanal Craftsmanship",
                  description: "We collaborate with skilled artisans across India to create exclusive items that showcase traditional techniques and contemporary designs.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  )
                },
                {
                  title: "Seasonal Refreshes",
                  description: "Our collections evolve with changing seasons and occasions, ensuring you always have access to fresh, relevant, and on-trend gifting options.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.2 }}
                  className="bg-white rounded-xl p-8 shadow-sm"
                >
                  <div className="mb-6">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-charcoal mb-3">{item.title}</h3>
                  <p className="text-charcoal/70">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Subscription CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-blush/10 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
            >
              <div className="max-w-3xl mx-auto relative z-10">
                <h2 className="text-3xl md:text-4xl font-playfair font-bold text-charcoal mb-6">
                  Stay Updated with New Collections
                </h2>
                <p className="text-lg text-charcoal/80 mb-8">
                  Subscribe to our newsletter to be the first to know about new collection launches, limited edition releases, and exclusive offers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="bg-white border border-gold/20 rounded-md px-6 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50 min-w-0 sm:min-w-[300px]"
                  />
                  <button className="inline-flex items-center justify-center px-6 py-3 bg-gold text-charcoal font-medium rounded-md hover:bg-gold/90 transition-all duration-300">
                    Subscribe
                  </button>
                </div>
                <p className="text-xs text-charcoal/60">
                  By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                </p>
              </div>
              <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-blush/10 z-0"></div>
              <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-gold/10 z-0"></div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
} 