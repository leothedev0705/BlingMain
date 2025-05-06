import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createAuthMiddleware } from '@/lib/authMiddleware';

// Local file path for users data
const dataFilePath = path.join(process.cwd(), 'src/data/users.json');
const dataDirectory = path.dirname(dataFilePath);

// Helper function to read users data
async function getUsersData() {
  try {
    // Ensure the data directory exists
    if (!fs.existsSync(dataDirectory)) {
      fs.mkdirSync(dataDirectory, { recursive: true });
    }
    
    const fileContents = await fs.promises.readFile(dataFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading users data:', error);
    // If the file doesn't exist, create an empty structure with a default admin
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      const emptyData = { 
        users: [
          {
            id: 'user-1',
            name: 'Admin User',
            email: 'admin@blingxbeyond.com',
            password: '12345', // Default dummy password
            role: 'super_admin',
            createdAt: new Date().toISOString()
          },
          {
            id: 'user-2',
            name: 'Regular Admin',
            email: 'regularadmin@blingxbeyond.com',
            password: '12345', // Default dummy password
            role: 'admin',
            createdAt: new Date().toISOString()
          },
          {
            id: 'user-3',
            name: 'View Only User',
            email: 'user@blingxbeyond.com',
            role: 'user',
            createdAt: new Date().toISOString()
          }
        ]
      };
      await fs.promises.writeFile(dataFilePath, JSON.stringify(emptyData, null, 2), 'utf8');
      return emptyData;
    }
    return { users: [] };
  }
}

// Helper function to write users data
async function writeUsersData(data: any) {
  try {
    // Ensure the data directory exists
    if (!fs.existsSync(dataDirectory)) {
      fs.mkdirSync(dataDirectory, { recursive: true });
    }
    
    await fs.promises.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing users data:', error);
    return false;
  }
}

// Auth middleware - only allow access to users with appropriate permissions
const usersReadMiddleware = createAuthMiddleware('users', 'read');
const usersWriteMiddleware = createAuthMiddleware('users', 'write');
const usersDeleteMiddleware = createAuthMiddleware('users', 'delete');

// GET handler - Fetch all users
export async function GET(req: NextRequest) {
  try {
    // Check permissions
    const authResult = await usersReadMiddleware(req);
    
    // If auth failed and returned a NextResponse, return it
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const data = await getUsersData();
    
    // For safety, never return password hashes or other sensitive data
    const sanitizedUsers = data.users.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }));
    
    return NextResponse.json({ users: sanitizedUsers });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST handler - Add a new user
export async function POST(req: NextRequest) {
  try {
    // Check permissions
    const authResult = await usersWriteMiddleware(req);
    
    // If auth failed and returned a NextResponse, return it
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    // Only super_admin can add new admin users
    if (authResult.session.user?.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Only super admins can add users' },
        { status: 403 }
      );
    }

    const newUser = await req.json();

    // Validate required fields
    if (!newUser.name || !newUser.email || !newUser.role) {
      return NextResponse.json(
        { error: 'Name, email, and role are required fields' },
        { status: 400 }
      );
    }

    // Generate ID if not provided
    if (!newUser.id) {
      newUser.id = `user-${Date.now()}`;
    }

    // Add password for admin/super_admin users
    if ((newUser.role === 'admin' || newUser.role === 'super_admin') && !newUser.password) {
      newUser.password = '12345'; // Default dummy password
    }

    // Add createdAt timestamp
    newUser.createdAt = new Date().toISOString();

    // Get current data
    const data = await getUsersData();
    
    // Check if email already exists
    if (data.users.some((u: any) => u.email === newUser.email)) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 400 }
      );
    }
    
    // Add user to data
    data.users.push(newUser);

    // Write updated data
    const success = await writeUsersData(data);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save user' },
        { status: 500 }
      );
    }

    // For response, only return non-sensitive user data
    const sanitizedUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt
    };

    return NextResponse.json(
      { message: 'User added successfully', user: sanitizedUser },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Failed to add user' },
      { status: 500 }
    );
  }
}

// PUT handler - Update user
export async function PUT(req: NextRequest) {
  try {
    // Check permissions
    const authResult = await usersWriteMiddleware(req);
    
    // If auth failed and returned a NextResponse, return it
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    // Only super_admin can modify users
    if (authResult.session.user?.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Only super admins can modify users' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const updatedUser = await req.json();

    // Get current data
    const data = await getUsersData();
    
    // Find user index
    const userIndex = data.users.findIndex((u: any) => u.id === id);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if updating to an existing email
    if (
      updatedUser.email && 
      updatedUser.email !== data.users[userIndex].email &&
      data.users.some((u: any) => u.email === updatedUser.email)
    ) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 400 }
      );
    }

    // Add password for admin/super_admin if role is being changed
    if (updatedUser.role && 
        (updatedUser.role === 'admin' || updatedUser.role === 'super_admin') && 
        data.users[userIndex].role === 'user') {
      updatedUser.password = updatedUser.password || '12345'; // Default dummy password if not provided
    }

    // Update user
    data.users[userIndex] = {
      ...data.users[userIndex],
      ...updatedUser,
      id: id // Ensure ID doesn't change
    };

    // Write updated data
    const success = await writeUsersData(data);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }

    // For response, only return non-sensitive user data
    const sanitizedUser = {
      id: data.users[userIndex].id,
      name: data.users[userIndex].name,
      email: data.users[userIndex].email,
      role: data.users[userIndex].role,
      createdAt: data.users[userIndex].createdAt
    };

    return NextResponse.json(
      { message: 'User updated successfully', user: sanitizedUser }
    );
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE handler - Delete user
export async function DELETE(req: NextRequest) {
  try {
    // Check permissions
    const authResult = await usersDeleteMiddleware(req);
    
    // If auth failed and returned a NextResponse, return it
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    // Only super_admin can delete users
    if (authResult.session.user?.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Only super admins can delete users' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get current data
    const data = await getUsersData();
    
    // Find user index
    const userIndex = data.users.findIndex((u: any) => u.id === id);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Don't allow deleting the last super_admin
    if (
      data.users[userIndex].role === 'super_admin' &&
      data.users.filter((u: any) => u.role === 'super_admin').length <= 1
    ) {
      return NextResponse.json(
        { error: 'Cannot delete the last super admin user' },
        { status: 400 }
      );
    }

    // Remove user
    data.users.splice(userIndex, 1);

    // Write updated data
    const success = await writeUsersData(data);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete user' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'User deleted successfully' }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
} 