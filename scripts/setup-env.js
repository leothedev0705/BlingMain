const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create interface for reading input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Path to .env file
const envPath = path.resolve(process.cwd(), '.env');

// Check if .env file exists
const envExists = fs.existsSync(envPath);

// Ask for API key
console.log('Bling×Beyond Chatbot Setup');
console.log('--------------------------');
console.log('This script will help you set up your Gemini API key for the chatbot.');
console.log('You can get a Gemini API key from: https://ai.google.dev/');
console.log('--------------------------\n');

// Ask for API key
rl.question('Enter your Gemini API key: ', (apiKey) => {
  if (!apiKey.trim()) {
    console.error('Error: API key cannot be empty.');
    rl.close();
    return;
  }

  // Create or update .env file
  const envContent = `GEMINI_API_KEY=${apiKey.trim()}\n`;
  
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\nSuccess! Your API key has been saved to .env');
    console.log('You can now run the chatbot with:');
    console.log('  npm run dev');
    console.log('\nTo test the API connection, run:');
    console.log('  npm run test:gemini');
  } catch (error) {
    console.error('Error saving API key:', error.message);
  }
  
  rl.close();
}); 