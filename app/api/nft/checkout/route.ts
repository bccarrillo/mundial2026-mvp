import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateNFTPrice, memoryHasNFT } from '@/lib/nft'
import { getUserPoints } from '@/lib/points'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Checkout API called')
    
    const { memory_id } = await request.json()
    console.log('📝 Memory ID:', memory_id)
    
    if (!memory_id) {
      return NextResponse.json({ error: 'ID de recuerdo requerido' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    console.log('👤 User check:', user?.id, authError)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar que el recuerdo existe
    const { data: memory, error: memoryError } = await supabase
      .from('memories')
      .select('id, title, image_url, user_id')
      .eq('id', memory_id)
      .eq('user_id', user.id)
      .single()

    console.log('📸 Memory check:', memory?.title, memoryError)

    if (memoryError || !memory) {
      return NextResponse.json({ error: 'Recuerdo no encontrado' }, { status: 404 })
    }

    // Verificar que no tenga NFT ya
    const hasNFT = await memoryHasNFT(memory_id)
    console.log('🎫 Has NFT check:', hasNFT)
    
    if (hasNFT) {
      return NextResponse.json({ error: 'Ya tiene certificado NFT' }, { status: 400 })
    }

    // Obtener precio
    const userPoints = await getUserPoints(user.id)
    const price = await calculateNFTPrice(user.id, userPoints?.level || 1)
    console.log('💰 Price calculated:', price, 'Level:', userPoints?.level)

    const paymentMode = process.env.NFT_PAYMENT_MODE || 'test'
    console.log('🔧 Payment mode:', paymentMode)
    
    console.log("ENV:", process.env.VERCEL_ENV);
    console.log("API KEY EXISTS:", !!process.env.CROSSMINT_API_KEY);
    console.log("API KEY PREFIX:", process.env.CROSSMINT_API_KEY?.substring(0, 12));
    console.log("COLLECTION ID:", process.env.CROSSMINT_COLLECTION_ID);
    console.log("CROSSMINT_ENVIRONMENT:", process.env.CROSSMINT_ENVIRONMENT);
    
    if (paymentMode === 'test') {
      console.log('🧪 Creating test NFT')
      // MODO TEST - NFT gratis sin pago
      const { error: insertError } = await supabase
        .from('nft_certificates')
        .insert({
          memory_id: memory_id,
          user_id: user.id,
          payment_intent_id: `test_${Date.now()}`,
          amount_paid: price,
          currency: 'USD',
          status: 'completed',
          blockchain: 'polygon',
          is_eligible_for_auction: true,
          token_id: `test_${memory_id.slice(0, 8)}`,
          contract_address: 'test_contract'
        })

      if (insertError) {
        console.error('❌ Test NFT insert error:', insertError)
        return NextResponse.json({ error: 'Error creando NFT test' }, { status: 500 })
      }

      console.log('✅ Test NFT created successfully')
      return NextResponse.json({
        success: true,
        message: 'NFT de prueba creado (sin pago)',
        price,
        mode: 'test'
      })
    } else {
      console.log('🚀 Creating dynamic NFT mint')
      console.log('🔑 API Key exists:', !!process.env.CROSSMINT_API_KEY)
      console.log('📦 Collection ID:', process.env.CROSSMINT_COLLECTION_ID)
      
      // Validar variables de entorno
      if (!process.env.CROSSMINT_API_KEY) {
        console.error('❌ CROSSMINT_API_KEY not found')
        return NextResponse.json({ error: 'Configuración de Crossmint incompleta' }, { status: 500 })
      }
      
      if (!process.env.CROSSMINT_COLLECTION_ID) {
        console.error('❌ CROSSMINT_COLLECTION_ID not found')
        return NextResponse.json({ error: 'Collection ID no configurado' }, { status: 500 })
      }
      
      // Auto-detectar environment basado en API key
      const isStaging = process.env.CROSSMINT_API_KEY.startsWith('ck_staging_')
      const environment = isStaging ? 'staging' : 'production'
      const blockchain = isStaging ? 'polygon-amoy' : 'polygon'
      
      console.log('🌍 Environment:', environment)
      console.log('⛓️ Blockchain:', blockchain)
      
      const baseUrl = isStaging 
        ? 'https://staging.crossmint.com' 
        : 'https://www.crossmint.com'
      const ordersUrl = `${baseUrl}/api/2022-06-09/orders`
      
      console.log('🔗 Orders URL:', ordersUrl)
      console.log('🔗 Base URL:', baseUrl)
      
      const orderBody = {
        lineItems: [
          {
            collectionLocator: `crossmint:${process.env.CROSSMINT_COLLECTION_ID}`,
            callData: {
              method: "mintTo",
              args: {
                recipient: `email:${user.email}:${blockchain}`,
                metadata: {
                  name: `Mundial 2026 - ${memory.title}`,
                  description: 'Certificado conmemorativo del Mundial 2026',
                  image: memory.image_url,
                  attributes: [
                    { trait_type: "Event", value: "Mundial 2026" },
                    { trait_type: "User Level", value: userPoints?.level || 1 },
                    { trait_type: "Price Paid", value: `$${price}` },
                    { trait_type: "Memory ID", value: memory_id }
                  ]
                }
              }
            }
          }
        ],
        payment: {
          currency: 'USD',
          amount: price.toString()
        },
        successCallbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/nft-success?memory_id=${memory_id}`,
        failureCallbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/nft-error?memory_id=${memory_id}`
      }
      
      console.log('📤 Order body:', JSON.stringify(orderBody, null, 2))
      
      const orderResponse = await fetch(ordersUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.CROSSMINT_API_KEY!
        },
        body: JSON.stringify(orderBody)
      });

      console.log('📡 Order response status:', orderResponse.status)

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text()
        console.error('❌ Crossmint Order Error:', errorText)
        return NextResponse.json({
          error: 'Error creando order',
          details: errorText
        }, { status: 500 })
      }

      const orderData = await orderResponse.json()
      console.log('✅ Order created:', orderData)

      // Crear registro pendiente de pago
      const { error: pendingError } = await supabase
        .from('nft_certificates')
        .insert({
          memory_id: memory_id,
          user_id: user.id,
          payment_intent_id: orderData.id,
          amount_paid: price,
          currency: 'USD',
          status: 'pending',
          blockchain: blockchain,
          is_eligible_for_auction: true
        })
      
      if (pendingError) {
        console.error('❌ Error creating pending NFT:', pendingError)
      }

      return NextResponse.json({
        success: true,
        checkoutUrl: orderData.checkoutUrl,
        orderId: orderData.id,
        price,
        mode: environment
      })
    }

  } catch (error) {
    console.error('💥 Error in checkout API:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}