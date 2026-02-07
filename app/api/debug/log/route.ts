import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { level, category, message, data } = await request.json()
    
    const supabase = await createClient()
    
    const logEntry = {
      level,
      category,
      message,
      data: data ? JSON.stringify(data) : null,
      user_id: null,
      ip_address: null,
      user_agent: request.headers.get('user-agent') || null
    }

    const { error } = await supabase
      .from('debug_logs')
      .insert(logEntry)

    if (error) {
      console.error('Error inserting log:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error in log API:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}