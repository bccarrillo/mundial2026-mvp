'use client';

import { useEffect, useState } from 'react';
import { useV2 } from '@/lib/V2Context';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import MobileLayout from '../components/MobileLayout';
import '../globals.css';

interface EditMemoryV2Props {
  params: { id: string };
}

export default function EditMemoryV2({ params }: EditMemoryV2Props) {
  const { t } = useV2();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [memory, setMemory] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    team: '',
    matchDate: '',
    isPublic: true,
    image: null as File | null,
    currentImageUrl: ''
  });
  const router = useRouter();
  const supabase = createClient();

  const teams = [
    'Colombia', 'Mexico', 'Argentina', 'Brasil', 'Estados Unidos', 'Canada',
    'España', 'Francia', 'Alemania', 'Italia', 'Inglaterra', 'Portugal'
  ];

  useEffect(() => {
    const fetchMemory = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/v2/login');
        return;
      }

      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        router.push('/v2/mis-recuerdos');
        return;
      }

      setMemory(data);
      setFormData({
        title: data.title || '',
        description: data.description || '',
        team: data.team || '',
        matchDate: data.match_date ? data.match_date.split('T')[0] : '',
        isPublic: data.is_public,
        image: null,
        currentImageUrl: data.image_url || ''
      });
      setLoading(false);
    };

    fetchMemory();
  }, [params.id, router, supabase]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let imageUrl = formData.currentImageUrl;

      // Upload new image if selected
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('memories')
          .upload(fileName, formData.image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('memories')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;

        // Delete old image if it exists and is different
        if (formData.currentImageUrl && formData.currentImageUrl !== imageUrl) {
          const oldFileName = formData.currentImageUrl.split('/').pop();
          if (oldFileName) {
            await supabase.storage.from('memories').remove([oldFileName]);
          }
        }
      }

      // Update memory
      const { error } = await supabase
        .from('memories')
        .update({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          team: formData.team || null,
          match_date: formData.matchDate || null,
          is_public: formData.isPublic,
          image_url: imageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id)
        .eq('user_id', user.id);

      if (error) throw error;

      router.push('/v2/mis-recuerdos');
    } catch (error) {
      console.error('Error updating memory:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <div className="font-display">
          <MobileLayout>
            <main className="flex-1 overflow-y-auto hide-scrollbar pb-24">
              <div className="px-4 py-6">
                <div className="animate-pulse space-y-6">
                  <div className="h-8 bg-gray-200 rounded w-48"></div>
                  <div className="h-64 bg-gray-200 rounded-2xl"></div>
                  <div className="space-y-4">
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-24 bg-gray-200 rounded"></div>
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
        <MobileLayout>
          <main className="flex-1 overflow-y-auto hide-scrollbar pb-24">
            <div className="px-4 py-6">
              <div className="flex items-center gap-3 mb-6">
                <button 
                  onClick={() => router.back()}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div>
                  <h1 className="text-2xl font-bold dark:text-white">{t('editMemory.title')}</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {t('editMemory.subtitle')}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Current Image */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    {t('create.imageRequired').replace(' *', '')}
                  </label>
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300">
                    {formData.currentImageUrl ? (
                      <img 
                        src={formData.currentImageUrl} 
                        alt="Current memory"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="material-symbols-outlined text-4xl text-gray-400">image</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* New Image Upload */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    Nueva Imagen (opcional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-primary transition-colors"
                    >
                      <div className="text-center">
                        <span className="material-symbols-outlined text-3xl text-gray-400 mb-2">add_photo_alternate</span>
                        <p className="text-sm text-gray-500">
                          {formData.image ? formData.image.name : t('create.selectImage')}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    {t('create.titleRequired')}
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder={t('create.titlePlaceholder')}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    {t('create.description')}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={t('create.descriptionPlaceholder')}
                    rows={4}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>

                {/* Team */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    {t('create.team')}
                  </label>
                  <select
                    value={formData.team}
                    onChange={(e) => setFormData(prev => ({ ...prev, team: e.target.value }))}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">{t('create.selectTeam')}</option>
                    {teams.map(team => (
                      <option key={team} value={team}>{team}</option>
                    ))}
                  </select>
                </div>

                {/* Match Date */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    {t('create.matchDate')}
                  </label>
                  <input
                    type="date"
                    value={formData.matchDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, matchDate: e.target.value }))}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Public Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{t('create.publicMemory')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('create.publicDescription')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isPublic: !prev.isPublic }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.isPublic ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.isPublic ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={saving || !formData.title.trim()}
                  className="w-full bg-primary hover:bg-red-600 disabled:bg-gray-300 text-white font-bold py-4 rounded-2xl transition-colors disabled:cursor-not-allowed"
                >
                  {saving ? t('editMemory.updating') : t('editMemory.updateButton')}
                </button>
              </form>
            </div>
          </main>
        </MobileLayout>
      </div>
    </>
  );
}