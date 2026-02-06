import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    console.log('🚀 Creating Crossmint checkout session for:', body.email);

    const res = await fetch(
      "https://www.crossmint.com/api/2022-06-09/checkout/sessions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.CROSSMINT_API_KEY!,
        },
        body: JSON.stringify({
          recipient: { email: body.email },
          lineItems: [
            {
              collectionId: process.env.CROSSMINT_COLLECTION_ID,
              quantity: 1,
            },
          ],
          payment: {
            fiat: { currency: "USD" },
          },
        }),
      }
    );

    console.log('📡 Crossmint response status:', res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Crossmint error:', errorText);
      return NextResponse.json({ 
        error: 'Error creating checkout session',
        details: errorText 
      }, { status: 500 });
    }

    const data = await res.json();
    console.log('✅ Checkout session created:', data.checkoutUrl ? 'Success' : 'No URL');

    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 Server error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}