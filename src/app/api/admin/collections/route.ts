import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Local file path for products data (which contains collections)
const dataFilePath = path.join(process.cwd(), 'src/data/products.json');

// Helper function to read products data
async function getProductsData() {
  try {
    const fileContents = await fs.promises.readFile(dataFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading products data:', error);
    return { products: [], collections: [] };
  }
}

// Helper function to write products data
async function writeProductsData(data: any) {
  try {
    await fs.promises.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing products data:', error);
    return false;
  }
}

// GET handler - Fetch all collections or a specific collection
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const data = await getProductsData();
    
    if (id) {
      // Return a specific collection
      const collection = data.collections.find((c: any) => c.id === id);
      
      if (!collection) {
        return NextResponse.json(
          { error: 'Collection not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(collection);
    }
    
    // Return all collections
    return NextResponse.json({ collections: data.collections });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}

// POST handler - Add a new collection
export async function POST(req: NextRequest) {
  try {
    // In a production app, add proper authentication here
    // For now, we'll allow all requests for development purposes

    const newCollection = await req.json();

    // Validate required fields
    if (!newCollection.title || !newCollection.description) {
      return NextResponse.json(
        { error: 'Title and description are required fields' },
        { status: 400 }
      );
    }

    // Generate ID if not provided
    if (!newCollection.id) {
      // Create slug-friendly ID from title
      newCollection.id = newCollection.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Initialize products array if not provided
    if (!newCollection.products) {
      newCollection.products = [];
    }

    // Add collection to data
    const data = await getProductsData();
    
    // Check if ID already exists
    if (data.collections.some((c: any) => c.id === newCollection.id)) {
      return NextResponse.json(
        { error: 'Collection with this ID already exists' },
        { status: 400 }
      );
    }
    
    data.collections.push(newCollection);

    // Write updated data
    const success = await writeProductsData(data);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save collection' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Collection added successfully', collection: newCollection },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Failed to add collection' },
      { status: 500 }
    );
  }
}

// PUT handler - Update collection
export async function PUT(req: NextRequest) {
  try {
    // In a production app, add proper authentication here
    // For now, we'll allow all requests for development purposes

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Collection ID is required' },
        { status: 400 }
      );
    }

    const updatedCollection = await req.json();

    // Get current data
    const data = await getProductsData();
    
    // Find collection index
    const collectionIndex = data.collections.findIndex((c: any) => c.id === id);
    
    if (collectionIndex === -1) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }

    // Update collection
    data.collections[collectionIndex] = {
      ...data.collections[collectionIndex],
      ...updatedCollection,
      id: id, // Ensure ID doesn't change
    };

    // Write updated data
    const success = await writeProductsData(data);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update collection' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Collection updated successfully', collection: data.collections[collectionIndex] }
    );
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update collection' },
      { status: 500 }
    );
  }
}

// DELETE handler - Delete collection
export async function DELETE(req: NextRequest) {
  try {
    // In a production app, add proper authentication here
    // For now, we'll allow all requests for development purposes

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Collection ID is required' },
        { status: 400 }
      );
    }

    // Get current data
    const data = await getProductsData();
    
    // Find collection index
    const collectionIndex = data.collections.findIndex((c: any) => c.id === id);
    
    if (collectionIndex === -1) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }

    // Remove collection
    data.collections.splice(collectionIndex, 1);

    // Write updated data
    const success = await writeProductsData(data);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete collection' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Collection deleted successfully' }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete collection' },
      { status: 500 }
    );
  }
} 