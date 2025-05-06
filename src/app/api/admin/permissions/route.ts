import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/lib/authMiddleware';
import { roles } from '@/lib/roles';

export async function GET(req: NextRequest) {
  try {
    // Get the user's session
    const session = await getUserSession(req);
    
    if (!session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get the role definition for this user
    const userRole = session.user.role;
    const roleDefinition = roles.find(r => r.name === userRole);
    
    if (!roleDefinition) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }
    
    // For admin roles, include password requirement information
    const isAdminRole = userRole === 'admin' || userRole === 'super_admin';
    
    return NextResponse.json({
      role: roleDefinition.name,
      description: roleDefinition.description,
      permissions: roleDefinition.permissions,
      requiresAuth: isAdminRole
    });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch permissions' },
      { status: 500 }
    );
  }
} 