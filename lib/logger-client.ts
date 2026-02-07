export type LogLevel = 'info' | 'warn' | 'error' | 'debug'
export type LogCategory = 'crossmint' | 'nft' | 'payment' | 'auth' | 'api' | 'general'

interface LogData {
  level: LogLevel
  category: LogCategory
  message: string
  data?: any
}

export async function logToSupabaseClient({
  level,
  category,
  message,
  data
}: LogData) {
  try {
    const response = await fetch('/api/debug/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        level,
        category,
        message,
        data
      })
    })

    if (!response.ok) {
      console.error('Error logging to Supabase via API:', response.statusText)
    }
  } catch (error) {
    console.error('Failed to log to Supabase via API:', error)
  }
}

// Funciones de conveniencia para client components
export const logInfoClient = (category: LogCategory, message: string, data?: any) =>
  logToSupabaseClient({ level: 'info', category, message, data })

export const logWarnClient = (category: LogCategory, message: string, data?: any) =>
  logToSupabaseClient({ level: 'warn', category, message, data })

export const logErrorClient = (category: LogCategory, message: string, data?: any) =>
  logToSupabaseClient({ level: 'error', category, message, data })

export const logDebugClient = (category: LogCategory, message: string, data?: any) =>
  logToSupabaseClient({ level: 'debug', category, message, data })