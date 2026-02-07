'use client'

import { useState, useEffect } from 'react'
import { getRateLimitStatus } from '@/lib/rate-limiting'

interface AntiSpamMonitorProps {
  className?: string
}

export default function AntiSpamMonitor({ className }: AntiSpamMonitorProps) {
  const [stats, setStats] = useState({
    registrationsToday: 0,
    blockedAttempts: 0,
    rateLimitStatus: null as any
  })

  useEffect(() => {
    // Obtener estadísticas de rate limiting
    const updateStats = () => {
      const rateLimitStatus = getRateLimitStatus('ip:current')
      setStats(prev => ({
        ...prev,
        rateLimitStatus
      }))
    }

    updateStats()
    const interval = setInterval(updateStats, 30000) // Actualizar cada 30 segundos

    return () => clearInterval(interval)
  }, [])

  if (process.env.NODE_ENV !== 'development') {
    return null // Solo mostrar en desarrollo
  }

  return (
    <div className={`bg-gray-100 p-3 rounded-lg text-xs ${className}`}>
      <h4 className="font-semibold mb-2">🛡️ Monitor Anti-Spam</h4>
      <div className="space-y-1">
        <div>Registros hoy: {stats.registrationsToday}</div>
        <div>Intentos bloqueados: {stats.blockedAttempts}</div>
        {stats.rateLimitStatus && (
          <div>
            Rate limit: {stats.rateLimitStatus.remaining} restantes
          </div>
        )}
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Sistema activo</span>
        </div>
      </div>
    </div>
  )
}