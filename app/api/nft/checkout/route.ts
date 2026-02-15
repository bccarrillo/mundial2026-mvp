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

    const paymentMode = process.env.NFT_PAYMENT_MODE || 'production'
    console.log('🔧 Payment mode:', paymentMode)
    
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
      console.log('🚀 Creating Crossmint checkout')
      console.log('🔑 API Key exists:', !!process.env.CROSSMINT_API_KEY)
      console.log('📦 Collection ID:', process.env.CROSSMINT_COLLECTION_ID)
      
      // MODO PRODUCCIÓN - Crear Crossmint Checkout Session con mint dinámico
      const baseUrl = process.env.CROSSMINT_ENVIRONMENT === 'staging' 
        ? 'https://staging.crossmint.com' 
        : 'https://www.crossmint.com'
      
      const checkoutResponse = await fetch(
        `${baseUrl}/api/2022-06-09/collections/${process.env.CROSSMINT_COLLECTION_ID}/nfts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.CROSSMINT_API_KEY!
          },
          body: JSON.stringify({
            recipient: `email:${user.email}:${process.env.CROSSMINT_ENVIRONMENT === 'staging' ? 'polygon-amoy' : 'polygon'}`,
            metadata: {
              name: `Mundial 2026 - ${memory.title}`,
              description: 'Certificado conmemorativo del Mundial 2026',
              image: memory.image_url,
              attributes: [
                { trait_type: "Event", value: "Mundial 2026" },
                { trait_type: "User Level", value: userPoints?.level || 1 },
                { trait_type: "Price Paid", value: `$${price}` }
              ]
            }
          })
        }
      );

      if (!checkoutResponse.ok) {
        const errorText = await checkoutResponse.text()
        console.error('❌ Crossmint Checkout Error:', errorText)
        return NextResponse.json({
          error: 'Error creando checkout',
          details: errorText
        }, { status: 500 })
      }

      const checkoutData = await checkoutResponse.json()
      console.log('✅ Crossmint NFT minted:', checkoutData)

      // Crear registro NFT completado
      if (checkoutData.id) {
        const { error: certError } = await supabase
          .from('nft_certificates')
          .insert({
            memory_id: memory_id,
            user_id: user.id,
            payment_intent_id: checkoutData.id,
            amount_paid: price,
            currency: 'USD',
            status: 'completed',
            blockchain: 'polygon',
            is_eligible_for_auction: true,
            token_id: checkoutData.id,
            mint_transaction_hash: checkoutData.onChain?.txHash,
            minted_at: new Date().toISOString()
          })
        
        if (certError) {
          console.error('❌ Error creating NFT certificate:', certError)
        }
      }

      return NextResponse.json({
        success: true,
        nftData: checkoutData,
        price,
        mode: process.env.CROSSMINT_ENVIRONMENT || 'production'
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