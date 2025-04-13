'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  id: string | number;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
}

const ProductCard = ({ id, title, description, price, imageUrl }: ProductCardProps) => {
  return (
    <motion.div 
      className="luxury-card group relative overflow-hidden"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="aspect-square relative overflow-hidden">
        {/* Image placeholder - in a real app this would be a next/image */}
        <div className="absolute inset-0 bg-charcoal/10 flex items-center justify-center">
          {imageUrl ? (
            <Image 
              src={imageUrl} 
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="text-charcoal/30">Product Image</div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Link 
            href={`/product/${id}`}
            className="magnetic-button gold-gradient w-full inline-flex items-center justify-center px-4 py-2 text-sm text-charcoal font-medium rounded-md hover:shadow-md transition-all duration-300"
          >
            View Details
          </Link>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-playfair text-lg font-semibold text-charcoal">{title}</h3>
        <p className="text-charcoal/70 text-sm mt-1 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center mt-3">
          <span className="text-charcoal font-medium">{price}</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg 
                key={star} 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 text-gold" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard; 