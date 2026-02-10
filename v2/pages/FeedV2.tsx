'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useV2 } from '@/lib/V2Context';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { handleAuthError } from '@/lib/auth-error-handler';
import { events } from '@/lib/analytics';
import MobileLayout from '../components/MobileLayout';
import MemoryCard from '../components/MemoryCard';
import '../globals.css';

interface Memory {
  id: string;
  title: string;
  image: string;
  location: string;
  locationColor: 'primary' | 'usa-blue' | 'mexico-green';
  author: {
    name: string;
    initials: string;
    avatarColor?: string;
    isVip?: boolean;
  };
  date: string;
  hasNFT?: boolean;
}

const PAGE_SIZE = 12;

// Memoized utility functions
const getLocationColor = (team?: string): 'primary' | 'usa-blue' | 'mexico-green' => {
  const colors: Record<string, 'primary' | 'usa-blue' | 'mexico-green'> = {
    'Colombia': 'primary',
    'México': 'mexico-green', 
    'Argentina': 'usa-blue',
    'Brasil': 'mexico-green',
    'Estados Unidos': 'usa-blue',
    'Canadá': 'primary'
  };
  return colors[team || ''] || 'primary';
};

const getInitials = (name?: string): string => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function FeedV2() {
  const { t } = useV2();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [teamFilter, setTeamFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [userVip, setUserVip] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const observer = useRef<IntersectionObserver | null>(null);

  const lastMemoryRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    // Track feed view
    events.viewFeed();
    
    // Get current user's VIP status
    const getUserVipStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_vip')
            .eq('id', user.id)
            .single();
          const isVip = profile?.is_vip || false;
          setUserVip(isVip);
          
          if (isVip) {
            events.vipBadgeShown();
          }
        }
      } catch (error) {
        await handleAuthError(error);
      }
    };
    getUserVipStatus();
  }, [supabase]);

  useEffect(() => {
    // Reset memories when filters change
    if (page === 0) {
      setMemories([]);
    }
    
    const fetchMemories = async () => {
      setLoading(true);
      let query = supabase
        .from('memories')
        .select(`
          *,
          profiles (display_name, email, is_vip)
        `)
        .eq('is_public', true)
        .is('deleted_at', null);

      if (teamFilter) {
        query = query.ilike('team', `%${teamFilter}%`);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (!error && data) {
        // Get NFT information for each memory (only if we have memories)
        let nftMemoryIds = new Set<string>()
        
        if (data.length > 0) {
          const memoryIds = data.map(m => m.id)
          const { data: nftData } = await supabase
            .from('nft_certificates')
            .select('memory_id')
            .in('memory_id', memoryIds)
          
          nftMemoryIds = new Set(nftData?.map(n => n.memory_id) || [])
        }
        
        const transformedMemories = useMemo(() => 
          data.map((memory: any): Memory => ({
            id: memory.id,
            title: memory.title,
            image: memory.image_url,
            location: memory.team || 'MUNDIAL 2026',
            locationColor: getLocationColor(memory.team),
            author: {
              name: memory.profiles?.display_name || 'Usuario',
              initials: getInitials(memory.profiles?.display_name),
              avatarColor: 'default',
              isVip: memory.profiles?.is_vip || false
            },
            date: formatDate(memory.created_at),
            hasNFT: nftMemoryIds.has(memory.id)
          })), [data, nftMemoryIds]
        );
        
        setMemories(prev => page === 0 ? transformedMemories : [...prev, ...transformedMemories]);
        setHasMore(data.length === PAGE_SIZE);
      }
      setLoading(false);
      setIsSearching(false);
    };

    fetchMemories();
  }, [page, teamFilter, searchQuery, supabase]);

  const handleFilterChange = (team: string) => {
    setTeamFilter(team);
    setMemories([]);
    setPage(0);
    setHasMore(true);
  };

  const handleSearch = async () => {
    if (isSearching) return;
    
    setIsSearching(true);
    setSearchQuery(searchInput);
    setMemories([]);
    setPage(0);
    setHasMore(true);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setMemories([]);
    setPage(0);
    setHasMore(true);
  };

  const handleCreateMemory = () => {
    router.push('/v2/crear');
  };

  const handleViewDetail = (memoryId: string) => {
    router.push(`/v2/memory/${memoryId}`);
  };

  const handleCreateNFT = (memoryId: string) => {
    router.push(`/v2/memory/${memoryId}`);
  };

  if (loading && memories.length === 0) {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <div className="font-display">
          <MobileLayout activeTab="explore" showVip={userVip}>
            <main className="flex-1 overflow-y-auto hide-scrollbar pb-24">
              <div className="px-4 py-6">
                <div className="animate-pulse space-y-6">
                  <div className="h-8 bg-gray-200 rounded w-48"></div>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-64 bg-gray-200 rounded-2xl"></div>
                    ))}
                  </div>
                </div>
              </div>
            </main>
          </MobileLayout>
        </div>
      </>
    );
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <div className="font-display">
        <MobileLayout activeTab="explore" showVip={userVip}>
          <main className="flex-1 overflow-y-auto hide-scrollbar pb-24">
            <div className="px-4 py-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold dark:text-white leading-none">{t('feed.title')}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {t('feed.subtitle')}
                  </p>
                </div>
                <button 
                  onClick={handleCreateMemory}
                  className="bg-primary hover:bg-red-600 text-white px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-xl">add</span>
                  <span className="font-bold text-sm tracking-wide">{t('buttons.create')}</span>
                </button>
              </div>
              
              {/* Search */}
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  placeholder={t('feed.search')}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-[#181111] dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-primary hover:bg-red-600 text-white px-4 py-3 rounded-xl transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">{isSearching ? 'hourglass_empty' : 'search'}</span>
                </button>
                {(searchQuery || searchInput) && (
                  <button 
                    onClick={handleClearSearch}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-4 py-3 rounded-xl transition-colors"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                )}
              </div>

              {/* Team Filters */}
              <div className="mb-6 flex gap-2 overflow-x-auto hide-scrollbar">
                {[
                  { name: t('filters.all'), value: '' },
                  { name: t('filters.colombia'), value: 'Colombia' },
                  { name: t('filters.mexico'), value: 'México' },
                  { name: t('filters.argentina'), value: 'Argentina' },
                  { name: t('filters.brazil'), value: 'Brasil' },
                  { name: t('filters.usa'), value: 'Estados Unidos' },
                  { name: t('filters.canada'), value: 'Canadá' }
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => handleFilterChange(filter.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      teamFilter === filter.value
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {filter.name}
                  </button>
                ))}
              </div>
              
              <div className="space-y-8">
                {memories.length === 0 && !loading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">{t('feed.noResults')}</p>
                  </div>
                ) : (
                  memories.map((memory, index) => (
                    <div
                      key={`${memory.id}-${page}-${index}`}
                      ref={index === memories.length - 1 ? lastMemoryRef : null}
                    >
                      <MemoryCard 
                        memory={memory}
                        onViewDetail={handleViewDetail}
                        onCreateNFT={() => handleCreateNFT(memory.id)}
                      />
                    </div>
                  ))
                )}
                
                {loading && memories.length > 0 && (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center gap-2 text-gray-500">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                      {t('feed.loadingMore')}
                    </div>
                  </div>
                )}
                
                {!hasMore && memories.length > 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">{t('feed.noMore')}</p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </MobileLayout>
      </div>
    </>
  );
}