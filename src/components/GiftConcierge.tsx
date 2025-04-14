'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { getGiftRecommendation, GiftFormData, GiftRecommendation } from '@/utils/giftRecommendationService';

// Example suggestion data
const giftSuggestions = [
  {
    id: 1,
    occasion: 'Anniversary',
    recipient: 'Spouse',
    budget: '₹30,000 - ₹50,000',
    preferences: 'Jewelry, Experiences',
    recommendation: {
      name: 'Eternal Bliss Collection',
      description: 'A customized jewelry piece paired with a private dining experience at a luxury restaurant.',
      price: '₹45,000',
      image: '/gifts/anniversary.jpg',
    },
  },
  {
    id: 2,
    occasion: 'Diwali',
    recipient: 'Business Partner',
    budget: '₹15,000 - ₹25,000',
    preferences: 'Home Decor, Gourmet',
    recommendation: {
      name: 'Luminous Prosperity Hamper',
      description: 'Artisanal diyas, premium dry fruits and nuts selection with fine teas in a handcrafted wooden chest.',
      price: '₹22,000',
      image: '/gifts/diwali.jpg',
    },
  },
  {
    id: 3,
    occasion: 'Birthday',
    recipient: 'Parent',
    budget: '₹10,000 - ₹20,000',
    preferences: 'Wellness, Personalized',
    recommendation: {
      name: 'Tranquil Moments Collection',
      description: 'A monogrammed silk robe with premium aromatherapy essentials and a personalized wellness journal.',
      price: '₹18,500',
      image: '/gifts/birthday.jpg',
    },
  },
];

const GiftConcierge = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<GiftFormData>({
    occasion: '',
    recipient: '',
    budget: '',
    preferences: '',
    relationship: '',
    recipientAge: '',
    specialInstructions: '',
  });
  const [recommendation, setRecommendation] = useState<GiftRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Use the AI-powered recommendation service
      const result = await getGiftRecommendation(formData);
      setRecommendation(result);
      setStep(2);
    } catch (error) {
      console.error('Error getting recommendation:', error);
      setError('Failed to generate a recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-ivory/5 backdrop-blur-sm border border-gold/20 rounded-2xl p-8 md:p-12">
      <h2 className="text-3xl font-bold text-ivory mb-6 font-playfair">
        Gift <span className="text-gold">Concierge</span>
      </h2>

      {step === 1 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <p className="text-gold font-medium mb-3">
            The AI powered gift finder is our concierge only!
          </p>
          <p className="text-ivory/90 mb-8">
            Our AI-powered Gift Concierge helps you find the perfect gift for any occasion,
            recipient, or budget. Experience personalized gifting like never before.
          </p>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-100 p-4 rounded-md mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="occasion" className="block text-ivory/90 mb-2">
                  Occasion
                </label>
                <select
                  id="occasion"
                  name="occasion"
                  value={formData.occasion}
                  onChange={handleChange}
                  required
                  className="w-full bg-charcoal/60 border border-gold/20 rounded-md px-4 py-3 text-ivory focus:outline-none focus:ring-2 focus:ring-gold/50"
                >
                  <option value="">Select an occasion</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Diwali">Diwali</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Corporate Gift">Corporate Gift</option>
                  <option value="Housewarming">Housewarming</option>
                  <option value="Raksha Bandhan">Raksha Bandhan</option>
                  <option value="Baby Shower">Baby Shower</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="recipient" className="block text-ivory/90 mb-2">
                  Recipient
                </label>
                <select
                  id="recipient"
                  name="recipient"
                  value={formData.recipient}
                  onChange={handleChange}
                  required
                  className="w-full bg-charcoal/60 border border-gold/20 rounded-md px-4 py-3 text-ivory focus:outline-none focus:ring-2 focus:ring-gold/50"
                >
                  <option value="">Select a recipient</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Friend">Friend</option>
                  <option value="Business Partner">Business Partner</option>
                  <option value="Client">Client</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Grandparent">Grandparent</option>
                  <option value="Child">Child</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="relationship" className="block text-ivory/90 mb-2">
                  Relationship (Optional)
                </label>
                <input
                  type="text"
                  id="relationship"
                  name="relationship"
                  value={formData.relationship || ''}
                  onChange={handleChange}
                  placeholder="e.g., Close friend of 10 years"
                  className="w-full bg-charcoal/60 border border-gold/20 rounded-md px-4 py-3 text-ivory focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              
              <div>
                <label htmlFor="recipientAge" className="block text-ivory/90 mb-2">
                  Recipient Age Range (Optional)
                </label>
                <select
                  id="recipientAge"
                  name="recipientAge"
                  value={formData.recipientAge || ''}
                  onChange={handleChange}
                  className="w-full bg-charcoal/60 border border-gold/20 rounded-md px-4 py-3 text-ivory focus:outline-none focus:ring-2 focus:ring-gold/50"
                >
                  <option value="">Select age range (optional)</option>
                  <option value="18-25">18-25</option>
                  <option value="26-35">26-35</option>
                  <option value="36-45">36-45</option>
                  <option value="46-60">46-60</option>
                  <option value="60+">60+</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="budget" className="block text-ivory/90 mb-2">
                  Budget
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  className="w-full bg-charcoal/60 border border-gold/20 rounded-md px-4 py-3 text-ivory focus:outline-none focus:ring-2 focus:ring-gold/50"
                >
                  <option value="">Select a budget range</option>
                  <option value="₹5,000 - ₹10,000">₹5,000 - ₹10,000</option>
                  <option value="₹10,000 - ₹20,000">₹10,000 - ₹20,000</option>
                  <option value="₹20,000 - ₹50,000">₹20,000 - ₹50,000</option>
                  <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                  <option value="₹1,00,000+">₹1,00,000+</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="preferences" className="block text-ivory/90 mb-2">
                  Preferences
                </label>
                <select
                  id="preferences"
                  name="preferences"
                  value={formData.preferences}
                  onChange={handleChange}
                  required
                  className="w-full bg-charcoal/60 border border-gold/20 rounded-md px-4 py-3 text-ivory focus:outline-none focus:ring-2 focus:ring-gold/50"
                >
                  <option value="">Select preferences</option>
                  <option value="Jewelry, Fine accessories">Jewelry, Fine accessories</option>
                  <option value="Home Decor, Art">Home Decor, Art</option>
                  <option value="Gourmet, Culinary experiences">Gourmet, Culinary experiences</option>
                  <option value="Wellness, Self-care">Wellness, Self-care</option>
                  <option value="Tech, Gadgets">Tech, Gadgets</option>
                  <option value="Personalized, Bespoke items">Personalized, Bespoke items</option>
                  <option value="Experiences, Memorable activities">Experiences, Memorable activities</option>
                  <option value="Traditional, Cultural items">Traditional, Cultural items</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="specialInstructions" className="block text-ivory/90 mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                id="specialInstructions"
                name="specialInstructions"
                value={formData.specialInstructions || ''}
                onChange={handleChange}
                placeholder="Any specific details that might help us recommend the perfect gift..."
                rows={3}
                className="w-full bg-charcoal/60 border border-gold/20 rounded-md px-4 py-3 text-ivory focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="magnetic-button gold-gradient inline-flex items-center justify-center px-6 py-3 text-charcoal font-medium rounded-md hover:shadow-lg transition-all duration-300 disabled:opacity-70"
            >
              {loading ? 'Processing...' : 'Find the Perfect Gift'}
            </button>
          </form>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin mb-4"></div>
              <p className="text-ivory/90">Our AI is curating the perfect gift for you...</p>
            </div>
          ) : recommendation ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="bg-charcoal/40 backdrop-blur-sm rounded-xl p-6 border border-gold/10 mb-6">
                  <div className="space-y-4">
                    <p className="text-ivory/80">Occasion: <span className="text-gold">{formData.occasion}</span></p>
                    <p className="text-ivory/80">Recipient: <span className="text-gold">{formData.recipient}</span></p>
                    <p className="text-ivory/80">Budget: <span className="text-gold">{formData.budget}</span></p>
                    <p className="text-ivory/80">Preferences: <span className="text-gold">{formData.preferences}</span></p>
                    {formData.relationship && (
                      <p className="text-ivory/80">Relationship: <span className="text-gold">{formData.relationship}</span></p>
                    )}
                    {formData.specialInstructions && (
                      <p className="text-ivory/80 text-sm italic">"{formData.specialInstructions}"</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-gold hover:text-gold/80 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Try a different combination
                </button>
              </div>
              <div>
                <div className="bg-ivory/5 p-6 rounded-lg border border-gold/20">
                  <div className="mb-4 aspect-w-16 aspect-h-9 rounded-md overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent z-10"></div>
                    {recommendation.imageUrl && (
                      <Image
                        src={recommendation.imageUrl}
                        alt={recommendation.name}
                        fill
                        objectFit="cover"
                        className="rounded-md"
                      />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gold font-playfair mb-2">"{recommendation.name}"</h3>
                  <p className="text-ivory/90 mb-4">{recommendation.description}</p>
                  <p className="text-2xl font-playfair text-gold mb-4">{recommendation.price}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm uppercase tracking-wider text-gold/70 mb-2">Personalization Options</h4>
                    <ul className="text-ivory/80 space-y-1 text-sm">
                      {recommendation.personalizationOptions.map((option, index) => (
                        <li key={index} className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold mr-2 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-6 p-3 bg-charcoal/30 rounded border border-gold/10">
                    <h4 className="text-sm uppercase tracking-wider text-gold/70 mb-1">Why This Gift?</h4>
                    <p className="text-ivory/90 text-sm italic">{recommendation.matchReason}</p>
                  </div>
                  
                  <div className="flex gap-4">
                    <Link
                      href="#"
                      className="magnetic-button gold-gradient inline-flex items-center justify-center px-6 py-3 flex-1 text-charcoal font-medium rounded-md hover:shadow-lg transition-all duration-300 text-center"
                    >
                      Purchase This Gift
                    </Link>
                    <button 
                      onClick={() => {
                        setLoading(true);
                        setTimeout(async () => {
                          try {
                            // Generate a new recommendation with the same criteria
                            const result = await getGiftRecommendation(formData);
                            setRecommendation(result);
                          } catch (error) {
                            console.error('Error regenerating recommendation:', error);
                            setError('Failed to generate a new recommendation. Please try again.');
                          } finally {
                            setLoading(false);
                          }
                        }, 500);
                      }}
                      className="px-3 py-2 border border-gold/30 rounded-md text-gold hover:bg-gold/10 transition-colors"
                      disabled={loading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-ivory/90">Sorry, we couldn't generate a recommendation at this time. Please try again.</p>
              <button
                onClick={() => setStep(1)}
                className="mt-4 text-gold hover:text-gold/80 transition-colors flex items-center justify-center mx-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Go back and try again
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default GiftConcierge; 