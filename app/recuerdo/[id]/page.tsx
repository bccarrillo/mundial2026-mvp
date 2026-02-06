'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Memory, Comment } from '@/types/database'
import { useTranslation } from 'react-i18next'
import { events } from '@/lib/analytics'
import { addPoints, getUserPoints } from '@/lib/points'
import { isUserVIPClient, calculateNFTPrice } from '@/lib/vip-client'
import NFTCertificationModal from '@/components/NFTCertificationModal'

export default function RecuerdoPage() {
  const [memory, setMemory] = useState<Memory | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showNFTModal, setShowNFTModal] = useState(false)
  const [nftPrice, setNFTPrice] = useState(0)
  const [userLevel, setUserLevel] = useState(1)
  const [isVIP, setIsVIP] = useState(false)
  const [hasNFT, setHasNFT] = useState(false)
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()
  const { t } = useTranslation()

  useEffect(() => {
    const fetchMemory = async () => {
      const id = params.id as string
      
      // Tracking: Ver recuerdo
      events.viewMemory(id)
      
      // Obtener usuario actual
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user?.id || null)

      // Si hay usuario, obtener datos para NFT
      if (user) {
        const [points, vipStatus] = await Promise.all([
          getUserPoints(user.id),
          isUserVIPClient(user.id)
        ])
        
        setUserLevel(points?.level || 1)
        setIsVIP(vipStatus)
        
        // Calcular precio NFT
        const price = calculateNFTPrice(Number(points?.level) || 1, vipStatus)
        setNFTPrice(price)
        
        // Verificar si el recuerdo ya tiene NFT
        const { data: nftData } = await supabase
          .from('nft_certificates')
          .select('id')
          .eq('memory_id', id)
          .maybeSingle()
        
        setHasNFT(!!nftData)
      }

      // Obtener recuerdo
      const { data, error } = await supabase
        .from('memories')
        .select(`
          *,
          profiles (display_name, email)
        `)
        .eq('id', id)
        .single()

      if (!error && data) {
        setMemory(data)
      }

      // Contar likes totales
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('memory_id', id)
      
      setLikesCount(count || 0)

      // Verificar si el usuario ya dio like
      if (user) {
        const { data: likeData } = await supabase
          .from('likes')
          .select('id')
          .eq('memory_id', id)
          .eq('user_id', user.id)
          .maybeSingle()
        
        setLiked(!!likeData)
      }

      // Obtener comentarios
      const { data: commentsData } = await supabase
        .from('comments')
        .select('*')
        .eq('memory_id', id)
        .order('created_at', { ascending: false })
      
      if (commentsData) {
        // Obtener profiles manualmente
        const userIds = [...new Set(commentsData.map(c => c.user_id))]
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('*')
          .in('id', userIds)
        
        const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || [])
        const commentsWithProfiles = commentsData.map(c => ({
          ...c,
          profiles: profilesMap.get(c.user_id)
        }))
        
        setComments(commentsWithProfiles)
      }

      setLoading(false)
    }

    fetchMemory()
  }, [params.id, supabase])

  const handleLike = async () => {
    if (!memory || !currentUser) {
      router.push('/login')
      return
    }

    if (liked) {
      // Quitar like
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('memory_id', memory.id)
        .eq('user_id', currentUser)

      if (!error) {
        setLiked(false)
        setLikesCount(prev => prev - 1)
        
        // OPCIONAL: Quitar puntos cuando se quita el like
        // if (currentUser !== memory.user_id) {
        //   await addPoints(memory.user_id, 'lose_like', memory.id)
        // }
      }
    } else {
      // Dar like
      const { error } = await supabase
        .from('likes')
        .insert({ memory_id: memory.id, user_id: currentUser })

      if (!error) {
        setLiked(true)
        setLikesCount(prev => prev + 1)
        
        // Solo agregar puntos si NO es el autor del recuerdo
        if (currentUser !== memory.user_id) {
          // Verificar si este usuario YA dio like antes a este recuerdo
          // (buscando en historial de transacciones con metadata específica)
          const transactionKey = `${currentUser}-${memory.id}-like`
          
          const { data: existingTransaction } = await supabase
            .from('point_transactions')
            .select('id')
            .eq('user_id', memory.user_id)           // Quien recibe los puntos (autor)
            .eq('action', 'receive_like')
            .eq('reference_id', memory.id)           // El recuerdo
            .textSearch('action', `receive_like`)    // Buscar solo likes
            .limit(1)
            .maybeSingle()
          
          // Contar cuántos likes ha recibido este recuerdo
          const { count: likeTransactions } = await supabase
            .from('point_transactions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', memory.user_id)
            .eq('action', 'receive_like')
            .eq('reference_id', memory.id)
          
          // Contar cuántos likes reales tiene el recuerdo
          const { count: actualLikes } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('memory_id', memory.id)
          
          // Solo dar puntos si hay menos transacciones que likes reales
          if ((likeTransactions || 0) < (actualLikes || 0)) {
            await addPoints(memory.user_id, 'receive_like', memory.id)
          }
        }
        
        // Tracking: Like dado
        events.likeMemory(memory.id)
      }
    }
  }

  const handleShare = async () => {
    if (!memory) return
    
    // Agregar puntos por compartir (solo si es el autor del recuerdo)
    if (currentUser === memory.user_id) {
      await addPoints(currentUser, 'share', memory.id)
    }
    
    // Tracking: Compartir recuerdo
    events.shareMemory(memory.id)
    
    const url = window.location.href
    const text = `📸 Mira este recuerdo del Mundial: ${memory?.title}\n\n👉 Crea el tuyo gratis en:`
    
    // Intentar Web Share API primero
    if (navigator.share) {
      try {
        await navigator.share({
          title: memory?.title,
          text: text,
          url: url,
        })
        return
      } catch (err) {
        // Si cancela, continuar con otras opciones
      }
    }
    
    // Opción WhatsApp directo
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleSubmitComment = async () => {
    if (!currentUser) {
      router.push('/login')
      return
    }

    if (!newComment.trim() || !memory) return

    setSubmitting(true)
    const { data, error } = await supabase
      .from('comments')
      .insert({
        memory_id: memory.id,
        user_id: currentUser,
        content: newComment.trim()
      })
      .select('*')
      .single()

    if (!error && data) {
      // Agregar puntos por comentar
      await addPoints(currentUser, 'comment', data.id)
      
      // Obtener profile del usuario
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser)
        .maybeSingle()
      
      setComments([{ ...data, profiles: profile }, ...comments])
      setNewComment('')
    }
    setSubmitting(false)
  }

  const handleDeleteComment = async (commentId: string) => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)

    if (!error) {
      setComments(comments.filter(c => c.id !== commentId))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-10 w-32 mb-4" />
          <Card>
            <Skeleton className="w-full h-96 rounded-t-lg" />
            <CardContent className="p-6">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!memory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t('memory.notFound')}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="outline"
          onClick={() => router.push('/feed')}
          className="mb-4"
        >
          ← {t('memory.backToFeed')}
        </Button>

        <Card>
          <img
            src={memory.image_url}
            alt={memory.title}
            className="w-full h-96 object-cover rounded-t-lg"
          />
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold mb-4">{memory.title}</h1>
            
            {memory.description && (
              <p className="text-muted-foreground mb-4">{memory.description}</p>
            )}

            {memory.team && (
              <p className="text-lg mb-2">⚽ {memory.team}</p>
            )}

            {memory.match_date && (
              <p className="text-sm text-muted-foreground mb-4">
                📅 {new Date(memory.match_date).toLocaleDateString()}
              </p>
            )}

            {memory.profiles && (
              <p className="text-sm text-muted-foreground mb-4">
                👤 {t('memory.by')} <span className="font-semibold">{memory.profiles.display_name}</span>
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-2 mt-6">
              <Button
                onClick={handleLike}
                variant={liked ? 'secondary' : 'default'}
                className="w-full sm:w-auto"
              >
                {liked ? '❤️' : '🤍'} {likesCount} {liked ? t('memory.liked') : t('memory.likes')}
              </Button>
              
              {/* Botón NFT - Solo si es el autor del recuerdo */}
              {currentUser === memory.user_id && !hasNFT && (
                <Button
                  onClick={() => setShowNFTModal(true)}
                  variant="outline"
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:from-purple-600 hover:to-blue-700"
                >
                  🎫 {t('nft.certifyButton')} (${nftPrice.toFixed(2)})
                </Button>
              )}
              
              {/* Indicador NFT certificado */}
              {hasNFT && (
                <Button
                  variant="outline"
                  disabled
                  className="w-full sm:w-auto bg-green-50 text-green-700 border-green-200"
                >
                  ✅ {t('nft.alreadyCertified')}
                </Button>
              )}
              
              <Button onClick={handleShare} variant="outline" className="w-full sm:flex-1">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span className="truncate">{t('memory.share')}</span>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-6">
              {t('memory.createdOn')} {new Date(memory.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        {/* Sección de comentarios */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">💬 {t('memory.comments')} ({comments.length})</h2>
            
            {/* Formulario nuevo comentario */}
            <div className="mb-6">
              <Textarea
                placeholder={currentUser ? t('memory.commentPlaceholder') : t('memory.commentPlaceholderLogin')}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={!currentUser || submitting}
                className="mb-2"
              />
              <Button 
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || submitting}
              >
                {submitting ? t('memory.commentSubmitting') : t('memory.commentButton')}
              </Button>
            </div>

            {/* Lista de comentarios */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  {t('memory.noComments')}
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-sm">
                          {comment.profiles?.display_name || 'Usuario'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString()} a las {new Date(comment.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                      {currentUser === comment.user_id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          {t('memory.deleteComment')}
                        </Button>
                      )}
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <p className="text-lg font-semibold mb-2">
              📸 {t('memory.ctaTitle')}
            </p>
            <p className="text-muted-foreground mb-4">
              {t('memory.ctaDesc')}
            </p>
            <Button onClick={() => router.push('/register')}>
              {t('memory.ctaButton')}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Modal de certificación NFT */}
      <NFTCertificationModal
        isOpen={showNFTModal}
        onClose={() => setShowNFTModal(false)}
        onSuccess={() => {
          setHasNFT(true)
          setShowNFTModal(false)
        }}
        memoryId={memory.id}
        memoryTitle={memory.title}
        price={nftPrice}
        userLevel={userLevel}
        isVIP={isVIP}
      />
    </div>
  )
}
