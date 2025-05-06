import React from 'react';
import { usePermissions } from '@/lib/usePermissions';
import { Permission as PermissionType } from '@/lib/roles';

interface PermissionProps {
  resource: string;
  action: PermissionType;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Permission component
 * 
 * Only renders its children if the current user has the specified permission
 * 
 * @example
 * <Permission resource="products" action="write">
 *   <Button>Add Product</Button>
 * </Permission>
 */
export function Permission({ 
  resource, 
  action, 
  fallback = null, 
  children 
}: PermissionProps) {
  const { hasPermission, loading, userRole } = usePermissions();
  
  // While loading permissions, don't render anything
  if (loading) {
    return null;
  }
  
  // STRICT ENFORCEMENT: Users can NEVER have write or delete access
  if (userRole === 'user' && (action === 'write' || action === 'delete')) {
    return <>{fallback}</>;
  }
  
  // Check if the user has the required permission
  if (hasPermission(resource, action)) {
    return <>{children}</>;
  }
  
  // If not, render the fallback or null
  return <>{fallback}</>;
}

/**
 * SuperAdminOnly component
 * 
 * Only renders its children if the current user is a super admin
 * 
 * @example
 * <SuperAdminOnly>
 *   <UserManagement />
 * </SuperAdminOnly>
 */
export function SuperAdminOnly({ 
  fallback = null, 
  children 
}: { 
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { isSuperAdmin, loading } = usePermissions();
  
  // While loading permissions, don't render anything
  if (loading) {
    return null;
  }
  
  // Check if the user is a super admin
  if (isSuperAdmin()) {
    return <>{children}</>;
  }
  
  // If not, render the fallback or null
  return <>{fallback}</>;
}

/**
 * AdminOnly component
 * 
 * Only renders its children if the current user is an admin or super admin
 * 
 * @example
 * <AdminOnly>
 *   <SettingsPanel />
 * </AdminOnly>
 */
export function AdminOnly({ 
  fallback = null, 
  children 
}: { 
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { isAdmin, loading, userRole } = usePermissions();
  
  // While loading permissions, don't render anything
  if (loading) {
    return null;
  }
  
  // STRICT ENFORCEMENT: Users are never admins
  if (userRole === 'user') {
    return <>{fallback}</>;
  }
  
  // Check if the user is an admin or super admin
  if (isAdmin()) {
    return <>{children}</>;
  }
  
  // If not, render the fallback or null
  return <>{fallback}</>;
} 