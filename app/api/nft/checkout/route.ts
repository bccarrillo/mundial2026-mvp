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
      
      // MODO PRODUCCIÓN - Crear Crossmint Checkout Widget URL
      const checkoutUrl = `https://www.crossmint.com/checkout?` + new URLSearchParams({
        clientId: process.env.CROSSMINT_PROJECT_ID!,
        mintTo: user.email,
        listingId: process.env.CROSSMINT_COLLECTION_ID!,
        successCallbackURL: `https://tu-app.vercel.app/nft/success?memory_id=${memory_id}`,
        failureCallbackURL: `https://tu-app.vercel.app/nft/failure?memory_id=${memory_id}`
      })
      
      console.log('✅ Crossmint checkout URL created:', checkoutUrl)
      
      return NextResponse.json({
        success: true,
        checkoutUrl: checkoutUrl,
        price,
        mode: 'production'
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