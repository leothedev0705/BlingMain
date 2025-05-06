'use client';

import { useState, useEffect } from 'react';
import { AdminOnly, Permission } from '@/components/Permission';
import { usePermissions } from '@/lib/usePermissions';
import ReadOnlyInput from '@/components/ReadOnlyInput';
import ReadOnlyCheckbox from '@/components/ReadOnlyCheckbox';

interface SettingsData {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    contactPhone: string;
    socialLinks: {
      instagram: string;
      facebook: string;
      twitter: string;
    };
  };
  shipping: {
    freeShippingThreshold: number;
    standardShippingRate: number;
    expressShippingRate: number;
  };
  payment: {
    enabledPaymentMethods: string[];
    taxRate: number;
  };
  notifications: {
    orderConfirmation: boolean;
    orderShipped: boolean;
    orderDelivered: boolean;
    abandonedCart: boolean;
  };
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { hasPermission, userRole } = usePermissions();

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings', {
        headers: {
          'x-user-role': userRole // For development testing
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }

      const data = await response.json();
      setSettings(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (section: string, sectionData: any) => {
    try {
      setError(null);
      setSuccess(null);
      
      const response = await fetch(`/api/admin/settings?section=${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': userRole // For development testing
        },
        body: JSON.stringify(sectionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update settings');
      }

      // Update local state
      setSettings(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          [section]: sectionData
        };
      });

      setSuccess('Settings updated successfully');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    
    updateSettings('general', settings.general);
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    
    updateSettings('shipping', settings.shipping);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    
    updateSettings('payment', settings.payment);
  };

  const handleNotificationsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    
    updateSettings('notifications', settings.notifications);
  };

  const updateGeneralSetting = (key: string, value: string) => {
    if (!settings) return;
    
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      setSettings({
        ...settings,
        general: {
          ...settings.general,
          [parent]: {
            ...settings.general[parent as keyof typeof settings.general] as any,
            [child]: value
          }
        }
      });
    } else {
      setSettings({
        ...settings,
        general: {
          ...settings.general,
          [key]: value
        }
      });
    }
  };

  const updateShippingSetting = (key: string, value: number) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      shipping: {
        ...settings.shipping,
        [key]: value
      }
    });
  };

  const updatePaymentSetting = (key: string, value: any) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      payment: {
        ...settings.payment,
        [key]: value
      }
    });
  };

  const handlePaymentMethodToggle = (method: string) => {
    if (!settings) return;
    
    const currentMethods = settings.payment.enabledPaymentMethods;
    
    if (currentMethods.includes(method)) {
      updatePaymentSetting('enabledPaymentMethods', currentMethods.filter(m => m !== method));
    } else {
      updatePaymentSetting('enabledPaymentMethods', [...currentMethods, method]);
    }
  };

  const updateNotificationSetting = (key: string, value: boolean) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gold border-r-transparent"></div>
      </div>
    );
  }

  return (
    <AdminOnly fallback={
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
        <p className="text-amber-700">You need Admin permissions to view this page.</p>
      </div>
    }>
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'general'
                  ? 'border-gold text-gold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('general')}
            >
              General
            </button>
            <button
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'shipping'
                  ? 'border-gold text-gold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('shipping')}
            >
              Shipping
            </button>
            <button
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'payment'
                  ? 'border-gold text-gold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('payment')}
            >
              Payment
            </button>
            <button
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'border-gold text-gold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </button>
          </nav>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <p className="text-green-700">{success}</p>
            </div>
          )}

          {userRole === 'user' && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    You are viewing in <strong>read-only mode</strong>. Form fields are disabled and cannot be edited.
                  </p>
                </div>
              </div>
            </div>
          )}

          {settings && (
            <>
              {/* General Settings */}
              {activeTab === 'general' && (
                <form onSubmit={handleGeneralSubmit}>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-charcoal">Site Information</h3>
                      <div className="mt-3 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Site Name
                          </label>
                          <ReadOnlyInput
                            type="text"
                            value={settings.general.siteName}
                            onChange={(e) => updateGeneralSetting('siteName', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Site Description
                          </label>
                          <ReadOnlyInput
                            isTextArea={true}
                            rows={3}
                            value={settings.general.siteDescription}
                            onChange={(e) => updateGeneralSetting('siteDescription', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-charcoal">Contact Information</h3>
                      <div className="mt-3 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Contact Email
                          </label>
                          <ReadOnlyInput
                            type="email"
                            value={settings.general.contactEmail}
                            onChange={(e) => updateGeneralSetting('contactEmail', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Contact Phone
                          </label>
                          <ReadOnlyInput
                            type="text"
                            value={settings.general.contactPhone}
                            onChange={(e) => updateGeneralSetting('contactPhone', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-charcoal">Social Media</h3>
                      <div className="mt-3 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Instagram
                          </label>
                          <ReadOnlyInput
                            type="text"
                            value={settings.general.socialLinks.instagram}
                            onChange={(e) => updateGeneralSetting('socialLinks.instagram', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Facebook
                          </label>
                          <ReadOnlyInput
                            type="text"
                            value={settings.general.socialLinks.facebook}
                            onChange={(e) => updateGeneralSetting('socialLinks.facebook', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Twitter
                          </label>
                          <ReadOnlyInput
                            type="text"
                            value={settings.general.socialLinks.twitter}
                            onChange={(e) => updateGeneralSetting('socialLinks.twitter', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Permission resource="settings" action="write">
                      <button
                        type="submit"
                        className="bg-gold hover:bg-gold/90 text-white px-4 py-2 rounded-lg"
                      >
                        Save General Settings
                      </button>
                    </Permission>
                  </div>
                </form>
              )}

              {/* Shipping Settings */}
              {activeTab === 'shipping' && (
                <form onSubmit={handleShippingSubmit}>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-charcoal">Shipping Rates</h3>
                      <div className="mt-3 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Free Shipping Threshold (₹)
                          </label>
                          <ReadOnlyInput
                            type="number"
                            value={settings.shipping.freeShippingThreshold}
                            onChange={(e) => updateShippingSetting('freeShippingThreshold', parseInt(e.target.value))}
                          />
                          <p className="mt-1 text-sm text-gray-500">
                            Orders above this amount qualify for free shipping
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Standard Shipping Rate (₹)
                          </label>
                          <ReadOnlyInput
                            type="number"
                            value={settings.shipping.standardShippingRate}
                            onChange={(e) => updateShippingSetting('standardShippingRate', parseInt(e.target.value))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Express Shipping Rate (₹)
                          </label>
                          <ReadOnlyInput
                            type="number"
                            value={settings.shipping.expressShippingRate}
                            onChange={(e) => updateShippingSetting('expressShippingRate', parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Permission resource="settings" action="write">
                      <button
                        type="submit"
                        className="bg-gold hover:bg-gold/90 text-white px-4 py-2 rounded-lg"
                      >
                        Save Shipping Settings
                      </button>
                    </Permission>
                  </div>
                </form>
              )}

              {/* Payment Settings */}
              {activeTab === 'payment' && (
                <form onSubmit={handlePaymentSubmit}>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-charcoal">Payment Methods</h3>
                      <div className="mt-3 space-y-2">
                        <ReadOnlyCheckbox
                          id="payment-card"
                          checked={settings.payment.enabledPaymentMethods.includes('card')}
                          onChange={() => handlePaymentMethodToggle('card')}
                          label="Credit/Debit Card"
                        />
                        <ReadOnlyCheckbox
                          id="payment-upi"
                          checked={settings.payment.enabledPaymentMethods.includes('upi')}
                          onChange={() => handlePaymentMethodToggle('upi')}
                          label="UPI"
                        />
                        <ReadOnlyCheckbox
                          id="payment-netbanking"
                          checked={settings.payment.enabledPaymentMethods.includes('netbanking')}
                          onChange={() => handlePaymentMethodToggle('netbanking')}
                          label="Net Banking"
                        />
                        <ReadOnlyCheckbox
                          id="payment-cod"
                          checked={settings.payment.enabledPaymentMethods.includes('cod')}
                          onChange={() => handlePaymentMethodToggle('cod')}
                          label="Cash on Delivery"
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-charcoal">Tax Configuration</h3>
                      <div className="mt-3 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Tax Rate (%)
                          </label>
                          <ReadOnlyInput
                            type="number"
                            step="0.01"
                            value={settings.payment.taxRate}
                            onChange={(e) => updatePaymentSetting('taxRate', parseFloat(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Permission resource="settings" action="write">
                      <button
                        type="submit"
                        className="bg-gold hover:bg-gold/90 text-white px-4 py-2 rounded-lg"
                      >
                        Save Payment Settings
                      </button>
                    </Permission>
                  </div>
                </form>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <form onSubmit={handleNotificationsSubmit}>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-charcoal">Email Notifications</h3>
                      <div className="mt-3 space-y-3">
                        <ReadOnlyCheckbox
                          id="notification-order-confirmation"
                          checked={settings.notifications.orderConfirmation}
                          onChange={(e) => updateNotificationSetting('orderConfirmation', e.target.checked)}
                          label="Order Confirmation Emails"
                        />
                        <ReadOnlyCheckbox
                          id="notification-order-shipped"
                          checked={settings.notifications.orderShipped}
                          onChange={(e) => updateNotificationSetting('orderShipped', e.target.checked)}
                          label="Order Shipped Emails"
                        />
                        <ReadOnlyCheckbox
                          id="notification-order-delivered"
                          checked={settings.notifications.orderDelivered}
                          onChange={(e) => updateNotificationSetting('orderDelivered', e.target.checked)}
                          label="Order Delivered Emails"
                        />
                        <ReadOnlyCheckbox
                          id="notification-abandoned-cart"
                          checked={settings.notifications.abandonedCart}
                          onChange={(e) => updateNotificationSetting('abandonedCart', e.target.checked)}
                          label="Abandoned Cart Reminder Emails"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Permission resource="settings" action="write">
                      <button
                        type="submit"
                        className="bg-gold hover:bg-gold/90 text-white px-4 py-2 rounded-lg"
                      >
                        Save Notification Settings
                      </button>
                    </Permission>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </AdminOnly>
  );
} 