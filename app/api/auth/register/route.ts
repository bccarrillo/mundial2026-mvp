import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateEmailForRegistration } from '@/lib/email-validation'
import { checkRateLimit } from '@/lib/rate-limiting'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { logErrorClient } from '@/lib/logger-client'

export async function POST(request: NextRequest) {
  try {
    const { email, password, recaptchaToken } = await request.json()
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    
    console.log('🔐 Registration attempt:', { email, ip })
    
    // 1. VALIDAR RECAPTCHA
    if (!recaptchaToken) {
      return NextResponse.json(
        { error: 'Verificación de seguridad requerida' },
        { status: 400 }
      )
    }
    
    const recaptchaResult = await verifyRecaptcha(recaptchaToken)
    if (!recaptchaResult.success) {
      console.warn('❌ reCAPTCHA failed:', recaptchaResult.error)
      return NextResponse.json(
        { error: 'Verificación de seguridad fallida. Intenta de nuevo.' },
        { status: 400 }
      )
    }
    
    console.log('✅ reCAPTCHA passed, score:', recaptchaResult.score)
    
    // 2. VALIDAR EMAIL
    const emailValidation = await validateEmailForRegistration(email)
    if (!emailValidation.valid) {
      console.warn('❌ Email validation failed:', emailValidation.reason)
      return NextResponse.json(
        { error: emailValidation.reason },
        { status: 400 }
      )
    }
    
    if (emailValidation.warning) {
      console.warn('⚠️ Email warning:', emailValidation.warning)
    }
    
    // 3. RATE LIMITING POR EMAIL
    const emailRateLimit = checkRateLimit(`email:${email}`, 1, 24 * 60 * 60 * 1000) // 1 por día
    if (!emailRateLimit.allowed) {
      console.warn('❌ Email rate limit exceeded:', email)
      return NextResponse.json(
        { error: 'Este email ya fue usado para registro reciente.' },
        { status: 429 }
      )
    }
    
    // 4. VALIDAR CONTRASEÑA
    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }
    
    // 5. CREAR USUARIO EN SUPABASE
    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          registration_ip: ip,
          recaptcha_score: recaptchaResult.score,
          email_trusted: emailValidation.trusted
        }
      }
    })
    
    if (error) {
      console.error('❌ Supabase registration error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    console.log('✅ User registered successfully:', data.user?.id)
    
    return NextResponse.json({
      success: true,
      message: 'Usuario registrado exitosamente. Revisa tu email para confirmar.',
      user: data.user,
      needsEmailConfirmation: !data.session
    })
    
  } catch (error) {
    console.error('💥 Registration API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}