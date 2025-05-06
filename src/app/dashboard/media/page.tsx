'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

// Media item type
type MediaItem = {
  id: string;
  src: string;
  alt: string;
  createdAt: string;
  size: string;
  type: string;
  dimensions?: string;
};

// Mock media items (in a real app, these would come from your API)
const mockMediaItems: MediaItem[] = [
  {
    id: 'img-1',
    src: '/assets/placeholder.jpg',
    alt: 'Product image 1',
    createdAt: '2023-10-15',
    size: '268 KB',
    type: 'image/jpeg',
    dimensions: '1200 x 800',
  },
  {
    id: 'img-2',
    src: '/assets/placeholder.jpg',
    alt: 'Collection cover',
    createdAt: '2023-10-14',
    size: '412 KB',
    type: 'image/jpeg',
    dimensions: '1600 x 1200',
  },
  {
    id: 'img-3',
    src: '/assets/placeholder.jpg',
    alt: 'Banner image',
    createdAt: '2023-10-12',
    size: '1.2 MB',
    type: 'image/png',
    dimensions: '1920 x 1080',
  },
  {
    id: 'img-4',
    src: '/assets/placeholder.jpg',
    alt: 'Product detail',
    createdAt: '2023-10-10',
    size: '380 KB',
    type: 'image/jpeg',
    dimensions: '1500 x 1500',
  },
];

export default function MediaLibraryPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(mockMediaItems);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [detailItem, setDetailItem] = useState<MediaItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter media items based on search query
  const filteredItems = mediaItems.filter(item => 
    item.alt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort items based on selected sort option
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'name':
        return a.alt.localeCompare(b.alt);
      default:
        return 0;
    }
  });

  // Handle selection toggle for an item
  const toggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  // Handle selection of all items
  const toggleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate file upload with progress
    const totalFiles = files.length;
    const newMediaItems: MediaItem[] = [];
    let processedFiles = 0;

    Array.from(files).forEach(file => {
      // Create a URL for the file
      const fileUrl = URL.createObjectURL(file);
      const fileSize = formatFileSize(file.size);
      const fileName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension

      // For image files, get dimensions
      if (file.type.startsWith('image/')) {
        const img = new window.Image();
        img.onload = () => {
          const newItem: MediaItem = {
            id: `img-${Date.now()}-${processedFiles}`,
            src: fileUrl,
            alt: fileName,
            createdAt: new Date().toISOString().split('T')[0],
            size: fileSize,
            type: file.type,
            dimensions: `${img.width} x ${img.height}`,
          };

          newMediaItems.push(newItem);
          processedFiles++;

          // Update progress
          const progress = Math.round((processedFiles / totalFiles) * 100);
          setUploadProgress(progress);

          // When all files are processed, update the media items
          if (processedFiles === totalFiles) {
            setMediaItems(prev => [...newMediaItems, ...prev]);
            setIsUploading(false);
          }
        };
        img.src = fileUrl;
      } else {
        // For non-image files
        const newItem: MediaItem = {
          id: `file-${Date.now()}-${processedFiles}`,
          src: fileUrl,
          alt: fileName,
          createdAt: new Date().toISOString().split('T')[0],
          size: fileSize,
          type: file.type,
        };

        newMediaItems.push(newItem);
        processedFiles++;

        // Update progress
        const progress = Math.round((processedFiles / totalFiles) * 100);
        setUploadProgress(progress);

        // When all files are processed, update the media items
        if (processedFiles === totalFiles) {
          setMediaItems(prev => [...newMediaItems, ...prev]);
          setIsUploading(false);
        }
      }
    });
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle media item deletion
  const handleDelete = () => {
    if (selectedItems.length === 0) return;
    
    setMediaItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
    setDetailItem(null);
  };

  // View media item details
  const viewDetails = (item: MediaItem) => {
    setDetailItem(item);
  };

  // Update media item alt text
  const updateAltText = (newAlt: string) => {
    if (!detailItem) return;
    
    setMediaItems(prev => 
      prev.map(item => 
        item.id === detailItem.id ? { ...item, alt: newAlt } : item
      )
    );
    
    setDetailItem(prev => prev ? { ...prev, alt: newAlt } : null);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-charcoal">Media Library</h1>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center px-4 py-2 bg-gold text-white rounded-md hover:bg-gold/90 transition-colors"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading ({uploadProgress}%)
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Files
            </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Search */}
          <div className="flex-grow max-w-md">
            <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
              <input
                type="text"
                placeholder="Search media..."
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

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Sort dropdown */}
            <div className="relative inline-block">
              <select
                className="appearance-none bg-white border border-gray-200 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'name')}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name (A-Z)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-charcoal">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* View mode */}
            <div className="inline-flex items-center border border-gray-200 rounded-md overflow-hidden">
              <button
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-charcoal' : 'bg-white text-charcoal/60'}`}
                onClick={() => setViewMode('grid')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 text-charcoal' : 'bg-white text-charcoal/60'}`}
                onClick={() => setViewMode('list')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Delete button - only visible when items are selected */}
            {selectedItems.length > 0 && (
              <button
                className="inline-flex items-center px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                onClick={handleDelete}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete {selectedItems.length > 1 ? `(${selectedItems.length})` : ''}
              </button>
            )}
          </div>
        </div>

        {/* Selection info bar - only visible when items are selected */}
        {selectedItems.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="select-all"
                checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                onChange={toggleSelectAll}
                className="h-4 w-4 text-gold focus:ring-gold/50 border-gray-300 rounded"
              />
              <label htmlFor="select-all" className="ml-2 text-sm text-charcoal">
                {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'} selected
              </label>
            </div>
            <button
              className="text-sm text-charcoal/70 hover:text-charcoal transition-colors"
              onClick={() => setSelectedItems([])}
            >
              Clear selection
            </button>
          </div>
        )}
      </div>

      {/* Media Gallery */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-charcoal/20 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-bold text-charcoal mb-1">No Media Found</h3>
          <p className="text-sm text-charcoal/70 mb-4">
            {searchQuery
              ? `No media items match your search for "${searchQuery}"`
              : "You haven't uploaded any media yet"}
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-4 py-2 bg-gold text-white rounded-md hover:bg-gold/90 transition-colors"
          >
            Upload Your First Media
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4' : ''}>
          {sortedItems.map((item) => (
            viewMode === 'grid' ? (
              <div 
                key={item.id}
                className={`relative bg-white rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md cursor-pointer ${
                  selectedItems.includes(item.id) ? 'ring-2 ring-gold' : ''
                }`}
                onClick={() => viewDetails(item)}
              >
                <div className="aspect-square relative">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-charcoal truncate">{item.alt}</h3>
                  <p className="text-xs text-charcoal/70 flex items-center justify-between mt-1">
                    <span>{item.dimensions || 'N/A'}</span>
                    <span>{item.size}</span>
                  </p>
                </div>
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleSelection(item.id);
                    }}
                    className="h-4 w-4 text-gold focus:ring-gold/50 border-gray-300 rounded"
                  />
                </div>
              </div>
            ) : (
              <div
                key={item.id}
                className={`flex items-center bg-white rounded-lg mb-2 p-2 ${
                  selectedItems.includes(item.id) ? 'ring-2 ring-gold' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleSelection(item.id)}
                  className="h-4 w-4 text-gold focus:ring-gold/50 border-gray-300 rounded mr-3"
                />
                <div className="relative w-12 h-12 mr-3 bg-gray-100 rounded-md flex-shrink-0">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-sm font-medium text-charcoal">{item.alt}</h3>
                  <p className="text-xs text-charcoal/70">{item.dimensions || 'N/A'}</p>
                </div>
                <div className="text-right text-xs text-charcoal/70 mr-4">
                  <p>{item.size}</p>
                  <p>{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => viewDetails(item)}
                  className="text-blue-600 hover:text-blue-800 transition-colors ml-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            )
          ))}
        </div>
      )}

      {/* Media Details Modal */}
      {detailItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-charcoal">Media Details</h2>
              <button
                onClick={() => setDetailItem(null)}
                className="text-charcoal/70 hover:text-charcoal transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 bg-gray-100 relative">
                <div className="aspect-square relative">
                  <Image
                    src={detailItem.src}
                    alt={detailItem.alt}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2 p-6 overflow-y-auto max-h-[60vh]">
                <div className="mb-4">
                  <label htmlFor="alt-text" className="block text-sm font-medium text-charcoal mb-1">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    id="alt-text"
                    value={detailItem.alt}
                    onChange={(e) => updateAltText(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gold/50 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-xs text-charcoal/70 mb-1">Type</h3>
                    <p className="text-sm text-charcoal">{detailItem.type}</p>
                  </div>
                  <div>
                    <h3 className="text-xs text-charcoal/70 mb-1">Size</h3>
                    <p className="text-sm text-charcoal">{detailItem.size}</p>
                  </div>
                  <div>
                    <h3 className="text-xs text-charcoal/70 mb-1">Dimensions</h3>
                    <p className="text-sm text-charcoal">{detailItem.dimensions || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-xs text-charcoal/70 mb-1">Uploaded</h3>
                    <p className="text-sm text-charcoal">{new Date(detailItem.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-charcoal mb-1">File URL</h3>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={detailItem.src}
                      readOnly
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-charcoal/70"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(detailItem.src)}
                      className="ml-2 p-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setSelectedItems([detailItem.id]);
                  handleDelete();
                }}
                className="inline-flex items-center px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
              <button
                onClick={() => setDetailItem(null)}
                className="px-4 py-2 border border-gray-200 rounded-md text-charcoal hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 