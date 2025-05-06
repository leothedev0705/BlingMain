import { NextRequest, NextResponse } from 'next/server';
import productsData from '@/data/products.json';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Find the requested collection
    const collection = productsData.collections.find(
      (collection) => collection.id === id
    );

    if (!collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }

    // Get all products for this collection
    const collectionProducts = productsData.products.filter(
      (product) => collection.products.includes(product.id)
    );

    return NextResponse.json({
      collection,
      products: collectionProducts
    });
  } catch (error) {
    console.error('Error fetching collection:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collection data' },
      { status: 500 }
    );
  }
} 