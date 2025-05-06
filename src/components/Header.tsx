'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';

const Header = () => {
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(2); // Hardcoded for now, will be dynamic later

  // Handle scroll event to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuOpen && !(event.target as Element).closest('#account-menu-container')) {
        setAccountMenuOpen(false);
      }
      if (searchOpen && !(event.target as Element).closest('#search-container')) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [accountMenuOpen, searchOpen]);

  // Navigation links
  const navLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '/collections', label: 'Collections' },
    { href: '/gift-catalogue', label: 'Gift Catalogue' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ];

  const handleLogout = async () => {
    await signOut({ redirect: false });
    setAccountMenuOpen(false);
    // No need to redirect as the page will refresh automatically
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 shadow-md ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md py-3 shadow-sm' 
        : 'bg-white/95 backdrop-blur-md py-3'
    }`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center">
              <span className="text-3xl font-bold font-playfair text-charcoal">
                Bling<span className="text-red-500">x</span>Beyond
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hidden md:flex items-center space-x-8"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className="relative text-sm font-medium group text-charcoal"
              >
                {link.label}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </motion.nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-6">
            {/* User Account Icon */}
            <div className="relative" id="account-menu-container">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="text-charcoal hover:text-gold transition-colors"
                aria-label="Account"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              
              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  {status === 'authenticated' ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-charcoal">{session?.user?.name}</p>
                        <p className="text-xs text-charcoal/60 truncate">{session?.user?.email}</p>
                      </div>
                      <Link 
                        href="/account/profile" 
                        className="block px-4 py-2 text-sm text-charcoal hover:bg-gray-100"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link 
                        href="/account/orders" 
                        className="block px-4 py-2 text-sm text-charcoal hover:bg-gray-100"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        href="/login" 
                        className="block px-4 py-2 text-sm text-charcoal hover:bg-gray-100"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link 
                        href="/signup" 
                        className="block px-4 py-2 text-sm text-charcoal hover:bg-gray-100"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* Search Icon */}
            <div className="relative" id="search-container">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-charcoal hover:text-gold transition-colors"
                aria-label="Search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              {searchOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg p-3 z-10">
                  <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="w-full px-3 py-2 text-sm focus:outline-none"
                      autoFocus
                    />
                    <button className="bg-gold px-3 py-2 text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Cart Icon with Count */}
            <Link href="/cart" className="relative text-charcoal hover:text-gold transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden ml-2 text-charcoal"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4 bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <nav className="flex flex-col py-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className="px-6 py-3 text-charcoal hover:bg-gold/10 hover:text-gold transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link 
                href="/concierge"
                className="mx-6 mt-2 px-4 py-2 bg-gold text-white rounded-md text-center hover:bg-gold/90 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Gift Concierge
              </Link>
              
              {/* Mobile search */}
              <div className="mx-6 mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full px-3 py-2 text-sm focus:outline-none"
                  />
                  <button className="bg-gold px-3 py-2 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Login/Account for mobile */}
              {status === 'loading' ? (
                <div className="mx-6 mt-2 h-10 bg-gray-200 rounded-md animate-pulse"></div>
              ) : session ? (
                <>
                  <div className="mx-6 mt-4 pt-4 border-t border-gray-200">
                    <p className="px-4 text-sm font-medium text-charcoal">
                      {session.user?.name}
                    </p>
                    <p className="px-4 text-xs text-charcoal/60 truncate mb-2">
                      {session.user?.email}
                    </p>
                    <Link 
                      href="/account/profile" 
                      className="block px-4 py-2 text-sm text-charcoal hover:bg-gray-100 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link 
                      href="/account/orders" 
                      className="block px-4 py-2 text-sm text-charcoal hover:bg-gray-100 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="mx-6 mt-4 pt-4 border-t border-gray-200 flex flex-col space-y-2">
                  <Link 
                    href="/login"
                    className="px-4 py-2 text-sm text-charcoal bg-gray-100 hover:bg-gray-200 rounded-md text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup"
                    className="px-4 py-2 text-sm bg-gold text-white rounded-md text-center hover:bg-gold/90"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header; 