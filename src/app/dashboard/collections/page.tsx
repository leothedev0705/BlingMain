'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Types for our collections data
type Product = {
  id: string;
  name: string;
  price: number;
  discount_price: number | null;
  images: string[];
};

type Collection = {
  id: string;
  title: string;
  description: string;
  image: string;
  products: string[];
};

type ProductData = {
  collections: Collection[];
  products: Product[];
};

// Sortable Collection Item Component
function SortableCollectionItem({ collection, products }: { collection: Collection, products: Product[] }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: collection.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Find count of products in this collection
  const productCount = collection.products.length;
  
  // Get first product image for preview if collection image is not available
  const previewImage = collection.image || 
    (products.find(p => collection.products.includes(p.id))?.images[0] || '/assets/placeholder.jpg');

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow"
    >
      <div className="relative h-48 bg-gray-100">
        <Image
          src={previewImage}
          alt={collection.title}
          fill
          className="object-cover"
        />
        <div 
          {...listeners}
          className="absolute top-4 right-4 bg-white rounded-full p-2 cursor-move shadow-sm hover:bg-gray-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-charcoal mb-1 truncate">{collection.title}</h3>
        <p className="text-sm text-charcoal/70 mb-3 line-clamp-2">{collection.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs bg-charcoal/5 text-charcoal/70 px-2 py-1 rounded">
            {productCount} Products
          </span>
          <div className="flex space-x-2">
            <Link href={`/dashboard/collections/${collection.id}`} className="text-blue-600 hover:text-blue-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </Link>
            <button className="text-red-600 hover:text-red-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CollectionsPage() {
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [collections, setCollections] = useState<Collection[]>([]);

  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load collections data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProductData(data);
        setCollections(data.collections);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to local import
        import('@/data/products.json')
          .then((module) => {
            setProductData(module.default);
            setCollections(module.default.collections);
          })
          .catch((err) => {
            console.error('Failed to load local data:', err);
          });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setCollections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
      
      // Here you would typically save the new order to your backend
      console.log('New collection order:', collections.map(c => c.id));
    }
  };

  // Filter collections based on search
  const filteredCollections = collections.filter(collection => 
    collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchQuery.toLowerCase())
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
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-charcoal">Manage Collections</h1>
        <Link
          href="/dashboard/collections/new"
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
          Add New Collection
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
          <input
            type="text"
            placeholder="Search collections..."
            className="w-full px-4 py-2 text-sm focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="bg-white px-4 py-2 text-charcoal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      <p className="text-sm text-charcoal/70 mb-4">
        Drag and drop to reorder collections. Changes are saved automatically.
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredCollections.map(c => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCollections.map((collection) => (
              <SortableCollectionItem 
                key={collection.id} 
                collection={collection} 
                products={productData?.products || []} 
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {filteredCollections.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 mx-auto text-charcoal/20 mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-lg font-bold text-charcoal mb-1">No Collections Found</h3>
          <p className="text-sm text-charcoal/70 mb-4">
            {searchQuery 
              ? `No collections match your search for "${searchQuery}"`
              : "You haven't created any collections yet"}
          </p>
          <Link
            href="/dashboard/collections/new"
            className="inline-flex items-center px-4 py-2 bg-gold text-white rounded-md hover:bg-gold/90 transition-colors"
          >
            Create Your First Collection
          </Link>
        </div>
      )}
    </div>
  );
} 