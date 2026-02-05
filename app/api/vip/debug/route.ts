import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verificar estado en profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_vip')
      .eq('id', user.id)
      .single()

    // Verificar estado en vip_memberships
    const { data: membership, error: membershipError } = await supabase
      .from('vip_memberships')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)

    return NextResponse.json({
      userId: user.id,
      profile: {
        is_vip: profile?.is_vip || false,
        error: profileError?.message
      },
      membership: {
        exists: membership && membership.length > 0,
        data: membership,
        error: membershipError?.message
      }
    })

  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ error: 'Debug failed' }, { status: 500 })
  }
}