'use client'

import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import StatsCounter from '@/components/StatsCounter'
import { useTranslation } from 'react-i18next'

export default function Home() {
  const { t } = useTranslation()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero */}
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-bold mb-6">
          ⚽ {t('landing.title')}
        </h1>
        <p className="text-2xl text-muted-foreground mb-4">
          {t('landing.subtitle')}
        </p>
        <StatsCounter />
        <div className="flex gap-4 justify-center mt-8">
          <Link href="/register">
            <Button size="lg" className="text-lg px-8">
              {t('landing.createAccount')}
            </Button>
          </Link>
          <Link href="/feed">
            <Button size="lg" variant="outline" className="text-lg px-8">
              {t('landing.viewMemories')}
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
              <h3 className="text-xl font-bold mb-2">{t('landing.feature1Title')}</h3>
              <p className="text-muted-foreground">
                {t('landing.feature1Desc')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-xl font-bold mb-2">{t('landing.feature2Title')}</h3>
              <p className="text-muted-foreground">
                {t('landing.feature2Desc')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">💚</div>
              <h3 className="text-xl font-bold mb-2">{t('landing.feature3Title')}</h3>
              <p className="text-muted-foreground">
                {t('landing.feature3Desc')}
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
              {t('landing.ctaTitle')}
            </h2>
            <p className="text-xl mb-6 opacity-90">
              {t('landing.ctaSubtitle')}
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                {t('landing.ctaButton')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
