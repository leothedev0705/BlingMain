import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Local file path for banners data
const dataFilePath = path.join(process.cwd(), 'src/data/banners.json');

// Helper function to read banners data
async function getBannersData() {
  try {
    const fileContents = await fs.promises.readFile(dataFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading banners data:', error);
    // If the file doesn't exist, create an empty structure
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      const emptyData = { 
        homeBanners: [],
        promotionalBanners: [],
        categoryBanners: []
      };
      await fs.promises.writeFile(dataFilePath, JSON.stringify(emptyData, null, 2), 'utf8');
      return emptyData;
    }
    return { 
      homeBanners: [],
      promotionalBanners: [],
      categoryBanners: []
    };
  }
}

// Helper function to write banners data
async function writeBannersData(data: any) {
  try {
    await fs.promises.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing banners data:', error);
    return false;
  }
}

// GET handler - Fetch all banners or a specific type
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    const data = await getBannersData();
    
    if (type) {
      // Return banners of a specific type
      switch (type) {
        case 'home':
          return NextResponse.json({ banners: data.homeBanners });
        case 'promotional':
          return NextResponse.json({ banners: data.promotionalBanners });
        case 'category':
          return NextResponse.json({ banners: data.categoryBanners });
        default:
          return NextResponse.json(
            { error: 'Invalid banner type' },
            { status: 400 }
          );
      }
    }
    
    // Return all banners
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

// POST handler - Add a new banner
export async function POST(req: NextRequest) {
  try {
    // In a production app, add proper authentication here
    // For now, we'll allow all requests for development purposes

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    if (!type || !['home', 'promotional', 'category'].includes(type)) {
      return NextResponse.json(
        { error: 'Valid banner type (home, promotional, or category) is required' },
        { status: 400 }
      );
    }

    const newBanner = await req.json();

    // Validate required fields
    if (!newBanner.imageUrl || !newBanner.title) {
      return NextResponse.json(
        { error: 'Image URL and title are required fields' },
        { status: 400 }
      );
    }

    // Generate ID if not provided
    if (!newBanner.id) {
      newBanner.id = `banner-${Date.now()}`;
    }

    // Add banner to appropriate section
    const data = await getBannersData();
    
    if (type === 'home') {
      data.homeBanners.push(newBanner);
    } else if (type === 'promotional') {
      data.promotionalBanners.push(newBanner);
    } else if (type === 'category') {
      data.categoryBanners.push(newBanner);
    }

    // Write updated data
    const success = await writeBannersData(data);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save banner' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Banner added successfully', banner: newBanner },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Failed to add banner' },
      { status: 500 }
    );
  }
}

// PUT handler - Update banner
export async function PUT(req: NextRequest) {
  try {
    // In a production app, add proper authentication here
    // For now, we'll allow all requests for development purposes

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !['home', 'promotional', 'category'].includes(type)) {
      return NextResponse.json(
        { error: 'Valid banner type (home, promotional, or category) is required' },
        { status: 400 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: 'Banner ID is required' },
        { status: 400 }
      );
    }

    const updatedBanner = await req.json();

    // Get current data
    const data = await getBannersData();
    
    // Select the right array based on type
    let bannerArray: any[];
    if (type === 'home') {
      bannerArray = data.homeBanners;
    } else if (type === 'promotional') {
      bannerArray = data.promotionalBanners;
    } else {
      bannerArray = data.categoryBanners;
    }
    
    // Find banner index
    const bannerIndex = bannerArray.findIndex((b: any) => b.id === id);
    
    if (bannerIndex === -1) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }

    // Update banner
    bannerArray[bannerIndex] = {
      ...bannerArray[bannerIndex],
      ...updatedBanner,
      id: id, // Ensure ID doesn't change
    };

    // Write updated data
    const success = await writeBannersData(data);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update banner' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Banner updated successfully', banner: bannerArray[bannerIndex] }
    );
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update banner' },
      { status: 500 }
    );
  }
}

// DELETE handler - Delete banner
export async function DELETE(req: NextRequest) {
  try {
    // In a production app, add proper authentication here
    // For now, we'll allow all requests for development purposes

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !['home', 'promotional', 'category'].includes(type)) {
      return NextResponse.json(
        { error: 'Valid banner type (home, promotional, or category) is required' },
        { status: 400 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: 'Banner ID is required' },
        { status: 400 }
      );
    }

    // Get current data
    const data = await getBannersData();
    
    // Select the right array based on type
    let bannerArray: any[];
    if (type === 'home') {
      bannerArray = data.homeBanners;
    } else if (type === 'promotional') {
      bannerArray = data.promotionalBanners;
    } else {
      bannerArray = data.categoryBanners;
    }
    
    // Find banner index
    const bannerIndex = bannerArray.findIndex((b: any) => b.id === id);
    
    if (bannerIndex === -1) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }

    // Remove banner
    bannerArray.splice(bannerIndex, 1);

    // Write updated data
    const success = await writeBannersData(data);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete banner' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Banner deleted successfully' }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete banner' },
      { status: 500 }
    );
  }
} 