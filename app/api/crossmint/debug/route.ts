import { NextRequest, NextResponse } from 'next/server'
import { logDebug } from '@/lib/logger'

export async function GET(request: NextRequest) {
  const debugData = {
    project: process.env.NEXT_PUBLIC_CROSSMINT_PROJECT_ID,
    collection: process.env.NEXT_PUBLIC_CROSSMINT_COLLECTION_ID,
    clientApiKey: process.env.NEXT_PUBLIC_CROSSMINT_CLIENT_API_KEY?.substring(0, 20) + "...",
    serverApiKey: process.env.CROSSMINT_API_KEY?.substring(0, 20) + "...",
    paymentMode: process.env.NEXT_PUBLIC_NFT_PAYMENT_MODE,
    timestamp: new Date().toISOString()
  }

  // Log a Supabase
  await logDebug('crossmint', 'Debug API called', debugData)

  console.log("=== CROSSMINT DEBUG ===")
  console.log("PROJECT:", debugData.project)
  console.log("COLLECTION:", debugData.collection)
  console.log("CLIENT_API_KEY:", debugData.clientApiKey)
  console.log("SERVER_API_KEY:", debugData.serverApiKey)
  console.log("NFT_PAYMENT_MODE:", debugData.paymentMode)
  console.log("======================")

  return NextResponse.json(debugData)
}