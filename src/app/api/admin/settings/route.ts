import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createAuthMiddleware } from '@/lib/authMiddleware';

// Local file path for settings data
const dataFilePath = path.join(process.cwd(), 'src/data/settings.json');
const dataDirectory = path.dirname(dataFilePath);

// Helper function to read settings data
async function getSettingsData() {
  try {
    // Ensure the data directory exists
    if (!fs.existsSync(dataDirectory)) {
      fs.mkdirSync(dataDirectory, { recursive: true });
    }
    
    const fileContents = await fs.promises.readFile(dataFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading settings data:', error);
    // If the file doesn't exist, create an empty structure
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      const emptyData = { 
        general: {
          siteName: "BlingxBeyond",
          siteDescription: "Luxury Gift Shop",
          contactEmail: "support@blingxbeyond.com",
          contactPhone: "+91 9876543210",
          socialLinks: {
            instagram: "",
            facebook: "",
            twitter: ""
          }
        },
        shipping: {
          freeShippingThreshold: 5000,
          standardShippingRate: 200,
          expressShippingRate: 500
        },
        payment: {
          enabledPaymentMethods: ["card", "upi", "netbanking"],
          taxRate: 18
        },
        notifications: {
          orderConfirmation: true,
          orderShipped: true,
          orderDelivered: true,
          abandonedCart: false
        }
      };
      await fs.promises.writeFile(dataFilePath, JSON.stringify(emptyData, null, 2), 'utf8');
      return emptyData;
    }
    return { 
      general: {},
      shipping: {},
      payment: {},
      notifications: {}
    };
  }
}

// Helper function to write settings data
async function writeSettingsData(data: any) {
  try {
    // Ensure the data directory exists
    if (!fs.existsSync(dataDirectory)) {
      fs.mkdirSync(dataDirectory, { recursive: true });
    }
    
    await fs.promises.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing settings data:', error);
    return false;
  }
}

// Create auth middleware for settings
const settingsReadMiddleware = createAuthMiddleware('settings', 'read');
const settingsWriteMiddleware = createAuthMiddleware('settings', 'write');

// GET handler - Fetch all settings or a specific section
export async function GET(req: NextRequest) {
  try {
    // Check permissions
    const authResult = await settingsReadMiddleware(req);
    
    // If auth failed and returned a NextResponse, return it
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const { searchParams } = new URL(req.url);
    const section = searchParams.get('section');

    const data = await getSettingsData();
    
    if (section) {
      // Return settings of a specific section
      if (data[section]) {
        return NextResponse.json({ [section]: data[section] });
      } else {
        return NextResponse.json(
          { error: 'Invalid settings section' },
          { status: 400 }
        );
      }
    }
    
    // Return all settings
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT handler - Update settings
export async function PUT(req: NextRequest) {
  try {
    // Check write permissions
    const authResult = await settingsWriteMiddleware(req);
    
    // If auth failed and returned a NextResponse, return it
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    // Verify user has proper role with password
    if (authResult.session.user?.role !== 'admin' && authResult.session.user?.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Only admins can update settings' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const section = searchParams.get('section');

    if (!section) {
      return NextResponse.json(
        { error: 'Settings section parameter is required' },
        { status: 400 }
      );
    }

    const updatedSettings = await req.json();
    const data = await getSettingsData();

    // Check if the section exists
    if (!data[section]) {
      return NextResponse.json(
        { error: 'Invalid settings section' },
        { status: 400 }
      );
    }

    // Update the specified section
    data[section] = {
      ...data[section],
      ...updatedSettings
    };

    // Write updated data
    const success = await writeSettingsData(data);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Settings updated successfully',
      data: { [section]: data[section] }
    });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
} 