'use client'

import { useEffect, useState } from 'react'
import { useV2 } from '@/lib/V2Context'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Memory, Comment } from '@/types/database'
import { addPoints, getUserPoints } from '@/lib/points'
import { isUserVIPClient, calculateNFTPrice } from '@/lib/vip-client'
import NFTCertificationModal from '@/components/NFTCertificationModal'
import { makeAuthenticatedRequest } from '@/lib/blockedUserHandler'
import MobileHeader from '../components/MobileHeader'
import BottomNavigation from '../components/BottomNavigation'
import Icon from '../components/Icon'
import '../globals.css'

interface MemoryDetailV2Props {
  params: { id: string }
}

export default function MemoryDetailV2({ params }: MemoryDetailV2Props) {
  const { t } = useV2();
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
  const supabase = createClient()

  useEffect(() => {
    const fetchMemory = async () => {
      const id = params.id as string
      
      // Validate ID parameter
      if (!id || id === 'undefined') {
        console.error('Invalid memory ID:', id)
        setLoading(false)
        return
      }
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user?.id || null)

      // If user exists, get NFT data
      if (user) {
        const [points, vipStatus] = await Promise.all([
          getUserPoints(user.id),
          isUserVIPClient(user.id)
        ])
        
        setUserLevel(points?.level || 1)
        setIsVIP(vipStatus)
        setNFTPrice(calculateNFTPrice(Number(points?.level) || 1, vipStatus))
        
        // Check if memory already has NFT
        const { data: nftData } = await supabase
          .from('nft_certificates')
          .select('id')
          .eq('memory_id', id)
          .maybeSingle()
        
        setHasNFT(!!nftData)
      }

      // Get memory
      const { data, error } = await supabase
        .from('memories')
        .select(`
          *,
          profiles (display_name, email)
        `)
        .eq('id', id)
        .is('deleted_at', null)
        .single()

      if (!error && data) {
        setMemory(data)
      }

      // Count total likes
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('memory_id', id)
      
      setLikesCount(count || 0)

      // Check if user already liked
      if (user) {
        const { data: likeData } = await supabase
          .from('likes')
          .select('id')
          .eq('memory_id', id)
          .eq('user_id', user.id)
          .maybeSingle()
        
        setLiked(!!likeData)
      }

      // Get comments
      const { data: commentsData } = await supabase
        .from('comments')
        .select('*')
        .eq('memory_id', id)
        .order('created_at', { ascending: false })
      
      if (commentsData) {
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
      router.push('/v2/login')
      return
    }

    if (liked) {
      try {
        await fetch(`/api/likes?memory_id=${memory.id}`, {
          method: 'DELETE'
        })
        
        setLiked(false)
        setLikesCount(prev => prev - 1)
      } catch (error: any) {
        if (error.message === 'BLOCKED_USER') return
        console.error('Error removing like:', error)
      }
    } else {
      try {
        await makeAuthenticatedRequest('/api/likes', {
          method: 'POST',
          body: JSON.stringify({ memory_id: memory.id })
        })
        
        setLiked(true)
        setLikesCount(prev => prev + 1)
        
        if (currentUser !== memory.user_id) {
          const { count: likeTransactions } = await supabase
            .from('point_transactions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', memory.user_id)
            .eq('action', 'receive_like')
            .eq('reference_id', memory.id)
          
          const { count: actualLikes } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('memory_id', memory.id)
          
          if ((likeTransactions || 0) < (actualLikes || 0)) {
            await addPoints(memory.user_id, 'receive_like', memory.id)
          }
        }
      } catch (error: any) {
        if (error.message === 'BLOCKED_USER') return
        console.error('Error giving like:', error)
      }
    }
  }

  const handleShare = async () => {
    if (!memory) return
    
    if (currentUser === memory.user_id) {
      await addPoints(currentUser, 'share', memory.id)
    }
    
    const url = window.location.href
    const text = `📸 Mira este recuerdo del Mundial: ${memory?.title}\n\n👉 Crea el tuyo gratis en:`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: memory?.title,
          text: text,
          url: url,
        })
        return
      } catch (err) {
        // Continue with other options
      }
    }
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleSubmitComment = async () => {
    if (!currentUser) {
      router.push('/v2/login')
      return
    }

    if (!newComment.trim() || !memory) return

    setSubmitting(true)
    try {
      const result = await makeAuthenticatedRequest('/api/comments', {
        method: 'POST',
        body: JSON.stringify({
          memory_id: memory.id,
          content: newComment.trim()
        })
      })

      if (result.comment) {
        await addPoints(currentUser, 'comment', result.comment.id)
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser)
          .maybeSingle()
        
        setComments([{ ...result.comment, profiles: profile }, ...comments])
        setNewComment('')
      }
    } catch (error: any) {
      if (error.message !== 'BLOCKED_USER') {
        console.error('Error sending comment:', error)
      }
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="font-display bg-white min-h-screen max-w-md mx-auto">
        <MobileHeader />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!memory) {
    return (
      <div className="font-display bg-white min-h-screen max-w-md mx-auto">
        <MobileHeader />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <p className="text-gray-500 mb-4">{t('memory.notFound')}</p>
            <button 
              onClick={() => router.push('/v2/feed')}
              className="bg-primary text-white px-4 py-2 rounded-lg"
            >
              {t('memory.backToFeed')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="font-display bg-white min-h-screen max-w-md mx-auto">
      {/* Hero Image */}
      <div className="relative w-full h-[65vh]">
        <img 
          alt={memory.title} 
          className="w-full h-full object-cover" 
          src={memory.image_url}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
        <button 
          className="absolute top-6 left-6 w-10 h-10 bg-white/30 ios-blur text-white rounded-full flex items-center justify-center"
          onClick={() => router.back()}
        >
          <Icon name="chevron_left" className="text-2xl" />
        </button>
        <div className="absolute bottom-12 left-6 right-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded uppercase tracking-wider">
              {memory.team || 'Mundial 2026'}
            </span>
            {memory.match_date && (
              <span className="px-2 py-0.5 bg-white/20 ios-blur text-white text-[10px] font-bold rounded uppercase tracking-wider">
                {new Date(memory.match_date).toLocaleDateString()}
              </span>
            )}
          </div>
          <h1 className="text-4xl font-extrabold text-white leading-tight shadow-sm">
            {memory.title}
          </h1>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative -mt-8 bg-white rounded-t-[2.5rem] px-6 pt-8 shadow-2xl pb-24">
        {/* Author Info */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden border-2 border-primary/20 p-0.5">
              <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
                <Icon name="person" className="text-gray-500" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                {memory.profiles?.display_name || 'Usuario'}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(memory.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400">
              <Icon name="more_horiz" className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <button className="flex flex-col items-center gap-2 group" onClick={handleShare}>
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600 group-active:bg-gray-100 transition-colors">
              <Icon name="share" className="text-2xl" />
            </div>
            <span className="text-xs font-semibold text-gray-500">{t('memory.share')}</span>
          </button>
          <button className="flex flex-col items-center gap-2 group" onClick={handleLike}>
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600 group-active:bg-gray-100 transition-colors">
              <Icon name="favorite" className={`text-2xl ${liked ? 'text-primary' : ''}`} />
            </div>
            <span className="text-xs font-semibold text-gray-500">
              {likesCount} {liked ? t('memory.liked') : t('memory.like')}
            </span>
          </button>
          <button className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600 group-active:bg-gray-100 transition-colors">
              <Icon name="download" className="text-2xl" />
            </div>
            <span className="text-xs font-semibold text-gray-500">{t('memory.download')}</span>
          </button>
        </div>

        {/* Description */}
        {memory.description && (
          <div className="mb-10">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
              {t('memory.description')}
            </h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              {memory.description}
            </p>
          </div>
        )}

        {/* NFT CTA - Only for memory owner */}
        {currentUser === memory.user_id && !hasNFT && (
          <div className="bg-black rounded-3xl p-6 text-white overflow-hidden relative mb-8">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/30 blur-3xl rounded-full"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
                  <Icon name="token" className="text-primary font-bold" />
                </div>
                <span className="font-bold text-lg uppercase tracking-tight">{t('memory.createNFT')}</span>
              </div>
              <p className="text-gray-400 text-sm mb-6 leading-snug">
                {t('memory.nftDescription')}
              </p>
              <button 
                className="w-full bg-primary hover:bg-red-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-900/20 active:scale-95 transition-all"
                onClick={() => setShowNFTModal(true)}
              >
                {t('memory.createNFTButton')} (${nftPrice.toFixed(2)})
              </button>
            </div>
          </div>
        )}

        {/* NFT Certified Indicator */}
        {hasNFT && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-8 text-center">
            <span className="text-green-600 text-3xl mb-2 block">✓</span>
            <p className="text-green-700 font-bold">✅ {t('memory.certified')}</p>
          </div>
        )}

        {/* Comments Section */}
        <div className="border-t pt-8">
          <h3 className="text-lg font-bold mb-4">💬 {t('memory.comments')} ({comments.length})</h3>
          
          {/* New Comment Form */}
          <div className="mb-6">
            <textarea
              placeholder={currentUser ? t('memory.writeComment') : t('memory.loginToComment')}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={!currentUser || submitting}
              className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              rows={3}
            />
            <button 
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || submitting}
              className="mt-2 px-4 py-2 bg-primary text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? t('memory.sending') : t('memory.commentButton')}
            </button>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
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
                      <p className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <BottomNavigation />

      {/* NFT Modal */}
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