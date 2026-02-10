import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { userId, context, ipAddress } = await request.json()
    
    if (!userId || !context) {
      return NextResponse.json({ 
        error: 'Missing required fields: userId and context are required'
      }, { status: 400 })
    }
    
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('user_legal_acceptances')
      .insert({
        user_id: userId,
        acceptance_context: context,
        ip_address: ipAddress || null
      })
      .select()

    if (error) {
      return NextResponse.json({ 
        error: 'Insert failed', 
        details: error.message 
      }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}