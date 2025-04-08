import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  MessageCircle,
  SendHorizontal,
  Share2,
  ShoppingBag,
  ThumbsUp,
  User,
  Volume2,
  VolumeX,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import SharePopup from '../Layout/SharePopup'

const MobileMediaView = ({
  media,
  videoRef,
  isMuted,
  isPlaying,
  videoTransition,
  toggleMute,
  togglePlay,
  toggleLike,
  isLiked,
  formatLikeCount,
  handleCommentSubmit,
  goToNextMedia,
  goToPreviousMedia,
  onBack,
}) => {
  const [isMobileDescExpanded, setIsMobileDescExpanded] = useState(false)
  const [showMobileComments, setShowMobileComments] = useState(false)
  const [showSharePopup, setShowSharePopup] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState('')
  const mediaContainerRef = useRef(null)
  const commentInputRef = useRef(null)

  // Setup mobile touch and scroll navigation
  useEffect(() => {
    if (mediaContainerRef.current) {
      const container = mediaContainerRef.current
      let touchStartY = 0
      let touchStartTime = 0
      const SWIPE_THRESHOLD = 80 // Increased threshold for mobile
      const MAX_SWIPE_TIME = 500 // Max time for swipe recognition

      const handleTouchStart = (e) => {
        if (showMobileComments) return
        touchStartY = e.touches[0].clientY
        touchStartTime = Date.now()
        e.stopPropagation()
      }

      const handleTouchMove = (e) => {
        if (!showMobileComments) {
          e.preventDefault()
        }
      }

      const handleTouchEnd = (e) => {
        if (showMobileComments || !touchStartY) return

        const touchEndY = e.changedTouches[0].clientY
        const deltaY = touchEndY - touchStartY
        const elapsedTime = Date.now() - touchStartTime

        // Reset values
        touchStartY = 0
        touchStartTime = 0

        // Check if valid swipe
        if (
          Math.abs(deltaY) > SWIPE_THRESHOLD &&
          elapsedTime < MAX_SWIPE_TIME
        ) {
          if (deltaY < 0) {
            // Swipe Up
            setSwipeDirection('↑')
            goToNextMedia()
          } else {
            // Swipe Down
            setSwipeDirection('↓')
            goToPreviousMedia()
          }
        }

        e.stopPropagation()
      }

      container.addEventListener('touchstart', handleTouchStart, {
        passive: false,
      })
      container.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      })
      container.addEventListener('touchend', handleTouchEnd, { passive: false })

      return () => {
        container.removeEventListener('touchstart', handleTouchStart)
        container.removeEventListener('touchmove', handleTouchMove)
        container.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [goToNextMedia, goToPreviousMedia, showMobileComments])

  // Handle keyboard visibility
  useEffect(() => {
    const detectKeyboard = () => {
      // When the visual viewport height becomes significantly smaller than the window height
      // we can assume the keyboard is visible
      const windowHeight = window.innerHeight
      const visibleHeight = window.visualViewport?.height || windowHeight
      const keyboardHeight = windowHeight - visibleHeight

      // If keyboard is taking up significant space (more than 20% of screen)
      if (keyboardHeight > windowHeight * 0.2) {
        setIsKeyboardVisible(true)
      } else {
        setIsKeyboardVisible(false)
      }
    }

    // Add listeners for visual viewport changes
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', detectKeyboard)
      window.visualViewport.addEventListener('scroll', detectKeyboard)
    }

    // Fallback for browsers without visualViewport API
    window.addEventListener('resize', detectKeyboard)

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', detectKeyboard)
        window.visualViewport.removeEventListener('scroll', detectKeyboard)
      }
      window.removeEventListener('resize', detectKeyboard)
    }
  }, [])

  const toggleMobileDescription = () => {
    setIsMobileDescExpanded(!isMobileDescExpanded)
  }

  const toggleDetailPanel = () => {
    setShowMobileComments(!showMobileComments)
  }

  const toggleSharePopup = () => {
    setShowSharePopup(!showSharePopup)
  }

  // Get the current URL for sharing
  const getCurrentShareUrl = () => {
    // Generate a share URL that includes the media ID or other relevant params
    return `${window.location.origin}/media/${media.id || ''}`
  }

  const isPhoto = media.type === 'photo'
  const isVideo = media.type === 'video'

  return (
    <div
      className='relative h-screen w-screen'
      ref={mediaContainerRef}
      style={{
        touchAction: 'none', // Disable browser touch handling
        overflow: 'hidden',
      }}
    >
      {/* CSS for like animation */}
      <style jsx>{`
        @keyframes likeEffect {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
          }
          100% {
            transform: scale(1);
          }
        }
        .liked-animation {
          animation: likeEffect 0.3s ease-in-out;
        }
      `}</style>

      {/* Media Player (Video or Photo) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative h-full overflow-hidden ${
          isPhoto ? 'bg-white' : 'bg-black'
        }`}
      >
        {isVideo ? (
          // Video content
          <video
            ref={videoRef}
            src={media.url}
            className={`w-full h-full object-cover cursor-pointer ${
              videoTransition
                ? 'opacity-0 transition-opacity duration-300'
                : 'opacity-100 transition-opacity duration-300'
            }`}
            controls={false}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onClick={togglePlay}
          />
        ) : (
          // Photo content
          <div className='relative w-full h-full'>
            <img
              src={media.imageUrl}
              alt={media.title}
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[85%] max-h-[85%] object-contain ${
                videoTransition
                  ? 'opacity-0 transition-opacity duration-300'
                  : 'opacity-100 transition-opacity duration-300'
              }`}
            />
          </div>
        )}

        {/* Bottom gradient for visibility - only for videos */}
        {isVideo && (
          <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none'></div>
        )}

        {/* Back button - Now with consistent icon size and centered with white background */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (onBack) onBack()
          }}
          className={`absolute top-4 left-4 rounded-full h-10 w-10 ${
            isPhoto ? 'bg-black/10 text-black' : 'bg-white/70 text-black'
          } border-0 flex items-center justify-center`}
        >
          <ChevronLeft size={20} className='flex-shrink-0' />
        </button>

        {/* Audio control button - Now with consistent icon size and centered with white background - Only for videos */}
        {isVideo && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleMute()
            }}
            className='absolute top-4 right-4 rounded-full h-10 w-10 bg-white/70 text-black border-0 flex items-center justify-center'
          >
            {isMuted ? (
              <VolumeX size={20} className='flex-shrink-0' />
            ) : (
              <Volume2 size={20} className='flex-shrink-0' />
            )}
          </button>
        )}

        {/* Mobile Action Buttons - Overlaid on media - Moved down by removing bottom margin */}
        <div className='absolute right-4 bottom-4 flex flex-col items-center space-y-5'>
          {/* Like button */}
          <div className='flex flex-col items-center'>
            <Button
              id='like-button-mobile'
              className={`rounded-full h-10 w-10 ${
                isLiked
                  ? 'bg-white text-black'
                  : isPhoto
                  ? 'bg-black/10 text-black'
                  : 'bg-black/30 text-white border-0'
              } flex items-center justify-center`}
              variant='ghost'
              onClick={toggleLike}
            >
              <ThumbsUp size={20} className='flex-shrink-0' />
            </Button>
            <span
              className={`text-xs ${
                isPhoto ? 'text-black' : 'text-white'
              } mt-1 font-medium`}
            >
              {isLiked ? formatLikeCount(media.likes, 1) : media.likes}
            </span>
          </div>

          {/* Comments button */}
          <div className='flex flex-col items-center'>
            <Button
              className={`rounded-full h-10 w-10 ${
                isPhoto ? 'bg-black/10 text-black' : 'bg-black/30 text-white'
              } border-0 flex items-center justify-center`}
              variant='ghost'
              onClick={toggleDetailPanel}
            >
              <MessageCircle size={20} className='flex-shrink-0' />
            </Button>
            <span
              className={`text-xs ${
                isPhoto ? 'text-black' : 'text-white'
              } mt-1 font-medium`}
            >
              {media.comments}
            </span>
          </div>

          {/* Share button (changed from Send to Share) */}
          <div className='flex flex-col items-center'>
            <Button
              className={`rounded-full h-10 w-10 ${
                isPhoto ? 'bg-black/10 text-black' : 'bg-black/30 text-white'
              } border-0 flex items-center justify-center`}
              variant='ghost'
              onClick={toggleSharePopup}
            >
              <SendHorizontal size={20} className='flex-shrink-0' />
            </Button>
            <span
              className={`text-xs ${
                isPhoto ? 'text-black' : 'text-white'
              } mt-1 font-medium`}
            >
              Send
            </span>
          </div>

          {/* Buy button */}
          <div className='flex flex-col items-center'>
            <Button
              className={`rounded-full h-10 w-10 ${
                isPhoto ? 'bg-black/10 text-black' : 'bg-black/30 text-white'
              } border-0 flex items-center justify-center`}
              variant='ghost'
            >
              <ShoppingBag size={20} className='flex-shrink-0' />
            </Button>
            <span
              className={`text-xs ${
                isPhoto ? 'text-black' : 'text-white'
              } mt-1 font-medium`}
            >
              +Cart
            </span>
          </div>
        </div>

        {/* Mobile username and description */}
        <div className='absolute bottom-4 left-4 max-w-[90%]'>
          <h4
            className={`${
              isPhoto ? 'text-black' : 'text-white'
            } font-medium text-xs`}
          >
            @{media.creator.name}
          </h4>
          <div
            className={`${
              isPhoto ? 'text-black/60' : 'text-white/60'
            } text-xs max-w-[280px] mt-0.5`}
          >
            {/* Make the paragraph itself clickable with cursor-pointer to show it's clickable */}
            <p
              className={`${
                !isMobileDescExpanded ? 'line-clamp-2' : ''
              } cursor-pointer`}
              onClick={(e) => {
                e.stopPropagation()
                toggleMobileDescription()
              }}
            >
              {media.description}
            </p>
            {/* Keep the button for visual indication */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleMobileDescription()
              }}
              className={`${
                isPhoto
                  ? 'text-black/80 hover:text-black'
                  : 'text-white/80 hover:text-white'
              } text-xs inline-flex items-center mt-0.5`}
            >
              {isMobileDescExpanded ? (
                <span className='flex items-center'>
                  Show less <ChevronUp size={10} className='ml-0.5' />
                </span>
              ) : (
                <span className='flex items-center'>
                  Show more <ChevronDown size={10} className='ml-0.5' />
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Comments Panel (fullscreen overlay) - Removed rounded corners */}
        <AnimatePresence>
          {showMobileComments && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className='absolute inset-0 bg-white overflow-hidden'
              style={{ zIndex: 100 }}
            >
              <div className='p-4 flex justify-between items-center border-b'>
                <h3 className='font-medium'>Comments ({media.comments})</h3>
                <button
                  className='bg-transparent border-none cursor-pointer p-2'
                  onClick={() => setShowMobileComments(false)}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='m6 9 6 6 6-6' />
                  </svg>
                </button>
              </div>
              <div
                className={`${
                  isKeyboardVisible
                    ? 'h-[calc(100%-200px)]'
                    : 'h-[calc(100%-110px)]'
                } overflow-y-auto p-4`}
              >
                {media.commentsList.map((comment) => (
                  <div key={comment.id} className='mb-6 flex space-x-3'>
                    <Avatar className='h-8 w-8 flex-shrink-0'>
                      <AvatarImage src={comment.avatar} />
                      <AvatarFallback>
                        <User size={16} />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className='flex items-center'>
                        <h4 className='text-sm font-medium'>{comment.user}</h4>
                        <span className='text-xs text-gray-500 ml-2'>
                          {comment.time}
                        </span>
                      </div>
                      <p className='text-sm mt-1'>{comment.text}</p>
                      <div className='flex items-center mt-2 text-xs text-gray-500'>
                        <button className='flex items-center gap-1'>
                          <ThumbsUp size={12} />
                          <span>{comment.likes}</span>
                        </button>
                        <button className='ml-4'>Reply</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className={`border-t absolute ${
                  isKeyboardVisible ? 'bottom-[200px]' : 'bottom-0'
                } left-0 right-0 p-3 bg-white`}
              >
                <div className='flex items-center'>
                  <Avatar className='h-8 w-8 ml-1 mr-2'>
                    <AvatarFallback>
                      <User size={16} />
                    </AvatarFallback>
                  </Avatar>
                  <Input
                    ref={commentInputRef}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder='Add a comment...'
                    className='flex-1 border border-gray-300 rounded-full text-base mr-2 focus:border-2 focus:border-blue-500'
                    style={{
                      fontSize: '16px', // Ensure minimum font size
                      transform: 'scale(1)', // Fix for iOS zoom
                      // Add iOS-specific fixes
                      transformOrigin: 'left center',
                      maxHeight: '2em', // Prevent iOS input expansion
                    }}
                  />
                  <Button
                    onClick={() => {
                      if (commentText.trim()) {
                        handleCommentSubmit()
                        setCommentText('')
                        // Blur the input after submitting to hide keyboard
                        if (commentInputRef.current) {
                          commentInputRef.current.blur()
                        }
                      }
                    }}
                    disabled={!commentText.trim()}
                    className='rounded-full bg-gray-900 text-white h-8 w-8 p-0 flex items-center justify-center'
                  >
                    <SendHorizontal size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Share Popup Integration */}
        <SharePopup
          isOpen={showSharePopup}
          onClose={() => setShowSharePopup(false)}
          currentUrl={getCurrentShareUrl()}
        />
      </motion.div>
    </div>
  )
}

export default MobileMediaView
