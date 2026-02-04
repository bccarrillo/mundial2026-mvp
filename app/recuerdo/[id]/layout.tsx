import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: memory } = await supabase
    .from('memories')
    .select('*')
    .eq('id', id)
    .single()

  if (!memory) {
    return {
      title: 'Recuerdo no encontrado',
    }
  }

  return {
    title: `${memory.title} - Mundial 2026`,
    description: memory.description || 'Recuerdo del Mundial 2026',
    openGraph: {
      title: memory.title,
      description: memory.description || 'Recuerdo del Mundial 2026',
      images: [
        {
          url: memory.image_url,
          width: 1200,
          height: 630,
          alt: memory.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: memory.title,
      description: memory.description || 'Recuerdo del Mundial 2026',
      images: [memory.image_url],
    },
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
