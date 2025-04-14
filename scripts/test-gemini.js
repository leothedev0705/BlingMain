// Load environment variables from .env file
require('dotenv').config();

// Import Google Generative AI SDK
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Function to test the Gemini API
async function testGeminiAPI() {
  try {
    // Get API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('Error: GEMINI_API_KEY environment variable is not set.');
      process.exit(1);
    }

    console.log('API Key:', apiKey.substring(0, 8) + '...[rest hidden]');
    
    // Initialize the Generative AI with your API key
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Get the model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    console.log('Sending test message to Gemini 1.5 Flash...');
    
    // Generate a response
    const prompt = 'Hello! I want to test the Gemini API integration for Bling×Beyond website. Please respond with a short greeting.';
    console.log('Prompt:', prompt);
    
    const result = await model.generateContent(prompt);
    
    // Get the response text
    const response = result.response;
    const text = response.text();
    
    console.log('Response from Gemini API:');
    console.log('--------------------------');
    console.log(text);
    console.log('--------------------------');
    console.log('API integration test completed successfully!');
    
  } catch (error) {
    console.error('Error testing Gemini API:');
    console.error(error.message);
    if (error.stack) {
      console.error('Stack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run the test
testGeminiAPI(); 