import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import StatsCounter from '@/components/StatsCounter'

export const metadata: Metadata = {
  title: 'Mundial 2026 - Guarda tus recuerdos',
  description: 'Crea tu álbum digital del Mundial 2026. Guarda y comparte tus mejores momentos.',
  openGraph: {
    title: 'Mundial 2026 - Guarda tus recuerdos',
    description: 'Crea tu álbum digital del Mundial 2026. Guarda y comparte tus mejores momentos.',
    type: 'website',
  },
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero */}
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-bold mb-6">
          ⚽ Mundial 2026
        </h1>
        <p className="text-2xl text-muted-foreground mb-4">
          Guarda y comparte tus recuerdos del Mundial
        </p>
        <StatsCounter />
        <div className="flex gap-4 justify-center mt-8">
          <Link href="/register">
            <Button size="lg" className="text-lg px-8">
              Crear cuenta gratis
            </Button>
          </Link>
          <Link href="/feed">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Ver recuerdos
            </Button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-xl font-bold mb-2">Guarda tus momentos</h3>
              <p className="text-muted-foreground">
                Sube fotos y videos de los mejores momentos del Mundial
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-xl font-bold mb-2">Comparte fácilmente</h3>
              <p className="text-muted-foreground">
                Cada recuerdo tiene su propio link para compartir en WhatsApp
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">💚</div>
              <h3 className="text-xl font-bold mb-2">100% Gratis</h3>
              <p className="text-muted-foreground">
                Sin límites, sin anuncios, sin costos ocultos
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="bg-gradient-to-r from-blue-500 to-green-500 text-white border-0">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para guardar tus recuerdos?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Únete a miles de fanáticos que ya están creando su álbum digital
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Empezar ahora
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
