export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params)
  }
}

// Eventos predefinidos
export const events = {
  // Registro
  signUp: (method: string) => trackEvent('sign_up', { method }),
  
  // Recuerdos
  createMemory: () => trackEvent('create_memory'),
  shareMemory: (memoryId: string) => trackEvent('share', { content_type: 'memory', item_id: memoryId }),
  likeMemory: (memoryId: string) => trackEvent('like', { content_type: 'memory', item_id: memoryId }),
  
  // Invitaciones
  shareInvite: () => trackEvent('share_invite'),
  acceptInvite: (inviterId: string) => trackEvent('accept_invite', { inviter_id: inviterId }),
  
  // Navegación
  viewFeed: () => trackEvent('view_feed'),
  viewMemory: (memoryId: string) => trackEvent('view_item', { item_id: memoryId }),
}
