import Header from '../../components/Header';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Footer from '../../components/Footer';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-ivory">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-charcoal silk-texture">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-ivory mb-4 font-playfair">Our Story</h1>
              <p className="text-lg text-ivory/90">
                Redefining luxury gifting with innovation, elegance, and personal touch
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-ivory">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-charcoal mb-6 font-playfair">Our Mission</h2>
              <p className="text-lg text-charcoal/80 mb-8">
                At BlingxBeyond, we believe that a thoughtful gift is more than just an object—it's an expression of emotions, a celebration of relationships, and a memory to cherish. Our mission is to transform gifting into an art form, curating exceptional experiences that resonate with both the giver and the receiver.
              </p>
              <div className="h-1 w-24 bg-gold mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center">
                <div className="w-16 h-16 bg-blush/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blush" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-3">Innovation</h3>
                <p className="text-charcoal/70">
                  We constantly push boundaries to bring fresh, creative gifting solutions that surprise and delight.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-3">Excellence</h3>
                <p className="text-charcoal/70">
                  We uphold the highest standards in every aspect, from product quality to customer experience.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center">
                <div className="w-16 h-16 bg-rich-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rich-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-3">Connection</h3>
                <p className="text-charcoal/70">
                  We believe in creating meaningful moments that strengthen bonds and celebrate relationships.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Journey */}
        <section className="py-16 bg-charcoal/5">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-charcoal mb-10 font-playfair text-center">Our Journey</h2>
              
              <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gold/50 before:to-transparent">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gold bg-ivory text-charcoal shrink-0 md:mx-auto">
                    2019
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold text-charcoal mb-2">The Beginning</h3>
                    <p className="text-charcoal/70">
                      Founded with a vision to transform the art of gifting, BlingxBeyond started as a boutique service for close friends and family.
                    </p>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gold bg-ivory text-charcoal shrink-0 md:mx-auto">
                    2020
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold text-charcoal mb-2">Expanding Horizons</h3>
                    <p className="text-charcoal/70">
                      We expanded our offerings to include corporate gifting and wedding collections, establishing partnerships with premium artisans.
                    </p>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gold bg-ivory text-charcoal shrink-0 md:mx-auto">
                    2022
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold text-charcoal mb-2">Innovation & Technology</h3>
                    <p className="text-charcoal/70">
                      Launched our AI-powered Gift Concierge service, revolutionizing personalized gifting with technology-driven recommendations.
                    </p>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gold bg-ivory text-charcoal shrink-0 md:mx-auto">
                    Now
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold text-charcoal mb-2">Present Day</h3>
                    <p className="text-charcoal/70">
                      Today, we serve clients across the globe, curating exceptional gifting experiences that blend tradition with contemporary aesthetics.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-charcoal silk-texture">
          <div className="container mx-auto px-4 md:px-6">
            <div className="bg-ivory/5 backdrop-blur-sm border border-gold/20 rounded-2xl p-8 md:p-12 max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-ivory mb-4 font-playfair">Need Personalized Gifts?</h2>
              <p className="text-lg text-ivory/90 mb-8">
                Call us at +91 98765 43210 or DM us at @blingxbeyond on Instagram for exclusive personalized gifting solutions.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="magnetic-button gold-gradient inline-flex items-center justify-center px-6 py-3 text-charcoal font-medium rounded-md hover:shadow-lg transition-all duration-300"
                >
                  Contact Us
                </Link>
                <Link
                  href="https://www.instagram.com/blingxbeyond"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="magnetic-button inline-flex items-center justify-center px-6 py-3 bg-transparent border border-gold text-ivory font-medium rounded-md hover:bg-gold/10 transition-all duration-300"
                >
                  Follow on Instagram
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
} 