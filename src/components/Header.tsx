'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <header className="border-b border-gold/20 bg-ivory py-4 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-charcoal font-playfair">
                Bling<span className="text-blush">x</span>Beyond
              </span>
            </Link>
          </motion.div>

          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hidden md:flex items-center space-x-8"
          >
            <NavLink href="/shop">Shop</NavLink>
            <NavLink href="/collections">Collections</NavLink>
            <NavLink href="/occasions">Occasions</NavLink>
            <NavLink href="/about">About Us</NavLink>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center space-x-5"
          >
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/account" className="text-charcoal hover:text-blush transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <Link href="/search" className="text-charcoal hover:text-blush transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
            </div>
            <Link 
              href="/cart" 
              className="relative text-charcoal hover:text-blush transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-blush text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">2</span>
            </Link>
            <Link 
              href="/contact" 
              className="hidden md:inline-flex magnetic-button gold-gradient items-center justify-center px-4 py-2 text-sm text-charcoal font-medium rounded-md hover:shadow-md transition-all duration-300"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Link 
      href={href} 
      className="relative font-medium text-charcoal hover:text-blush transition-colors group"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blush transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
};

export default Header; 