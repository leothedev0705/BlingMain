// Import Google Generative AI SDK
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import 'dotenv/config';

// Load and configure dotenv
require('dotenv').config();

// API key from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Initialize the Google Generative AI with API key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Create a model instance with optimized parameters for gift recommendations
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.7,         // Optimized temperature for balanced creativity and consistency
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2000,    // Increased for more detailed gift descriptions
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

// Log API key status
if (!GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY is not set in environment variables. Gift Concierge will not work properly.');
} else {
  console.log('Gemini API key found for Gift Concierge. Length:', GEMINI_API_KEY.length);
}

// Enhanced system prompt with more product specifics
const GIFT_CONCIERGE_PROMPT = 
  "You are a luxury gift concierge AI for Bling×Beyond, an upscale Indian gifting brand specializing in elegant, bespoke gifts. " +
  "Your expertise lies in recommending the perfect gift based on occasion, recipient, budget, and preferences. " +
  
  "SPECIFIC GIFT INVENTORY: " +
  "1. JEWELRY AND ACCESSORIES: " +
  "- 'Eternal Elegance' diamond pendant necklaces (₹45,000-₹150,000) " +
  "- 'Heritage Collection' gold cufflinks with semi-precious stones (₹25,000-₹60,000) " +
  "- 'Regal Essence' sterling silver jewelry boxes with velvet interiors (₹18,000-₹40,000) " +
  "- 'Time Honored' luxury watches with customized faces (₹35,000-₹200,000) " +
  
  "2. HOME DÉCOR: " +
  "- 'Crystal Symphony' hand-cut crystal vases and bowls (₹15,000-₹75,000) " +
  "- 'Golden Age' 24k gold-plated serving pieces (₹20,000-₹80,000) " +
  "- 'Royal Serenity' premium silk bedding sets (₹30,000-₹120,000) " +
  "- 'Heritage Artisan' hand-carved wooden décor items (₹10,000-₹50,000) " +
  
  "3. GOURMET & CULINARY: " +
  "- 'Flavor Voyage' premium spice and tea collections (₹7,500-₹25,000) " +
  "- 'Divine Indulgence' artisanal chocolate and confectionery hampers (₹10,000-₹40,000) " +
  "- 'Spirit Legacy' aged spirits in custom decanters (₹35,000-₹150,000) " +
  
  "4. CORPORATE & EXECUTIVE: " +
  "- 'Command Presence' leather desk sets and accessories (₹15,000-₹60,000) " +
  "- 'Digital Aristocrat' premium tech accessories in precious metals (₹25,000-₹100,000) " +
  "- 'Authority Imprint' custom monogrammed business accessories (₹12,000-₹45,000) " +
  
  "When making recommendations, please follow these guidelines: " +
  
  "1. GIFT DETAILS: " +
  "- Select a specific gift from our inventory that best matches the criteria " +
  "- Write a detailed, vivid description (50-75 words) highlighting unique features, materials, and craftsmanship " +
  "- Suggest a price within the specified budget range that feels appropriate for a luxury item " +
  "- For collections, create a cohesive theme that ties multiple items together " +
  
  "2. LUXURY POSITIONING: " +
  "- Focus on premium materials like fine gold, silver, crystal, silk, leather, and exotic woods " +
  "- Emphasize handcrafted and artisanal qualities " +
  "- Mention elegant packaging and presentation " +
  "- Use sophisticated language that conveys exclusivity " +
  
  "3. CULTURAL RELEVANCE: " +
  "- For Indian occasions (like Diwali, Raksha Bandhan, etc.), incorporate culturally relevant elements " +
  "- Balance traditional values with contemporary aesthetics " +
  "- Consider regional preferences when mentioned " +
  
  "4. PERSONALIZATION: " +
  "- Suggest specific personalization options relevant to the selected gift " +
  "- Consider the relationship between gift-giver and recipient " +
  
  "5. RESPONSE FORMAT: " +
  "Provide your response in JSON format with these fields: " +
  "- name: Gift name from our inventory " +
  "- description: Detailed description " +
  "- price: Price in Indian Rupees (₹) " +
  "- personalizationOptions: List of personalization suggestions " +
  "- matchReason: Brief explanation of why this gift matches the criteria " +
  
  "Example JSON response structure: " +
  "{ " +
  "  \"name\": \"Heritage Artisan Rosewood Tea Chest\", " +
  "  \"description\": \"A masterfully crafted tea chest made from sustainably sourced rosewood, featuring intricate hand-carved motifs inspired by Mughal architecture. Lined with cedar and silk, it contains six compartments for premium single-estate teas housed in gold-infused glass containers.\", " +
  "  \"price\": \"₹24,500\", " +
  "  \"personalizationOptions\": [\"Engraved family crest on chest exterior\", \"Custom inlay work with initials\", \"Selection of recipient's favorite tea varieties\", \"Personalized brewing guide with recipient's name\"], " +
  "  \"matchReason\": \"This sophisticated piece perfectly suits your father's preference for elegant home items and wellness products, combining functionality with artistic craftsmanship while staying within your specified budget range.\" " +
  "} " +
  
  "Only return valid JSON that can be parsed. Do not include any explanatory text outside the JSON structure.";

// Types for gift recommendation data
export interface GiftFormData {
  occasion: string;
  recipient: string;
  budget: string;
  preferences: string;
  relationship?: string;
  recipientAge?: string;
  specialInstructions?: string;
}

export interface GiftRecommendation {
  name: string;
  description: string;
  price: string;
  personalizationOptions: string[];
  matchReason: string;
  imageUrl?: string;
}

/**
 * Generates AI gift recommendations based on user form data
 */
export async function getGiftRecommendation(formData: GiftFormData): Promise<GiftRecommendation> {
  if (!GEMINI_API_KEY) {
    console.error('ERROR: Cannot generate gift recommendation - Gemini API key is not set');
    return {
      name: "Luxury Gift Collection",
      description: "A carefully curated selection of premium items tailored to your specifications. This elegant gift combines refined aesthetics with practical luxury.",
      price: formData.budget.split(' - ')[0], // Use the lower end of the budget range
      personalizationOptions: ["Custom engraving", "Personalized message", "Gift wrapping"],
      matchReason: "Created based on your specific gift criteria.",
      imageUrl: '/gifts/default.jpg',
    };
  }

  try {
    // Enhanced prompt for the AI with more specific guidance
    const prompt = `Please recommend the perfect luxury gift from our inventory based on these criteria:
      Occasion: ${formData.occasion}
      Recipient: ${formData.recipient}
      Budget Range: ${formData.budget}
      Preferences: ${formData.preferences}
      ${formData.relationship ? `Relationship to Gift Giver: ${formData.relationship}` : ''}
      ${formData.recipientAge ? `Recipient Age Range: ${formData.recipientAge}` : ''}
      ${formData.specialInstructions ? `Special Requirements: ${formData.specialInstructions}` : ''}
      
      Remember to select an actual product from our inventory that best matches these criteria.
      Ensure the price falls within the specified budget range.
      Focus on how this gift would create a meaningful experience for this specific occasion and recipient.
    `;

    console.log('Sending gift recommendation request to Gemini:', formData.occasion, formData.recipient, formData.budget);
    
    // Send the prompt to the model with retry logic
    let result;
    let retries = 0;
    const maxRetries = 2;
    
    while (retries <= maxRetries) {
      try {
        result = await model.generateContent([GIFT_CONCIERGE_PROMPT, prompt]);
        break; // Success, exit the loop
      } catch (error) {
        retries++;
        console.error(`Attempt ${retries}/${maxRetries} failed:`, error);
        if (retries > maxRetries) throw error; // Re-throw if we've exhausted retries
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retrying
      }
    }
    
    if (!result) throw new Error('Failed to get response after retries');
    
    const response = result.response;
    const text = response.text();
    console.log('Received gift recommendation response. Length:', text.length);

    // Parse the JSON response from the AI with improved error handling
    try {
      // Clean the text to ensure it's valid JSON
      let cleanedText = text.trim();
      // Remove any markdown code block markers if present
      cleanedText = cleanedText.replace(/```json/g, '').replace(/```/g, '');
      // Remove any text before or after the JSON object
      const jsonStartIndex = cleanedText.indexOf('{');
      const jsonEndIndex = cleanedText.lastIndexOf('}') + 1;
      if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
        cleanedText = cleanedText.substring(jsonStartIndex, jsonEndIndex);
      }
      
      const recommendation = JSON.parse(cleanedText);
      
      // Validate the required fields
      if (!recommendation.name || !recommendation.description || 
          !recommendation.price || !recommendation.personalizationOptions || 
          !recommendation.matchReason) {
        throw new Error('Missing required fields in recommendation');
      }
      
      // Assign appropriate image based on occasion or gift type
      const occasion = formData.occasion.toLowerCase();
      const giftName = recommendation.name.toLowerCase();
      let imageUrl = '/gifts/default.jpg';
      
      if (occasion.includes('wedding') || giftName.includes('wedding')) {
        imageUrl = '/gifts/wedding.jpg';
      } else if (occasion.includes('diwali') || giftName.includes('diwali')) {
        imageUrl = '/gifts/diwali.jpg';
      } else if (occasion.includes('anniversary') || giftName.includes('anniversary')) {
        imageUrl = '/gifts/anniversary.jpg';
      } else if (occasion.includes('birthday') || giftName.includes('birthday')) {
        imageUrl = '/gifts/birthday.jpg';
      } else if (occasion.includes('corporate') || giftName.includes('corporate')) {
        imageUrl = '/gifts/corporate.jpg';
      } else if (giftName.includes('jewelry') || giftName.includes('jewellery') || 
                 giftName.includes('diamond') || giftName.includes('gold')) {
        imageUrl = '/gifts/jewelry.jpg';
      } else if (giftName.includes('home') || giftName.includes('décor') || 
                 giftName.includes('crystal') || giftName.includes('silver')) {
        imageUrl = '/gifts/decor.jpg';
      }
      
      console.log('Generated gift recommendation:', recommendation.name, 'for', formData.occasion);
      
      return {
        ...recommendation,
        imageUrl,
      };
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.log('Raw AI response:', text);
      
      // Enhanced fallback response based on the form data
      return generateFallbackRecommendation(formData);
    }
  } catch (error) {
    console.error('Error getting gift recommendation:', error);
    return generateFallbackRecommendation(formData);
  }
}

/**
 * Generates a fallback recommendation when the AI fails
 */
function generateFallbackRecommendation(formData: GiftFormData): GiftRecommendation {
  console.log('Using fallback gift recommendation for:', formData.occasion, formData.recipient);
  
  // Default fallback
  let fallback: GiftRecommendation = {
    name: "Luxury Gift Collection",
    description: "A carefully curated selection of premium items tailored to your specifications. This elegant gift combines refined aesthetics with practical luxury.",
    price: formData.budget,
    personalizationOptions: ["Custom engraving", "Personalized message", "Gift wrapping"],
    matchReason: "Created based on your specific gift criteria.",
    imageUrl: '/gifts/default.jpg',
  };
  
  // Try to provide a more specific fallback based on occasion and preferences
  const occasion = formData.occasion.toLowerCase();
  const preferences = formData.preferences.toLowerCase();
  
  if (occasion.includes('wedding')) {
    fallback = {
      name: "Royal Heritage Silver Collection",
      description: "An exquisite set of handcrafted silver items including a centerpiece bowl, serving tray, and candlesticks. Each piece features delicate filigree work by master silversmiths, representing prosperity and harmony.",
      price: formData.budget,
      personalizationOptions: ["Engraved names and wedding date", "Custom motifs based on couple's heritage", "Gift packaging with personalized message"],
      matchReason: "This timeless collection symbolizes the couple's new journey together while providing practical luxury items for their home.",
      imageUrl: '/gifts/wedding.jpg',
    };
  } else if (occasion.includes('diwali')) {
    fallback = {
      name: "Illumination Prosperity Hamper",
      description: "A luxurious Diwali gift set featuring handcrafted gold-plated diyas, premium dry fruits in embossed containers, gourmet sweets, and an artisanal incense collection, all presented in a silk-lined wooden chest.",
      price: formData.budget,
      personalizationOptions: ["Custom message on gift box", "Name engraving on diyas", "Selection of recipient's favorite sweets"],
      matchReason: "This hamper combines traditional Diwali elements with luxury presentation, perfect for celebrating the festival of lights.",
      imageUrl: '/gifts/diwali.jpg',
    };
  } else if (preferences.includes('jewelry') || preferences.includes('accessories')) {
    fallback = {
      name: "Celestial Elegance Diamond Pendant",
      description: "A stunning pendant featuring ethically-sourced diamonds set in 18K gold, designed in a celestial pattern that symbolizes eternal brilliance. Comes with a matching chain and presented in a handcrafted wooden jewelry box.",
      price: formData.budget,
      personalizationOptions: ["Engraved message on the back", "Choice of gold tone (yellow, rose, or white)", "Adjustable chain length"],
      matchReason: "This timeless piece combines sophisticated design with premium materials, making it perfect for special occasions and everyday elegance.",
      imageUrl: '/gifts/jewelry.jpg',
    };
  }
  
  return fallback;
} 