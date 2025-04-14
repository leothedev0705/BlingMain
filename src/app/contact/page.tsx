import Header from '../../components/Header';
import Link from 'next/link';
import Footer from '../../components/Footer';

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-ivory">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-charcoal silk-texture">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-ivory mb-4 font-playfair">Get in Touch</h1>
              <p className="text-lg text-ivory/90">
                We'd love to hear from you. Reach out for personalized gifting solutions or any inquiries.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 bg-ivory">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-charcoal mb-6 font-playfair">Send Us a Message</h2>
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-charcoal mb-1">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full gold-gradient text-charcoal font-medium py-2 px-4 rounded-md hover:shadow-lg transition-all duration-300"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-charcoal mb-6 font-playfair">Contact Information</h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium text-charcoal mb-2">Reach Us</h3>
                    <p className="text-charcoal/80 mb-1">
                      <span className="font-medium">Phone:</span> +91 98765 43210
                    </p>
                    <p className="text-charcoal/80 mb-1">
                      <span className="font-medium">Email:</span> info@blingxbeyond.com
                    </p>
                    <p className="text-charcoal/80">
                      <span className="font-medium">Instagram:</span> @blingxbeyond
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-charcoal mb-2">Business Hours</h3>
                    <p className="text-charcoal/80 mb-1">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-charcoal/80">Saturday: 10:00 AM - 4:00 PM</p>
                  </div>

                  <div className="p-6 bg-blush/10 rounded-xl border border-blush/20">
                    <h3 className="text-lg font-medium text-charcoal mb-2">Need Personalized Gifts?</h3>
                    <p className="text-charcoal/80 mb-4">
                      Call us at +91 98765 43210 or DM us at @blingxbeyond on Instagram for exclusive personalized gifting solutions.
                    </p>
                    <Link
                      href="https://www.instagram.com/blingxbeyond"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blush hover:text-blush/80 transition-colors"
                    >
                      Follow us on Instagram
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
} 