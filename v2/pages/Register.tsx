'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useV2 } from '@/lib/V2Context';
import '../globals.css';
import PixelLogo from '../components/PixelLogo';
import FormInput from '../components/FormInput';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();
  const { t } = useV2();

  const handleRegister = () => {
    // Register logic here
    console.log('Register:', { email, password });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-background-dark max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-center pt-12 pb-8">
        <div className="text-center">
          <PixelLogo size="large" />
          <h1 className="text-3xl font-bold dark:text-white mt-4 mb-2">Memories26</h1>
          <div className="h-1 w-16 bg-primary rounded-full mx-auto"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold dark:text-white mb-2">{t('auth.registerTitle')}</h2>
          <p className="text-gray-500 dark:text-gray-400">Únete y guarda tus recuerdos del Mundial 2026</p>
        </div>

        {/* Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} className="space-y-4 mb-8">
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <span className="text-xl">@</span>
            </div>
            <input
              type="email"
              placeholder={t('auth.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-[#181111] dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <span className="text-xl">•</span>
            </div>
            <input
              type="password"
              placeholder={t('auth.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-[#181111] dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
          
          {/* Register Button */}
          <button 
            type="submit"
            className="w-full bg-primary hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-50"
          >
            {t('auth.registerButton')}
          </button>
        </form>

        {/* Terms */}
        <div className="mb-8">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed">
            Al crear una cuenta, aceptas nuestros{' '}
            <span className="text-primary font-medium">Términos de Servicio</span> y{' '}
            <span className="text-primary font-medium">Política de Privacidad</span>
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center mb-8">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
          <span className="px-4 text-gray-500 text-sm">o</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
            {t('auth.hasAccount')}
          </p>
          <button className="bg-gray-100 dark:bg-gray-800 text-[#181111] dark:text-white font-bold py-3 px-8 rounded-xl transition-colors active:scale-[0.98]">
            {t('auth.loginButton')}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <p className="text-xs text-gray-400">
          Mundial 2026 • Canada • Mexico • USA
        </p>
      </div>
    </div>
  );
}