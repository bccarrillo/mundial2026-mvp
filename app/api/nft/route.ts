import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateNFTPrice, createNFTCertificate, memoryHasNFT } from '@/lib/nft'
import { getUserPoints } from '@/lib/points'

// Verificar si estamos en modo demo
const isDemoMode = !process.env.CROSSMINT_PROJECT_ID

export async function POST(request: NextRequest) {
  try {
    // Debug: verificar variables de entorno
    console.log('Environment variables check:', {
      NFT_MODE: process.env.NFT_MODE,
      CROSSMINT_PROJECT_ID: process.env.CROSSMINT_PROJECT_ID ? 'SET' : 'NOT SET',
      CROSSMINT_CLIENT_SECRET: process.env.CROSSMINT_CLIENT_SECRET ? 'SET' : 'NOT SET',
      CROSSMINT_ENVIRONMENT: process.env.CROSSMINT_ENVIRONMENT
    })
    
    const { memory_id, mode = 'demo' } = await request.json()
    
    if (!memory_id) {
      return NextResponse.json({ error: 'Memory ID required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verificar que el recuerdo existe y pertenece al usuario
    const { data: memory, error: memoryError } = await supabase
      .from('memories')
      .select('id, title, image_url, user_id')
      .eq('id', memory_id)
      .eq('user_id', user.id)
      .single()

    if (memoryError || !memory) {
      return NextResponse.json({ error: 'Memory not found or not owned by user' }, { status: 404 })
    }

    // Verificar que no tenga NFT ya
    const hasNFT = await memoryHasNFT(memory_id)
    if (hasNFT) {
      return NextResponse.json({ error: 'Memory already has NFT certificate' }, { status: 400 })
    }

    // Obtener puntos del usuario para calcular precio
    const userPoints = await getUserPoints(user.id)
    const price = await calculateNFTPrice(user.id, userPoints?.level || 1)

    // Determinar modo de operación - usar directamente NFT_MODE
    const operationMode = process.env.NFT_MODE === 'production' ? 'production' : 'demo'
    
    console.log('Operation mode:', operationMode, 'NFT_MODE:', process.env.NFT_MODE)

    // MODO DEMO: Crear NFT directamente sin pago
    if (operationMode === 'demo') {
      console.log('Running in DEMO mode')
      const certificate = await createNFTCertificate(
        memory_id,
        user.id,
        user.email || '',
        `demo_nft_${Date.now()}`,
        price,
        'demo'
      )

      if (!certificate) {
        return NextResponse.json({ error: 'Failed to create NFT certificate' }, { status: 500 })
      }

      // Simular mint exitoso
      const { error: updateError } = await supabase
        .from('nft_certificates')
        .update({
          status: 'completed',
          token_id: `demo_${certificate.id.slice(0, 8)}`,
          contract_address: 'demo_contract',
          minted_at: new Date().toISOString()
        })
        .eq('id', certificate.id)

      if (updateError) {
        console.error('Error updating demo NFT:', updateError)
      }

      return NextResponse.json({
        success: true,
        certificate,
        price,
        message: '¡Recuerdo certificado como NFT! (Modo Demo)',
        demo: true
      })
    }

    // MODO PRODUCCIÓN: Crear NFT real con Crossmint
    console.log('Running in PRODUCTION mode - calling Crossmint')
    try {
      const certificate = await createNFTCertificate(
        memory_id,
        user.id,
        user.email || '',
        `crossmint_${Date.now()}`,
        price,
        'production'
      )

      if (!certificate) {
        return NextResponse.json({ error: 'Failed to create NFT certificate' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        certificate,
        price,
        message: certificate.status === 'minting' 
          ? 'NFT being created on blockchain. You\'ll receive email confirmation.' 
          : 'NFT creation failed. Please try again.',
        demo: false,
        debug: {
          status: certificate.status,
          blockchainId: certificate.token_id,
          transactionHash: certificate.mint_transaction_hash
        }
      })
    } catch (error) {
      console.error('Production NFT error:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to create NFT on blockchain',
        price,
        demo: false
      })
    }

  } catch (error) {
    console.error('Error creating NFT:', error)
    return NextResponse.json(
      { error: 'Failed to create NFT certificate' },
      { status: 500 }
    )
  }
}

// Obtener NFTs del usuario
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: certificates, error } = await supabase
      .from('nft_certificates')
      .select(`
        *,
        memories!inner(title, image_url, created_at)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching NFTs:', error)
      return NextResponse.json({ error: 'Failed to fetch NFTs' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      certificates: certificates || []
    })

  } catch (error) {
    console.error('Error in NFT GET:', error)
    return NextResponse.json(
      { error: 'Failed to fetch NFTs' },
      { status: 500 }
    )
  }
}