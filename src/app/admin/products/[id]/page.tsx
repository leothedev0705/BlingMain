'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Types
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

export default function ProductEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const isNew = id === 'new';
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Product form state
  const [product, setProduct] = useState<Product>({
    id: '',
    name: '',
    description: '',
    price: 0,
    discount_price: null,
    images: [],
    categories: [],
    tags: [],
    features: [],
    stock: 0,
    related_products: [],
  });
  
  // New category input state
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newFeature, setNewFeature] = useState('');
  
  // File input ref for image upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Fetch product data and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all products for categories
        const productsResponse = await fetch('/api/products');
        const productsData = await productsResponse.json();
        
        // Get unique categories
        const allCategories = new Set<string>();
        productsData.products.forEach((p: Product) => {
          p.categories.forEach(category => allCategories.add(category));
        });
        setCategories(Array.from(allCategories));
        
        // If editing an existing product, fetch its data
        if (!isNew) {
          // In a real app, you would fetch the specific product
          // For now, find the product in the fetched data
          const foundProduct = productsData.products.find((p: Product) => p.id === id);
          
          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            // Product not found, redirect to products page
            router.push('/admin/products');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to local import
        import('@/data/products.json')
          .then((module) => {
            const data = module.default;
            
            // Get unique categories
            const allCategories = new Set<string>();
            data.products.forEach((p: Product) => {
              p.categories.forEach(category => allCategories.add(category));
            });
            setCategories(Array.from(allCategories));
            
            // If editing an existing product, fetch its data
            if (!isNew) {
              const foundProduct = data.products.find((p: Product) => p.id === id);
              if (foundProduct) {
                setProduct(foundProduct);
              } else {
                // Product not found, redirect to products page
                router.push('/admin/products');
              }
            }
          })
          .catch((err) => {
            console.error('Failed to load local data:', err);
          });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isNew, router]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseInt(value) || 0 : value,
    }));
  };

  // Handle discount price
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProduct(prev => ({
      ...prev,
      discount_price: value === '' ? null : parseInt(value) || 0,
    }));
  };

  // Handle category toggle
  const toggleCategory = (category: string) => {
    setProduct(prev => {
      if (prev.categories.includes(category)) {
        return {
          ...prev,
          categories: prev.categories.filter(c => c !== category),
        };
      } else {
        return {
          ...prev,
          categories: [...prev.categories, category],
        };
      }
    });
  };

  // Add new category
  const addCategory = () => {
    if (newCategory.trim() === '') return;
    
    const formattedCategory = newCategory.trim().toLowerCase().replace(/\s+/g, '-');
    
    if (!categories.includes(formattedCategory)) {
      setCategories(prev => [...prev, formattedCategory]);
    }
    
    if (!product.categories.includes(formattedCategory)) {
      setProduct(prev => ({
        ...prev,
        categories: [...prev.categories, formattedCategory],
      }));
    }
    
    setNewCategory('');
  };

  // Add new tag
  const addTag = () => {
    if (newTag.trim() === '' || product.tags.includes(newTag.trim())) return;
    
    setProduct(prev => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()],
    }));
    
    setNewTag('');
  };

  // Remove tag
  const removeTag = (tag: string) => {
    setProduct(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  // Add new feature
  const addFeature = () => {
    if (newFeature.trim() === '' || product.features.includes(newFeature.trim())) return;
    
    setProduct(prev => ({
      ...prev,
      features: [...prev.features, newFeature.trim()],
    }));
    
    setNewFeature('');
  };

  // Remove feature
  const removeFeature = (feature: string) => {
    setProduct(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature),
    }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // In a real app, you would upload the file to your server or cloud storage
      // For now, create object URLs for the selected images
      const newImageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      
      setProduct(prev => ({
        ...prev,
        images: [...prev.images, ...newImageUrls],
      }));
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Save the product
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Validate the product data
      if (!product.name.trim()) {
        alert('Please enter a product name');
        setSaving(false);
        return;
      }
      
      if (product.price <= 0) {
        alert('Please enter a valid price');
        setSaving(false);
        return;
      }
      
      if (product.categories.length === 0) {
        alert('Please select at least one category');
        setSaving(false);
        return;
      }
      
      const productToSave = {
        ...product,
        // Generate a new ID if this is a new product
        id: isNew ? `product-${Date.now()}` : product.id,
      };
      
      // Save to API
      const url = isNew 
        ? `/api/products` 
        : `/api/products?id=${productToSave.id}`;
      
      const response = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productToSave),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save product');
      }
      
      console.log('Product saved:', result);
      
      // Redirect to the products page
      router.push('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Format category name for display
  const formatCategory = (category: string) => {
    return category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gold border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-bold text-charcoal"
        >
          {isNew ? 'Add New Product' : `Edit Product: ${product.name}`}
        </motion.h1>
        <Link
          href="/admin/products"
          className="text-charcoal/70 hover:text-charcoal transition-colors text-sm flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Products
        </Link>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Product Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-charcoal mb-4">Product Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-1">
                    Product Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={product.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gold/50 focus:border-transparent"
                    placeholder="e.g. Diamond Tennis Bracelet"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-charcoal mb-1">
                    Description*
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={product.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gold/50 focus:border-transparent"
                    placeholder="Describe your product..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-charcoal mb-1">
                      Price (₹)*
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={product.price}
                      onChange={handleInputChange}
                      min="0"
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gold/50 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="discount_price" className="block text-sm font-medium text-charcoal mb-1">
                      Discount Price (₹)
                    </label>
                    <input
                      type="number"
                      id="discount_price"
                      name="discount_price"
                      value={product.discount_price !== null ? product.discount_price : ''}
                      onChange={handleDiscountChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gold/50 focus:border-transparent"
                      placeholder="Leave empty for no discount"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-charcoal mb-1">
                    Stock*
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={product.stock}
                    onChange={handleInputChange}
                    min="0"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gold/50 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Categories and Tags */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-charcoal mb-4">Categories & Tags</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Categories*
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {categories.map(category => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className={`px-3 py-1.5 rounded-md text-sm ${
                          product.categories.includes(category)
                            ? 'bg-gold text-white'
                            : 'bg-gray-100 text-charcoal/70 hover:bg-gray-200'
                        }`}
                      >
                        {formatCategory(category)}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex mt-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="flex-grow px-4 py-2 border border-gray-200 rounded-l-md focus:ring-2 focus:ring-gold/50 focus:border-transparent"
                      placeholder="New category..."
                    />
                    <button
                      type="button"
                      onClick={addCategory}
                      className="px-4 py-2 bg-charcoal text-white rounded-r-md hover:bg-charcoal/90 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {product.tags.map(tag => (
                      <div
                        key={tag}
                        className="px-3 py-1.5 bg-gray-100 text-charcoal/70 rounded-md text-sm flex items-center"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-charcoal/40 hover:text-red-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex mt-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="flex-grow px-4 py-2 border border-gray-200 rounded-l-md focus:ring-2 focus:ring-gold/50 focus:border-transparent"
                      placeholder="Add a tag..."
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-charcoal text-white rounded-r-md hover:bg-charcoal/90 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Features */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-charcoal mb-4">Product Features</h2>
              
              <div>
                <div className="space-y-2 mb-4">
                  {product.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-md"
                    >
                      <span className="text-sm text-charcoal">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="text-charcoal/40 hover:text-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-grow px-4 py-2 border border-gray-200 rounded-l-md focus:ring-2 focus:ring-gold/50 focus:border-transparent"
                    placeholder="Add a feature..."
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-charcoal text-white rounded-r-md hover:bg-charcoal/90 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-charcoal mb-4">Product Images</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {product.images.map((image, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden bg-gray-100">
                      <div className="aspect-square relative">
                        <Image
                          src={image}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md text-sm text-charcoal hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload Images
                </button>
                
                <p className="text-xs text-charcoal/60 text-center">
                  Recommended size: 1200 x 1200 pixels (square ratio)
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex justify-end space-x-3"
        >
          <Link
            href="/admin/products"
            className="px-6 py-2 border border-gray-200 rounded-md text-charcoal hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-2 bg-gold text-white rounded-md hover:bg-gold/90 transition-colors flex items-center ${
              saving ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {saving && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isNew ? 'Create Product' : 'Save Changes'}
          </button>
        </motion.div>
      </form>
    </div>
  );
} 