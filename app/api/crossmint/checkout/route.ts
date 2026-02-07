import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    console.log('🚀 Creating Crossmint checkout session for:', body.email);
    console.log('🔧 Environment:', process.env.CROSSMINT_ENVIRONMENT);

    // Determinar URL base según el entorno
    const baseUrl = process.env.CROSSMINT_ENVIRONMENT === 'staging' 
      ? 'https://staging.crossmint.com' 
      : 'https://www.crossmint.com';
    
    console.log('🌐 Using base URL:', baseUrl);

    // API moderna de Crossmint
    const res = await fetch(
      `${baseUrl}/api/2022-06-09/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.CROSSMINT_API_KEY!,
        },
        body: JSON.stringify({
          recipient: { 
            email: body.email 
          },
          quantity: 1,
          payment: {
            method: "fiat",
            currency: "usd",
            amount: "0.70" // Precio fijo para test
          },
          metadata: {
            name: "Mundial 2026 - Certificado NFT",
            description: "Certificado conmemorativo del Mundial 2026",
            image: "https://mundial2026-mvp.vercel.app/icon-512.png"
          }
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
    console.log('✅ Order created:', data);

    // Para test mode, devolver URL de checkout si existe
    if (data.checkoutUrl) {
      return NextResponse.json({ checkoutUrl: data.checkoutUrl });
    } else {
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('💥 Server error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}