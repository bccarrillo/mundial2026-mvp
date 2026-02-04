import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  const { count: usersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
  
  const { count: memoriesCount } = await supabase
    .from('memories')
    .select('*', { count: 'exact', head: true })
  
  return NextResponse.json({
    users: usersCount || 0,
    memories: memoriesCount || 0
  })
}
