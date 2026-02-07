import { createClient } from '@/lib/supabase/server'

export type LogLevel = 'info' | 'warn' | 'error' | 'debug'
export type LogCategory = 'crossmint' | 'nft' | 'payment' | 'auth' | 'api' | 'general'

interface LogData {
  level: LogLevel
  category: LogCategory
  message: string
  data?: any
  userId?: string
  ipAddress?: string
  userAgent?: string
}

export async function logToSupabase({
  level,
  category,
  message,
  data,
  userId,
  ipAddress,
  userAgent
}: LogData) {
  try {
    const supabase = await createClient()
    
    const logEntry = {
      level,
      category,
      message,
      data: data ? JSON.stringify(data) : null,
      user_id: userId || null,
      ip_address: ipAddress || null,
      user_agent: userAgent || null
    }

    const { error } = await supabase
      .from('debug_logs')
      .insert(logEntry)

    if (error) {
      console.error('Error logging to Supabase:', error)
    }
  } catch (error) {
    console.error('Failed to log to Supabase:', error)
  }
}

// Funciones de conveniencia
export const logInfo = (category: LogCategory, message: string, data?: any, userId?: string) =>
  logToSupabase({ level: 'info', category, message, data, userId })

export const logWarn = (category: LogCategory, message: string, data?: any, userId?: string) =>
  logToSupabase({ level: 'warn', category, message, data, userId })

export const logError = (category: LogCategory, message: string, data?: any, userId?: string) =>
  logToSupabase({ level: 'error', category, message, data, userId })

export const logDebug = (category: LogCategory, message: string, data?: any, userId?: string) =>
  logToSupabase({ level: 'debug', category, message, data, userId })