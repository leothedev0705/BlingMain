// Remove unused imports

// Get the session on the server side using the new auth object
export async function getSession() {
  const { auth } = await import('@/auth'); // Dynamically import auth here
  return await auth();
}

// Check if user is authenticated (server-side)
export async function isAuthenticated() {
  const { auth } = await import('@/auth'); // Dynamically import auth here
  const session = await auth();
  return !!session;
}

// Check if user has admin role (server-side)
export async function isAdmin() {
  const { auth } = await import('@/auth'); // Dynamically import auth here
  const session = await auth();
  return session?.user?.role === 'admin';
}

// Redirect if not authenticated (server-side) - This pattern might change with middleware in newer Next.js
export async function requireAuth(context) { 
  const { auth } = await import('@/auth'); // Dynamically import auth here
  const session = await auth();

  if (!session) {
    // In App Router, redirects are usually handled via middleware or the redirect() function
    // This pattern is more common in Pages Router getServerSideProps
    // Consider using middleware for route protection
    console.log("requireAuth: No session found, redirect needed (implement middleware or redirect())");
    // For now, just return null or throw an error, as this pattern isn't ideal here
    return null;
    // Example using Next.js redirect function (needs 'next/navigation')
    // import { redirect } from 'next/navigation';
    // redirect('/login');
  }

  return {
    props: {
      session,
    },
  };
}

// Client-side registration function
export async function registerUser(userData) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Registration failed');
  }

  return data;
} 