import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, shippingInfo, paymentMethod, total } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }
    if (!shippingInfo || !shippingInfo.fullName || !shippingInfo.address || !shippingInfo.phone) {
      return NextResponse.json({ error: 'Missing shipping details' }, { status: 400 });
    }

    // Save order in our local database file
    const newOrder = createOrder({
      items,
      shippingInfo,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      total
    });

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully!',
      order: newOrder
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error during checkout' }, { status: 500 });
  }
}
