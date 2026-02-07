import { toast } from 'sonner'

export function handleBlockedUserError(error: string) {
  console.log('🔍 Manejando error de usuario bloqueado:', error)
  if (error.includes('cuenta está suspendida')) {
    console.log('🚨 Mostrando toast de usuario bloqueado')
    toast.error('Tu cuenta está suspendida', {
      description: 'Contacta al administrador para más información.',
      duration: 5000
    })
    return true
  }
  return false
}

export async function makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  })

  if (!response.ok) {
    const error = await response.json()
    if (handleBlockedUserError(error.error)) {
      throw new Error('BLOCKED_USER')
    }
    throw new Error(error.error || 'Error en la solicitud')
  }

  return response.json()
}