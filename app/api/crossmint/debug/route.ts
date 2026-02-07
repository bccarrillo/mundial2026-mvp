import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log("=== CROSSMINT DEBUG ===")
  console.log("PROJECT:", process.env.NEXT_PUBLIC_CROSSMINT_PROJECT_ID)
  console.log("COLLECTION:", process.env.NEXT_PUBLIC_CROSSMINT_COLLECTION_ID)
  console.log("CLIENT_API_KEY:", process.env.NEXT_PUBLIC_CROSSMINT_CLIENT_API_KEY?.substring(0, 20) + "...")
  console.log("SERVER_API_KEY:", process.env.CROSSMINT_API_KEY?.substring(0, 20) + "...")
  console.log("NFT_PAYMENT_MODE:", process.env.NEXT_PUBLIC_NFT_PAYMENT_MODE)
  console.log("======================")

  return NextResponse.json({
    project: process.env.NEXT_PUBLIC_CROSSMINT_PROJECT_ID,
    collection: process.env.NEXT_PUBLIC_CROSSMINT_COLLECTION_ID,
    clientApiKey: process.env.NEXT_PUBLIC_CROSSMINT_CLIENT_API_KEY?.substring(0, 20) + "...",
    serverApiKey: process.env.CROSSMINT_API_KEY?.substring(0, 20) + "...",
    paymentMode: process.env.NEXT_PUBLIC_NFT_PAYMENT_MODE,
    timestamp: new Date().toISOString()
  })
}