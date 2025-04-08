import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Image,
  MessageCircle,
  PanelLeftClose,
  PanelLeftOpen,
  SendHorizontal,
  ShoppingBag,
  ThumbsUp,
  User,
  Volume2,
  VolumeX,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import SharePopup from '../Layout/SharePopup'
import MobileVideoView from './MobileVideoView'

const VideoViewPage = () => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [videoTransition, setVideoTransition] = useState(false)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const videoRef = React.useRef(null)
  const videoContainerRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
    }
  }, [currentMediaIndex])
  // Check if the device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Check on initial load
    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile)

    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  // Support for keyboard navigation (for all devices)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent triggering on input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')
        return

      // Find the arrow buttons programmatically (if they exist)
      const upButton =
        document.querySelector('[aria-label="Previous media"]') ||
        document.querySelector('.arrow-up-button')
      const downButton =
        document.querySelector('[aria-label="Next media"]') ||
        document.querySelector('.arrow-down-button')

      if (e.key === 'ArrowUp') {
        // Either click the button if it exists or call the function directly
        if (upButton) {
          upButton.click()
        } else {
          goToPreviousMedia()
        }
        e.preventDefault() // Prevent page scroll
      } else if (e.key === 'ArrowDown') {
        if (downButton) {
          downButton.click()
        } else {
          goToNextMedia()
        }
        e.preventDefault() // Prevent page scroll
      }
    }

    // Add keyboard event listener
    window.addEventListener('keydown', handleKeyDown)

    // Clean up
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentMediaIndex])

  // Mock data for multiple media items alternating between video and photo
  const mediaItems = [
    {
      id: '123',
      type: 'video',
      title: 'Home Depot Organizer Changed My Workspace!',
      url: '/sample.mp4',
      views: '345K',
      likes: '42.3K',
      comments: '1.2K',
      shares: '8.5K',
      description:
        'I found this amazing desk organizer on Amazon that completely transformed my workspace! It has compartments for everything and looks so sleek. Check it out and earn when you buy through my link. #workspace #organization #amazonfinds',
      creator: {
        name: 'OrganizedLife',
        avatar: '/api/placeholder/40/40',
      },
      product: {
        name: 'Premium Bamboo Desk Organizer',
        price: '$34.99',
        rating: 4.8,
        commission: '$3.50',
        image: '/api/placeholder/80/80',
      },
      commentsList: [
        {
          id: '1',
          user: 'WorkspaceEnthusiast',
          avatar: '/api/placeholder/40/40',
          text: "Just bought this! Can't wait for it to arrive.",
          likes: 245,
          time: '2h ago',
        },
        {
          id: '2',
          user: 'MinimalistDesigner',
          avatar: '/api/placeholder/40/40',
          text: 'Does it come in black?',
          likes: 78,
          time: '4h ago',
        },
        {
          id: '3',
          user: 'ProductivityGuru',
          avatar: '/api/placeholder/40/40',
          text: "I've had this for 2 months now and it's holding up really well! Definitely worth the money.",
          likes: 512,
          time: '1d ago',
        },
      ],
    },
    {
      id: '125',
      type: 'photo',
      title: 'Premium Wireless Headphones | Crystal Clear Sound',
      imageUrl:
        'https://static.vecteezy.com/system/resources/thumbnails/024/558/880/small_2x/red-wireless-headphones-isolated-on-transparent-background-ai-generated-png.png',
      views: '129K',
      likes: '31.2K',
      comments: '723',
      shares: '5.1K',
      description:
        'These wireless headphones have amazing sound quality and battery life that lasts all day! Super comfortable ear cushions too. Check them out through my link. #headphones #audiotech #wirelessaudio',
      creator: {
        name: 'TechReviewer',
        avatar: '/api/placeholder/40/40',
      },
      product: {
        name: 'Ultra Comfort Wireless Headphones',
        price: '$79.99',
        rating: 4.7,
        commission: '$6.50',
        image: '/api/placeholder/80/80',
      },
      commentsList: [
        {
          id: '1',
          user: 'AudioPhile',
          avatar: '/api/placeholder/40/40',
          text: 'How is the noise cancellation on these?',
          likes: 187,
          time: '5h ago',
        },
        {
          id: '2',
          user: 'MusicLover',
          avatar: '/api/placeholder/40/40',
          text: "Just ordered a pair! Can't wait to try them out.",
          likes: 92,
          time: '8h ago',
        },
        {
          id: '3',
          user: 'BassBoosted',
          avatar: '/api/placeholder/40/40',
          text: 'The bass on these is incredible for the price point.',
          likes: 305,
          time: '1d ago',
        },
      ],
    },
    {
      id: '124',
      type: 'video',
      title: 'RED Dragon Amazing Cable Management System!',
      url: '/sample.mp4', // Same video URL for demo
      views: '217K',
      likes: '38.9K',
      comments: '954',
      shares: '7.2K',
      description:
        'Never deal with tangled cables again! This cable management system keeps everything neat and organized. Perfect for any desk setup. #cablemanagement #organization #techsetup',
      creator: {
        name: 'OrganizedLife',
        avatar: '/api/placeholder/40/40',
      },
      product: {
        name: 'Pro Cable Management Kit',
        price: '$24.99',
        rating: 4.6,
        commission: '$2.75',
        image: '/api/placeholder/80/80',
      },
      commentsList: [
        {
          id: '1',
          user: 'CableHater',
          avatar: '/api/placeholder/40/40',
          text: 'This solved all my cable problems! So much cleaner now.',
          likes: 320,
          time: '4h ago',
        },
        {
          id: '2',
          user: 'SetupExpert',
          avatar: '/api/placeholder/40/40',
          text: 'Does it work well with thick power cables?',
          likes: 45,
          time: '6h ago',
        },
        {
          id: '3',
          user: 'TechReviewer',
          avatar: '/api/placeholder/40/40',
          text: "I've tried many systems and this is definitely top tier.",
          likes: 218,
          time: '1d ago',
        },
      ],
    },
  ]
  const handleShareButtonClick = () => {
    setIsSharePopupOpen(true)
  }

  const closeSharePopup = () => {
    setIsSharePopupOpen(false)
  }
  // Current media item data
  const mediaItem = mediaItems[currentMediaIndex]

  // New function to handle redirect to Amazon when title is clicked
  const handleTitleClick = () => {
    window.open('https://amazon.com', '_blank') // Opens amazon.com in a new tab
  }

  const goToNextMedia = () => {
    if (isAnimating) return

    setVideoTransition(true)
    setIsAnimating(true)

    // Wait for transition effect before changing the media
    setTimeout(() => {
      // Navigate to next media item (with circular navigation)
      setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % mediaItems.length)

      // Restart the video if the next item is a video
      if (
        mediaItems[(currentMediaIndex + 1) % mediaItems.length].type ===
          'video' &&
        videoRef.current
      ) {
        videoRef.current.currentTime = 0
        if (isPlaying) {
          videoRef.current.play()
        }
      }

      // Reset transition after a short delay
      setTimeout(() => {
        setVideoTransition(false)
        setIsAnimating(false)
      }, 400)
    }, 300)
  }

  const goToPreviousMedia = () => {
    if (isAnimating) return

    setVideoTransition(true)
    setIsAnimating(true)

    // Wait for transition effect before changing the media
    setTimeout(() => {
      // Navigate to previous media (with circular navigation)
      const newIndex =
        currentMediaIndex === 0 ? mediaItems.length - 1 : currentMediaIndex - 1
      setCurrentMediaIndex(newIndex)

      // Restart the video if the previous item is a video
      if (mediaItems[newIndex].type === 'video' && videoRef.current) {
        videoRef.current.currentTime = 0
        if (isPlaying) {
          videoRef.current.play()
        }
      }

      // Reset transition after a short delay
      setTimeout(() => {
        setVideoTransition(false)
        setIsAnimating(false)
      }, 400)
    }, 300)
  }

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return
    // Here you'd normally send the comment to your backend
    // and then update the comments list
    setCommentText('')
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(!isMuted)
    }
  }

  const togglePlay = () => {
    if (videoRef.current && mediaItem.type === 'video') {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded)
  }

  // Function to handle K-formatted numbers
  const formatLikeCount = (likesStr, increment = 0) => {
    // Parse the K-formatted number
    const num = parseFloat(likesStr.replace('K', '')) * 1000
    // Add the increment
    const newNum = num + increment

    // Format back to K format
    if (newNum >= 1000) {
      return (newNum / 1000).toFixed(1) + 'K'
    }
    return newNum.toString()
  }

  const toggleLike = () => {
    setIsLiked(!isLiked)
    // Here you would typically make an API call to update like status

    // Show like animation or update UI
    const likeButton = document.getElementById('like-button')
    if (likeButton) {
      likeButton.classList.add('liked-animation')
      setTimeout(() => {
        likeButton.classList.remove('liked-animation')
      }, 300)
    }
  }

  const toggleDetailPanel = () => {
    // For desktop, toggle the detail panel
    setIsAnimating(true)
    setIsDetailPanelOpen(!isDetailPanelOpen)

    // Reset the animating state after animation completes
    setTimeout(() => {
      setIsAnimating(false)
    }, 500)
  }

  return (
    <>
      <div
        className={`flex flex-col h-screen w-full bg-white ${
          !isMobile ? 'items-center justify-center' : ''
        }`}
      >
        {/* CSS for like animation - used in desktop view */}
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

        {/* Main Content Container */}
        <div
          className={`flex flex-col md:flex-row bg-white ${
            !isMobile
              ? 'mx-auto rounded h-[85vh] max-w-3xl'
              : 'h-screen w-screen'
          }`}
        >
          {/* Conditionally render mobile or desktop view */}
          {isMobile ? (
            <MobileVideoView
              media={mediaItem}
              videoRef={videoRef}
              isMuted={isMuted}
              isPlaying={isPlaying}
              videoTransition={videoTransition}
              toggleMute={toggleMute}
              togglePlay={togglePlay}
              toggleLike={toggleLike}
              isLiked={isLiked}
              formatLikeCount={formatLikeCount}
              handleCommentSubmit={handleCommentSubmit}
              goToNextMedia={goToNextMedia}
              goToPreviousMedia={goToPreviousMedia}
              handleShareButtonClick={handleShareButtonClick}
              handleTitleClick={handleTitleClick} // Pass the new function to mobile view
            />
          ) : (
            <>
              {/* Desktop view - FIXED CONTAINER to prevent button clipping */}
              <div
                className='relative flex md:h-[85vh] items-end transition-all duration-500 ease-in-out'
                style={{ overflow: 'visible' }}
              >
                {/* Left Side Buttons (Up and Down) - FIXED */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className='flex flex-col items-center justify-center space-y-4 mr-2 self-center'
                  style={{
                    overflow: 'visible',
                    position: 'relative',
                    zIndex: 10,
                  }}
                >
                  {/* Up button */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className='flex flex-col items-center'
                    style={{ overflow: 'visible' }}
                  >
                    <Button
                      className='text-gray-800 rounded-full h-10 w-10 border border-gray-400 bg-white hover:bg-gray-100 arrow-up-button'
                      variant='ghost'
                      style={{ outline: 'none', overflow: 'visible' }}
                      onClick={goToPreviousMedia}
                      aria-label='Previous media'
                    >
                      <ArrowUp size={20} />
                    </Button>
                  </motion.div>

                  {/* Down button */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className='flex flex-col items-center'
                    style={{ overflow: 'visible' }}
                  >
                    <Button
                      className='text-gray-800 rounded-full h-10 w-10 border border-gray-400 bg-white hover:bg-gray-100 arrow-down-button'
                      variant='ghost'
                      style={{ outline: 'none', overflow: 'visible' }}
                      onClick={goToNextMedia}
                      aria-label='Next media'
                    >
                      <ArrowDown size={20} />
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Video/Photo Section */}
                <motion.div
                  ref={videoContainerRef}
                  layout
                  className={`relative md:w-[340px] ${
                    mediaItem.type === 'video' ? 'bg-black' : 'bg-white'
                  } overflow-hidden transition-all duration-500 ease-in-out ${
                    isDetailPanelOpen ? 'ml-0' : 'md:ml-auto md:mr-auto'
                  } h-[85vh] mx-auto my-auto`}
                  transition={{
                    layout: {
                      type: 'spring',
                      stiffness: 250,
                      damping: 25,
                      duration: 0.5,
                    },
                  }}
                >
                  {/* Media Player (Video or Photo) */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className='relative h-full overflow-hidden'
                  >
                    {mediaItem.type === 'video' ? (
                      // Video Content
                      <video
                        ref={videoRef}
                        src={mediaItem.url}
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
                      // Photo Content
                      <img
                        src={mediaItem.imageUrl}
                        alt={mediaItem.title}
                        className={`w-full h-full object-contain cursor-pointer ${
                          videoTransition
                            ? 'opacity-0 transition-opacity duration-300'
                            : 'opacity-100 transition-opacity duration-300'
                        }`}
                      />
                    )}

                    {/* Stronger gradient at bottom for videos only */}
                    {mediaItem.type === 'video' && (
                      <div className='absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none'></div>
                    )}

                    {/* Audio control button (only for videos) */}
                    {mediaItem.type === 'video' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleMute()
                        }}
                        className='absolute top-4 right-4 bg-white/60 rounded-full p-2 text-black'
                      >
                        {isMuted ? (
                          <VolumeX size={18} />
                        ) : (
                          <Volume2 size={18} />
                        )}
                      </button>
                    )}

                    {/* Creator info at bottom of media - kept username, removed avatar */}
                    <div className='absolute bottom-4 left-4 flex items-center space-x-2 max-w-[80%]'>
                      <div>
                        <h4
                          className={`${
                            mediaItem.type === 'video'
                              ? 'text-white'
                              : 'text-black'
                          } font-medium text-xs`}
                        >
                          @{mediaItem.creator.name}
                        </h4>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Action Buttons - Right side (desktop only) */}
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2,
                    layout: {
                      type: 'spring',
                      stiffness: 250,
                      damping: 25,
                      duration: 0.3,
                    },
                  }}
                  className='flex flex-col items-center space-y-4 px-2 mt-auto'
                >
                  {/* 1. Thumb button */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className='flex flex-col items-center mb-4'
                  >
                    <div>
                      <Button
                        id='like-button'
                        className={`rounded-full h-10 w-10 border transition-all duration-200 ${
                          isLiked
                            ? 'bg-black text-white border-black hover:bg-gray-900'
                            : 'bg-white/70 text-gray-800 border-gray-400 hover:bg-gray-100'
                        }`}
                        variant='ghost'
                        style={{ outline: 'none' }}
                        onClick={toggleLike}
                      >
                        <ThumbsUp
                          size={20}
                          className={isLiked ? 'text-white' : ''}
                        />
                      </Button>
                    </div>
                    <span className='text-xs text-gray-700 mt-1'>
                      {isLiked
                        ? formatLikeCount(mediaItem.likes, 1)
                        : mediaItem.likes}
                    </span>
                  </motion.div>

                  {/* 2. Send button */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className='flex flex-col items-center mb-4'
                  >
                    <div>
                      <Button
                        className='text-gray-800 rounded-full h-10 w-10 border border-gray-400 bg-white/70 hover:bg-gray-100'
                        variant='ghost'
                        style={{ outline: 'none' }}
                        onClick={handleShareButtonClick}
                      >
                        <SendHorizontal size={20} className='mx-auto' />
                      </Button>
                    </div>
                    <span className='text-xs text-gray-700 mt-1'>Send</span>
                  </motion.div>

                  {/* 3. Buy button */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className='flex flex-col items-center mb-4'
                  >
                    <div>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-gray-800 rounded-full h-10 w-10 border border-gray-400 bg-white/70 hover:bg-gray-100'
                      >
                        <ShoppingBag size={20} />
                      </Button>
                    </div>
                    <span className='text-xs text-gray-700 mt-1'>+Cart</span>
                  </motion.div>

                  {/* 4. Info/Detail toggle button */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className='flex flex-col items-center'
                  >
                    <div>
                      <Button
                        className='text-gray-800 rounded-full h-10 w-10 border border-gray-400 bg-white/70 hover:bg-gray-100'
                        variant='ghost'
                        style={{ outline: 'none' }}
                        onClick={toggleDetailPanel}
                      >
                        {isDetailPanelOpen ? (
                          <PanelLeftClose size={20} />
                        ) : (
                          <PanelLeftOpen size={20} />
                        )}
                      </Button>
                    </div>
                    <span className='text-xs text-gray-700 mt-1'>
                      {isDetailPanelOpen ? 'Hide' : 'Show'}
                    </span>
                  </motion.div>
                </motion.div>
              </div>

              {/* Details Section - Desktop only with animation */}
              <AnimatePresence>
                {isDetailPanelOpen && (
                  <motion.div
                    key='detail-panel'
                    initial={{ opacity: 0, x: 200 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 200 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                    className='flex-1 bg-white md:max-w-[340px] md:h-[85vh] border-l border-gray-100 overflow-hidden pt-0 flex flex-col'
                    onAnimationStart={() => setIsAnimating(true)}
                    onAnimationComplete={() => setIsAnimating(false)}
                  >
                    {/* Media Title and Creator Info */}
                    <div className='p-3 pt-0 border-b border-gray-100'>
                      {/* Updated title with onClick and cursor-pointer */}
                      <h2
                        className='text-lg font-medium mb-2 cursor-pointer'
                        onClick={handleTitleClick}
                      >
                        {/* Split the title to highlight the brand name (first two words) */}
                        {mediaItem.title.split(' ').map((word, index) =>
                          index < 2 ? (
                            // First two words (brand) in black
                            <span key={index} className='text-gray-900'>
                              {word}{' '}
                            </span>
                          ) : (
                            // Rest of title in light grey
                            <span key={index} className='text-gray-400'>
                              {word}{' '}
                            </span>
                          )
                        )}
                      </h2>

                      <div className='flex items-center justify-between mb-3'>
                        <h3 className='text-black font-bold text-2xl'>
                          {mediaItem.product.price}
                        </h3>
                        <span className='text-gray-500 text-xs'>
                          Posted 3 days ago
                        </span>
                      </div>

                      {/* Amazon Affiliate Button - changed to Add to Cart */}
                      <button className='block cursor-pointer w-full bg-[#ffd814] hover:bg-[#f7ca00] text-center py-2 rounded-sm text-sm font-medium text-black transition-colors duration-200 mb-3 border border-[#fcd200]'>
                        <div className='flex items-center justify-center'>
                          <ShoppingBag size={16} className='mr-2' />
                          Add to Cart
                        </div>
                      </button>

                      <div>
                        <p
                          className={`text-gray-600 text-sm ${
                            !isDescriptionExpanded ? 'line-clamp-2' : ''
                          }`}
                        >
                          {mediaItem.description}
                        </p>
                        <button
                          onClick={toggleDescription}
                          className='text-xs text-gray-500 flex items-center mt-1 hover:text-gray-700'
                        >
                          {isDescriptionExpanded ? (
                            <>
                              Show less <ChevronUp size={12} className='ml-1' />
                            </>
                          ) : (
                            <>
                              Show more{' '}
                              <ChevronDown size={12} className='ml-1' />
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Comments Section - Main content */}
                    <div className='px-3 py-4 flex-1 overflow-y-auto'>
                      <div className='flex justify-between items-center mb-4'>
                        <h3 className='font-medium text-gray-900 text-sm'>
                          Comments ({mediaItem.comments})
                        </h3>
                      </div>

                      <motion.div
                        className='space-y-6'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          staggerChildren: 0.1,
                          delayChildren: 0.2,
                        }}
                      >
                        {mediaItem.commentsList.map((comment) => (
                          <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='flex space-x-2'
                          >
                            <Avatar className='h-7 w-7 flex-shrink-0 mt-0.5'>
                              <AvatarImage src={comment.avatar} />
                              <AvatarFallback className='bg-gray-100 text-gray-700'>
                                <User size={12} />
                              </AvatarFallback>
                            </Avatar>
                            <div className='flex-1'>
                              <div className='flex items-center space-x-1'>
                                <h4 className='text-xs font-medium text-gray-900'>
                                  {comment.user}
                                </h4>
                                <span className='text-xs text-gray-500'>
                                  • {comment.time}
                                </span>
                              </div>
                              <p className='text-xs mt-1 text-gray-700'>
                                {comment.text}
                              </p>
                              <div className='flex items-center mt-1 text-xs text-gray-500'>
                                <button className='flex items-center gap-1 hover:text-gray-900'>
                                  <ThumbsUp size={10} />
                                  <span>{comment.likes}</span>
                                </button>
                                <button className='ml-3 hover:text-gray-900'>
                                  Reply
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>

                    {/* Comment input field - Updated to match mobile style */}
                    <div className='border-t border-gray-100 p-3 mt-auto'>
                      <div className='flex items-center space-x-2'>
                        <Avatar className='h-7 w-7'>
                          <AvatarFallback className='bg-gray-100 text-gray-700'>
                            <User size={12} />
                          </AvatarFallback>
                        </Avatar>
                        <Input
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder='Add a comment...'
                          className='flex-1 border-1 border-gray-300 hover:border-2 hover:border-black text-black focus:outline-none focus:ring-0 focus:border-black focus:border-2 rounded-full placeholder:text-gray-400 placeholder:text-xs text-sm h-8'
                        />
                        <Button
                          size='sm'
                          onClick={handleCommentSubmit}
                          disabled={!commentText.trim()}
                          className='rounded-full bg-gray-900 hover:bg-black text-white text-xs h-7 px-3'
                        >
                          Post
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
      {/* At the end of your component, before closing tag */}
      <SharePopup
        isOpen={isSharePopupOpen}
        onClose={closeSharePopup}
        currentUrl={currentUrl}
      />
    </>
  )
}

export default VideoViewPage
