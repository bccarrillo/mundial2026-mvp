'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Memory {
  id: number
  title: string
  image_url: string
  created_at: string
  user_id: string
  profiles: {
    email: string
    display_name: string
  } | null
}

interface Report {
  id: number
  reason: string
  created_at: string
  memories: Memory
  reported_user: {
    id: string
    email: string
    display_name: string
  }
  reporter: {
    email: string
    display_name: string
  }
}

export default function AdminPanel() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [blockedUsers, setBlockedUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMemories, setLoadingMemories] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [filterUser, setFilterUser] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [allUsers, setAllUsers] = useState<{email: string, display_name: string}[]>([])

  const supabase = createClient()

  useEffect(() => {
    checkAdminAccess()
  }, [])

  useEffect(() => {
    if (isAdmin) {
      loadInitialData()
    }
  }, [isAdmin])

  useEffect(() => {
    if (isAdmin && (filterUser || filterDate)) {
      loadFilteredData()
    } else if (isAdmin && !filterUser && !filterDate) {
      loadInitialData()
    }
  }, [filterUser, filterDate])

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || !['admin', 'moderator'].includes(profile.role)) {
        alert('No tienes permisos de administrador')
        window.location.href = '/'
        return
      }

      setIsAdmin(true)
      // No llamar loadData aquí, se llama en useEffect
    } catch (error) {
      console.error('Error verificando acceso:', error)
      window.location.href = '/'
    }
  }

  const loadInitialData = async () => {
    try {
      setLoading(true)
      
      // Cargar datos en paralelo para mejor performance
      const [memoriesResult, usersResult, reportsResult, blockedUsersResult] = await Promise.all([
        // Memorias recientes (incluye eliminadas para moderación)
        supabase
          .from('memories')
          .select(`
            *,
            profiles (email, display_name)
          `)
          .order('created_at', { ascending: false })
          .limit(20),
        
        // Lista de usuarios
        supabase
          .from('profiles')
          .select('email, display_name')
          .order('email'),
        
        // Cargar reportes pendientes
        fetch('/api/admin/reports')
          .then(res => res.json())
          .catch(err => {
            console.error('Error cargando reportes:', err)
            return { reports: [] }
          }),
        
        // Cargar usuarios bloqueados con información de perfiles
        supabase
          .from('blocked_users')
          .select('*')
          .order('blocked_at', { ascending: false })
      ])

      setMemories(memoriesResult.data || [])
      setAllUsers(usersResult.data || [])
      setReports(reportsResult.reports || [])
      
      // Obtener información de perfiles para usuarios bloqueados
      const blockedUsersWithProfiles = await Promise.all(
        (blockedUsersResult.data || []).map(async (blocked) => {
          const [userProfile, blockerProfile] = await Promise.all([
            supabase.from('profiles').select('email, display_name').eq('id', blocked.user_id).single(),
            supabase.from('profiles').select('email, display_name').eq('id', blocked.blocked_by).single()
          ])
          
          return {
            ...blocked,
            userProfile: userProfile.data,
            blockerProfile: blockerProfile.data
          }
        })
      )
      
      setBlockedUsers(blockedUsersWithProfiles)
      console.log('🔍 Usuarios bloqueados cargados:', blockedUsersWithProfiles)
      setLoading(false)
    } catch (error) {
      console.error('Error cargando datos iniciales:', error)
      setLoading(false)
    }
  }

  const loadFilteredData = async () => {
    try {
      setLoadingMemories(true)
      
      // Solo recargar memorias con filtros (incluye eliminadas)
      let memoriesQuery = supabase
        .from('memories')
        .select(`
          *,
          profiles (email, display_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50)
      
      // Aplicar filtros
      if (filterUser) {
        memoriesQuery = memoriesQuery
          .not('profiles', 'is', null)
          .eq('profiles.email', filterUser)
      }
      
      if (filterDate) {
        const startDate = new Date(filterDate)
        const endDate = new Date(filterDate)
        endDate.setDate(endDate.getDate() + 1)
        
        memoriesQuery = memoriesQuery
          .gte('created_at', startDate.toISOString())
          .lt('created_at', endDate.toISOString())
      }
      
      const { data: memoriesData } = await memoriesQuery
      setMemories(memoriesData || [])
      setLoadingMemories(false)
    } catch (error) {
      console.error('Error cargando datos filtrados:', error)
      setLoadingMemories(false)
    }
  }

  const deleteMemory = async (memoryId: number, userId: string, reason: string) => {
    try {
      const response = await fetch('/api/admin/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_memory',
          memoryId,
          userId,
          reason
        })
      })

      if (response.ok) {
        alert('Contenido eliminado')
        // Recargar solo si no hay filtros, sino recargar filtrados
        if (filterUser || filterDate) {
          loadFilteredData()
        } else {
          loadInitialData()
        }
      } else {
        alert('Error eliminando contenido')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error eliminando contenido')
    }
  }

  const blockUser = async (userId: string, reason: string) => {
    try {
      const response = await fetch('/api/admin/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'block_user',
          userId,
          reason
        })
      })

      if (response.ok) {
        alert('Usuario bloqueado')
        // Recargar solo si no hay filtros, sino recargar filtrados
        if (filterUser || filterDate) {
          loadFilteredData()
        } else {
          loadInitialData()
        }
      } else {
        alert('Error bloqueando usuario')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error bloqueando usuario')
    }
  }

  const restoreMemory = async (memoryId: number) => {
    try {
      const response = await fetch('/api/admin/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'restore_memory',
          memoryId
        })
      })

      if (response.ok) {
        alert('Contenido restaurado')
        // Recargar solo si no hay filtros, sino recargar filtrados
        if (filterUser || filterDate) {
          loadFilteredData()
        } else {
          loadInitialData()
        }
      } else {
        alert('Error restaurando contenido')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error restaurando contenido')
    }
  }

  const unblockUser = async (userId: string) => {
    try {
      const response = await fetch('/api/admin/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'unblock_user',
          userId
        })
      })

      if (response.ok) {
        alert('Usuario desbloqueado')
        // Recargar datos completos
        loadInitialData()
      } else {
        alert('Error desbloqueando usuario')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error desbloqueando usuario')
    }
  }

  if (!isAdmin || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🛡️ Panel de Moderación</h1>
      
      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🔍 Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Usuario</label>
              <select 
                value={filterUser} 
                onChange={(e) => setFilterUser(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Todos los usuarios</option>
                {allUsers.map((user) => (
                  <option key={user.email} value={user.email}>
                    {user.display_name ? `${user.display_name} (${user.email})` : user.email}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Fecha</label>
              <input 
                type="date" 
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={() => {
                  setFilterUser('')
                  setFilterDate('')
                }}
                variant="outline"
                className="w-full"
              >
                🗑️ Limpiar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>📊 Contenido Activo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{memories.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>🚨 Reportes Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{reports?.length || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>🚫 Usuarios Bloqueados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">{blockedUsers.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Usuarios Bloqueados */}
      {blockedUsers && blockedUsers.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🚫 Usuarios Bloqueados</CardTitle>
          </CardHeader>
          <CardContent>
            {blockedUsers.map((blocked) => (
              <div key={blocked.id} className="border-b pb-4 mb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p><strong>Usuario:</strong> {blocked.userProfile?.display_name || 'Sin nombre'} ({blocked.userProfile?.email || 'Sin email'})</p>
                    <p><strong>Bloqueado por:</strong> {blocked.blockerProfile?.display_name || 'Admin'} ({blocked.blockerProfile?.email || 'Sin email'})</p>
                    <p><strong>Fecha:</strong> {new Date(blocked.blocked_at).toLocaleString()}</p>
                    <p><strong>Razón:</strong> {blocked.reason || 'Sin razón especificada'}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => unblockUser(blocked.user_id)}
                    className="text-green-600 hover:text-green-700"
                  >
                    ✅ Desbloquear
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Reportes Pendientes */}
      {reports && reports.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🚨 Reportes Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            {reports.map((report) => (
              <div key={report.id} className="border-b pb-4 mb-4 last:border-b-0">
                <div className="flex gap-4">
                  {report.memories?.image_url && (
                    <img 
                      src={report.memories.image_url} 
                      alt="Contenido reportado"
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p><strong>Reportado por:</strong> {report.reporter?.email || 'Usuario desconocido'}</p>
                    <p><strong>Usuario reportado:</strong> {report.reported_user?.email || 'Usuario desconocido'}</p>
                    <p><strong>Razón:</strong> {report.reason}</p>
                    <p><strong>Título:</strong> {report.memories?.title || 'Sin título'}</p>
                    <div className="flex gap-2 mt-2">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteMemory(
                          report.memory_id, 
                          report.reported_user?.id || '', 
                          `Reportado: ${report.reason}`
                        )}
                      >
                        🗑️ Eliminar Contenido
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => blockUser(
                          report.reported_user?.id || '', 
                          `Múltiples reportes: ${report.reason}`
                        )}
                      >
                        🚫 Bloquear Usuario
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Contenido Reciente */}
      <Card>
        <CardHeader>
          <CardTitle>
            📋 Contenido Reciente
            {(filterUser || filterDate) && (
              <span className="text-sm font-normal text-gray-600 ml-2">
                ({memories.length} resultados)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingMemories ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-gray-600">Filtrando contenido...</span>
            </div>
          ) : (
            <div className="grid gap-4">
              {memories.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  {(filterUser || filterDate) ? 'No se encontró contenido con los filtros aplicados' : 'No hay contenido disponible'}
                </p>
              ) : (
                memories.map((memory) => (
                  <div key={memory.id} className={`flex gap-4 p-4 border rounded ${
                    memory.deleted_at ? 'bg-red-50 border-red-200 opacity-75' : ''
                  }`}>
                    <img 
                      src={memory.image_url} 
                      alt={memory.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{memory.title}</h3>
                        {memory.deleted_at && (
                          <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                            🗑️ ELIMINADO
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Por: {memory.profiles?.email || 'Usuario desconocido'} | {new Date(memory.created_at).toLocaleString()}
                      </p>
                      {memory.deleted_at && (
                        <p className="text-xs text-red-600 mt-1">
                          Eliminado: {new Date(memory.deleted_at).toLocaleString()}
                          {memory.deletion_reason && ` - ${memory.deletion_reason}`}
                        </p>
                      )}
                      <div className="flex gap-2 mt-2">
                        {!memory.deleted_at ? (
                          <>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => {
                                const reason = prompt('Razón para eliminar:')
                                if (reason) {
                                  deleteMemory(memory.id, memory.user_id, reason)
                                }
                              }}
                            >
                              🗑️ Eliminar
                            </Button>
                            {/* Solo mostrar botón bloquear si el usuario NO está bloqueado */}
                            {!blockedUsers.some(blocked => blocked.user_id === memory.user_id) && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  const reason = prompt('Razón para bloquear usuario:')
                                  if (reason) {
                                    blockUser(memory.user_id, reason)
                                  }
                                }}
                              >
                                🚫 Bloquear Usuario
                              </Button>
                            )}
                            {/* Mostrar indicador si el usuario está bloqueado */}
                            {blockedUsers.some(blocked => blocked.user_id === memory.user_id) && (
                              <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                                🚫 USUARIO BLOQUEADO
                              </span>
                            )}
                          </>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => restoreMemory(memory.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            ♾️ Restaurar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}