import { NextResponse } from 'next/server';
import { getWishlist, toggleWishlistItem } from '@/lib/db';

export async function GET() {
  return NextResponse.json(getWishlist());
}

export async function POST(request: Request) {
  try {
    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    const updatedWishlist = toggleWishlistItem(productId);
    return NextResponse.json(updatedWishlist);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
