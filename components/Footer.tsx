'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Footer() {
  const [isAdmin, setIsAdmin] = useState(false)
  const isDebugMode = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true'
  const isProduction = process.env.NODE_ENV === 'production'
  
  useEffect(() => {
    checkAdminStatus()
  }, [])
  
  const checkAdminStatus = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        
        setIsAdmin(profile?.role === 'admin' || profile?.role === 'moderator')
      }
    } catch (error) {
      console.error('Error checking admin status:', error)
    }
  }
  
  return (
    <footer className="bg-gray-100 border-t mt-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div>
            © 2024 Mundial 2026 - Recuerdos NFT
          </div>
          
          <div className="flex items-center gap-4">
            <span className={`px-2 py-1 rounded text-xs font-mono ${
              isProduction 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {isProduction ? 'PROD' : 'DEV'}
            </span>
            
            {isDebugMode && (
              <Link 
                href="/debug"
                className="px-3 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600 transition-colors"
              >
                Debug
              </Link>
            )}
            
            {isAdmin && (
              <Link 
                href="/admin"
                className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
              >
                🛡️ Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}