import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const signature = request.headers.get('x-crossmint-signature')
    
    // Verificar webhook signature (simplificado para demo)
    if (!verifyWebhookSignature(body, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const supabase = await createClient()

    // Manejar diferentes tipos de eventos
    switch (body.type) {
      case 'nft.minted':
        await handleNFTMinted(supabase, body.data)
        break
      case 'nft.failed':
        await handleNFTFailed(supabase, body.data)
        break
      default:
        console.log('Unhandled webhook event:', body.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handleNFTMinted(supabase: any, data: any) {
  const { error } = await supabase
    .from('nft_certificates')
    .update({
      status: 'completed',
      mint_transaction_hash: data.onChain?.txHash,
      contract_address: data.onChain?.contractAddress,
      token_id: data.onChain?.tokenId,
      minted_at: new Date().toISOString()
    })
    .eq('token_id', data.id)

  if (error) {
    console.error('Error updating NFT status:', error)
  }
}

async function handleNFTFailed(supabase: any, data: any) {
  const { error } = await supabase
    .from('nft_certificates')
    .update({
      status: 'failed'
    })
    .eq('token_id', data.id)

  if (error) {
    console.error('Error updating failed NFT:', error)
  }
}

function verifyWebhookSignature(body: any, signature: string | null): boolean {
  // En producción, implementar verificación real según docs de Crossmint
  // Por ahora, aceptar todos los webhooks en desarrollo
  if (process.env.NODE_ENV === 'development') {
    return true
  }
  
  // TODO: Implementar verificación real con CROSSMINT_WEBHOOK_SECRET
  return signature !== null
}