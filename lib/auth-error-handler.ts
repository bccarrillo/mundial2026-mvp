import { createClient } from './supabase/client';

export async function handleAuthError(error: any) {
  // Check if it's an invalid refresh token error
  if (error?.message?.includes('Invalid Refresh Token') || 
      error?.message?.includes('Refresh Token Not Found')) {
    
    const supabase = createClient();
    
    // Clear the invalid session
    await supabase.auth.signOut();
    
    // Clear any stored auth data
    localStorage.removeItem('supabase.auth.token');
    
    // Redirect to landing page
    window.location.href = '/v2/landing';
    
    return true; // Indicates error was handled
  }
  
  return false; // Error not handled
}

export async function getAuthenticatedUser() {
  const supabase = createClient();
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      const handled = await handleAuthError(error);
      if (handled) return null;
      throw error;
    }
    
    return user;
  } catch (error) {
    const handled = await handleAuthError(error);
    if (handled) return null;
    throw error;
  }
}