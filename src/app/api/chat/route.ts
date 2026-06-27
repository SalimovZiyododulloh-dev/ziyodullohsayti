import { NextResponse } from 'next/server';

const BOT_RESPONSES: Record<string, string> = {
  default: "Salom! I'm your Antigravity Tech Assistant. How can I help you choose hardware today? I can guide you on the PC Builder, real-time pricing, or our OLX integrations.",
  compatibility: "PC Builder compatibility checks automatically verify that your CPU matches the motherboard socket (e.g. AM5 or LGA1700) and that your Power Supply (PSU) can handle the total TDP of your CPU and GPU. Try building in our /builder section!",
  olx: "We support peer-to-peer listings! Products with the OLX badge have simulated links to OLX, and you can cross-post items you'd like to sell directly from your Dashboard.",
  price: "Our prices are synced with major retailers in real-time. Turn on 'Real-Time Pricing' in the Catalog to scrape current market rates and find the best deals!",
  shipping: "We deliver across Uzbekistan! Standard delivery in Tashkent takes 4-24 hours. For regions, it takes 1-3 business days.",
  keyboard: "For gaming, linear switches (Red/Cream) are fast and quiet. For typing, tactile (Brown) or clicky (Blue) switches offer satisfying feedback.",
  mouse: "For FPS games, look for a lightweight mouse (under 60g) like the Aureum Claw X1. Higher DPI (e.g., 26,000) provides extreme precision."
};

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    const msg = message.toLowerCase();
    
    let reply = BOT_RESPONSES.default;
    
    if (msg.includes('compat') || msg.includes('builder') || msg.includes('moslik')) {
      reply = BOT_RESPONSES.compatibility;
    } else if (msg.includes('olx') || msg.includes('sotish') || msg.includes('p2p')) {
      reply = BOT_RESPONSES.olx;
    } else if (msg.includes('price') || msg.includes('narx') || msg.includes('realtime') || msg.includes('scrape')) {
      reply = BOT_RESPONSES.price;
    } else if (msg.includes('ship') || msg.includes('deliv') || msg.includes('dostavka') || msg.includes('yetkazish')) {
      reply = BOT_RESPONSES.shipping;
    } else if (msg.includes('keyboard') || msg.includes('tugma') || msg.includes('switch') || msg.includes('klaviatura')) {
      reply = BOT_RESPONSES.keyboard;
    } else if (msg.includes('mouse') || msg.includes('sichqoncha') || msg.includes('dpi')) {
      reply = BOT_RESPONSES.mouse;
    }

    // Simulate short network latency (e.g. 500ms)
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ reply: "Kechirasiz, tizimda xatolik yuz berdi. Iltimos, qayta urunib ko'ring." }, { status: 500 });
  }
}
