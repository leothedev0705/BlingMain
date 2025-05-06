import { useEffect, useState } from 'react';
import { Permission } from './roles';

interface AuthState {
  userRole: string;
  isAuthenticated: boolean;
  isPasswordVerified: boolean;
}

// This would normally come from a session or auth provider
// For demonstration, we're using localStorage
export function getUserAuth(): AuthState {
  if (typeof window !== 'undefined') {
    return {
      userRole: localStorage.getItem('userRole') || 'user',
      isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
      isPasswordVerified: localStorage.getItem('isPasswordVerified') === 'true'
    };
  }
  return {
    userRole: 'user',
    isAuthenticated: false,
    isPasswordVerified: false
  };
}

export function setUserRole(role: string, password?: string): boolean {
  if (typeof window !== 'undefined') {
    // For admin and super_admin roles, verify password
    if ((role === 'admin' || role === 'super_admin') && password !== '12345') {
      // Password incorrect
      localStorage.setItem('userRole', 'user');
      localStorage.setItem('isAuthenticated', 'false');
      localStorage.setItem('isPasswordVerified', 'false');
      return false;
    }
    
    localStorage.setItem('userRole', role);
    localStorage.setItem('isAuthenticated', 'true');
    
    // Set password verified state for admin roles
    if (role === 'admin' || role === 'super_admin') {
      localStorage.setItem('isPasswordVerified', 'true');
    } else {
      localStorage.setItem('isPasswordVerified', 'false');
    }
    
    return true;
  }
  return false;
}

// Hook to fetch and cache permissions
export function usePermissions() {
  const [permissions, setPermissions] = useState<Record<string, Permission[]>>({});
  const [loading, setLoading] = useState(true);
  const [authState, setAuthState] = useState<AuthState>({
    userRole: 'user',
    isAuthenticated: false,
    isPasswordVerified: false
  });

  // Fetch permissions for current user
  useEffect(() => {
    const auth = getUserAuth();
    setAuthState(auth);
    
    async function fetchPermissions() {
      try {
        const response = await fetch('/api/admin/permissions', {
          headers: {
            'x-user-role': auth.userRole
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setPermissions(data.permissions || {});
        } else {
          console.error('Failed to fetch permissions');
        }
      } catch (error) {
        console.error('Error fetching permissions:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPermissions();
  }, []);

  // Check if user has a specific permission
  const hasPermission = (resource: string, action: Permission): boolean => {
    // For write/delete operations, require password verification for admin roles
    if ((action === 'write' || action === 'delete') && 
        (authState.userRole === 'admin' || authState.userRole === 'super_admin') && 
        !authState.isPasswordVerified) {
      return false;
    }
    
    if (!permissions[resource]) return false;
    return permissions[resource].includes(action);
  };

  // Check if user is at least an admin (for UI elements)
  const isAdmin = (): boolean => {
    return ['admin', 'super_admin'].includes(authState.userRole) && authState.isPasswordVerified;
  };

  // Check if user is a super admin (for sensitive areas)
  const isSuperAdmin = (): boolean => {
    return authState.userRole === 'super_admin' && authState.isPasswordVerified;
  };

  // Verify admin password
  const verifyPassword = (password: string): boolean => {
    if (password === '12345') {
      localStorage.setItem('isPasswordVerified', 'true');
      setAuthState(prev => ({ ...prev, isPasswordVerified: true }));
      return true;
    }
    return false;
  };

  return {
    permissions,
    loading,
    userRole: authState.userRole,
    isAuthenticated: authState.isAuthenticated,
    isPasswordVerified: authState.isPasswordVerified,
    hasPermission,
    isAdmin,
    isSuperAdmin,
    verifyPassword,
    setRole: (role: string, password?: string) => {
      const success = setUserRole(role, password);
      if (success) {
        const newAuthState = getUserAuth();
        setAuthState(newAuthState);
      }
      return success;
    }
  };
} 