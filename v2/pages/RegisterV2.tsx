'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { addPoints } from '@/lib/points'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import PixelLogo from '../components/PixelLogo'
import Icon from '../components/Icon'
import '../globals.css'

function RegisterFormV2() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const referrerId = searchParams.get('ref')
  const { executeRecaptcha } = useGoogleReCaptcha()
  const { t } = useTranslation()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Execute reCAPTCHA
      if (!executeRecaptcha) {
        setError('Sistema de seguridad no disponible. Recarga la página.')
        setLoading(false)
        return
      }

      const recaptchaToken = await executeRecaptcha('register')
      
      // Call protected API
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

      // Registration successful
      console.log('✅ Registration successful:', result)
      
      // Handle referral if exists
      if (referrerId && result.user) {
        await supabase
          .from('invitations')
          .insert({
            inviter_id: referrerId,
            invitee_email: email,
            invitee_id: result.user.id,
            status: 'accepted'
          })
        
        await addPoints(referrerId, 'invite', result.user.id)
      }
      
      setSuccess(true)
      setTimeout(() => router.push('/v2/dashboard'), 2000)
      
    } catch (error) {
      console.error('Registration error:', error)
      setError('Error de conexión. Intenta de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div className="font-display bg-white min-h-screen max-w-md mx-auto flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <PixelLogo size="large" />
            </div>
            <h1 className="text-3xl font-bold text-[#333333] mb-2">Memories26</h1>
            <p className="text-gray-500">{t('landing.createAccount')}</p>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="check_circle" className="text-3xl text-green-600" />
              </div>
              <p className="text-green-600 font-semibold mb-2">¡Registro exitoso!</p>
              <p className="text-sm text-gray-500">Redirigiendo al dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                  <Icon name="email" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    minLength={6}
                  />
                  <Icon name="lock" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              
              {/* Security Indicator */}
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-xl">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Protegido contra spam y bots</span>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-red-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creando cuenta...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Icon name="person_add" className="text-xl" />
                    Crear Cuenta
                  </div>
                )}
              </button>
            </form>
          )}

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={() => router.push('/v2/login')}
                className="text-primary font-semibold hover:underline"
              >
                Iniciar Sesión
              </button>
            </p>
          </div>

          {/* Referral Info */}
          {referrerId && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <Icon name="group_add" className="text-blue-600 text-2xl mb-2" />
              <p className="text-blue-800 text-sm font-medium">
                Te invitaron a unirte a Memories26
              </p>
              <p className="text-blue-600 text-xs mt-1">
                Ambos recibirán puntos bonus al registrarte
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function RegisterV2() {
  return (
    <Suspense fallback={
      <div className="font-display bg-white min-h-screen max-w-md mx-auto flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    }>
      <RegisterFormV2 />
    </Suspense>
  )
}