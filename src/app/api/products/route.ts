import { NextResponse } from 'next/server';
import { mockProducts, Product } from '@/data/mock-products';

// Helper to simulate a small price jitter to mimic live retail updates
function getScrapedPrice(basePrice: number): number {
  // Random price change between -3% and +3%
  const jitter = (Math.random() * 6 - 3) / 100;
  return Math.round(basePrice * (1 + jitter));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const realtime = searchParams.get('realtime') === 'true';
  const category = searchParams.get('category');
  const query = searchParams.get('query');

  let products: Product[] = [...mockProducts];

  // Simulating real-time Google Shopping/Tech power-retailer pricing
  if (realtime) {
    products = products.map(p => ({
      ...p,
      price: getScrapedPrice(p.price)
    }));
  }

  // Filter by category if specified
  if (category) {
    products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  // Live search query matching
  if (query) {
    const q = query.toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      (p.specs.brand && p.specs.brand.toLowerCase().includes(q))
    );
  }

  return NextResponse.json(products);
}
