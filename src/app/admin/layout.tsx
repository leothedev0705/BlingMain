'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { AdminOnly, SuperAdminOnly, Permission } from '@/components/Permission';
import RoleSelector from '@/components/RoleSelector';
import { usePermissions } from '@/lib/usePermissions';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const { userRole, loading } = usePermissions();

  // Set isMounted to true when component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Skip authentication if on the login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Show loading state before client-side code runs
  if (!isMounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gold border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      </div>
    );
  }

  // For development purposes, we'll bypass auth checks
  // In production, uncomment the following block
  /*
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gold border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
    return null;
  }

  // Check if user has admin role
  if (!['admin', 'super_admin'].includes(userRole)) {
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
    return null;
  }
  */

  // Sidebar navigation items with permission requirements
  const navItems = [
    { 
      path: '/admin/dashboard', 
      label: 'Dashboard', 
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      resource: 'products',
      action: 'read' as const
    },
    { 
      path: '/admin/products', 
      label: 'Products', 
      icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
      resource: 'products',
      action: 'read' as const
    },
    { 
      path: '/admin/collections', 
      label: 'Collections', 
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      resource: 'collections',
      action: 'read' as const
    },
    { 
      path: '/admin/banners', 
      label: 'Banners & Offers', 
      icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
      resource: 'banners',
      action: 'read' as const
    },
    { 
      path: '/admin/faq', 
      label: 'FAQ Management', 
      icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      resource: 'faqs',
      action: 'read' as const
    },
    { 
      path: '/admin/about', 
      label: 'About Section', 
      icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      resource: 'brand',
      action: 'read' as const
    },
    { 
      path: '/admin/settings', 
      label: 'Settings', 
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      resource: 'settings',
      action: 'read' as const
    },
    { 
      path: '/admin/users', 
      label: 'User Management', 
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      resource: 'users',
      action: 'read' as const,
      adminOnly: true
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside 
        className={`
          bg-charcoal text-white w-64 flex-shrink-0 transition-all duration-300 transform
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          fixed inset-y-0 z-30 md:relative md:translate-x-0
        `}
      >
        <div className="p-6 flex items-center border-b border-white/10">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold font-playfair">
              Bling<span className="text-gold">x</span>Beyond
            </span>
            <span className="ml-2 text-xs bg-gold text-white px-2 py-0.5 rounded">CMS</span>
          </Link>
        </div>

        <nav className="mt-6 px-3">
          {navItems.map((item) => (
            <Permission
              key={item.path}
              resource={item.resource}
              action={item.action}
            >
              {item.adminOnly ? (
                <AdminOnly>
                  <Link
                    href={item.path}
                    className={`
                      flex items-center px-4 py-3 rounded-lg mt-1 transition-colors
                      ${pathname === item.path ? 'bg-white/10 text-gold' : 'hover:bg-white/5'}
                    `}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 mr-3"
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                    </svg>
                    <span>{item.label}</span>
                  </Link>
                </AdminOnly>
              ) : (
                <Link
                  href={item.path}
                  className={`
                    flex items-center px-4 py-3 rounded-lg mt-1 transition-colors
                    ${pathname === item.path ? 'bg-white/10 text-gold' : 'hover:bg-white/5'}
                  `}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-3"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                  <span>{item.label}</span>
                </Link>
              )}
            </Permission>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-charcoal font-medium">
              {session?.user?.name?.charAt(0).toUpperCase() || userRole.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium truncate">{session?.user?.name || (userRole === 'super_admin' ? 'Super Admin' : userRole === 'admin' ? 'Admin' : 'User')}</p>
              <p className="text-xs text-white/60 truncate">{session?.user?.email || 'role: ' + userRole}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Top navigation */}
        <header className="bg-white shadow-sm z-20 relative">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              className="md:hidden text-charcoal"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isSidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            
            <div className="text-sm text-charcoal/70">
              {pathname.split('/').map((segment, i, arr) => (
                <span key={i}>
                  {i > 0 && <span className="mx-2 text-charcoal/40">/</span>}
                  <span className={i === arr.length - 1 ? 'font-medium text-charcoal' : ''}>
                    {segment || 'Admin'}
                  </span>
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              {userRole === 'user' && (
                <div className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
                  View Only Mode
                </div>
              )}
              <Link 
                href="/"
                className="text-charcoal/70 hover:text-charcoal transition-colors"
                target="_blank"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
              <button className="text-charcoal/70 hover:text-charcoal transition-colors">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* View-only banner for users */}
        {userRole === 'user' && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 m-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">View-Only Mode</h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p>
                    You are currently in view-only mode. All edit buttons and functions are disabled.
                    To make changes, please switch to an admin role with appropriate permissions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>

        {/* Role selector for development purposes */}
        {process.env.NODE_ENV !== 'production' && <RoleSelector />}
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
} 