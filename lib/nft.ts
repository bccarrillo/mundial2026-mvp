import { createClient } from '@/lib/supabase/server'
import { isUserVIP } from '@/lib/vip'

// Configuración Crossmint
const CROSSMINT_CONFIG = {
  projectId: process.env.CROSSMINT_PROJECT_ID!,
  clientSecret: process.env.CROSSMINT_API_KEY!, // Usar CROSSMINT_API_KEY
  collectionId: process.env.CROSSMINT_COLLECTION_ID || 'default',
  environment: process.env.CROSSMINT_ENVIRONMENT || 'staging',
  baseUrl: process.env.CROSSMINT_ENVIRONMENT === 'production' 
    ? 'https://api.crossmint.com' 
    : 'https://staging.crossmint.com'
}

// Configuración NFT
const NFT_MODE = process.env.NFT_MODE || 'demo' // 'demo' | 'production'

export interface NFTCertificate {
  id: string
  memory_id: string
  user_id: string
  token_id?: string
  contract_address?: string
  blockchain: string
  metadata_uri?: string
  image_uri?: string
  payment_intent_id?: string
  amount_paid: number
  currency: string
  status: 'pending' | 'minting' | 'completed' | 'failed'
  mint_transaction_hash?: string
  is_eligible_for_auction: boolean
  votes_received: number
  created_at: string
  minted_at?: string
}

export interface NFTMetadata {
  name: string
  description: string
  image: string
  external_url: string
  attributes: Array<{
    trait_type: string
    value: string | number
    display_type?: string
  }>
  properties: {
    category: string
    creator: string
    rights: string
  }
}

// Calcular precio NFT con descuentos VIP y por nivel
export async function calculateNFTPrice(userId: string, userLevel: number): Promise<number> {
  const pricingMode = process.env.NFT_PRICING_MODE || 'production'
  
  if (pricingMode === 'test') {
    // MODO TEST - Precio fijo $0.70 para todos
    return 0.70
  } else {
    // MODO PRODUCCIÓN - Cálculos completos por nivel y VIP
    let basePrice = 3 // Precio por defecto para usuarios nuevos
    
    if (userLevel >= 5) basePrice = 0.75     // Mínimo Crossmint para Leyendas
    else if (userLevel >= 4) basePrice = 1.5 // $1.50 para Campeones
    else if (userLevel >= 3) basePrice = 2.25 // $2.25 para Estrellas
    
    // Descuento VIP adicional (10%) pero respetando mínimo $0.75
    const vipStatus = await isUserVIP(userId)
    if (vipStatus && basePrice > 0.75) {
      basePrice = Math.max(0.75, basePrice * 0.9)
    }
    
    return Math.round(basePrice * 100) / 100
  }
}

// Verificar si un recuerdo ya tiene NFT
export async function memoryHasNFT(memoryId: string): Promise<boolean> {
  const supabase = await createClient()
  
  const { data } = await supabase
    .rpc('memory_has_nft', { memory_id_param: memoryId })
  
  return data || false
}

// Crear NFT real con Crossmint
async function mintNFTWithCrossmint(nftData: {
  userEmail: string
  title: string
  description: string
  imageUrl: string
  userLevel: number
  price: number
  createdAt: string
}) {
  const response = await fetch(`${CROSSMINT_CONFIG.baseUrl}/api/2022-06-09/collections/${CROSSMINT_CONFIG.collectionId}/nfts`, {
    method: 'POST',
    headers: {
      'X-API-KEY': CROSSMINT_CONFIG.clientSecret,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      recipient: `email:${nftData.userEmail}:polygon`,
      metadata: {
        name: `Mundial 2026 - ${nftData.title}`,
        description: nftData.description,
        image: nftData.imageUrl,
        attributes: [
          { trait_type: "Event", value: "Mundial 2026" },
          { trait_type: "User Level", value: nftData.userLevel },
          { trait_type: "Price Paid", value: `$${nftData.price}` },
          { trait_type: "Certification Date", value: nftData.createdAt }
        ]
      }
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Crossmint API Error:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText
    })
    throw new Error(`Crossmint API error: ${response.status} - ${errorText}`)
  }

  return response.json()
}

// Crear certificado NFT (modo demo o producción)
export async function createNFTCertificate(
  memoryId: string,
  userId: string,
  userEmail: string,
  paymentIntentId: string,
  amountPaid: number,
  mode: 'demo' | 'production' = NFT_MODE as 'demo' | 'production'
): Promise<NFTCertificate | null> {
  const supabase = await createClient()
  
  // Verificar que el recuerdo no tenga NFT ya
  const hasNFT = await memoryHasNFT(memoryId)
  if (hasNFT) {
    throw new Error('Este recuerdo ya tiene certificado NFT')
  }
  
  // Verificar que el usuario es dueño del recuerdo
  const { data: memory } = await supabase
    .from('memories')
    .select('user_id, title, image_url')
    .eq('id', memoryId)
    .eq('user_id', userId)
    .single()
  
  if (!memory) {
    throw new Error('Recuerdo no encontrado o no te pertenece')
  }

  let blockchainId = null
  let transactionHash = null
  let status: 'pending' | 'minting' | 'completed' | 'failed' = 'pending'

  // Si es modo producción, crear NFT real
  if (mode === 'production') {
    try {
      console.log('Creating NFT with Crossmint...', {
        userEmail,
        title: memory.title,
        price: amountPaid
      })
      
      const crossmintResult = await mintNFTWithCrossmint({
        userEmail,
        title: memory.title,
        description: `Certificado conmemorativo del Mundial 2026`,
        imageUrl: memory.image_url,
        userLevel: 1, // TODO: obtener nivel real del usuario
        price: amountPaid,
        createdAt: new Date().toISOString()
      })
      
      console.log('Crossmint result:', crossmintResult)
      
      blockchainId = crossmintResult.id
      transactionHash = crossmintResult.onChain?.txHash
      status = 'minting'
    } catch (error) {
      console.error('Crossmint error:', error)
      status = 'failed'
    }
  } else {
    // Modo demo - simular éxito
    status = 'completed'
  }
  
  // Crear certificado NFT en base de datos
  const { data: certificate, error } = await supabase
    .from('nft_certificates')
    .insert({
      memory_id: memoryId,
      user_id: userId,
      payment_intent_id: paymentIntentId,
      amount_paid: amountPaid,
      currency: 'USD',
      status,
      blockchain: 'polygon',
      is_eligible_for_auction: true,
      token_id: blockchainId,
      mint_transaction_hash: transactionHash
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating NFT certificate:', error)
    return null
  }
  
  return certificate
}

// Generar metadatos NFT
export function generateNFTMetadata(
  memory: any,
  certificate: NFTCertificate,
  userLevel: number
): NFTMetadata {
  const tokenId = certificate.id.slice(0, 8) // Usar primeros 8 chars del UUID
  
  return {
    name: `Mundial 2026 - Recuerdo #${tokenId}`,
    description: `Certificado conmemorativo del Mundial 2026. Recuerdo auténtico creado por un fan durante el evento más grande del fútbol mundial.`,
    image: certificate.image_uri || memory.image_url,
    external_url: `https://mundial2026.app/recuerdo/${memory.id}`,
    attributes: [
      {
        trait_type: "Evento",
        value: "FIFA World Cup 2026"
      },
      {
        trait_type: "Tipo",
        value: "Certificado Conmemorativo"
      },
      {
        trait_type: "Nivel Creador",
        value: userLevel
      },
      {
        trait_type: "Blockchain",
        value: "Polygon"
      },
      {
        trait_type: "Fecha Creación",
        value: new Date(certificate.created_at).toISOString().split('T')[0]
      },
      {
        display_type: "date",
        trait_type: "Timestamp",
        value: Math.floor(new Date(certificate.created_at).getTime() / 1000)
      }
    ],
    properties: {
      category: "commemorative",
      creator: certificate.user_id,
      rights: "Personal use only"
    }
  }
}

// Obtener NFTs del usuario
export async function getUserNFTs(userId: string): Promise<NFTCertificate[]> {
  const supabase = await createClient()
  
  const { data: certificates, error } = await supabase
    .from('nft_certificates')
    .select(`
      *,
      memories!inner(title, image_url, created_at)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching user NFTs:', error)
    return []
  }
  
  return certificates || []
}

// Obtener NFTs elegibles para subasta (Top por votos)
export async function getAuctionEligibleNFTs(limit: number = 100): Promise<any[]> {
  const supabase = await createClient()
  
  const { data: nfts, error } = await supabase
    .from('nft_certificates')
    .select(`
      *,
      memories!inner(title, image_url, created_at),
      profiles!inner(display_name)
    `)
    .eq('is_eligible_for_auction', true)
    .eq('status', 'completed')
    .order('votes_received', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching auction eligible NFTs:', error)
    return []
  }
  
  return nfts || []
}

// Votar por NFT para subasta
export async function voteForNFT(nftId: string, userId: string): Promise<boolean> {
  const supabase = await createClient()
  
  try {
    const { error } = await supabase
      .from('auction_votes')
      .insert({
        nft_certificate_id: nftId,
        voter_user_id: userId
      })
    
    if (error) {
      // Si es error de duplicado, está bien (ya votó)
      if (error.code === '23505') {
        return true
      }
      console.error('Error voting for NFT:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error in vote function:', error)
    return false
  }
}