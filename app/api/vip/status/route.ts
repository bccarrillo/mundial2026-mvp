import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ isVIP: false })
    }

    // Verificar estado VIP
    const { data: isVIP } = await supabase
      .rpc('is_user_vip', { user_id_param: user.id })

    return NextResponse.json({ 
      isVIP: isVIP || false,
      userId: user.id 
    })

  } catch (error) {
    console.error('Error checking VIP status:', error)
    return NextResponse.json({ isVIP: false })
  }
}