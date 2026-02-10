import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // This endpoint is for general debug logging, not legal acceptances
    // Just log and return success
    console.log('Debug log:', body)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Debug log error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}