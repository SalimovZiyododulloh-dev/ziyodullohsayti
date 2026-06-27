import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, name, price, description, contactPhone } = body;

    if (!name || !price) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    }

    // Generate a simulated OLX ID
    const olxId = Math.floor(100000000 + Math.random() * 900000000);
    // Transliterate name to URL-friendly string
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const simulatedUrl = `https://olx.uz/d/obyavlenie/${slug}-ID${olxId}.html`;

    // Simulate cross-posting delay (e.g. 800ms)
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({
      success: true,
      message: 'Item cross-posted to OLX successfully!',
      olxUrl: simulatedUrl,
      postedAt: new Date().toISOString(),
      listingDetails: {
        id: olxId,
        title: `${name} - PC Hardware`,
        price: `${price} USD`,
        description: description || 'Premium PC hardware listed via Antigravity E-Commerce Hub.',
        phone: contactPhone || '+998 (90) 123-45-67'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 500 });
  }
}
