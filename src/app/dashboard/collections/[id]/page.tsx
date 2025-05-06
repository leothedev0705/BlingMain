'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

// SortableProductItem component
function SortableProductItem({ product, onRemove }: { product: Product, onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: product.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden flex-shrink-0 w-48 select-none"
    >
      <div className="relative h-32 bg-gray-100">
        <Image
          src={product.images[0] || '/assets/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-cover"
        />
        <div 
          {...listeners}
          className="absolute top-2 right-2 bg-white rounded-full p-1 cursor-move shadow-sm hover:bg-gray-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </div>
      </div>
      <div className="p-3">
        <h4 className="text-sm font-semibold text-charcoal truncate">{product.name}</h4>
        <p className="text-xs text-charcoal/70 mt-1">₹{product.price}</p>
        <button
          onClick={() => onRemove(product.id)}
          className="mt-2 text-xs text-red-600 hover:text-red-800 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default function CollectionEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const isNew = id === 'new';
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [collection, setCollection] = useState<Collection>({
    id: '',
    title: '',
    description: '',
    image: '',
    products: [],
  });
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedProducts, setDraggedProducts] = useState<Product[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all products
        const productsResponse = await fetch('/api/products');
        const productsData = await productsResponse.json();
        setAllProducts(productsData.products);
        
        // Fetch collection if not new
        if (!isNew) {
          const collectionResponse = await fetch(`/api/collections/${id}`);
          if (collectionResponse.ok) {
            const collectionData = await collectionResponse.json();
            setCollection(collectionData.collection);
            
            // Set dragged products
            const productsInCollection = productsData.products.filter(
              (product: Product) => collectionData.collection.products.includes(product.id)
            );
            setDraggedProducts(productsInCollection);
          } else {
            router.push('/dashboard/collections');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Local fallback
        import('@/data/products.json')
          .then((module) => {
            const data = module.default;
            setAllProducts(data.products);
            
            if (!isNew) {
              const foundCollection = data.collections.find((c: Collection) => c.id === id);
              if (foundCollection) {
                setCollection(foundCollection);
                
                // Set dragged products
                const productsInCollection = data.products.filter(
                  (product: Product) => foundCollection.products.includes(product.id)
                );
                setDraggedProducts(productsInCollection);
              } else {
                router.push('/dashboard/collections');
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
    setCollection(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setDraggedProducts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Handle product removal
  const handleRemoveProduct = (productId: string) => {
    setDraggedProducts(prev => prev.filter(product => product.id !== productId));
  };

  // Handle product addition
  const handleAddProduct = (product: Product) => {
    if (!draggedProducts.some(p => p.id === product.id)) {
      setDraggedProducts(prev => [...prev, product]);
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // In a real app, you would upload the file to your server or cloud storage
      // For now, we'll simulate this with a local URL
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setCollection(prev => ({
        ...prev,
        image: imageUrl,
      }));
    }
  };

  // Handle form submission
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Update products list from draggedProducts
      const updatedCollection = {
        ...collection,
        products: draggedProducts.map(p => p.id),
      };
      
      // Generate a new ID if this is a new collection
      if (isNew) {
        updatedCollection.id = `collection-${Date.now()}`;
      }
      
      // In a real app, you would save to your API
      console.log('Saving collection:', updatedCollection);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Redirect back to collections list
      router.push('/dashboard/collections');
    } catch (error) {
      console.error('Error saving collection:', error);
      alert('Failed to save collection. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Filter products based on search
  const filteredProducts = allProducts.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !draggedProducts.some(p => p.id === product.id)
  );

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
        <h1 className="text-2xl font-bold text-charcoal">
          {isNew ? 'Create New Collection' : `Edit Collection: ${collection.title}`}
        </h1>
        <Link
          href="/dashboard/collections"
          className="text-charcoal/70 hover:text-charcoal transition-colors text-sm flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Collections
        </Link>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Collection Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-charcoal mb-4">Collection Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-charcoal mb-1">
                    Collection Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={collection.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gold/50 focus:border-transparent"
                    placeholder="e.g. Luxury Gifts"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-charcoal mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={collection.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gold/50 focus:border-transparent"
                    placeholder="Describe this collection..."
                  />
                </div>
              </div>
            </div>

            {/* Products Selection */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-charcoal mb-4">Collection Products</h2>
              <p className="text-sm text-charcoal/70 mb-4">
                Drag products here to add them to your collection. Drag to reorder.
              </p>
              
              {/* Selected Products */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-charcoal mb-2">Selected Products</h3>
                
                {draggedProducts.length === 0 ? (
                  <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-6 text-center">
                    <p className="text-sm text-charcoal/70">
                      No products added yet. Drag products from below to add them to this collection.
                    </p>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={draggedProducts.map(p => p.id)}
                      strategy={horizontalListSortingStrategy}
                    >
                      <div className="flex gap-4 overflow-x-auto pb-4">
                        {draggedProducts.map(product => (
                          <SortableProductItem
                            key={product.id}
                            product={product}
                            onRemove={handleRemoveProduct}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
              
              {/* Available Products */}
              <div>
                <h3 className="text-sm font-medium text-charcoal mb-2">Available Products</h3>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gold/50 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto p-1">
                  {filteredProducts.map(product => (
                    <div
                      key={product.id}
                      className="bg-white border border-gray-100 rounded-md overflow-hidden cursor-pointer hover:shadow-sm transition-shadow flex items-center p-2"
                      onClick={() => handleAddProduct(product)}
                    >
                      <div className="relative w-12 h-12 rounded-md bg-gray-100 flex-shrink-0">
                        <Image
                          src={product.images[0] || '/assets/placeholder.jpg'}
                          alt={product.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="ml-3 overflow-hidden">
                        <h4 className="text-xs font-semibold text-charcoal truncate">{product.name}</h4>
                        <p className="text-xs text-charcoal/70">₹{product.price}</p>
                      </div>
                    </div>
                  ))}
                  
                  {filteredProducts.length === 0 && (
                    <div className="col-span-full text-center py-8">
                      <p className="text-sm text-charcoal/70">
                        {searchQuery
                          ? `No products match your search for "${searchQuery}"`
                          : 'No more products available'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Collection Image */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-charcoal mb-4">Collection Image</h2>
              
              <div className="relative mb-4 bg-gray-50 border border-dashed border-gray-200 rounded-lg overflow-hidden">
                {collection.image ? (
                  <div className="relative aspect-[3/2] w-full">
                    <Image
                      src={collection.image}
                      alt={collection.title || 'Collection image'}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100 transition-colors"
                      onClick={() => setCollection(prev => ({ ...prev, image: '' }))}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-charcoal/20 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-charcoal/70 mb-4">
                      No image selected
                    </p>
                  </div>
                )}
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-2 border border-gray-200 rounded-md text-sm text-charcoal hover:bg-gray-50 transition-colors"
              >
                {collection.image ? 'Change Image' : 'Upload Image'}
              </button>
              
              <p className="mt-2 text-xs text-charcoal/60">
                Recommended size: 1200 x 800 pixels (3:2 ratio)
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <Link
            href="/dashboard/collections"
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
            {isNew ? 'Create Collection' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
} 