import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Local file path for products data
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

// GET handler - Fetch all products or a single product
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const data = await getProductsData();

    // If ID is provided, return only that specific product
    if (id) {
      const product = data.products.find((p: any) => p.id === id);
      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(product);
    }

    // Otherwise return all products
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST handler - Add a new product
export async function POST(req: NextRequest) {
  try {
    const newProduct = await req.json();

    // Validate required fields
    if (!newProduct.name || !newProduct.price) {
      return NextResponse.json(
        { error: 'Name and price are required fields' },
        { status: 400 }
      );
    }

    // Generate ID if not provided
    if (!newProduct.id) {
      newProduct.id = `product-${Date.now()}`;
    }

    // Add product to data
    const data = await getProductsData();
    data.products.push(newProduct);

    // Write updated data
    const success = await writeProductsData(data);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save product' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Product added successfully', product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Failed to add product' },
      { status: 500 }
    );
  }
}

// PUT handler - Update product
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const updatedProduct = await req.json();

    // Get current data
    const data = await getProductsData();
    
    // Find product index
    const productIndex = data.products.findIndex((p: any) => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Update product
    data.products[productIndex] = {
      ...data.products[productIndex],
      ...updatedProduct,
      id: id, // Ensure ID doesn't change
    };

    // Write updated data
    const success = await writeProductsData(data);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Product updated successfully', product: data.products[productIndex] }
    );
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE handler - Delete product
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Get current data
    const data = await getProductsData();
    
    // Find product index
    const productIndex = data.products.findIndex((p: any) => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Remove product
    data.products.splice(productIndex, 1);

    // Also remove from any collections
    data.collections.forEach((collection: any) => {
      collection.products = collection.products.filter((productId: string) => productId !== id);
    });

    // Write updated data
    const success = await writeProductsData(data);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Product deleted successfully' }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 