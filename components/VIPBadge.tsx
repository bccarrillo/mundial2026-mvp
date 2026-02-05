'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface VIPBadgeProps {
  isVIP: boolean
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export default function VIPBadge({ 
  isVIP, 
  size = 'md', 
  showText = true, 
  className = '' 
}: VIPBadgeProps) {
  if (!isVIP) return null

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  }

  const iconSizes = {
    sm: 'text-xs',
    md: 'text-sm', 
    lg: 'text-base'
  }

  return (
    <div className={`
      inline-flex items-center gap-1 
      bg-gradient-to-r from-yellow-400 to-orange-500 
      text-white font-semibold rounded-full
      shadow-sm hover:shadow-md transition-shadow
      ${sizeClasses[size]} ${className}
    `}>
      <span className={`${iconSizes[size]}`}>👑</span>
      {showText && <span>VIP</span>}
    </div>
  )
}

// Hook para verificar estado VIP (simplificado)
export function useVIPStatus(userId?: string) {
  const [isVIP, setIsVIP] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const checkVIPStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setIsVIP(false)
          setLoading(false)
          return
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('is_vip')
          .eq('id', user.id)
          .single()
        
        if (!error && data) {
          setIsVIP(data.is_vip || false)
        } else {
          setIsVIP(false)
        }
      } catch (error) {
        console.error('Error checking VIP status:', error)
        setIsVIP(false)
      } finally {
        setLoading(false)
      }
    }

    checkVIPStatus()
  }, [userId, supabase])

  return { isVIP, loading }
}