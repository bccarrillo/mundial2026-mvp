import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { memoryId } = await request.json()
    
    const supabase = await createClient()
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    // Create test NFT certificate
    const { data, error } = await supabase
      .from('nft_certificates')
      .insert({
        memory_id: memoryId,
        user_id: user.id,
        status: 'completed',
        minted_at: new Date().toISOString()
      })
      .select()

    if (error) {
      console.error('Error creating test certificate:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Test endpoint error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}