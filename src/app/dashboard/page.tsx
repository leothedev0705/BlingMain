'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type StatsData = {
  collections: number;
  products: number;
  media: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData>({
    collections: 0,
    products: 0,
    media: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app, this would fetch from an API
        const response = await fetch('/api/products');
        const data = await response.json();
        
        setStats({
          collections: data.collections.length,
          products: data.products.length,
          media: data.products.reduce((total: number, product: any) => total + product.images.length, 0),
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Fallback to local import
        import('@/data/products.json')
          .then((module) => {
            const data = module.default;
            setStats({
              collections: data.collections.length,
              products: data.products.length,
              media: data.products.reduce((total: number, product: any) => total + product.images.length, 0),
            });
          })
          .catch((err) => {
            console.error('Failed to load local data:', err);
          });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    {
      title: 'Add New Collection',
      description: 'Create a new collection for your products',
      icon: 'M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z',
      link: '/dashboard/collections/new',
      color: 'bg-blue-50 text-blue-700',
    },
    {
      title: 'Add New Product',
      description: 'Add a new product to your inventory',
      icon: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z',
      link: '/dashboard/products/new',
      color: 'bg-green-50 text-green-700',
    },
    {
      title: 'Upload Media',
      description: 'Add new images to your media library',
      icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12',
      link: '/dashboard/media',
      color: 'bg-purple-50 text-purple-700',
    },
    {
      title: 'Use Gift Concierge',
      description: 'Access the gift concierge settings',
      icon: 'M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11',
      link: '/dashboard/settings/concierge',
      color: 'bg-amber-50 text-amber-700',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-charcoal mb-6">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: 'Collections',
            value: stats.collections,
            icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
            color: 'bg-blue-500',
          },
          {
            title: 'Products',
            value: stats.products,
            icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
            color: 'bg-green-500',
          },
          {
            title: 'Media Items',
            value: stats.media,
            icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
            color: 'bg-purple-500',
          },
          {
            title: 'Storage Used',
            value: '12.4 MB',
            icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2',
            color: 'bg-amber-500',
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm p-6 flex items-center"
          >
            <div className={`${stat.color} h-12 w-12 rounded-full flex items-center justify-center text-white`}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm text-charcoal/70 font-medium">{stat.title}</h2>
              <p className="text-2xl font-bold text-charcoal">
                {loading ? (
                  <span className="inline-block h-6 w-16 bg-gray-200 animate-pulse rounded"></span>
                ) : (
                  stat.value
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-bold text-charcoal mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            href={action.link}
            className="block bg-white rounded-lg shadow-sm p-6 hover:shadow transition-shadow"
          >
            <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mb-4`}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-charcoal mb-1">{action.title}</h3>
            <p className="text-sm text-charcoal/70">{action.description}</p>
          </Link>
        ))}
      </div>

      {/* Recent Updates */}
      <h2 className="text-xl font-bold text-charcoal mb-4">Recent Activity</h2>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-charcoal">Latest Updates</h3>
            <Link href="/dashboard/activity" className="text-sm text-gold hover:text-gold/80 transition-colors">
              View All
            </Link>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            {
              action: 'Added new product',
              target: 'Diamond Tennis Bracelet',
              user: 'Admin',
              time: '2 hours ago',
              icon: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z',
              color: 'bg-green-100 text-green-600',
            },
            {
              action: 'Updated collection',
              target: 'Luxury Gifts',
              user: 'Admin',
              time: '1 day ago',
              icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
              color: 'bg-blue-100 text-blue-600',
            },
            {
              action: 'Uploaded new images',
              target: 'Media Library',
              user: 'Admin',
              time: '2 days ago',
              icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
              color: 'bg-purple-100 text-purple-600',
            },
          ].map((activity, index) => (
            <div key={index} className="flex items-start p-4">
              <div className={`${activity.color} h-8 w-8 rounded-full flex items-center justify-center mt-1`}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={activity.icon} />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-charcoal font-medium">
                  {activity.action} <span className="font-bold">{activity.target}</span>
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-charcoal/60">{activity.user}</span>
                  <span className="mx-1 text-charcoal/40">•</span>
                  <span className="text-xs text-charcoal/60">{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 