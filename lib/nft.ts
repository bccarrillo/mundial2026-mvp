import { createClient } from '@/lib/supabase/server'
import { isUserVIP } from '@/lib/vip'

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
  let basePrice = 3 // Precio por defecto para usuarios nuevos
  
  // Descuentos por nivel
  if (userLevel >= 5) basePrice = 0      // Gratis para Leyendas
  else if (userLevel >= 4) basePrice = 1 // $1 para Campeones
  else if (userLevel >= 3) basePrice = 2 // $2 para Estrellas
  
  // Descuento VIP adicional (10%)
  const vipStatus = await isUserVIP(userId)
  if (vipStatus && basePrice > 0) {
    basePrice = Math.max(0.1, basePrice * 0.9) // Mínimo $0.10
  }
  
  return Math.round(basePrice * 100) / 100 // Redondear a 2 decimales
}

// Verificar si un recuerdo ya tiene NFT
export async function memoryHasNFT(memoryId: string): Promise<boolean> {
  const supabase = await createClient()
  
  const { data } = await supabase
    .rpc('memory_has_nft', { memory_id_param: memoryId })
  
  return data || false
}

// Crear certificado NFT
export async function createNFTCertificate(
  memoryId: string,
  userId: string,
  paymentIntentId: string,
  amountPaid: number
): Promise<NFTCertificate | null> {
  const supabase = await createClient()
  
  // Verificar que el recuerdo no tenga NFT ya
  const hasNFT = await memoryHasNFT(memoryId)
  if (hasNFT) {
    throw new Error('Memory already has NFT certificate')
  }
  
  // Verificar que el usuario es dueño del recuerdo
  const { data: memory } = await supabase
    .from('memories')
    .select('user_id, title, image_url')
    .eq('id', memoryId)
    .eq('user_id', userId)
    .single()
  
  if (!memory) {
    throw new Error('Memory not found or not owned by user')
  }
  
  // Crear certificado NFT
  const { data: certificate, error } = await supabase
    .from('nft_certificates')
    .insert({
      memory_id: memoryId,
      user_id: userId,
      payment_intent_id: paymentIntentId,
      amount_paid: amountPaid,
      currency: 'USD',
      status: 'pending',
      blockchain: 'polygon',
      is_eligible_for_auction: true
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