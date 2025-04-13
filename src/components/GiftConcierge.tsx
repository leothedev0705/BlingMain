'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

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
  const [formData, setFormData] = useState({
    occasion: '',
    recipient: '',
    budget: '',
    preferences: '',
  });
  const [suggestion, setSuggestion] = useState<null | typeof giftSuggestions[0]>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      // Find a matching suggestion or use the first one
      const matchedSuggestion = giftSuggestions.find(
        (s) => s.occasion === formData.occasion
      ) || giftSuggestions[0];
      
      setSuggestion(matchedSuggestion);
      setLoading(false);
      setStep(2);
    }, 1500);
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
          <p className="text-ivory/90 mb-8">
            Our AI-powered Gift Concierge helps you find the perfect gift for any occasion,
            recipient, or budget. Experience personalized gifting like never before.
          </p>
          
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
                  <option value="Corporate">Corporate</option>
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
                  <option value="₹50,000+">₹50,000+</option>
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
                  <option value="Jewelry, Experiences">Jewelry, Experiences</option>
                  <option value="Home Decor, Gourmet">Home Decor, Gourmet</option>
                  <option value="Wellness, Personalized">Wellness, Personalized</option>
                  <option value="Tech, Luxury">Tech, Luxury</option>
                </select>
              </div>
            </div>
            
            <button
              type="submit"
              className="magnetic-button gold-gradient inline-flex items-center justify-center px-6 py-3 text-charcoal font-medium rounded-md hover:shadow-lg transition-all duration-300"
            >
              Find the Perfect Gift
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
          ) : suggestion ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="bg-charcoal/40 backdrop-blur-sm rounded-xl p-6 border border-gold/10 mb-6">
                  <div className="space-y-4">
                    <p className="text-ivory/80">Occasion: <span className="text-gold">{suggestion.occasion}</span></p>
                    <p className="text-ivory/80">Recipient: <span className="text-gold">{suggestion.recipient}</span></p>
                    <p className="text-ivory/80">Budget: <span className="text-gold">{suggestion.budget}</span></p>
                    <p className="text-ivory/80">Preferences: <span className="text-gold">{suggestion.preferences}</span></p>
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
                  <h3 className="text-xl font-bold text-gold font-playfair mb-2">Recommended: "{suggestion.recommendation.name}"</h3>
                  <p className="text-ivory/90 mb-4">{suggestion.recommendation.description}</p>
                  <p className="text-ivory font-medium mb-6">{suggestion.recommendation.price}</p>
                  <Link
                    href={`/product/${suggestion.id}`}
                    className="magnetic-button gold-gradient inline-flex items-center justify-center px-6 py-3 w-full text-charcoal font-medium rounded-md hover:shadow-lg transition-all duration-300"
                  >
                    View This Gift
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </motion.div>
      )}
    </div>
  );
};

export default GiftConcierge; 