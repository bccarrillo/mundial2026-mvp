import { NextRequest, NextResponse } from 'next/server'

// Rate limiting básico en middleware
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Limpiar entradas expiradas
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

function checkRateLimit(identifier: string, limit: number, windowMs: number) {
  const now = Date.now()
  const key = `rate_limit:${identifier}`
  
  let entry = rateLimitStore.get(key)
  
  if (!entry || now > entry.resetTime) {
    entry = { count: 0, resetTime: now + windowMs }
  }
  
  entry.count++
  rateLimitStore.set(key, entry)
  
  const allowed = entry.count <= limit
  const remaining = Math.max(0, limit - entry.count)
  
  return { allowed, remaining, resetTime: entry.resetTime }
}

export function middleware(request: NextRequest) {
  // Solo aplicar rate limiting a rutas de autenticación
  if (request.nextUrl.pathname.startsWith('/api/auth/')) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    
    // Configuración de rate limiting
    const limit = parseInt(process.env.RATE_LIMIT_REGISTRATIONS_PER_HOUR || '3')
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_HOURS || '1') * 60 * 60 * 1000
    
    const rateLimitResult = checkRateLimit(`ip:${ip}`, limit, windowMs)
    
    if (!rateLimitResult.allowed) {
      console.warn(`Rate limit exceeded for IP: ${ip}`)
      
      return NextResponse.json(
        { 
          error: 'Demasiados intentos de registro. Intenta de nuevo más tarde.',
          resetTime: rateLimitResult.resetTime
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
          }
        }
      )
    }
    
    // Agregar headers informativos
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Limit', limit.toString())
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
    response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString())
    
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/auth/:path*',
  ],
}