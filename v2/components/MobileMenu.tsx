'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useV2 } from '@/lib/V2Context'
import Icon from './Icon';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const router = useRouter()
  const supabase = createClient()
  const { t, language, changeLanguage } = useV2()

  const handleNavigation = (path: string) => {
    onClose()
    router.push(path)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    onClose()
    router.push('/v2/login')
  }

  const handleLanguageChange = (lang: string) => {
    changeLanguage(lang)
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-white dark:bg-background-dark flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <span className="text-xl font-bold text-primary">{t('nav.menu')}</span>
        <button onClick={onClose} className="p-2">
          <Icon name="close" size="xl" />
        </button>
      </div>
      
      <nav className="flex flex-col p-6 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase text-gray-400">{t('nav.language')}</label>
          <div className="flex gap-3">
            <button 
              onClick={() => handleLanguageChange('es')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                language === 'es' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
              }`}
            >
              Español
            </button>
            <button 
              onClick={() => handleLanguageChange('en')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                language === 'en' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
              }`}
            >
              English
            </button>
            <button 
              onClick={() => handleLanguageChange('pt')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                language === 'pt' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
              }`}
            >
              Português
            </button>
          </div>
        </div>
        
        <button 
          onClick={() => handleNavigation('/v2/feed')}
          className="flex items-center gap-4 text-lg font-medium py-3 border-b border-gray-50 dark:border-gray-800"
        >
          <Icon name="photo_library" className="text-gray-500" />
          {t('nav.feed')}
        </button>
        
        <button 
          onClick={() => handleNavigation('/v2/dashboard')}
          className="flex items-center gap-4 text-lg font-medium py-3 border-b border-gray-50 dark:border-gray-800"
        >
          <Icon name="dashboard" className="text-gray-500" />
          {t('nav.dashboard')}
        </button>
        
        <button 
          onClick={() => handleNavigation('/v2/crear')}
          className="flex items-center gap-4 text-lg font-medium py-3 border-b border-gray-50 dark:border-gray-800"
        >
          <Icon name="add_circle" className="text-gray-500" />
          {t('nav.create')}
        </button>
        
        <button 
          onClick={() => handleNavigation('/v2/rankings')}
          className="flex items-center gap-4 text-lg font-medium py-3 border-b border-gray-50 dark:border-gray-800"
        >
          <Icon name="military_tech" className="text-gray-500" />
          {t('nav.rankings')}
        </button>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 text-lg font-medium py-3 mt-4 text-primary"
        >
          <Icon name="logout" className="text-primary" />
          {t('nav.logout')}
        </button>
      </nav>
    </div>
  );
}