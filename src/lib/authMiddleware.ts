import { NextRequest, NextResponse } from 'next/server';
import { hasPermission, Permission } from './roles';

export interface UserData {
  id: string;
  email: string;
  role: string;
  password?: string;
}

export interface UserSession {
  user: UserData | null;
}

// Dummy function to get user session
// In a real application, this would verify the JWT token or session cookie
export async function getUserSession(req: NextRequest): Promise<UserSession> {
  // For development purposes, we'll use a header to simulate different roles
  const role = req.headers.get('x-user-role') || 'user';
  
  // Add dummy passwords based on roles
  let userData: UserData = {
    id: 'user-123',
    email: 'user@example.com',
    role: role
  };
  
  // For admin/super_admin, add password (in real app this would come from DB)
  if (role === 'admin' || role === 'super_admin') {
    userData = {
      ...userData,
      password: '12345' // Dummy password for admins
    };
  }
  
  return {
    user: userData
  };
}

export async function checkPermission(
  req: NextRequest,
  resource: string,
  action: Permission
): Promise<{ allowed: boolean; session: UserSession }> {
  // Get user session
  const session = await getUserSession(req);
  
  if (!session.user) {
    return { allowed: false, session };
  }
  
  // Strict enforcement of role permissions:
  
  // 1. User role can ONLY have read access, never write or delete
  if (session.user.role === 'user' && (action === 'write' || action === 'delete')) {
    return { allowed: false, session };
  }
  
  // 2. Admin role can have read/write/delete on non-sensitive resources
  if (session.user.role === 'admin' && (action === 'write' || action === 'delete')) {
    // Check if it's a sensitive resource - if yes, deny access
    if (resource === 'users' || resource === 'roles') {
      return { allowed: false, session };
    }
  }
  
  // 3. Super admin has access to everything (checked via hasPermission)
  
  // Check if user has permission for this action on this resource based on role definition
  const allowed = hasPermission(session.user.role, resource, action);
  
  return { allowed, session };
}

export function createAuthMiddleware(resource: string, action: Permission) {
  return async function authMiddleware(req: NextRequest) {
    // Skip auth check for GET requests to public endpoints
    if (req.method === 'GET' && action === 'read' && !req.url.includes('/api/admin')) {
      return { success: true, session: await getUserSession(req) };
    }
    
    const { allowed, session } = await checkPermission(req, resource, action);
    
    if (!allowed) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    // Return session data instead of calling NextResponse.next()
    return { 
      success: true, 
      session,
      headers: {
        'x-user-id': session.user?.id || '',
        'x-user-role': session.user?.role || ''
      } 
    };
  };
} 