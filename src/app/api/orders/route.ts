import { NextResponse } from 'next/server';
import { getOrders } from '@/lib/db';

export async function GET() {
  try {
    const orders = getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve orders' }, { status: 500 });
  }
}
