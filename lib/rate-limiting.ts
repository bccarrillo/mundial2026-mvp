// Sistema básico de rate limiting usando memoria local
// Para producción, reemplazar con Redis

interface RateLimitEntry {
  count: number
  resetTime: number
}

// Almacenamiento en memoria (temporal)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Limpiar entradas expiradas cada 5 minutos
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

export function checkRateLimit(
  identifier: string, 
  limit: number = 3, 
  windowMs: number = 60 * 60 * 1000 // 1 hora por defecto
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const key = `rate_limit:${identifier}`
  
  let entry = rateLimitStore.get(key)
  
  // Si no existe o expiró, crear nueva entrada
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + windowMs
    }
  }
  
  // Incrementar contador
  entry.count++
  rateLimitStore.set(key, entry)
  
  const allowed = entry.count <= limit
  const remaining = Math.max(0, limit - entry.count)
  
  return {
    allowed,
    remaining,
    resetTime: entry.resetTime
  }
}

export function getRateLimitStatus(identifier: string): {
  count: number
  remaining: number
  resetTime: number
} | null {
  const key = `rate_limit:${identifier}`
  const entry = rateLimitStore.get(key)
  
  if (!entry || Date.now() > entry.resetTime) {
    return null
  }
  
  const limit = parseInt(process.env.RATE_LIMIT_REGISTRATIONS_PER_HOUR || '3')
  
  return {
    count: entry.count,
    remaining: Math.max(0, limit - entry.count),
    resetTime: entry.resetTime
  }
}