'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Banner types
type Banner = {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  position: 'main' | 'secondary' | 'tertiary';
  isActive: boolean;
};

// Mock banners (in a real app, these would come from your API)
const mockBanners: Banner[] = [
  {
    id: 'banner-1',
    title: 'Luxury Jewelry Collection',
    subtitle: 'Exclusive designs for every occasion',
    buttonText: 'Shop Now',
    buttonLink: '/collections/luxury-gifts',
    imageUrl: '/assets/placeholder.jpg',
    position: 'main',
    isActive: true,
  },
  {
    id: 'banner-2',
    title: 'Wedding Collection',
    subtitle: 'Make your special day even more memorable',
    buttonText: 'Explore',
    buttonLink: '/collections/wedding-collection',
    imageUrl: '/assets/placeholder.jpg',
    position: 'secondary',
    isActive: true,
  },
  {
    id: 'banner-3',
    title: 'Corporate Gifts',
    subtitle: 'Premium gifting solutions for businesses',
    buttonText: 'Learn More',
    buttonLink: '/collections/corporate-gifts',
    imageUrl: '/assets/placeholder.jpg',
    position: 'tertiary',
    isActive: false,
  },
];

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setBanners(mockBanners);
      setLoading(false);
    }, 800);
  }, []);

  const handleToggleActive = (banner: Banner) => {
    setBanners(prev => 
      prev.map(b => 
        b.id === banner.id ? { ...b, isActive: !b.isActive } : b
      )
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, banner: Banner) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // In a real app, you would upload the file to your server or cloud storage
      const fileUrl = URL.createObjectURL(files[0]);
      
      setBanners(prev =>
        prev.map(b =>
          b.id === banner.id ? { ...b, imageUrl: fileUrl } : b
        )
      );
    }
  };

  const openImageUpload = (banner: Banner) => {
    setSelectedBanner(banner);
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gold border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-bold text-charcoal"
        >
          Manage Homepage Banners
        </motion.h1>
        <Link
          href="/admin/banners/new"
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
          Add New Banner
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-charcoal mb-4">
            Main Banner (Hero Section)
          </h2>
          <p className="text-charcoal/70 text-sm mb-4">
            This is the primary banner displayed on your homepage. It should be eye-catching and showcase your featured collection or promotion.
          </p>

          {banners
            .filter(banner => banner.position === 'main')
            .map(banner => (
              <div
                key={banner.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="relative h-64 bg-gray-100">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                    <div className="p-8 max-w-md">
                      <h3 className="text-2xl font-bold text-white mb-2">{banner.title}</h3>
                      <p className="text-white/80 mb-4">{banner.subtitle}</p>
                      <span className="inline-block px-6 py-2 bg-gold text-white rounded-md">
                        {banner.buttonText}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between bg-gray-50">
                  <div className="flex items-center">
                    <span className={`inline-block w-3 h-3 rounded-full ${banner.isActive ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                    <span className="text-sm text-charcoal/70">
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleToggleActive(banner)}
                      className={`px-3 py-1 rounded text-xs ${banner.isActive ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                    >
                      {banner.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => openImageUpload(banner)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                    >
                      Change Image
                    </button>
                    <Link
                      href={`/admin/banners/${banner.id}`}
                      className="px-3 py-1 bg-charcoal/10 text-charcoal/70 rounded text-xs"
                    >
                      Edit Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-charcoal mb-4">
            Secondary Banners
          </h2>
          <p className="text-charcoal/70 text-sm mb-4">
            These banners appear below the main banner and can be used to highlight additional collections or promotions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners
              .filter(banner => banner.position === 'secondary' || banner.position === 'tertiary')
              .map(banner => (
                <div
                  key={banner.id}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="relative h-40 bg-gray-100">
                    <Image
                      src={banner.imageUrl}
                      alt={banner.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                      <div className="p-6 max-w-md">
                        <h3 className="text-xl font-bold text-white mb-1">{banner.title}</h3>
                        <p className="text-white/80 text-sm mb-3">{banner.subtitle}</p>
                        <span className="inline-block px-4 py-1 bg-gold text-white rounded-md text-sm">
                          {banner.buttonText}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between bg-gray-50">
                    <div className="flex items-center">
                      <span className={`inline-block w-2 h-2 rounded-full ${banner.isActive ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                      <span className="text-xs text-charcoal/70">
                        {banner.position === 'secondary' ? 'Secondary' : 'Tertiary'} • {banner.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleActive(banner)}
                        className={`px-2 py-1 rounded text-xs ${banner.isActive ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                      >
                        {banner.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <Link
                        href={`/admin/banners/${banner.id}`}
                        className="px-2 py-1 bg-charcoal/10 text-charcoal/70 rounded text-xs"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </motion.div>

      {/* Hidden file input for image upload */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => selectedBanner && handleImageUpload(e, selectedBanner)}
      />
    </div>
  );
} 