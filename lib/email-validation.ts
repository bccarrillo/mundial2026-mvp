// Utilidades para validación de emails y detección de spam
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isDisposableEmail(email: string): boolean {
  const disposableDomains = [
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'tempmail.org',
    'throwaway.email',
    'temp-mail.org',
    'yopmail.com',
    'maildrop.cc',
    'sharklasers.com',
    'grr.la',
    'guerrillamailblock.com'
  ]
  
  const domain = email.split('@')[1]?.toLowerCase()
  return disposableDomains.includes(domain)
}

export function isTrustedDomain(email: string): boolean {
  const trustedDomains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'icloud.com',
    'protonmail.com',
    'live.com',
    'msn.com',
    'aol.com',
    'zoho.com'
  ]
  
  const domain = email.split('@')[1]?.toLowerCase()
  return trustedDomains.includes(domain)
}

export async function validateEmailForRegistration(email: string) {
  // 1. Formato válido
  if (!isValidEmail(email)) {
    return { valid: false, reason: 'Formato de email inválido' }
  }
  
  // 2. No emails temporales
  if (isDisposableEmail(email)) {
    return { valid: false, reason: 'Los emails temporales no están permitidos' }
  }
  
  // 3. Verificar si es dominio confiable (opcional - solo warning)
  const trusted = isTrustedDomain(email)
  
  return { 
    valid: true, 
    trusted,
    warning: !trusted ? 'Email de dominio menos común - se requiere verificación' : null
  }
}