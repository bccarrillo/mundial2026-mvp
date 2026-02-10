'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useV2 } from '@/lib/V2Context';
import MobileLayout from '../components/MobileLayout';
import UserProfile from '../components/UserProfile';
import '../globals.css';

interface User {
  name: string;
  email: string;
  avatar?: string;
  isVip: boolean;
}

export default function Dashboard() {
  const { t } = useV2();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/v2/login');
      } else {
        // Transformar datos V1 a formato V2
        setUser({
          name: user.user_metadata?.display_name || user.email?.split('@')[0] || t('dashboard.welcome'),
          email: user.email || '',
          avatar: user.user_metadata?.avatar_url,
          isVip: user.user_metadata?.is_vip || false
        });
        setLoading(false);
      }
    };
    getUser();
  }, [router, supabase]);

  const handleAction = (action: string) => {
    switch (action) {
      case 'crear':
        router.push('/v2/crear');
        break;
      case 'nfts':
        router.push('/v2/mis-nfts');
        break;
      case 'eventos':
        router.push('/v2/mis-recuerdos');
        break;
      case 'invitar':
        router.push('/v2/invitar');
        break;
      case 'galeria':
        router.push('/v2/feed');
        break;
      default:
        console.log('Action:', action);
    }
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-background-dark max-w-md mx-auto">
        <div className="animate-pulse p-6">
          <div className="h-16 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirecting...
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <div className="font-display">
        <MobileLayout showVip={user.isVip} activeTab="home">
          <main className="flex-1 overflow-y-auto hide-scrollbar pb-24 px-6">
            {/* User Profile Section */}
            <UserProfile 
              name={user.name}
              email={user.email}
              avatar={user.avatar}
              isVip={user.isVip}
            />

            {/* Action Cards */}
            <div className="py-8 space-y-4">
              <button 
                onClick={() => handleAction('crear')}
                className="w-full group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                  </div>
                  <span className="font-bold text-lg dark:text-white">{t('dashboard.createMemory')}</span>
                </div>
                <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">chevron_right</span>
              </button>
              
              <button 
                onClick={() => handleAction('nfts')}
                className="w-full group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-usa-blue dark:text-blue-400">
                    <span className="material-symbols-outlined text-2xl">token</span>
                  </div>
                  <span className="font-bold text-lg dark:text-white">{t('dashboard.viewNFTs')}</span>
                </div>
                <span className="material-symbols-outlined text-gray-300 group-hover:text-usa-blue transition-colors">chevron_right</span>
              </button>
              
              <button 
                onClick={() => handleAction('eventos')}
                className="w-full group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-mexico-green dark:text-green-400">
                    <span className="material-symbols-outlined text-2xl">photo_library</span>
                  </div>
                  <span className="font-bold text-lg dark:text-white">{t('dashboard.exploreEvents')}</span>
                </div>
                <span className="material-symbols-outlined text-gray-300 group-hover:text-mexico-green transition-colors">chevron_right</span>
              </button>
              
              <button 
                onClick={() => handleAction('invitar')}
                className="w-full group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <span className="material-symbols-outlined text-2xl">group_add</span>
                  </div>
                  <span className="font-bold text-lg dark:text-white">{t('dashboard.inviteFriends')}</span>
                </div>
                <span className="material-symbols-outlined text-gray-300 group-hover:text-purple-600 transition-colors">chevron_right</span>
              </button>
            </div>

            {/* Bottom CTA */}
            <div className="pt-4 flex justify-center">
              <button 
                onClick={() => handleAction('galeria')}
                className="bg-primary/10 text-primary px-6 py-2.5 rounded-full font-bold text-sm hover:bg-primary hover:text-white transition-colors"
              >
                {t('dashboard.viewGallery')}
              </button>
            </div>
          </main>
        </MobileLayout>
      </div>
    </>
  );
}