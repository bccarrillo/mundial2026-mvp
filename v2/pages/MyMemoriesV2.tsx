'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useV2 } from '@/lib/V2Context';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import MobileLayout from '../components/MobileLayout';
import Icon from '../components/Icon';
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
  };
  date: string;
  likes_count?: number;
  is_public: boolean;
}

const PAGE_SIZE = 12;

const getLocationColor = (team?: string): 'primary' | 'usa-blue' | 'mexico-green' => {
  const colors: Record<string, 'primary' | 'usa-blue' | 'mexico-green'> = {
    'Colombia': 'primary',
    'Mexico': 'mexico-green', 
    'Argentina': 'usa-blue',
    'Brasil': 'mexico-green',
    'Estados Unidos': 'usa-blue',
    'Canada': 'primary'
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

export default function MyMemoriesV2() {
  const { t } = useV2();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isVip, setIsVip] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; memory: Memory | null }>({ show: false, memory: null });
  const [deleting, setDeleting] = useState(false);
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
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/v2/login');
        return;
      }
      
      // Get VIP status from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_vip')
        .eq('id', user.id)
        .single();
      
      setCurrentUser(user.id);
      setIsVip(profile?.is_vip || false);
    };
    getUser();
  }, [router, supabase]);

  useEffect(() => {
    if (!currentUser) return;
    
    const fetchMemories = async () => {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('memories')
        .select(`
          *,
          profiles (display_name, email)
        `)
        .eq('user_id', currentUser)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (!error && data) {
        const transformedMemories = data.map((memory: any): Memory => ({
          id: memory.id,
          title: memory.title,
          image: memory.image_url,
          location: memory.team || 'MUNDIAL 2026',
          locationColor: getLocationColor(memory.team),
          author: {
            name: memory.profiles?.display_name || 'Usuario',
            initials: getInitials(memory.profiles?.display_name),
            avatarColor: 'default'
          },
          date: formatDate(memory.created_at),
          likes_count: memory.likes_count || 0,
          is_public: memory.is_public
        }));
        
        setMemories(prev => page === 0 ? transformedMemories : [...prev, ...transformedMemories]);
        setHasMore(data.length === PAGE_SIZE);
      }
      setLoading(false);
    };

    fetchMemories();
  }, [page, currentUser, supabase]);

  const handleCreateMemory = () => {
    router.push('/v2/crear');
  };

  const handleViewDetail = (memoryId: string) => {
    router.push(`/v2/memory/${memoryId}`);
  };

  const handleEdit = (memoryId: string) => {
    router.push(`/v2/editar-recuerdo/${memoryId}`);
  };

  const handleDeleteClick = (memory: Memory) => {
    setDeleteModal({ show: true, memory });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.memory || deleting) return;
    
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('memories')
        .update({ 
          deleted_at: new Date().toISOString(),
          deleted_by: currentUser,
          deletion_reason: 'user_request'
        })
        .eq('id', deleteModal.memory.id)
        .eq('user_id', currentUser);

      if (!error) {
        setMemories(prev => prev.filter(m => m.id !== deleteModal.memory!.id));
        setDeleteModal({ show: false, memory: null });
      }
    } catch (error) {
      console.error('Error deleting memory:', error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading && memories.length === 0) {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <div className="font-display">
          <MobileLayout activeTab="home" showVip={isVip}>
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
        <MobileLayout activeTab="home" showVip={isVip}>
          <main className="flex-1 overflow-y-auto hide-scrollbar pb-24">
            <div className="px-4 py-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold dark:text-white leading-none flex items-center gap-2">
                    <span className="material-symbols-outlined text-mexico-green">photo_library</span>
                    {t('myMemories.title')}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {t('myMemories.subtitle')}
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
              
              <div className="space-y-6">
                {memories.length === 0 && !loading ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-gray-400">photo_library</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">{t('myMemories.noMemories')}</p>
                    <button 
                      onClick={handleCreateMemory}
                      className="bg-primary text-white px-6 py-3 rounded-xl font-bold"
                    >
                      {t('myMemories.createFirst')}
                    </button>
                  </div>
                ) : (
                  memories.map((memory, index) => (
                    <div
                      key={`${memory.id}-${page}-${index}`}
                      ref={index === memories.length - 1 ? lastMemoryRef : null}
                      className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800"
                    >
                      <div className="relative aspect-square">
                        <img 
                          src={memory.image} 
                          alt={memory.title}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => handleViewDetail(memory.id)}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-image.jpg';
                          }}
                        />
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full text-white ${
                            memory.locationColor === 'primary' ? 'bg-primary' :
                            memory.locationColor === 'usa-blue' ? 'bg-usa-blue' : 'bg-mexico-green'
                          }`}>
                            {memory.location}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2">
                          {!memory.is_public && (
                            <span className="bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium">
                              <span className="material-symbols-outlined text-xs">lock</span> {t('myMemories.private')}
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-4 right-4 flex gap-2">
                          <button
                            onClick={() => handleEdit(memory.id)}
                            className="w-10 h-10 bg-white/90 hover:bg-white text-gray-700 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95"
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(memory)}
                            className="w-10 h-10 bg-red-500/90 hover:bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 
                              className="font-bold text-lg text-gray-900 dark:text-white leading-tight cursor-pointer hover:text-primary transition-colors"
                              onClick={() => handleViewDetail(memory.id)}
                            >
                              {memory.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {memory.date}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-red-500">favorite</span>
                            <span>{memory.likes_count || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className={`material-symbols-outlined ${memory.is_public ? "text-green-500" : "text-gray-400"}`}>{memory.is_public ? "public" : "lock"}</span>
                            <span>{memory.is_public ? t('myMemories.public') : t('myMemories.private')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {loading && memories.length > 0 && (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center gap-2 text-gray-500">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                      {t('myMemories.loadingMore')}
                    </div>
                  </div>
                )}
                
                {!hasMore && memories.length > 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">{t('myMemories.noMore')}</p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </MobileLayout>
      </div>

      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-red-500">delete</span>
              </div>
              <h3 className="text-lg font-bold mb-2 dark:text-white">{t('myMemories.deleteTitle')}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                {t('myMemories.deleteMessage')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({ show: false, memory: null })}
                  disabled={deleting}
                  className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {t('myMemories.cancel')}
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  {deleting ? t('myMemories.deleting') : t('myMemories.delete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}