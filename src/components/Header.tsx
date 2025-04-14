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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [accountMenuOpen]);

  // Navigation links
  const navLinks = [
    { href: '/shop', label: 'Shop' },
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
        : 'bg-charcoal/80 backdrop-blur-md py-5'
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
              <span className={`text-2xl font-bold font-playfair ${isScrolled ? 'text-charcoal' : 'text-ivory'}`}>
                Bling<span className="text-gold">×</span>Beyond
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
                className={`relative text-sm font-medium group ${
                  isScrolled ? 'text-charcoal' : 'text-ivory'
                }`}
              >
                {link.label}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </motion.nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/concierge"
              className={`px-4 py-2 rounded-md border ${
                isScrolled 
                  ? 'border-gold text-gold hover:bg-gold hover:text-white' 
                  : 'border-ivory/80 text-ivory hover:bg-ivory/10'
              } transition-colors`}
            >
              Gift Concierge
            </Link>
            
            {/* Login/Account */}
            {status === 'loading' ? (
              <div className={`w-8 h-8 rounded-full ${isScrolled ? 'bg-charcoal/10' : 'bg-ivory/10'} animate-pulse`}></div>
            ) : session ? (
              <div className="relative" id="account-menu-container">
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className={`flex items-center space-x-1 ${isScrolled ? 'text-charcoal' : 'text-ivory'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isScrolled ? 'bg-charcoal/10' : 'bg-ivory/10'}`}>
                    {session.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {accountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-charcoal">{session.user?.name}</p>
                      <p className="text-xs text-charcoal/60 truncate">{session.user?.email}</p>
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
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className={`px-4 py-2 ${
                  isScrolled 
                    ? 'text-charcoal hover:text-gold' 
                    : 'text-ivory hover:text-gold'
                } transition-colors`}
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-6 w-6 ${isScrolled ? 'text-charcoal' : 'text-ivory'}`} 
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
                className="mx-6 mt-2 px-4 py-2 bg-gold text-charcoal rounded-md text-center hover:bg-gold/90 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Gift Concierge
              </Link>
              
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
                <Link 
                  href="/login"
                  className="mx-6 mt-2 px-4 py-2 border border-charcoal text-charcoal rounded-md text-center hover:bg-charcoal/5 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login / Sign Up
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header; 