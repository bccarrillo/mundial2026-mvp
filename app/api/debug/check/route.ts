import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Intentar leer logs
    const { data: readData, error: readError } = await supabase
      .from('debug_logs')
      .select('*')
      .limit(5)

    // Intentar insertar log
    const { data: insertData, error: insertError } = await supabase
      .from('debug_logs')
      .insert({
        level: 'debug',
        category: 'test',
        message: 'Test connection to debug_logs table',
        data: JSON.stringify({ 
          test: true, 
          timestamp: new Date().toISOString() 
        })
      })
      .select()

    return NextResponse.json({
      read: {
        success: !readError,
        error: readError?.message,
        count: readData?.length || 0
      },
      write: {
        success: !insertError,
        error: insertError?.message,
        data: insertData
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}