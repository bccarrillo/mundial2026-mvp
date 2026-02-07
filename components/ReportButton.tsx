'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface ReportButtonProps {
  memoryId: number
  reportedUserId: string
}

export default function ReportButton({ memoryId, reportedUserId }: ReportButtonProps) {
  const [isReporting, setIsReporting] = useState(false)
  const supabase = createClient()

  const reportContent = async () => {
    try {
      setIsReporting(true)
      
      const reason = prompt('¿Por qué reportas este contenido?\n\nOpciones:\n- Contenido inapropiado\n- Spam\n- Violencia\n- Fuera de tema\n- Otro')
      
      if (!reason) {
        setIsReporting(false)
        return
      }

      const response = await fetch('/api/admin/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memoryId,
          reportedUserId,
          reason
        })
      })

      if (response.ok) {
        alert('Reporte enviado. Gracias por ayudar a mantener la comunidad segura.')
      } else {
        alert('Error enviando reporte. Intenta de nuevo.')
      }
    } catch (error) {
      console.error('Error reportando:', error)
      alert('Error enviando reporte')
    } finally {
      setIsReporting(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={reportContent}
      disabled={isReporting}
      className="text-gray-500 hover:text-red-600"
    >
      🚨 {isReporting ? 'Enviando...' : 'Reportar'}
    </Button>
  )
}