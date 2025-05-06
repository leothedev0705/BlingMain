import React, { useState } from 'react';
import { roles } from '@/lib/roles';
import { getUserAuth, setUserRole } from '@/lib/usePermissions';

/**
 * RoleSelector component - For development purposes only
 * 
 * Allows switching between different user roles to test permissions
 */
export default function RoleSelector() {
  const { userRole, isPasswordVerified } = getUserAuth();
  const [selectedRole, setSelectedRole] = useState(userRole);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = event.target.value;
    setSelectedRole(newRole);
    
    // If switching to admin or super_admin, show password input
    if ((newRole === 'admin' || newRole === 'super_admin') && !isPasswordVerified) {
      setShowPasswordModal(true);
    } else {
      // For non-admin roles, just set directly
      changeRole(newRole);
    }
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verify the password (dummy implementation)
    if (password === '12345') {
      setError('');
      changeRole(selectedRole, password);
      setShowPasswordModal(false);
      setPassword('');
    } else {
      setError('Invalid password. Try "12345" for demo.');
    }
  };
  
  const changeRole = (role: string, pwd?: string) => {
    const success = setUserRole(role, pwd);
    if (success) {
      // Reload the page to refresh permissions
      window.location.reload();
    } else if (role === 'admin' || role === 'super_admin') {
      setError('Password verification failed');
      setShowPasswordModal(true);
    }
  };
  
  // Get a readable permission summary for each role
  const getRoleDescription = (roleName: string) => {
    if (roleName === 'user') {
      return 'View Only';
    } else if (roleName === 'admin') {
      return 'Can Edit (except sensitive data)';
    } else {
      return 'Full Access';
    }
  };
  
  return (
    <>
      <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg z-30 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <label htmlFor="role-selector" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            User Role:
          </label>
          <select
            id="role-selector"
            value={selectedRole}
            onChange={handleRoleChange}
            className="text-sm p-1 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {roles.map((role) => (
              <option key={role.name} value={role.name}>
                {role.name.replace('_', ' ')} - {getRoleDescription(role.name)}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center">
          <span className="inline-block mr-1 w-2 h-2 rounded-full bg-green-500"></span>
          Development mode only 
          {isPasswordVerified && (userRole === 'admin' || userRole === 'super_admin') ? ' (Authenticated)' : ''}
        </div>
      </div>
      
      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Admin Authentication</h2>
            <p className="mb-4 text-gray-700">
              To access {selectedRole.replace('_', ' ')} privileges, please enter the password.
              <br />
              <span className="text-sm text-gray-500">For demo, use password: 12345</span>
            </p>
            
            {/* Display permission level */}
            <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded text-sm">
              <strong>Permission Level:</strong> {getRoleDescription(selectedRole)}
              {selectedRole === 'user' && (
                <div className="mt-1">Users can only view content, not modify anything.</div>
              )}
              {selectedRole === 'admin' && (
                <div className="mt-1">Admins can edit most content but cannot manage users or access sensitive data.</div>
              )}
              {selectedRole === 'super_admin' && (
                <div className="mt-1">Super Admins have full access to all features including user management.</div>
              )}
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold"
                  autoFocus
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPassword('');
                    setError('');
                    setSelectedRole(userRole); // Reset to current role
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gold text-white rounded hover:bg-gold/90"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
} 