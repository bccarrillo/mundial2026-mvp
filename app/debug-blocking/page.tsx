'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { makeAuthenticatedRequest } from '@/lib/blockedUserHandler'
import { toast } from 'sonner'

export default function DebugBlockingPage() {
  const [loading, setLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    loadDebugInfo()
  }, [])

  const loadDebugInfo = async () => {
    try {
      const response = await fetch('/api/debug-blocking')
      const data = await response.json()
      setDebugInfo(data)
    } catch (error) {
      console.error('Error cargando debug info:', error)
    }
  }

  const testCreateMemory = async () => {
    setLoading(true)
    try {
      await makeAuthenticatedRequest('/api/memories', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Test Memory',
          description: 'Test Description',
          image_url: 'https://example.com/test.jpg',
          is_public: true
        })
      })
      toast.success('Memoria creada exitosamente')
    } catch (error: any) {
      if (error.message !== 'BLOCKED_USER') {
        toast.error('Error: ' + error.message)
      }
    }
    setLoading(false)
  }

  const testCreateComment = async () => {
    setLoading(true)
    try {
      await makeAuthenticatedRequest('/api/comments', {
        method: 'POST',
        body: JSON.stringify({
          memory_id: '123',
          content: 'Test comment'
        })
      })
      toast.success('Comentario creado exitosamente')
    } catch (error: any) {
      if (error.message !== 'BLOCKED_USER') {
        toast.error('Error: ' + error.message)
      }
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🧪 Debug - Sistema de Bloqueo</h1>
      
      {/* Debug Info */}
      {debugInfo && (
        <div className="mb-6 p-4 bg-blue-50 rounded border">
          <h2 className="font-bold mb-2">🔍 Estado del Usuario:</h2>
          <pre className="text-xs bg-white p-2 rounded overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="space-y-4">
        <Button 
          onClick={testCreateMemory} 
          disabled={loading}
          className="w-full"
        >
          Probar Crear Memoria
        </Button>
        
        <Button 
          onClick={testCreateComment} 
          disabled={loading}
          className="w-full"
        >
          Probar Crear Comentario
        </Button>
        
        <Button 
          onClick={() => {
            fetch('/api/debug-blocking/block', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: debugInfo?.userId,
                reason: 'Prueba manual de bloqueo'
              })
            }).then(res => res.json()).then(data => {
              console.log('Resultado bloqueo:', data)
              toast.success('Usuario bloqueado manualmente')
              loadDebugInfo()
            }).catch(err => {
              console.error('Error bloqueando:', err)
              toast.error('Error bloqueando usuario')
            })
          }}
          variant="destructive"
          className="w-full"
        >
          🚫 Bloquear Usuario Manualmente
        </Button>
        
        <Button 
          onClick={loadDebugInfo} 
          variant="outline"
          className="w-full"
        >
          🔄 Recargar Estado
        </Button>
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">Instrucciones:</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Si estás bloqueado, deberías ver toast rojo "Tu cuenta está suspendida"</li>
          <li>Si no estás bloqueado, verás toast verde de éxito o error normal</li>
          <li>Revisa la consola del navegador para logs de debug</li>
          <li>El estado del usuario muestra si está en la tabla blocked_users</li>
        </ol>
      </div>
    </div>
  )
}