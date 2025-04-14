# BlingxBeyond - Luxury Gifting Experience

BlingxBeyond is a premium gifting brand based in India, specializing in creating elegant, unforgettable gift experiences for high-net-worth individuals, weddings, festive occasions, and corporate gifting.

## 🌟 Features

- **Luxury Product Showcase**: Elegant product displays with hover animations and cinematic visuals
- **AI-Powered Gift Concierge**: Personalized gift recommendations based on occasion, recipient, budget, and preferences
- **Responsive Design**: Beautiful layouts optimized for all devices
- **Premium UX**: Smooth animations, transitions, and micro-interactions for a luxurious feel

## 🚀 Technology Stack

- **Frontend**: Next.js + Tailwind CSS + ShadCN UI
- **UI Components**: ShadCN UI for elegant, customizable components
- **Animations**: Framer Motion for sophisticated animations and transitions
- **Image Handling**: next/image + WebP for optimized high-resolution visuals
- **Hosting**: Vercel for fast deployments and automatic image/CDN optimization

## 🎨 Design Elements

- **Color Palette**: Ivory, Charcoal, Blush Pink, Gold, Rich Green
- **Typography**: Playfair Display for headings, Inter for body text
- **Textures**: Silk backgrounds, gift paper pattern overlays
- **Icons**: Lucide or custom line-drawn icons

## 🧰 Development Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/blingxbeyond.git
   cd blingxbeyond
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📋 Project Structure

- `/src/app`: Next.js app router pages and layout
- `/src/components`: Reusable UI components
- `/src/lib`: Utility functions and shared code
- `/src/data`: JSON data files for products and content
- `/public`: Static assets like images

## 🏗️ Key Pages

1. **Landing Page / Home**: Hero section with cinematic product showcase and CTAs
2. **Shop / Gifting Categories**: Collection cards with hover effects and filtering
3. **Product Pages**: Image galleries with Framer Motion animations
4. **Gift Concierge**: AI-powered gift recommendation system
5. **About / Craftsmanship**: Storytelling with scroll-triggered animations

## 📱 Responsive Design

The site is fully responsive with optimized layouts for:
- Mobile devices
- Tablets
- Desktop computers

## 📝 License

This project is proprietary and owned by BlingxBeyond.

# Bling×Beyond Chatbot

An AI-powered chatbot for the Bling×Beyond website that helps users navigate the site and find information about products and services.

## Features

- Interactive chat interface
- Powered by Google's Gemini 1.5 Flash model
- Quick responses to common navigation questions
- Conversation history and context awareness
- Error handling and recovery

## Setup

### Prerequisites

- Node.js (v14 or higher)
- Gemini API key (get one from [Google AI Studio](https://ai.google.dev/))

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd [repository-name]
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment:

```bash
npm run setup
```

Follow the prompts to enter your Gemini API key. This will create a `.env` file with your API key.

### Testing the API Connection

To verify your API key is working correctly, run:

```bash
npm run test:gemini
```

This will send a test message to the Gemini API and display the response.

## Development

To run the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the website with the chatbot.

## Production

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Usage

The chatbot appears as a chat bubble in the bottom right corner of the website. Users can:

- Click the bubble to open the chat window
- Type questions or navigational queries in the input field
- Click the clear button to reset the conversation
- Close the chat by clicking the X button or clicking outside the chat window

## Customization

### Chatbot Appearance

The chatbot appearance can be customized in `src/components/ui/ChatBot.tsx`.

### AI Responses

To modify how the chatbot responds, edit the `src/utils/chatUtils.ts` file:

- Adjust predefined responses in the `navigationResponses` object
- Modify the system prompt in the `SYSTEM_PROMPT` constant
- Adjust the model parameters in the `model` configuration

## Troubleshooting

If you encounter issues:

1. Verify your API key is correct in the `.env` file
2. Make sure you've installed all dependencies with `npm install`
3. Check the browser console for any error messages
4. Run `npm run test:gemini` to test the API connection

## License

[MIT License](LICENSE) 