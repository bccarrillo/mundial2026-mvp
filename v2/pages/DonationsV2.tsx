'use client';

import { useRouter } from 'next/navigation';
import { useV2 } from '@/lib/V2Context';
import MobileLayout from '../components/MobileLayout';
import '../globals.css';

export default function DonationsV2() {
  const { t } = useV2();
  const router = useRouter();

  const handlePayPalDonate = () => {
    // Temporal: usar donate button hasta implementar Smart Buttons
    window.open('https://www.paypal.com/donate/?hosted_button_id=8J9YJEFABFWRS', '_blank');
  };

  // TODO: Implementar PayPal Smart Payment Buttons para permitir
  // pagos con tarjeta sin crear cuenta PayPal
  const initPayPalSmartButtons = () => {
    // Implementación futura con PayPal SDK
    // Permitirá: tarjeta de crédito, débito, PayPal, Apple Pay, Google Pay
  };

  const handleShareApp = () => {
    if (typeof window !== 'undefined') {
      const text = `🏆 ¡Descubre Memories26! La app para guardar y compartir tus recuerdos de eventos deportivos. 100% gratis 🇪🇸\\n\\n👉 ${window.location.origin}`;
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <div className="font-display">
        <MobileLayout>
          <main className="flex-1 overflow-y-auto pb-24">
            <section className="px-6 pt-8 pb-4 text-center">
              <h1 className="text-[32px] font-bold leading-tight mb-3">💝 {t('support.title')}</h1>
              <p className="text-black/70 dark:text-white/70 text-base leading-relaxed max-w-sm mx-auto">
                {t('support.subtitle')}
              </p>
            </section>

            <section className="px-4 py-4">
              <div className="bg-white dark:bg-white/5 rounded-xl overflow-hidden shadow-sm border border-black/5 dark:border-white/5">
                <div className="h-48 w-full bg-gradient-to-br from-blue-500 to-green-500 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5">
                    <span className="text-white font-bold text-xl">🚀 {t('support.mainTitle')}</span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-black/80 dark:text-white/80 text-sm leading-relaxed mb-6">
                    {t('support.mainDescription')}
                  </p>
                  <button 
                    onClick={handlePayPalDonate}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-full flex items-center justify-center gap-3 shadow-lg shadow-primary/20 transition-transform active:scale-95"
                  >
                    <span className="material-symbols-outlined">payments</span>
                    {t('support.donateButton')}
                  </button>
                  <p className="text-center text-[10px] text-black/40 dark:text-white/40 mt-3 uppercase tracking-widest font-bold">
                    {t('support.securePayment')}
                  </p>
                </div>
              </div>
            </section>

            <section className="px-6 py-8">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">verified</span>
                100% Gratis para Usuarios
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 shrink-0 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">dns</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{t('support.reason1Title')}</h3>
                    <p className="text-xs text-black/60 dark:text-white/60">{t('support.reason1Description')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 shrink-0 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">auto_awesome</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{t('support.reason2Title')}</h3>
                    <p className="text-xs text-black/60 dark:text-white/60">{t('support.reason2Description')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 shrink-0 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">groups</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{t('support.reason3Title')}</h3>
                    <p className="text-xs text-black/60 dark:text-white/60">{t('support.reason3Description')}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="px-4 py-4">
              <div className="bg-primary/5 dark:bg-primary/10 border-2 border-dashed border-primary/30 rounded-xl p-6">
                <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">stars</span>
                  {t('support.benefitsTitle')}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-white dark:bg-white/5 p-3 rounded-lg border border-primary/10">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">military_tech</span>
                      <span className="text-sm font-medium">{t('support.benefit1Title')}</span>
                    </div>
                    <span className="material-symbols-outlined text-black/20 dark:text-white/20">chevron_right</span>
                  </div>
                  <div className="flex items-center justify-between bg-white dark:bg-white/5 p-3 rounded-lg border border-primary/10">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">speed</span>
                      <span className="text-sm font-medium">{t('support.benefit2Title')}</span>
                    </div>
                    <span className="material-symbols-outlined text-black/20 dark:text-white/20">chevron_right</span>
                  </div>
                  <div className="flex items-center justify-between bg-white dark:bg-white/5 p-3 rounded-lg border border-primary/10">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">favorite</span>
                      <span className="text-sm font-medium">{t('support.benefit3Title')}</span>
                    </div>
                    <span className="material-symbols-outlined text-black/20 dark:text-white/20">chevron_right</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="px-6 py-8 mb-10">
              <h2 className="text-lg font-bold mb-4">🤝 {t('support.alternativeTitle')}</h2>
              <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2">
                <button 
                  onClick={handleShareApp}
                  className="shrink-0 bg-white dark:bg-white/5 px-6 py-4 rounded-xl border border-black/5 dark:border-white/5 text-center flex flex-col items-center gap-2"
                >
                  <span className="material-symbols-outlined text-blue-500">share</span>
                  <span className="text-xs font-bold">{t('support.shareApp')}</span>
                </button>
                <button 
                  onClick={() => router.push('/v2/invitar')}
                  className="shrink-0 bg-white dark:bg-white/5 px-6 py-4 rounded-xl border border-black/5 dark:border-white/5 text-center flex flex-col items-center gap-2"
                >
                  <span className="material-symbols-outlined text-green-500">group_add</span>
                  <span className="text-xs font-bold">{t('support.inviteFriends')}</span>
                </button>
                <button className="shrink-0 bg-white dark:bg-white/5 px-6 py-4 rounded-xl border border-black/5 dark:border-white/5 text-center flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-yellow-500">star</span>
                  <span className="text-xs font-bold">Calificar</span>
                </button>
              </div>
            </section>
          </main>
        </MobileLayout>
      </div>
    </>
  );
}