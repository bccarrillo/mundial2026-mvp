'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

export default function ApoyarPage() {
  const router = useRouter()
  const { t } = useTranslation()

  const handlePayPalDonate = () => {
    // PayPal Donate button - reemplaza con tu link real de PayPal
    window.open('https://www.paypal.com/donate/?business=archangelark1@hotmail.com&no_recurring=0&currency_code=USD', '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard')}
          className="mb-4"
        >
          ← {t('common.back')}
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">💝 {t('support.title')}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('support.subtitle')}
          </p>
        </div>

        {/* Main donation card */}
        <Card className="mb-8 border-2 border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-800">
              🚀 {t('support.mainTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-lg text-green-700">
              {t('support.mainDescription')}
            </p>
            
            <div className="space-y-4">
              <Button 
                onClick={handlePayPalDonate}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
              >
                💳 {t('support.donateButton')}
              </Button>
              
              <p className="text-sm text-muted-foreground">
                {t('support.securePayment')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Why support us */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎯 {t('support.reason1Title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('support.reason1Description')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🌍 {t('support.reason2Title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('support.reason2Description')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏆 {t('support.reason3Title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('support.reason3Description')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💎 {t('support.reason4Title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('support.reason4Description')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Supporter benefits */}
        <Card className="mb-8 border-2 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-center text-yellow-800">
              ⭐ {t('support.benefitsTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl mb-2">🏅</div>
                <h3 className="font-semibold text-yellow-800">{t('support.benefit1Title')}</h3>
                <p className="text-sm text-yellow-700">{t('support.benefit1Description')}</p>
              </div>
              <div>
                <div className="text-2xl mb-2">🎨</div>
                <h3 className="font-semibold text-yellow-800">{t('support.benefit2Title')}</h3>
                <p className="text-sm text-yellow-700">{t('support.benefit2Description')}</p>
              </div>
              <div>
                <div className="text-2xl mb-2">💝</div>
                <h3 className="font-semibold text-yellow-800">{t('support.benefit3Title')}</h3>
                <p className="text-sm text-yellow-700">{t('support.benefit3Description')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alternative support */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              🤝 {t('support.alternativeTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              {t('support.alternativeDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline"
                onClick={() => router.push('/invitar')}
              >
                👥 {t('support.inviteFriends')}
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  const text = `🏆 ¡Descubre Mundial 2026! La app para guardar y compartir tus recuerdos del Mundial. 100% gratis y en español 🇪🇸\n\n👉 ${window.location.origin}`
                  const url = `https://wa.me/?text=${encodeURIComponent(text)}`
                  window.open(url, '_blank')
                }}
              >
                📱 {t('support.shareApp')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer message */}
        <div className="text-center mt-8 p-6 bg-white/50 rounded-lg">
          <p className="text-muted-foreground">
            {t('support.footerMessage')}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {t('support.footerThanks')}
          </p>
        </div>
      </div>
    </div>
  )
}