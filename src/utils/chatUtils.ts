// Import Google Generative AI SDK
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import 'dotenv/config';

// Load and configure dotenv
require('dotenv').config();

// API key from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Validate API key
if (!GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY is not set in environment variables. Chat functionality will not work properly.');
} else {
  console.log('Gemini API key found. Length:', GEMINI_API_KEY.length);
}

// Initialize the Google Generative AI with API key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Predefined responses for navigation questions
interface NavigationResponses {
  [key: string]: string;
}

const navigationResponses: NavigationResponses = {
  giftCatalogue: 'You can explore our Gift Catalogue at /gift-catalogue. We have collections for weddings, corporate events, festivals, and more!',
  shop: 'Check out our shop at /shop. We have new arrivals, best sellers, sale items, and custom orders!',
  concierge: 'Our Gift Concierge service offers personalized assistance for selecting the perfect gift. Visit /concierge to learn more!',
  contact: 'You can contact us at /contact. We\'re always happy to help!',
  about: 'Learn more about Bling×Beyond at /about. We specialize in luxury gifting experiences for all special occasions.',
  wedding: 'We have an exclusive wedding collection with luxury gifts. Visit /collections/wedding to explore!',
  corporate: 'Our corporate gifts are perfect for business relationships. Check them out at /collections/corporate!',
  diwali: 'Celebrate Diwali with our specially curated gift hampers at /occasions/diwali!',
  anniversary: 'Find the perfect anniversary gift at /occasions/anniversary!',
  birthday: 'Make birthdays special with our curated gifts at /occasions/birthday!',
  default: 'Thank you for your message! I can help you navigate our website, find the perfect gift, or answer questions about our products and services. Please let me know what you\'re looking for.'
};

// Create a model instance with optimized parameters
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.7,         // Increased from 0.4 for more creative responses
    topK: 40,                 // Increased from 32 for more diverse responses
    topP: 0.9,                // Adjusted for better response quality
    maxOutputTokens: 1000,    // Increased from 800 for more detailed responses
  },
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
});

// Enhanced system prompt with more detailed context
const SYSTEM_PROMPT = 
  "You are a helpful, friendly, and knowledgeable assistant for Bling×Beyond, a premium luxury gifting brand based in India. " +
  "Your role is to provide exceptional customer service by helping users navigate the website, find perfect gifts, and answer detailed questions about products and services. " +
  
  "WEBSITE NAVIGATION: " +
  "- Gift Catalogue (/gift-catalogue): Our curated collections for special occasions. " +
  "- Shop (/shop): Browse products by category including new arrivals, best sellers, sale items, and custom orders. " +
  "- Collections: Specialized gift collections including Wedding (/collections/wedding), Corporate (/collections/corporate), Festive (/collections/festive), and Personalized (/collections/personalized). " +
  "- Occasions: Gift suggestions for specific occasions like Anniversary (/occasions/anniversary), Birthday (/occasions/birthday), Diwali (/occasions/diwali), and more. " +
  "- Gift Concierge (/concierge): Our personalized service that helps find the perfect gift based on recipient, occasion, and budget. " +
  
  "PRODUCT INFORMATION: " +
  "- Luxury Jewelry: Fine gold and silver pieces with gemstone options, including necklaces, bracelets, and custom designs. Price range: ₹15,000-₹200,000. " +
  "- Home Décor: Crystal items, silver-plated decorative pieces, luxury candles, and artisanal home accessories. Price range: ₹5,000-₹75,000. " +
  "- Personalized Gifts: Monogrammed leather goods, custom engraved items, and bespoke gift sets. Price range: ₹3,000-₹50,000. " +
  "- Gift Hampers: Curated luxury collections including gourmet treats, wellness products, and premium beverages. Price range: ₹7,500-₹100,000. " +
  "- Corporate Gifts: Executive desk accessories, premium tech gadgets, and branded luxury items. Price range: ₹10,000-₹150,000. " +
  "- Festive Collections: Special items for Diwali, Raksha Bandhan, Karwa Chauth, and other Indian festivals. Price range: ₹5,000-₹80,000. " +
  "- Wedding Gifts: Luxury gift sets, silver items, home essentials, and couple-focused experiences. Price range: ₹25,000-₹300,000. " +
  
  "CUSTOMER SERVICE: " +
  "- For any issues or special requests, direct users to our Contact page (/contact). " +
  "- Our shipping is available across India with express delivery options. " +
  "- We offer gift wrapping services with custom message cards. " +
  "- Return and exchange available within 7 days for non-personalized items. " +
  "- Premium delivery service available for high-value purchases. " +
  
  "TONE GUIDELINES: " +
  "- Be warm, helpful, and professional. " +
  "- Use elegant, sophisticated language that reflects our luxury brand. " +
  "- Be concise but thorough in your responses. " +
  "- If you don't know something specific about our products, acknowledge this and suggest contacting customer service for details. " +
  
  "GIFT RECOMMENDATION GUIDELINES: " +
  "- Always consider occasion, recipient relationship, budget, and preferences when making suggestions. " +
  "- For wedding gifts, focus on lasting items that symbolize union and prosperity. " +
  "- For corporate gifts, emphasize sophistication and understated elegance. " +
  "- For festival gifts, incorporate cultural elements and traditional motifs. " +
  "- When making specific product suggestions, mention typical price range to set expectations. " +
  
  "Always prioritize suggesting relevant sections of our website where users can find more information about their query.";

// Initialize chat with improved context
let chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [{ text: SYSTEM_PROMPT }],
    },
    {
      role: "model",
      parts: [{ text: "I understand my role as Bling×Beyond's luxury gifting assistant. I'll help customers navigate the website, find perfect gifts, and provide detailed information about our premium products and services. I'll maintain an elegant, professional tone that reflects our luxury brand while being warm and helpful." }],
    },
  ],
});

/**
 * Calls the Gemini 1.5 Flash model API using the Google Generative AI SDK
 * @param message User message to send to the API
 * @returns Response from the Gemini model
 */
async function callGeminiAPI(message: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    console.error('ERROR: Cannot call Gemini API - API key is not set');
    return "I'm sorry, but I'm having trouble connecting to my knowledge base. Please try again later or contact our customer service for immediate assistance.";
  }

  try {
    console.log('Sending message to Gemini API:', message.substring(0, 50) + (message.length > 50 ? '...' : ''));
    // Send message to the model
    const result = await chat.sendMessage(message);
    const response = result.response;
    const responseText = response.text();
    console.log('Received response from Gemini API. Length:', responseText.length);
    return responseText;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    
    // If the chat fails, reinitialize it and try again
    try {
      console.log("Reinitializing chat session...");
      chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: SYSTEM_PROMPT }],
          },
          {
            role: "model",
            parts: [{ text: "I understand my role as Bling×Beyond's luxury gifting assistant. I'll help customers navigate the website, find perfect gifts, and provide detailed information about our premium products and services. I'll maintain an elegant, professional tone that reflects our luxury brand while being warm and helpful." }],
          },
        ],
      });
      return "I apologize for the brief interruption. How may I assist you with finding the perfect luxury gift today?";
    } catch (retryError) {
      console.error("Failed to reinitialize chat:", retryError);
      return "I'm sorry, I encountered an error connecting to my knowledge base. Please try again later or contact our customer service for immediate assistance.";
    }
  }
}

/**
 * Processes the user message and returns an appropriate response
 * @param message User's message text
 * @returns Bot response text
 */
export async function processMessage(message: string): Promise<string> {
  try {
    const lowerCaseMessage = message.toLowerCase();
    
    // Add more structured navigation responses for specific product inquiries
    if (lowerCaseMessage.includes('jewelry') || lowerCaseMessage.includes('jewellery')) {
      return "Our luxury jewelry collection includes fine gold and silver pieces with premium gemstone options. Prices range from ₹15,000 to ₹200,000. Browse our collection at /shop.";
    }
    
    if (lowerCaseMessage.includes('home') && (lowerCaseMessage.includes('decor') || lowerCaseMessage.includes('décor'))) {
      return "Our home décor collection features crystal items, silver-plated decorative pieces, luxury candles, and artisanal accessories. Prices range from ₹5,000 to ₹75,000. Explore at /shop.";
    }
    
    if (lowerCaseMessage.includes('corporate') && lowerCaseMessage.includes('gift')) {
      return "Our corporate gift collection includes executive desk accessories, premium tech gadgets, and branded luxury items perfect for business relationships. View our corporate gifting options at /collections/corporate.";
    }
    
    // For very simple queries, provide quick responses directly
    if (lowerCaseMessage.length < 15) {
      if (lowerCaseMessage.includes('gift') && (lowerCaseMessage.includes('catalogue') || lowerCaseMessage.includes('catalog'))) {
        return navigationResponses.giftCatalogue;
      } else if (lowerCaseMessage.includes('shop') || lowerCaseMessage.includes('products')) {
        return navigationResponses.shop;
      } else if (lowerCaseMessage.includes('concierge') || lowerCaseMessage.includes('help me')) {
        return navigationResponses.concierge;
      } else if (lowerCaseMessage.includes('contact') || lowerCaseMessage.includes('contact us')) {
        return navigationResponses.contact;
      } else if (lowerCaseMessage.includes('about') || lowerCaseMessage.includes('about us')) {
        return navigationResponses.about;
      } else if (lowerCaseMessage.includes('wedding')) {
        return navigationResponses.wedding;
      } else if (lowerCaseMessage.includes('corporate')) {
        return navigationResponses.corporate;
      } else if (lowerCaseMessage.includes('diwali')) {
        return navigationResponses.diwali;
      } else if (lowerCaseMessage.includes('anniversary')) {
        return navigationResponses.anniversary;
      } else if (lowerCaseMessage.includes('birthday')) {
        return navigationResponses.birthday;
      }
    }

    // Enhanced context for complex gift recommendation queries
    if (lowerCaseMessage.includes('recommend') || 
        lowerCaseMessage.includes('suggestion') || 
        (lowerCaseMessage.includes('looking') && lowerCaseMessage.includes('for')) ||
        (lowerCaseMessage.includes('need') && lowerCaseMessage.includes('gift'))) {
        
      // Extract potential context clues
      const occasions = ['wedding', 'anniversary', 'birthday', 'diwali', 'corporate', 'housewarming'];
      const recipients = ['wife', 'husband', 'mother', 'father', 'parents', 'friend', 'boss', 'colleague', 'client'];
      const budgetMatches = message.match(/₹([0-9,]+)/g) || message.match(/([0-9,]+)\s*rupees/gi);
      
      let enhancedMessage = message;
      
      // Add context for the model to better understand this is a gift recommendation request
      enhancedMessage = "The user is looking for a gift recommendation. " + enhancedMessage;
      
      // Add hint to include navigation links in the response
      enhancedMessage += " Please include relevant section links in your response.";
      
      console.log('Enhanced gift recommendation query:', enhancedMessage);
      return await callGeminiAPI(enhancedMessage);
    }

    // For more complex queries, use the Gemini API
    return await callGeminiAPI(message);
  } catch (error) {
    console.error('Error processing message:', error);
    return 'I apologize for the inconvenience. I seem to be having trouble at the moment. Please try again in a few moments, or feel free to browse our collections directly through the navigation menu.';
  }
} 