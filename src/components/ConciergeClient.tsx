'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from './Header';
import GiftConcierge from './GiftConcierge';

const benefits = [
  {
    icon: '✨',
    title: 'Personalized Experience',
    description: 'Our AI understands preferences, occasions, and relationships to curate truly personalized gift suggestions.',
  },
  {
    icon: '⏱️',
    title: 'Time-Saving',
    description: 'Skip hours of browsing and indecision. Get curated recommendations in seconds based on your specific inputs.',
  },
  {
    icon: '🎁',
    title: 'Memorable Gifting',
    description: 'Each suggestion is designed to create lasting impressions and strengthen your relationships.',
  },
];

export default function ConciergeClient() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-charcoal silk-texture py-16 md:py-24 relative">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold text-ivory mb-6 font-playfair"
              >
                Gift <span className="text-gold">Concierge</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-lg text-ivory/90 mb-8"
              >
                Let our AI-powered concierge help you find the perfect gift for any occasion.
                Experience personalized gifting at its finest.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Concierge Form Section */}
        <section className="py-16 bg-charcoal">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <GiftConcierge />
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24 bg-ivory">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-6 font-playfair">
                Why Use Our Gift Concierge?
              </h2>
              <p className="text-lg text-charcoal/80">
                Our AI-powered Gift Concierge offers a personalized shopping experience
                that saves you time and ensures memorable gifting.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-6">
                    <span className="text-gold text-2xl">{benefit.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-charcoal mb-3 font-playfair">{benefit.title}</h3>
                  <p className="text-charcoal/70">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-16 bg-charcoal/5">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white p-8 md:p-12 rounded-lg shadow-md border border-gold/10">
                <div className="flex flex-col items-center text-center">
                  <div className="text-4xl text-gold mb-6">❝</div>
                  <p className="text-xl text-charcoal/90 italic mb-8">
                    The Gift Concierge service saved me hours of browsing. It understood exactly what I was looking for
                    and suggested the perfect anniversary gift that my wife absolutely loved!
                  </p>
                  <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                  <h4 className="text-lg font-bold text-charcoal">Rahul Sharma</h4>
                  <p className="text-charcoal/70">Delhi, IN</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-charcoal border-t border-gold/20 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <h3 className="text-xl font-bold text-ivory font-playfair">
                Bling<span className="text-gold">x</span>Beyond
              </h3>
              <p className="text-ivory/70 mt-2">Elevating gifting to an art form</p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h4 className="text-gold font-medium mb-3">Collections</h4>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-ivory/70 hover:text-gold transition-colors">Festive</Link></li>
                  <li><Link href="#" className="text-ivory/70 hover:text-gold transition-colors">Wedding</Link></li>
                  <li><Link href="#" className="text-ivory/70 hover:text-gold transition-colors">Corporate</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-gold font-medium mb-3">About</h4>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-ivory/70 hover:text-gold transition-colors">Our Story</Link></li>
                  <li><Link href="#" className="text-ivory/70 hover:text-gold transition-colors">Craftsmanship</Link></li>
                  <li><Link href="#" className="text-ivory/70 hover:text-gold transition-colors">Contact</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gold/10 mt-12 pt-8 text-center">
            <p className="text-ivory/50 text-sm">© {new Date().getFullYear()} BlingxBeyond. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
} 