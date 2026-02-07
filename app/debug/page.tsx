'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface DebugLog {
  id: string
  created_at: string
  level: string
  category: string
  message: string
  data: any
  user_id?: string
}

export default function DebugLogsPage() {
  const [logs, setLogs] = useState<DebugLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [envVars, setEnvVars] = useState<any>(null)
  const [loadingEnv, setLoadingEnv] = useState(false)

  useEffect(() => {
    fetchLogs()
  }, [filter])

  const fetchLogs = async () => {
    setLoading(true)
    const supabase = createClient()
    
    let query = supabase
      .from('debug_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (filter !== 'all') {
      query = query.eq('category', filter)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching logs:', error)
    } else {
      setLogs(data || [])
    }
    setLoading(false)
  }

  const fetchEnvVars = async () => {
    setLoadingEnv(true)
    try {
      const response = await fetch('/api/crossmint/debug')
      const data = await response.json()
      setEnvVars(data)
    } catch (error) {
      console.error('Error fetching env vars:', error)
    }
    setLoadingEnv(false)
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-50'
      case 'warn': return 'text-yellow-600 bg-yellow-50'
      case 'info': return 'text-blue-600 bg-blue-50'
      case 'debug': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🔍 Debug Panel</h1>
        <div className="flex gap-2">
          <button 
            onClick={fetchEnvVars}
            disabled={loadingEnv}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loadingEnv ? 'Cargando...' : '🔧 Ver Variables'}
          </button>
          <button 
            onClick={fetchLogs}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            🔄 Refresh Logs
          </button>
        </div>
      </div>

      {/* Panel de Variables de Entorno */}
      {envVars && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">🔧 Variables de Entorno Crossmint</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">PROJECT ID:</span>
                <span className={`font-mono text-sm ${envVars.project ? 'text-green-600' : 'text-red-600'}`}>
                  {envVars.project || '❌ No configurado'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">COLLECTION ID:</span>
                <span className={`font-mono text-sm ${envVars.collection ? 'text-green-600' : 'text-red-600'}`}>
                  {envVars.collection || '❌ No configurado'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">PAYMENT MODE:</span>
                <span className={`font-mono text-sm ${envVars.paymentMode ? 'text-green-600' : 'text-red-600'}`}>
                  {envVars.paymentMode || '❌ No configurado'}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">CLIENT API KEY:</span>
                <span className={`font-mono text-sm ${envVars.clientApiKey && envVars.clientApiKey !== 'undefined...' ? 'text-green-600' : 'text-red-600'}`}>
                  {envVars.clientApiKey && envVars.clientApiKey !== 'undefined...' ? envVars.clientApiKey : '❌ No configurado'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">SERVER API KEY:</span>
                <span className={`font-mono text-sm ${envVars.serverApiKey && envVars.serverApiKey !== 'undefined...' ? 'text-green-600' : 'text-red-600'}`}>
                  {envVars.serverApiKey && envVars.serverApiKey !== 'undefined...' ? envVars.serverApiKey : '❌ No configurado'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Timestamp:</span>
                <span className="font-mono text-sm text-gray-600">
                  {new Date(envVars.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          
          {/* Status General */}
          <div className="mt-4 p-3 rounded border-l-4 ${
            envVars.project && envVars.collection && envVars.clientApiKey && envVars.clientApiKey !== 'undefined...' 
              ? 'border-green-500 bg-green-50' 
              : 'border-red-500 bg-red-50'
          }">
            <div className="font-semibold ${
              envVars.project && envVars.collection && envVars.clientApiKey && envVars.clientApiKey !== 'undefined...' 
                ? 'text-green-800' 
                : 'text-red-800'
            }">
              {envVars.project && envVars.collection && envVars.clientApiKey && envVars.clientApiKey !== 'undefined...' 
                ? '✅ Configuración Completa' 
                : '❌ Configuración Incompleta'
              }
            </div>
            <div className="text-sm mt-1 ${
              envVars.project && envVars.collection && envVars.clientApiKey && envVars.clientApiKey !== 'undefined...' 
                ? 'text-green-700' 
                : 'text-red-700'
            }">
              {envVars.project && envVars.collection && envVars.clientApiKey && envVars.clientApiKey !== 'undefined...' 
                ? 'Todas las variables necesarias están configuradas' 
                : 'Faltan variables de entorno críticas'
              }
            </div>
          </div>
        </div>
      )}

      {/* Filtros de Logs */}
      <div className="mb-4 flex gap-2">
        {['all', 'crossmint', 'nft', 'payment', 'auth', 'api'].map(category => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-3 py-1 rounded text-sm ${
              filter === category 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category === 'all' ? 'Todos' : category}
          </button>
        ))}
      </div>

      {/* Logs */}
      <div>
        <h2 className="text-lg font-semibold mb-4">📋 Logs del Sistema</h2>
        {loading ? (
          <div className="text-center py-8">Cargando logs...</div>
        ) : (
          <div className="space-y-2">
            {logs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay logs disponibles
              </div>
            ) : (
              logs.map(log => (
                <div key={log.id} className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getLevelColor(log.level)}`}>
                        {log.level.toUpperCase()}
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        {log.category}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-800 mb-2">
                    {log.message}
                  </div>
                  
                  {log.data && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                        Ver datos
                      </summary>
                      <pre className="mt-2 p-2 bg-gray-100 rounded overflow-x-auto">
                        {JSON.stringify(JSON.parse(log.data), null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}