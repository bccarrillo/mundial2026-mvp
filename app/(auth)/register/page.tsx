'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'
import { events } from '@/lib/analytics'
import { addPoints } from '@/lib/points'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const referrerId = searchParams.get('ref')
  const { t } = useTranslation()
  const { executeRecaptcha } = useGoogleReCaptcha()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 1. Ejecutar reCAPTCHA
      if (!executeRecaptcha) {
        setError('Sistema de seguridad no disponible. Recarga la página.')
        setLoading(false)
        return
      }

      const recaptchaToken = await executeRecaptcha('register')
      
      // 2. Llamar a nuestra API protegida
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          recaptchaToken
        })
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Error en el registro')
        setLoading(false)
        return
      }

      // 3. Registro exitoso
      console.log('✅ Registration successful:', result)
      
      // Tracking: Usuario registrado
      events.signUp('email')
      
      // Si hay referido, crear invitación
      if (referrerId && result.user) {
        await supabase
          .from('invitations')
          .insert({
            inviter_id: referrerId,
            invitee_email: email,
            invitee_id: result.user.id,
            status: 'accepted'
          })
        
        // Agregar puntos al invitador por invitación exitosa
        await addPoints(referrerId, 'invite', result.user.id)
        
        // Tracking: Invitación aceptada
        events.acceptInvite(referrerId)
      }
      
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2000)
      
    } catch (error) {
      console.error('Registration error:', error)
      setError('Error de conexión. Intenta de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">⚽ {t('landing.title')}</CardTitle>
          <CardDescription>{t('landing.createAccount')}</CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center py-8">
              <p className="text-green-600 font-semibold mb-2">{t('common.success')}!</p>
              <p className="text-sm text-muted-foreground">{t('common.loading')}...</p>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground mt-1">Mínimo 6 caracteres</p>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              
              {/* Indicador de protección */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Protegido contra spam y bots</span>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('common.loading') : t('auth.registerButton')}
              </Button>
            </form>
          )}

          <p className="text-center text-sm text-muted-foreground mt-4">
            {t('auth.hasAccount')}{' '}
            <a href="/login" className="text-primary hover:underline">
              {t('auth.loginLink')}
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  )
}
