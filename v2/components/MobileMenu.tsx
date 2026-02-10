'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Icon from './Icon';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleNavigation = (path: string) => {
    onClose()
    router.push(path)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    onClose()
    router.push('/v2/login')
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-white dark:bg-background-dark flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <span className="text-xl font-bold text-primary">Menú</span>
        <button onClick={onClose} className="p-2">
          <Icon name="close" size="xl" />
        </button>
      </div>
      
      <nav className="flex flex-col p-6 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase text-gray-400">Idioma</label>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium">
              Español
            </button>
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full text-sm">
              English
            </button>
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full text-sm">
              Português
            </button>
          </div>
        </div>
        
        <button 
          onClick={() => handleNavigation('/v2/feed')}
          className="flex items-center gap-4 text-lg font-medium py-3 border-b border-gray-50 dark:border-gray-800"
        >
          <Icon name="photo_library" className="text-gray-500" />
          Recuerdos
        </button>
        
        <button 
          onClick={() => handleNavigation('/v2/dashboard')}
          className="flex items-center gap-4 text-lg font-medium py-3 border-b border-gray-50 dark:border-gray-800"
        >
          <Icon name="dashboard" className="text-gray-500" />
          Dashboard
        </button>
        
        <button 
          onClick={() => handleNavigation('/v2/crear')}
          className="flex items-center gap-4 text-lg font-medium py-3 border-b border-gray-50 dark:border-gray-800"
        >
          <Icon name="add_circle" className="text-gray-500" />
          Crear
        </button>
        
        <button 
          onClick={() => handleNavigation('/v2/rankings')}
          className="flex items-center gap-4 text-lg font-medium py-3 border-b border-gray-50 dark:border-gray-800"
        >
          <Icon name="military_tech" className="text-gray-500" />
          Rankings
        </button>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 text-lg font-medium py-3 mt-4 text-primary"
        >
          <Icon name="logout" className="text-primary" />
          Cerrar Sesión
        </button>
      </nav>
    </div>
  );
}