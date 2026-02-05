'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Memory } from '@/types/database'
import { useTranslation } from 'react-i18next'
import { events } from '@/lib/analytics'

const PAGE_SIZE = 12

export default function FeedPage() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const [teamFilter, setTeamFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [clickedMemoryId, setClickedMemoryId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()
  const observer = useRef<IntersectionObserver | null>(null)
  const { t } = useTranslation() // Fixed TypeScript error

  const lastMemoryRef = useCallback((node: HTMLDivElement) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  useEffect(() => {
    // Tracking: Ver feed
    events.viewFeed()
    
    const fetchMemories = async () => {
      setLoading(true)
      let query = supabase
        .from('memories')
        .select(`
          *,
          profiles (display_name, email)
        `)
        .eq('is_public', true)

      if (teamFilter) {
        query = query.ilike('team', `%${teamFilter}%`)
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

      if (!error && data) {
        setMemories(prev => [...prev, ...data])
        setHasMore(data.length === PAGE_SIZE)
      }
      setLoading(false)
      setIsSearching(false)
    }

    fetchMemories()
  }, [page, teamFilter, searchQuery, supabase])

  const handleFilterChange = (team: string) => {
    setTeamFilter(team)
    setMemories([])
    setPage(0)
    setHasMore(true)
  }

  const handleSearch = async () => {
    if (isSearching) return // Prevenir múltiples búsquedas
    
    setIsSearching(true)
    
    // Si es la misma búsqueda, solo resetear resultados
    if (searchQuery === searchInput) {
      setMemories([])
      setPage(0)
      setHasMore(true)
      // Delay mínimo para mostrar el indicador
      await new Promise(resolve => setTimeout(resolve, 300))
      // Forzar nueva búsqueda cambiando el estado
      setPage(prev => prev + 1)
    } else {
      setSearchQuery(searchInput)
      setMemories([])
      setPage(0)
      setHasMore(true)
      // Delay mínimo para mostrar el indicador
      await new Promise(resolve => setTimeout(resolve, 300))
    }
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setSearchQuery('')
    setMemories([])
    setPage(0)
    setHasMore(true)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleMemoryClick = (memoryId: string) => {
    setClickedMemoryId(memoryId)
    router.push(`/recuerdo/${memoryId}`)
  }

  // Generar key única combinando id y timestamp
  const getUniqueKey = (memory: Memory, index: number) => {
    return `${memory.id}-${index}`
  }

  if (loading && memories.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">⚽ {t('feed.title')}</h1>
        
        {/* Buscador */}
        <div className="mb-4 flex gap-2 max-w-md">
          <Input
            type="text"
            placeholder={t('feed.searchPlaceholder')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="bg-white border-2"
          />
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? t('feed.searching') : t('feed.searchButton')}
          </Button>
          {(searchQuery || searchInput) && (
            <Button variant="outline" onClick={handleClearSearch}>
              {t('feed.clearSearch')}
            </Button>
          )}
        </div>
        
        {/* Filtros por equipo */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <Button 
            variant={teamFilter === '' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('')}
          >
            {t('feed.filterAll')}
          </Button>
          <Button 
            variant={teamFilter === 'Colombia' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('Colombia')}
          >
            🇨🇴 Colombia
          </Button>
          <Button 
            variant={teamFilter === 'México' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('México')}
          >
            🇲🇽 México
          </Button>
          <Button 
            variant={teamFilter === 'Argentina' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('Argentina')}
          >
            🇦🇷 Argentina
          </Button>
          <Button 
            variant={teamFilter === 'Brasil' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('Brasil')}
          >
            🇧🇷 Brasil
          </Button>
          <Button 
            variant={teamFilter === 'Estados Unidos' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('Estados Unidos')}
          >
            🇺🇸 USA
          </Button>
          <Button 
            variant={teamFilter === 'Canadá' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('Canadá')}
          >
            🇨🇦 Canadá
          </Button>
        </div>

        {memories.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {t('feed.noMemories')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memories.map((memory, index) => (
              <Card 
                key={getUniqueKey(memory, index)}
                ref={index === memories.length - 1 ? lastMemoryRef : null}
                className={`overflow-hidden cursor-pointer transition-all duration-200 relative ${
                  clickedMemoryId === memory.id 
                    ? 'opacity-30 scale-95 pointer-events-none' 
                    : 'hover:shadow-lg hover:scale-105'
                }`}
                onClick={() => handleMemoryClick(memory.id)}
              >
                <img
                  src={memory.image_url}
                  alt={memory.title}
                  className="w-full h-48 object-cover"
                />
                {clickedMemoryId === memory.id && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2">{memory.title}</h3>
                  {memory.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {memory.description}
                    </p>
                  )}
                  {memory.team && (
                    <p className="text-sm mt-2">⚽ {memory.team}</p>
                  )}
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-muted-foreground">
                      {new Date(memory.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {memory.profiles && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Por: {memory.profiles.display_name}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {loading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{t('feed.loadingMore')}</p>
          </div>
        )}
        {!hasMore && memories.length > 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{t('feed.noMore')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
