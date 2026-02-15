import { NextResponse } from "next/server";
import { createClient } from '@/lib/supabase/server';
import { checkUserBlocked, createBlockedUserError } from '@/lib/blockingUtils';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    console.log('🚀 Creating Crossmint checkout session for:', body.email);
    console.log('🔧 Environment:', process.env.CROSSMINT_ENVIRONMENT);
    console.log('📝 Memory ID:', body.memoryId);

    const supabase = await createClient();
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Verificar si el usuario está bloqueado
    const isBlocked = await checkUserBlocked(user.id)
    if (isBlocked) {
      return createBlockedUserError()
    }
    // Obtener datos del recuerdo si se proporciona memoryId
    let memoryData = null;
    if (body.memoryId) {
      const { data: memory } = await supabase
        .from('memories')
        .select('title, image_url')
        .eq('id', body.memoryId)
        .single();
      
      memoryData = memory;
      console.log('📸 Memory data:', memoryData?.title);
    }

    // SEPARAR COMPLETAMENTE STAGING Y PRODUCTION
    if (process.env.CROSSMINT_ENVIRONMENT === 'staging') {
      // STAGING: Crear checkout session con mint dinámico
      console.log('📦 Using STAGING environment with dynamic minting');
      
      const res = await fetch(
        "https://staging.crossmint.com/api/2022-06-09/checkout/sessions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.CROSSMINT_API_KEY!,
          },
          body: JSON.stringify({
            lineItems: [{
              collectionLocator: `crossmint:${process.env.CROSSMINT_COLLECTION_ID}`,
              callData: {
                totalPrice: "0.70",
                quantity: 1,
                metadata: {
                  name: memoryData ? `Mundial 2026 - ${memoryData.title}` : `Mundial 2026 - Certificado NFT (Staging)`,
                  description: 'Certificado conmemorativo del Mundial 2026 - Modo Staging',
                  image: memoryData?.image_url || "https://mundial2026-mvp.vercel.app/icon-512.png",
                  attributes: [
                    { trait_type: "Event", value: "Mundial 2026" },
                    { trait_type: "Type", value: "Commemorative Certificate" },
                    { trait_type: "Environment", value: "Staging" }
                  ]
                }
              },
              price: {
                amount: "0.70",
                currency: "usd"
              }
            }],
            successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://mundial2026-mvp.vercel.app'}/recuerdo/${body.memoryId}?nft_success=true`,
            cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://mundial2026-mvp.vercel.app'}/recuerdo/${body.memoryId}?nft_cancelled=true`
          })
        }
      );

      console.log('📡 Staging response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Staging error:', errorText);
        return NextResponse.json({ 
          error: 'Error creating staging checkout',
          details: errorText 
        }, { status: 500 });
      }

      const sessionData = await res.json();
      console.log('✅ Staging checkout session created:', sessionData);
      
      // Crear registro NFT pendiente (sin mint hasta confirmar pago)
      if (body.memoryId && sessionData.id) {
        const { error: certError } = await supabase
          .from('nft_certificates')
          .insert({
            memory_id: body.memoryId,
            user_id: user.id,
            payment_intent_id: sessionData.id,
            amount_paid: 0.70,
            currency: 'USD',
            status: 'pending',
            blockchain: 'polygon',
            is_eligible_for_auction: true
          })
        
        if (certError) {
          console.error('❌ Error creating pending NFT certificate:', certError)
        }
      }
      
      return NextResponse.json({
        success: true,
        sessionData: sessionData,
        checkoutUrl: sessionData.url,
        mode: 'staging'
      });
      
    } else {
      // PRODUCTION: Crear checkout session con mint dinámico
      console.log('🏭 Using PRODUCTION environment with dynamic minting');
      
      const res = await fetch(
        "https://www.crossmint.com/api/2022-06-09/checkout/sessions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.CROSSMINT_API_KEY!,
          },
          body: JSON.stringify({
            lineItems: [{
              collectionLocator: `crossmint:${process.env.CROSSMINT_COLLECTION_ID}`,
              callData: {
                totalPrice: "0.70",
                quantity: 1,
                metadata: {
                  name: memoryData ? `Mundial 2026 - ${memoryData.title}` : `Mundial 2026 - Certificado NFT`,
                  description: 'Certificado conmemorativo del Mundial 2026',
                  image: memoryData?.image_url || "https://mundial2026-mvp.vercel.app/icon-512.png",
                  attributes: [
                    { trait_type: "Event", value: "Mundial 2026" },
                    { trait_type: "Type", value: "Commemorative Certificate" }
                  ]
                }
              },
              price: {
                amount: "0.70",
                currency: "usd"
              }
            }],
            successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://mundial2026-mvp.vercel.app'}/recuerdo/${body.memoryId}?nft_success=true`,
            cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://mundial2026-mvp.vercel.app'}/recuerdo/${body.memoryId}?nft_cancelled=true`
          })
        }
      );

      console.log('📡 Production response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Production error:', errorText);
        return NextResponse.json({ 
          error: 'Error creating production checkout',
          details: errorText
        }, { status: 500 });
      }

      const sessionData = await res.json();
      console.log('✅ Production checkout session created:', sessionData);
      
      // Crear registro NFT pendiente (sin mint hasta confirmar pago)
      if (body.memoryId && sessionData.id) {
        const { error: certError } = await supabase
          .from('nft_certificates')
          .insert({
            memory_id: body.memoryId,
            user_id: user.id,
            payment_intent_id: sessionData.id,
            amount_paid: 0.70,
            currency: 'USD',
            status: 'pending',
            blockchain: 'polygon',
            is_eligible_for_auction: true
          })
        
        if (certError) {
          console.error('❌ Error creating pending NFT certificate:', certError)
        }
      }
      
      return NextResponse.json({
        success: true,
        sessionData: sessionData,
        checkoutUrl: sessionData.url,
        mode: 'production'
      });
    }

  } catch (error) {
    console.error('💥 Server error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}