'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useV2 } from '@/lib/V2Context';
import '../globals.css';
import MobileLayout from '../components/MobileLayout';

interface VIPData {
  memberSince: string;
  isVip: boolean;
}

export default function VIPZone() {
  const { t } = useV2();
  const [vipData, setVipData] = useState<VIPData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getVIPData = async () => {
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
      
      const isVip = profile?.is_vip || false;
      const memberSince = user.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : '5/2/2026';
      
      setVipData({
        memberSince,
        isVip
      });
      setLoading(false);
    };
    getVIPData();
  }, [router, supabase]);

  if (loading) {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <div className="font-display">
          <MobileLayout activeTab="vip">
            <main className="flex-1 overflow-y-auto hide-scrollbar pb-24">
              <div className="px-4 py-6">
                <div className="animate-pulse space-y-6">
                  <div className="h-32 bg-gray-200 rounded-2xl"></div>
                  <div className="h-24 bg-gray-200 rounded-2xl"></div>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded-xl"></div>
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
        <MobileLayout activeTab="vip" showVip={vipData?.isVip}>
          <main className="flex-1 overflow-y-auto hide-scrollbar pb-24">
            {/* VIP Hero Section */}
            <div className="px-6 py-8 text-center bg-gradient-to-b from-amber-50/50 to-white dark:from-amber-950/20 dark:to-background-dark">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
                <span className="material-symbols-outlined text-5xl text-gold-vip">stars</span>
              </div>
              <h2 className="text-2xl font-bold dark:text-white">{t('vip.title')}</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{t('vip.subtitle')}</p>
            </div>

            {/* VIP Stats Card */}
            <div className="px-4 -mt-4">
              <div className="bg-[#181111] dark:bg-gray-900 rounded-2xl p-5 shadow-xl border border-amber-500/30">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-gray-400 text-sm">{t('vip.memberSince')}</span>
                    <span className="text-white font-bold">{vipData?.memberSince}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-gray-400 text-sm">{t('vip.nftDiscount')}</span>
                    <div className="text-right">
                      <span className="text-amber-400 font-bold">$2.03</span>
                      <span className="text-gray-500 text-xs line-through ml-1">$3.00</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">{t('vip.exclusiveFeatures')}</span>
                    <span className="text-white font-bold">7 {t('vip.active')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* VIP Benefits */}
            <div className="px-6 mt-10">
              <h3 className="text-lg font-bold mb-4 dark:text-white">{t('vip.benefits')}</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-yellow-600 flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-lg">verified</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm dark:text-white">{t('vip.exclusiveBadge')}</p>
                    <p className="text-xs text-gray-500">{t('vip.badgeDescription')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-lg">percent</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm dark:text-white">{t('vip.discount')}</p>
                    <p className="text-xs text-gray-500">{t('vip.discountDescription')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div className="w-10 h-10 rounded-full bg-usa-blue flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-lg">analytics</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm dark:text-white">{t('vip.advancedStats')}</p>
                    <p className="text-xs text-gray-500">{t('vip.statsDescription')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Coming Soon Features */}
            <div className="px-6 mt-10">
              <h3 className="text-lg font-bold mb-4 dark:text-white">{t('vip.comingSoon')}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 opacity-70">
                  <span className="material-symbols-outlined text-2xl mb-2 block text-gray-400">filter_alt</span>
                  <p className="font-bold text-xs dark:text-gray-300">{t('vip.specialFilters')}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 opacity-70">
                  <span className="material-symbols-outlined text-2xl mb-2 block text-gray-400">chat</span>
                  <p className="font-bold text-xs dark:text-gray-300">{t('vip.vipChat')}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-8 flex flex-col gap-3">
              <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-transform">
                <span className="material-symbols-outlined text-xl">confirmation_number</span>
                {t('vip.mintVipNFT')}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-3.5 rounded-xl font-bold text-xs dark:text-white active:scale-[0.98] transition-transform">
                  <span className="material-symbols-outlined text-lg">headset_mic</span>
                  {t('vip.premiumSupport')}
                </button>
                <button className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-3.5 rounded-xl font-bold text-xs dark:text-white active:scale-[0.98] transition-transform">
                  <span className="material-symbols-outlined text-lg">groups</span>
                  {t('vip.fanClub')}
                </button>
              </div>
            </div>
          </main>
        </MobileLayout>
      </div>
    </>
  );
}