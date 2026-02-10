import { createClient } from '@/lib/supabase/client';

interface LogLegalAcceptanceParams {
  userId: string;
  context: 'registration' | 'nft_payment';
  ipAddress?: string;
  userAgent?: string;
}

export async function logLegalAcceptance({
  userId,
  context,
  ipAddress
}: LogLegalAcceptanceParams) {
  // Validate required parameters
  if (!userId || !context) {
    console.error('Missing required parameters for legal logging:', { userId, context })
    return false
  }
  
  try {
    const response = await fetch('/api/legal/acceptance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        context,
        ipAddress: ipAddress || null
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error logging to Supabase via API:', errorData.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error logging to Supabase via API:', error);
    return false;
  }
}

// Función para obtener IP del cliente (lado servidor)
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

// Función para verificar si el usuario ya aceptó términos
export async function hasAcceptedTerms(userId: string, context: string): Promise<boolean> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('user_legal_acceptances')
      .select('id')
      .eq('user_id', userId)
      .eq('acceptance_context', context)
      .eq('document_version', '1.0')
      .single();

    return !error && !!data;
  } catch (error) {
    return false;
  }
}