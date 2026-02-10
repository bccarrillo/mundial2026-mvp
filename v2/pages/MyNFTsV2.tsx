'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useV2 } from '@/lib/V2Context';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import MobileLayout from '../components/MobileLayout';
import '../globals.css';

interface NFT {
  id: string;
  memory_id: string;
  crossmint_id: string;
  blockchain_address?: string;
  created_at: string;
  memory: {
    title: string;
    image_url: string;
    team?: string;
    created_at: string;
  };
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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function MyNFTsV2() {
  const { t } = useV2();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();
  const observer = useRef<IntersectionObserver | null>(null);

  const lastNFTRef = useCallback((node: HTMLDivElement) => {
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
      setCurrentUser(user.id);
    };
    getUser();
  }, [router, supabase]);

  useEffect(() => {
    if (!currentUser) return;
    
    const fetchNFTs = async () => {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('nfts')
        .select(`
          *,
          memories (
            title,
            image_url,
            team,
            created_at
          )
        `)
        .eq('user_id', currentUser)
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (!error && data) {
        const transformedNFTs = data.map((nft: any): NFT => ({
          id: nft.id,
          memory_id: nft.memory_id,
          crossmint_id: nft.crossmint_id,
          blockchain_address: nft.blockchain_address,
          created_at: nft.created_at,
          memory: {
            title: nft.memories?.title || 'Recuerdo sin título',
            image_url: nft.memories?.image_url || '',
            team: nft.memories?.team,
            created_at: nft.memories?.created_at || nft.created_at
          }
        }));
        
        setNfts(prev => page === 0 ? transformedNFTs : [...prev, ...transformedNFTs]);
        setHasMore(data.length === PAGE_SIZE);
      }
      setLoading(false);
    };

    fetchNFTs();
  }, [page, currentUser, supabase]);

  const handleCreateNFT = () => {
    router.push('/v2/feed');
  };

  const handleViewMemory = (memoryId: string) => {
    router.push(`/v2/memory/${memoryId}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading && nfts.length === 0) {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <div className="font-display">
          <MobileLayout activeTab="vip">
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
        <MobileLayout activeTab="vip">
          <main className="flex-1 overflow-y-auto hide-scrollbar pb-24">
            <div className="px-4 py-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold dark:text-white leading-none flex items-center gap-2">
                    <span className="material-symbols-outlined text-gold-vip">token</span>
                    {t('myNFTs.title')}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {t('myNFTs.subtitle')}
                  </p>
                </div>
                <button 
                  onClick={handleCreateNFT}
                  className="bg-gold-vip hover:bg-yellow-500 text-black px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg shadow-gold-vip/20 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-xl">add</span>
                  <span className="font-bold text-sm tracking-wide">{t('buttons.create')}</span>
                </button>
              </div>

              {/* NFT Benefits Info */}
              <div className="bg-gradient-to-r from-gold-vip/10 to-yellow-500/10 rounded-2xl p-4 mb-6 border border-gold-vip/20">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-2xl text-gold-vip">stars</span>
                  <h3 className="font-bold text-lg dark:text-white">{t('myNFTs.benefits.title')}</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                    <span>{t('myNFTs.benefits.permanent')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                    <span>{t('myNFTs.benefits.auction')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                    <span>{t('myNFTs.benefits.ownership')}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {nfts.length === 0 && !loading ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gold-vip/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-gold-vip">token</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">{t('myNFTs.noNFTs')}</p>
                    <button 
                      onClick={handleCreateNFT}
                      className="bg-gold-vip text-black px-6 py-3 rounded-xl font-bold"
                    >
                      {t('myNFTs.createFirst')}
                    </button>
                  </div>
                ) : (
                  nfts.map((nft, index) => (
                    <div
                      key={`${nft.id}-${page}-${index}`}
                      ref={index === nfts.length - 1 ? lastNFTRef : null}
                      className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm border border-gold-vip/20"
                    >
                      <div className="relative aspect-square">
                        <img 
                          src={nft.memory.image_url} 
                          alt={nft.memory.title}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => handleViewMemory(nft.memory_id)}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-image.jpg';
                          }}
                        />
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full text-white ${
                            getLocationColor(nft.memory.team) === 'primary' ? 'bg-primary' :
                            getLocationColor(nft.memory.team) === 'usa-blue' ? 'bg-usa-blue' : 'bg-mexico-green'
                          }`}>
                            {nft.memory.team || 'MUNDIAL 2026'}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4">
                          <span className="bg-gold-vip text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">verified</span>
                            NFT
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 
                              className="font-bold text-lg text-gray-900 dark:text-white leading-tight cursor-pointer hover:text-gold-vip transition-colors"
                              onClick={() => handleViewMemory(nft.memory_id)}
                            >
                              {nft.memory.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {t('myNFTs.certified')}: {formatDate(nft.created_at)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {/* Crossmint ID */}
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                  {t('myNFTs.crossmintId')}
                                </p>
                                <p className="text-sm font-mono text-gray-900 dark:text-white">
                                  {nft.crossmint_id.slice(0, 20)}...
                                </p>
                              </div>
                              <button
                                onClick={() => copyToClipboard(nft.crossmint_id)}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              >
                                <span className="material-symbols-outlined text-lg text-gray-500">content_copy</span>
                              </button>
                            </div>
                          </div>

                          {/* Blockchain Address */}
                          {nft.blockchain_address && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    {t('myNFTs.blockchainAddress')}
                                  </p>
                                  <p className="text-sm font-mono text-gray-900 dark:text-white">
                                    {nft.blockchain_address.slice(0, 20)}...
                                  </p>
                                </div>
                                <button
                                  onClick={() => copyToClipboard(nft.blockchain_address!)}
                                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                  <span className="material-symbols-outlined text-lg text-gray-500">content_copy</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => handleViewMemory(nft.memory_id)}
                              className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                            >
                              <span className="material-symbols-outlined text-lg">visibility</span>
                              {t('myNFTs.viewMemory')}
                            </button>
                            <button
                              onClick={() => copyToClipboard(`${window.location.origin}/v2/memory/${nft.memory_id}`)}
                              className="flex-1 bg-gold-vip hover:bg-yellow-500 text-black py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                            >
                              <span className="material-symbols-outlined text-lg">share</span>
                              {t('myNFTs.share')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {loading && nfts.length > 0 && (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center gap-2 text-gray-500">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-gold-vip rounded-full animate-spin"></div>
                      {t('myNFTs.loadingMore')}
                    </div>
                  </div>
                )}
                
                {!hasMore && nfts.length > 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">{t('myNFTs.noMore')}</p>
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