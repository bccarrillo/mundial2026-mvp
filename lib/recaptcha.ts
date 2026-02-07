// Utilidad para verificar reCAPTCHA v3 en el servidor

export async function verifyRecaptcha(token: string): Promise<{
  success: boolean
  score?: number
  error?: string
}> {
  try {
    // Modo desarrollo - siempre pasar
    if (process.env.RECAPTCHA_DEVELOPMENT_MODE === 'true') {
      console.log('🧪 reCAPTCHA development mode - bypassing verification')
      return { success: true, score: 0.9 }
    }
    
    const secretKey = process.env.RECAPTCHA_SECRET_KEY
    
    if (!secretKey) {
      console.error('RECAPTCHA_SECRET_KEY no configurada')
      return { success: false, error: 'Configuración de reCAPTCHA faltante' }
    }
    
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`
    })
    
    const data = await response.json()
    
    if (!data.success) {
      console.error('reCAPTCHA verification failed:', data['error-codes'])
      return { 
        success: false, 
        error: 'Verificación de reCAPTCHA fallida' 
      }
    }
    
    // reCAPTCHA v3 devuelve un score de 0.0 a 1.0
    // 1.0 = muy probablemente humano
    // 0.0 = muy probablemente bot
    const score = data.score || 0
    
    // Umbral mínimo de 0.5 (ajustable)
    const minScore = 0.5
    
    if (score < minScore) {
      console.warn(`reCAPTCHA score bajo: ${score}`)
      return { 
        success: false, 
        score,
        error: 'Verificación de seguridad fallida' 
      }
    }
    
    return { success: true, score }
    
  } catch (error) {
    console.error('Error verificando reCAPTCHA:', error)
    return { 
      success: false, 
      error: 'Error interno de verificación' 
    }
  }
}