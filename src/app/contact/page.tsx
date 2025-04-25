'use client';

import Header from '../../components/Header';
import Link from 'next/link';
import Footer from '../../components/Footer';
import { useState, FormEvent, useRef } from 'react';

interface FormStatus {
  submitting: boolean;
  submitted: boolean;
  error: string | null;
}

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<FormStatus>({
    submitting: false,
    submitted: false,
    error: null
  });
  
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submission started');
    setFormStatus({ submitting: true, submitted: false, error: null });

    const formData = new FormData(e.currentTarget);
    
    // Log form data for debugging
    console.log('Form data:', {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    });
    
    try {
      // Create a hidden iframe for submission
      const iframe = document.createElement('iframe');
      iframe.name = 'hidden-iframe';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      // Create the form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://docs.google.com/forms/d/e/1FAIpQLSedvpyQ6FWv2393FlOVKIOru4P1GQCgkVBbDnZdCUzQ3PZOUA/formResponse';
      form.target = 'hidden-iframe';
      form.style.display = 'none';

      // Add form fields
      const entries = {
        'entry.932374030': formData.get('name')?.toString() || '',
        'entry.1445859178': formData.get('email')?.toString() || '',
        'entry.647094820': formData.get('message')?.toString() || ''
      };

      Object.entries(entries).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'text';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      // Add form to body and submit
      document.body.appendChild(form);
      form.submit();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(form);
        document.body.removeChild(iframe);
      }, 1000);

      console.log('Form submitted successfully');
      setFormStatus({
        submitting: false,
        submitted: true,
        error: null
      });

      // Reset form
      e.currentTarget.reset();

      // Reset form status after 5 seconds
      setTimeout(() => {
        setFormStatus({
          submitting: false,
          submitted: false,
          error: null
        });
      }, 5000);

    } catch (error) {
      console.error('Form submission error:', error);
      setFormStatus({
        submitting: false,
        submitted: false,
        error: 'Failed to submit form. Please try again.'
      });
    }
  };

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
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
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
                      required
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
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={formStatus.submitting}
                    className={`w-full gold-gradient text-charcoal font-medium py-2 px-4 rounded-md transition-all duration-300 ${
                      formStatus.submitting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                    }`}
                  >
                    {formStatus.submitting ? 'Sending...' : 'Send Message'}
                  </button>
                  
                  {formStatus.submitted && (
                    <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
                      Thank you for your message! We'll get back to you soon.
                    </div>
                  )}
                  
                  {formStatus.error && (
                    <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
                      {formStatus.error}
                    </div>
                  )}
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