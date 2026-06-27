import fs from 'fs';
import path from 'path';

const DB_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');

export interface Order {
  id: string;
  date: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  shippingInfo: {
    fullName: string;
    address: string;
    city: string;
    phone: string;
  };
  paymentMethod: string;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  trackingCode: string;
  total: number;
}

export interface DbData {
  wishlist: string[]; // array of productIds
  orders: Order[];
}

const defaultDbData: DbData = {
  wishlist: [],
  orders: []
};

// Helper function to read the DB
export function readDb(): DbData {
  try {
    if (!fs.existsSync(DB_FILE_PATH)) {
      // Ensure the directory exists
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      // Write default data
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(defaultDbData, null, 2), 'utf-8');
      return defaultDbData;
    }
    const rawData = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading local JSON database:', error);
    return defaultDbData;
  }
}

// Helper function to write to the DB
export function writeDb(data: DbData): boolean {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing to local JSON database:', error);
    return false;
  }
}

// Wishlist methods
export function getWishlist(): string[] {
  return readDb().wishlist;
}

export function toggleWishlistItem(productId: string): string[] {
  const db = readDb();
  const index = db.wishlist.indexOf(productId);
  if (index === -1) {
    db.wishlist.push(productId);
  } else {
    db.wishlist.splice(index, 1);
  }
  writeDb(db);
  return db.wishlist;
}

// Orders methods
export function getOrders(): Order[] {
  return readDb().orders;
}

export function createOrder(orderData: Omit<Order, 'id' | 'date' | 'status' | 'trackingCode'>): Order {
  const db = readDb();
  
  // Generate random order id (e.g. AG-10294)
  const orderId = `AG-${Math.floor(10000 + Math.random() * 90000)}`;
  // Generate random tracking code (e.g. TRK489182390UZ)
  const trackingCode = `TRK${Math.floor(100000000 + Math.random() * 900000000)}UZ`;
  
  const newOrder: Order = {
    ...orderData,
    id: orderId,
    date: new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' }),
    status: 'Processing',
    trackingCode
  };
  
  db.orders.unshift(newOrder); // Add to the top of the list
  writeDb(db);
  return newOrder;
}
