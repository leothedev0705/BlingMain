'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Gift item type definition
type GiftItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  occasion: string;
  featured: boolean;
  tags: string[];
  price?: string;
  productCount?: number;
};

// Gift Catalogue data - combines collections and occasions
const giftCatalogueItems: GiftItem[] = [
  // Collections
  {
    id: 'wedding-collection',
    name: 'Royal Wedding Collection',
    description: 'Exquisite gift hampers and bespoke items to celebrate the sacred union. Features handcrafted pieces with traditional motifs and contemporary designs.',
    image: '/assets/collection-wedding.jpg',
    category: 'Collection',
    occasion: 'Wedding',
    productCount: 24,
    featured: true,
    tags: ['Wedding', 'Luxury', 'Handcrafted']
  },
  {
    id: 'festive-collection',
    name: 'Festive Celebrations',
    description: 'Illuminate your celebrations with our curated collection of festive gift hampers, artisanal decorations, and premium gourmet selections.',
    image: '/assets/collection-festive.jpg',
    category: 'Collection',
    occasion: 'Festive',
    productCount: 32,
    featured: true,
    tags: ['Festive', 'Diwali', 'Holi', 'Handcrafted']
  },
  {
    id: 'corporate-collection',
    name: 'Corporate Excellence',
    description: 'Impress your clients and colleagues with sophisticated corporate gifts that reflect professionalism and premium quality.',
    image: '/assets/collection-corporate.jpg',
    category: 'Collection',
    occasion: 'Corporate',
    productCount: 18,
    featured: true,
    tags: ['Corporate', 'Executive', 'Professional']
  },
  {
    id: 'personalized-collection',
    name: 'Personalized Treasures',
    description: 'Create meaningful connections with custom-designed gifts featuring monograms, special messages, and bespoke creations.',
    image: '/assets/collection-personalized.jpg',
    category: 'Collection',
    occasion: 'Personalized',
    productCount: 26,
    featured: false,
    tags: ['Personalized', 'Custom', 'Bespoke']
  },
  // Occasions
  {
    id: 'wedding-occasions',
    name: 'Wedding Ceremonies',
    description: 'Celebrate the sacred union with exquisite gifts that honor tradition while embracing modern elegance. From personalized keepsakes to luxurious gift hampers.',
    image: '/assets/occasion-wedding.jpg',
    category: 'Occasion',
    occasion: 'Wedding',
    featured: true,
    tags: ['Wedding', 'Celebration', 'Luxury']
  },
  {
    id: 'anniversary',
    name: 'Anniversary Celebrations',
    description: 'Mark milestone moments with thoughtfully curated gifts that symbolize years of love and commitment. Perfect for silver, golden, and milestone anniversaries.',
    image: '/assets/occasion-anniversary.jpg',
    category: 'Occasion',
    occasion: 'Anniversary',
    featured: true,
    tags: ['Anniversary', 'Romance', 'Celebration']
  },
  {
    id: 'diwali',
    name: 'Diwali Festivities',
    description: 'Illuminate the festival of lights with our opulent Diwali collection featuring handcrafted diyas, gourmet treats, and luxurious gift hampers.',
    image: '/assets/occasion-diwali.jpg',
    category: 'Occasion',
    occasion: 'Diwali',
    featured: true,
    tags: ['Diwali', 'Festival', 'Celebration']
  },
  {
    id: 'corporate-gifting',
    name: 'Corporate Gifting',
    description: 'Make a lasting impression with sophisticated corporate gifts that convey appreciation and strengthen professional relationships.',
    image: '/assets/occasion-corporate.jpg',
    category: 'Occasion',
    occasion: 'Corporate',
    featured: true,
    tags: ['Corporate', 'Business', 'Professional']
  },
  {
    id: 'birthday',
    name: 'Birthday Celebrations',
    description: 'Make their special day extraordinary with personalized birthday gifts that create memorable moments and showcase your thoughtfulness.',
    image: '/assets/occasion-birthday.jpg',
    category: 'Occasion',
    occasion: 'Birthday',
    featured: true,
    tags: ['Birthday', 'Celebration', 'Personal']
  }
];

export default function GiftCataloguePage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Filter gifts based on active filter and category
  const filteredGifts = giftCatalogueItems
    .filter(item => activeFilter === 'all' || activeFilter === 'featured' && item.featured || item.tags.includes(activeFilter))
    .filter(item => activeCategory === 'all' || item.category === activeCategory);

  // Available filters
  const filters = [
    { id: 'all', name: 'All Items' },
    { id: 'featured', name: 'Featured' },
    { id: 'Wedding', name: 'Wedding' },
    { id: 'Corporate', name: 'Corporate' },
    { id: 'Festive', name: 'Festive' },
    { id: 'Personalized', name: 'Personalized' },
    { id: 'Anniversary', name: 'Anniversary' },
    { id: 'Birthday', name: 'Birthday' }
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
                Gift <span className="text-gold">Catalogue</span>
              </h1>
              <p className="text-xl md:text-2xl text-ivory/80 mb-10">
                Explore our comprehensive collection of exquisite gifts for every occasion and sentiment
              </p>
            </motion.div>
          </div>
        </section>

        {/* Catalogue Section */}
        <section className="py-16 container mx-auto px-4 md:px-6">
          <div className="mb-12">
            {/* Category Tabs */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-md shadow-sm bg-charcoal/5 p-1">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                    activeCategory === 'all'
                      ? "bg-gold text-charcoal"
                      : "text-charcoal hover:bg-charcoal/10"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveCategory('Collection')}
                  className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                    activeCategory === 'Collection'
                      ? "bg-gold text-charcoal"
                      : "text-charcoal hover:bg-charcoal/10"
                  }`}
                >
                  Collections
                </button>
                <button
                  onClick={() => setActiveCategory('Occasion')}
                  className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                    activeCategory === 'Occasion'
                      ? "bg-gold text-charcoal"
                      : "text-charcoal hover:bg-charcoal/10"
                  }`}
                >
                  Occasions
                </button>
              </div>
            </div>

            {/* Filters */}
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

            {/* Gift Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredGifts.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <Link href={`/${item.category.toLowerCase()}s/${item.id}`}>
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={item.image || "/assets/placeholder.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {item.featured && (
                        <div className="absolute top-4 right-4 bg-gold text-charcoal text-xs font-medium px-3 py-1 rounded-full">
                          Featured
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-charcoal/70 backdrop-blur-sm text-ivory text-xs font-medium px-3 py-1 rounded-full">
                        {item.category}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                      <div className="absolute bottom-0 left-0 p-6">
                        <h3 className="text-xl md:text-2xl font-playfair font-bold text-white mb-2 group-hover:text-gold transition-colors">
                          {item.name}
                        </h3>
                        <div className="flex gap-2">
                          {item.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-xs uppercase bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-white/90">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="p-6">
                    <p className="text-charcoal/80 mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-charcoal/60">
                        {item.productCount ? `${item.productCount} Products` : item.occasion}
                      </span>
                      <Link
                        href={`/${item.category.toLowerCase()}s/${item.id}`}
                        className="text-gold font-medium hover:text-gold/80 transition-colors flex items-center gap-2"
                      >
                        Explore
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

        {/* Personalized Gifting */}
        <section className="py-16 bg-charcoal/5">
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
                  Speak to Our Gift Concierge
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