import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createVIPMembership } from '@/lib/vip'

// Verificar si estamos en modo demo (sin Stripe configurado)
const isDemoMode = !process.env.STRIPE_SECRET_KEY

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verificar si ya es VIP
    const { data: existingVIP } = await supabase
      .from('vip_memberships')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (existingVIP) {
      return NextResponse.json({ error: 'User is already VIP' }, { status: 400 })
    }

    // MODO DEMO: Crear VIP directamente
    if (isDemoMode) {
      const { data: membership, error: insertError } = await supabase
        .from('vip_memberships')
        .insert({
          user_id: user.id,
          payment_intent_id: `demo_${Date.now()}`,
          amount_paid: 5.00,
          currency: 'USD',
          is_active: true,
          expires_at: null
        })
        .select()
        .single()

      if (insertError) {
        console.error('Error creating demo VIP:', insertError)
        // Fallback: actualizar directamente el campo is_vip en profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ is_vip: true })
          .eq('id', user.id)
        
        if (profileError) {
          console.error('Error updating profile VIP status:', profileError)
          return NextResponse.json({ error: 'Failed to create VIP membership' }, { status: 500 })
        }
        
        return NextResponse.json({
          success: true,
          message: '¡Bienvenido al club VIP! (Modo Demo - Profile Updated)',
          demo: true
        })
      }

      return NextResponse.json({
        success: true,
        membership,
        message: '¡Bienvenido al club VIP! (Modo Demo)',
        demo: true
      })
    }

    // MODO PRODUCCIÓN: Stripe (cuando esté configurado)
    const Stripe = require('stripe')
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 500,
      currency: 'usd',
      metadata: {
        user_id: user.id,
        product: 'vip_membership'
      }
    })

    return NextResponse.json({
      success: true,
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id
    })

  } catch (error) {
    console.error('Error creating VIP payment:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}

// Confirmar pago y activar VIP
export async function PUT(request: NextRequest) {
  try {
    const { payment_intent_id } = await request.json()
    
    if (!payment_intent_id) {
      return NextResponse.json({ error: 'Payment intent ID required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verificar pago en Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id)
    
    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }

    if (paymentIntent.metadata.user_id !== user.id) {
      return NextResponse.json({ error: 'Payment user mismatch' }, { status: 400 })
    }

    // Crear membresía VIP
    const membership = await createVIPMembership(
      user.id,
      payment_intent_id,
      paymentIntent.amount / 100 // Convertir de centavos a dólares
    )

    if (!membership) {
      return NextResponse.json({ error: 'Failed to create VIP membership' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      membership,
      message: '¡Bienvenido al club VIP!'
    })

  } catch (error) {
    console.error('Error confirming VIP payment:', error)
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    )
  }
}