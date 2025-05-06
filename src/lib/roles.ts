export type Permission = 'read' | 'write' | 'delete';

export interface Resource {
  name: string;
  description: string;
  isSensitive?: boolean;
}

export interface RoleDefinition {
  name: string;
  description: string;
  permissions: {
    [key: string]: Permission[];
  };
}

// Available resources in the system
export const resources: Resource[] = [
  {
    name: 'products',
    description: 'Product management'
  },
  {
    name: 'collections',
    description: 'Collection management'
  },
  {
    name: 'banners',
    description: 'Banner management'
  },
  {
    name: 'brand',
    description: 'Brand information'
  },
  {
    name: 'faqs',
    description: 'FAQ management'
  },
  {
    name: 'settings',
    description: 'Site settings'
  },
  {
    name: 'users',
    description: 'User management',
    isSensitive: true
  },
  {
    name: 'roles',
    description: 'Role management',
    isSensitive: true
  }
];

// Role definitions with their permissions
export const roles: RoleDefinition[] = [
  {
    name: 'super_admin',
    description: 'Access to read, write, and delete everything, including sensitive information',
    permissions: {
      products: ['read', 'write', 'delete'],
      collections: ['read', 'write', 'delete'],
      banners: ['read', 'write', 'delete'],
      brand: ['read', 'write', 'delete'],
      faqs: ['read', 'write', 'delete'],
      settings: ['read', 'write', 'delete'],
      users: ['read', 'write', 'delete'],
      roles: ['read', 'write', 'delete']
    }
  },
  {
    name: 'admin',
    description: 'Access to edit all information except sensitive information',
    permissions: {
      products: ['read', 'write', 'delete'],
      collections: ['read', 'write', 'delete'],
      banners: ['read', 'write', 'delete'],
      brand: ['read', 'write', 'delete'],
      faqs: ['read', 'write', 'delete'],
      settings: ['read', 'write'],
      users: ['read'],
      roles: ['read']
    }
  },
  {
    name: 'user',
    description: 'View-only access to non-sensitive information',
    permissions: {
      products: ['read'],
      collections: ['read'],
      banners: ['read'],
      brand: ['read'],
      faqs: ['read'],
      settings: ['read'],
      users: [],
      roles: []
    }
  }
];

// Helper functions for permission checking
export function hasPermission(role: string, resource: string, action: Permission): boolean {
  const roleDefinition = roles.find(r => r.name === role);
  if (!roleDefinition) return false;
  
  const permissions = roleDefinition.permissions[resource];
  if (!permissions) return false;
  
  return permissions.includes(action);
}

export function isSensitiveResource(resource: string): boolean {
  const resourceDef = resources.find(r => r.name === resource);
  return resourceDef?.isSensitive || false;
} 