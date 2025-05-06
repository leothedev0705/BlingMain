import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Local file path for FAQ data
const dataFilePath = path.join(process.cwd(), 'src/data/faqs.json');

// Helper function to read FAQ data
async function getFaqData() {
  try {
    const fileContents = await fs.promises.readFile(dataFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading FAQ data:', error);
    // If the file doesn't exist, create an empty structure
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      const emptyData = { faqs: [] };
      await fs.promises.writeFile(dataFilePath, JSON.stringify(emptyData, null, 2), 'utf8');
      return emptyData;
    }
    return { faqs: [] };
  }
}

// Helper function to write FAQ data
async function writeFaqData(data: any) {
  try {
    await fs.promises.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing FAQ data:', error);
    return false;
  }
}

// GET handler - Fetch all FAQs
export async function GET(req: NextRequest) {
  try {
    const data = await getFaqData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}

// POST handler - Add a new FAQ
export async function POST(req: NextRequest) {
  try {
    // In a production app, add proper authentication here
    // For now, we'll allow all requests for development purposes

    const newFaq = await req.json();

    // Validate required fields
    if (!newFaq.question || !newFaq.answer) {
      return NextResponse.json(
        { error: 'Question and answer are required fields' },
        { status: 400 }
      );
    }

    // Generate ID if not provided
    if (!newFaq.id) {
      newFaq.id = `faq-${Date.now()}`;
    }

    // Add FAQ to data
    const data = await getFaqData();
    data.faqs.push(newFaq);

    // Write updated data
    const success = await writeFaqData(data);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save FAQ' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'FAQ added successfully', faq: newFaq },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Failed to add FAQ' },
      { status: 500 }
    );
  }
}

// PUT handler - Update FAQ
export async function PUT(req: NextRequest) {
  try {
    // In a production app, add proper authentication here
    // For now, we'll allow all requests for development purposes

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'FAQ ID is required' },
        { status: 400 }
      );
    }

    const updatedFaq = await req.json();

    // Get current data
    const data = await getFaqData();
    
    // Find FAQ index
    const faqIndex = data.faqs.findIndex((f: any) => f.id === id);
    
    if (faqIndex === -1) {
      return NextResponse.json(
        { error: 'FAQ not found' },
        { status: 404 }
      );
    }

    // Update FAQ
    data.faqs[faqIndex] = {
      ...data.faqs[faqIndex],
      ...updatedFaq,
      id: id, // Ensure ID doesn't change
    };

    // Write updated data
    const success = await writeFaqData(data);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update FAQ' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'FAQ updated successfully', faq: data.faqs[faqIndex] }
    );
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update FAQ' },
      { status: 500 }
    );
  }
}

// DELETE handler - Delete FAQ
export async function DELETE(req: NextRequest) {
  try {
    // In a production app, add proper authentication here
    // For now, we'll allow all requests for development purposes

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'FAQ ID is required' },
        { status: 400 }
      );
    }

    // Get current data
    const data = await getFaqData();
    
    // Find FAQ index
    const faqIndex = data.faqs.findIndex((f: any) => f.id === id);
    
    if (faqIndex === -1) {
      return NextResponse.json(
        { error: 'FAQ not found' },
        { status: 404 }
      );
    }

    // Remove FAQ
    data.faqs.splice(faqIndex, 1);

    // Write updated data
    const success = await writeFaqData(data);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete FAQ' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'FAQ deleted successfully' }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete FAQ' },
      { status: 500 }
    );
  }
} 