'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl: '/admin/dashboard',
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/admin/dashboard');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBypass = () => {
    // This is a temporary bypass for development purposes
    router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold font-playfair text-charcoal">
              Bling<span className="text-red-500">x</span>Beyond
            </span>
          </Link>
          <Link href="/" className="text-sm text-charcoal hover:text-gold transition-colors">
            Back to Website
          </Link>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-charcoal p-6 text-center">
            <h1 className="text-2xl font-bold text-ivory font-playfair">
              Admin <span className="text-gold">CMS</span> Login
            </h1>
            <p className="text-ivory/80 mt-2 text-sm">
              Access your admin dashboard to manage your content
            </p>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-charcoal/80 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="Admin email address"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-charcoal/80 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="Admin password"
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-charcoal text-ivory font-medium rounded-md hover:bg-charcoal/90 transition-colors disabled:opacity-70"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-xs text-gray-500">OR</span>
                </div>
              </div>
              
              <button
                onClick={handleBypass}
                className="mt-2 py-2 px-4 w-full bg-gold text-white font-medium rounded-md hover:bg-gold/90 transition-colors"
              >
                Bypass Login (Development Only)
              </button>
              
              <p className="mt-4 text-xs text-gray-500">
                Note: The bypass option is for development purposes only and should be removed in production.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 