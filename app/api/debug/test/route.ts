import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Insertar log de prueba
    const { error } = await supabase
      .from('debug_logs')
      .insert({
        level: 'info',
        category: 'test',
        message: 'Test log from API',
        data: JSON.stringify({ 
          test: true, 
          timestamp: new Date().toISOString(),
          source: 'test-api'
        })
      })

    if (error) {
      console.error('Error inserting test log:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        hint: 'Probablemente la tabla debug_logs no existe. Ejecuta el SQL primero.'
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Log de prueba insertado correctamente' 
    })

  } catch (error) {
    console.error('Error in test log API:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      hint: 'Verifica que la tabla debug_logs exista en Supabase'
    }, { status: 500 })
  }
}