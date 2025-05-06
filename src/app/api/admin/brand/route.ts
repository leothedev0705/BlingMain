import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Local file path for brand data
const dataFilePath = path.join(process.cwd(), 'src/data/brandInfo.json');

// Helper function to read brand data
async function getBrandData() {
  try {
    const fileContents = await fs.promises.readFile(dataFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading brand data:', error);
    return { brand: {}, products: {}, personas: [], marketingCampaigns: [] };
  }
}

// Helper function to write brand data
async function writeBrandData(data: any) {
  try {
    await fs.promises.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing brand data:', error);
    return false;
  }
}

// GET handler - Fetch brand info
export async function GET(req: NextRequest) {
  try {
    const data = await getBrandData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brand information' },
      { status: 500 }
    );
  }
}

// PUT handler - Update brand info
export async function PUT(req: NextRequest) {
  try {
    // In a production app, add proper authentication here
    // For now, we'll allow all requests for development purposes

    const { searchParams } = new URL(req.url);
    const section = searchParams.get('section');

    if (!section) {
      return NextResponse.json(
        { error: 'Section parameter is required' },
        { status: 400 }
      );
    }

    const updatedData = await req.json();
    const data = await getBrandData();

    // Update the specified section
    if (section === 'brand') {
      data.brand = { ...data.brand, ...updatedData };
    } else if (section === 'products') {
      data.products = { ...data.products, ...updatedData };
    } else if (section === 'personas') {
      data.personas = updatedData;
    } else if (section === 'marketingCampaigns') {
      data.marketingCampaigns = updatedData;
    } else {
      return NextResponse.json(
        { error: 'Invalid section specified' },
        { status: 400 }
      );
    }

    // Write updated data
    const success = await writeBrandData(data);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update brand information' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Brand information updated successfully', data: data }
    );
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update brand information' },
      { status: 500 }
    );
  }
} 