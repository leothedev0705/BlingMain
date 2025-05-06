'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// FAQ type definition
type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
  isVisible: boolean;
};

// Mock FAQs data (in a real app, these would come from your API)
const mockFAQs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 3-5 business days within India. For international orders, shipping can take 7-14 business days depending on your location.',
    category: 'shipping',
    isVisible: true,
  },
  {
    id: 'faq-2',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for all our products. Items must be in their original condition with all tags attached to be eligible for return.',
    category: 'returns',
    isVisible: true,
  },
  {
    id: 'faq-3',
    question: 'Do you offer gift wrapping?',
    answer: 'Yes, we offer premium gift wrapping services for all our products. You can select this option during checkout for an additional fee.',
    category: 'gifting',
    isVisible: true,
  },
  {
    id: 'faq-4',
    question: 'How do I track my order?',
    answer: 'You will receive a tracking number via email once your order ships. You can use this number to track your package on our website or through the courier\'s website.',
    category: 'shipping',
    isVisible: true,
  },
  {
    id: 'faq-5',
    question: 'Are your products authentic?',
    answer: 'All our jewelry and gift items are 100% authentic and sourced directly from reputable manufacturers. We provide authentication certificates for select high-value items.',
    category: 'products',
    isVisible: true,
  },
];

export default function FAQManagementPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [newFaq, setNewFaq] = useState<Omit<FAQ, 'id'>>(
    { question: '', answer: '', category: '', isVisible: true }
  );
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setFaqs(mockFAQs);
      
      // Extract unique categories
      const categorySet = new Set<string>();
      mockFAQs.forEach(faq => categorySet.add(faq.category));
      setCategories(Array.from(categorySet));
      
      setLoading(false);
    }, 800);
  }, []);

  // Filter FAQs by category
  const filteredFaqs = activeCategory === 'all'
    ? faqs
    : faqs.filter(faq => faq.category === activeCategory);

  // Toggle FAQ visibility
  const toggleVisibility = (id: string) => {
    setFaqs(prev => prev.map(faq => 
      faq.id === id ? { ...faq, isVisible: !faq.isVisible } : faq
    ));
  };

  // Set FAQ for editing
  const startEditing = (faq: FAQ) => {
    setEditingFaq({ ...faq });
    setIsAddingNew(false);
  };

  // Update editing FAQ
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditingFaq(prev => prev ? { ...prev, [name]: value } : null);
  };

  // Save edited FAQ
  const saveEditedFaq = () => {
    if (!editingFaq) return;
    
    setFaqs(prev => prev.map(faq => 
      faq.id === editingFaq.id ? editingFaq : faq
    ));
    
    setEditingFaq(null);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingFaq(null);
    setIsAddingNew(false);
  };

  // Handle new FAQ form change
  const handleNewFaqChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewFaq(prev => ({ ...prev, [name]: value }));
  };

  // Add new FAQ
  const addNewFaq = () => {
    const newFaqWithId = {
      ...newFaq,
      id: `faq-${Date.now()}`,
    };
    
    setFaqs(prev => [...prev, newFaqWithId]);
    setNewFaq({ question: '', answer: '', category: '', isVisible: true });
    setIsAddingNew(false);
  };

  // Delete FAQ
  const deleteFaq = (id: string) => {
    setFaqs(prev => prev.filter(faq => faq.id !== id));
  };

  // Start adding new FAQ
  const startAddingNew = () => {
    setIsAddingNew(true);
    setEditingFaq(null);
  };

  // Format category for display
  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-charcoal">Manage FAQs</h1>
          <button
            onClick={startAddingNew}
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
            Add New FAQ
          </button>
        </div>

        <p className="mt-2 text-charcoal/70">
          Manage the frequently asked questions displayed on your website.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-wrap items-center gap-2 mb-6"
      >
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-md text-sm ${
            activeCategory === 'all'
              ? 'bg-charcoal text-white'
              : 'bg-gray-100 text-charcoal/70 hover:bg-gray-200'
          }`}
        >
          All Categories
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-md text-sm ${
              activeCategory === category
                ? 'bg-charcoal text-white'
                : 'bg-gray-100 text-charcoal/70 hover:bg-gray-200'
            }`}
          >
            {formatCategory(category)}
          </button>
        ))}
      </motion.div>

      {/* Add/Edit FAQ Form */}
      {(isAddingNew || editingFaq) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-6"
        >
          <h2 className="text-lg font-bold text-charcoal mb-4">
            {isAddingNew ? 'Add New FAQ' : 'Edit FAQ'}
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-charcoal mb-1">
                Question
              </label>
              <input
                type="text"
                id="question"
                name="question"
                value={isAddingNew ? newFaq.question : editingFaq?.question || ''}
                onChange={isAddingNew ? handleNewFaqChange : handleEditChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gold/50 focus:border-transparent"
                placeholder="Enter the question"
              />
            </div>
            
            <div>
              <label htmlFor="answer" className="block text-sm font-medium text-charcoal mb-1">
                Answer
              </label>
              <textarea
                id="answer"
                name="answer"
                value={isAddingNew ? newFaq.answer : editingFaq?.answer || ''}
                onChange={isAddingNew ? handleNewFaqChange : handleEditChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gold/50 focus:border-transparent"
                placeholder="Enter the answer"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-charcoal mb-1">
                Category
              </label>
              <div className="flex gap-2">
                <select
                  id="category"
                  name="category"
                  value={isAddingNew ? newFaq.category : editingFaq?.category || ''}
                  onChange={isAddingNew ? handleNewFaqChange : handleEditChange}
                  className="flex-grow px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gold/50 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {formatCategory(category)}
                    </option>
                  ))}
                </select>
                
                {/* Option to add new category could be implemented here */}
              </div>
            </div>
            
            <div className="flex justify-end mt-4 space-x-3">
              <button
                onClick={cancelEditing}
                className="px-4 py-2 border border-gray-200 rounded-md text-charcoal hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={isAddingNew ? addNewFaq : saveEditedFaq}
                className="px-4 py-2 bg-gold text-white rounded-md hover:bg-gold/90 transition-colors"
              >
                {isAddingNew ? 'Add FAQ' : 'Save Changes'}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* FAQ List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-charcoal">
            {activeCategory === 'all' ? 'All FAQs' : `${formatCategory(activeCategory)} FAQs`}
          </h2>
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-charcoal/20 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-bold text-charcoal mb-1">No FAQs Found</h3>
            <p className="text-sm text-charcoal/70 mb-4">
              {activeCategory !== 'all'
                ? `No FAQs in the "${formatCategory(activeCategory)}" category`
                : "You haven't added any FAQs yet"}
            </p>
            <button
              onClick={startAddingNew}
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
              Add Your First FAQ
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredFaqs.map(faq => (
              <div key={faq.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-grow pr-6">
                    <h3 className="text-lg font-medium text-charcoal mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-charcoal/70">
                      {faq.answer}
                    </p>
                    <div className="mt-3 flex items-center">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-charcoal/70 rounded-md text-xs mr-3">
                        {formatCategory(faq.category)}
                      </span>
                      <span className={`flex items-center text-xs ${faq.isVisible ? 'text-green-600' : 'text-red-600'}`}>
                        <span className={`inline-block w-2 h-2 rounded-full ${faq.isVisible ? 'bg-green-500' : 'bg-red-500'} mr-1`}></span>
                        {faq.isVisible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleVisibility(faq.id)}
                      className={`p-2 rounded-md ${
                        faq.isVisible
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {faq.isVisible ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        )}
                      </svg>
                    </button>
                    <button
                      onClick={() => startEditing(faq)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteFaq(faq.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
} 