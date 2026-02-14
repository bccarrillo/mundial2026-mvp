import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🎯 Crossmint webhook received:', body.type)

    const supabase = await createClient()

    // Pago confirmado - proceder con mint
    if (body.type === 'order.payment.succeeded') {
      const orderId = body.data.id
      
      // Buscar certificado pendiente
      const { data: cert, error: certError } = await supabase
        .from('nft_certificates')
        .select('*, memories(title, image_url)')
        .eq('payment_intent_id', orderId)
        .eq('status', 'pending')
        .single()

      if (certError || !cert) {
        console.error('❌ Certificate not found:', orderId)
        return NextResponse.json({ received: true })
      }

      // Actualizar estado a "minting"
      await supabase
        .from('nft_certificates')
        .update({ status: 'minting' })
        .eq('id', cert.id)

      // Mintear NFT con Crossmint
      const mintResponse = await fetch(
        `${process.env.CROSSMINT_ENVIRONMENT === 'production' ? 'https://api.crossmint.com' : 'https://staging.crossmint.com'}/api/2022-06-09/collections/${process.env.CROSSMINT_COLLECTION_ID}/nfts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.CROSSMINT_API_KEY!
          },
          body: JSON.stringify({
            recipient: `email:${body.data.recipient.email}:${process.env.CROSSMINT_ENVIRONMENT === 'production' ? 'polygon' : 'polygon-amoy'}`,
            metadata: {
              name: `Mundial 2026 - ${cert.memories.title}`,
              description: 'Certificado conmemorativo del Mundial 2026',
              image: cert.memories.image_url,
              attributes: [
                { trait_type: "Event", value: "Mundial 2026" },
                { trait_type: "Order ID", value: orderId }
              ]
            }
          })
        }
      )

      if (mintResponse.ok) {
        const nftData = await mintResponse.json()
        
        // Actualizar con datos del NFT
        await supabase
          .from('nft_certificates')
          .update({
            status: 'completed',
            token_id: nftData.id,
            mint_transaction_hash: nftData.onChain?.txHash,
            minted_at: new Date().toISOString()
          })
          .eq('id', cert.id)
          
        console.log('✅ NFT minted successfully:', nftData.id)
      } else {
        // Error en mint
        await supabase
          .from('nft_certificates')
          .update({ status: 'failed' })
          .eq('id', cert.id)
          
        console.error('❌ Mint failed for order:', orderId)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('💥 Webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}