import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Menu,
  Minus,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Pause,
  Play,
  Plus,
  SendHorizontal,
  ShoppingBag,
  ThumbsUp,
  User,
  Volume2,
  VolumeX,
} from 'lucide-react'
import React, { useState } from 'react'
import Layout from '../Layout/Layout'

const VideoDetailPage = () => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [isCommenting, setIsCommenting] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [videoTransition, setVideoTransition] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const videoRef = React.useRef(null)

  // Mock data for multiple videos (using the same video data for demonstration)
  const videos = [
    {
      id: '123',
      title: 'This Desk Organizer Changed My Workspace!',
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
        followers: '124K',
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
      id: '124',
      title: 'Check Out This Amazing Cable Management System!',
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
        followers: '124K',
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

  // Current video data
  const video = videos[currentVideoIndex]

  const goToNextVideo = () => {
    setVideoTransition(true)

    // Wait for transition effect before changing the video
    setTimeout(() => {
      // Navigate to next video (with circular navigation)
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length)

      // Restart the video if needed
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        if (isPlaying) {
          videoRef.current.play()
        }
      }

      // Reset transition after a short delay
      setTimeout(() => {
        setVideoTransition(false)
      }, 400)
    }, 300)
  }

  const goToPreviousVideo = () => {
    setVideoTransition(true)

    // Wait for transition effect before changing the video
    setTimeout(() => {
      // Navigate to previous video (with circular navigation)
      setCurrentVideoIndex((prevIndex) =>
        prevIndex === 0 ? videos.length - 1 : prevIndex - 1
      )

      // Restart the video if needed
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        if (isPlaying) {
          videoRef.current.play()
        }
      }

      // Reset transition after a short delay
      setTimeout(() => {
        setVideoTransition(false)
      }, 400)
    }, 300)
  }

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return
    // Here you'd normally send the comment to your backend
    // and then update the comments list
    setCommentText('')
    setIsCommenting(false)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(!isMuted)
    }
  }

  const togglePlay = () => {
    if (videoRef.current) {
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

  const toggleDetailPanel = () => {
    setIsAnimating(true)
    setIsDetailPanelOpen(!isDetailPanelOpen)

    // Reset the animating state after animation completes
    setTimeout(() => {
      setIsAnimating(false)
    }, 500)
  }

  return (
    <>
      <div className='flex flex-col h-screen w-full bg-white items-center justify-center'>
        {/* Main Content Container */}
        <div className='flex flex-col md:flex-row mx-auto bg-white rounded h-[85vh] max-w-3xl'>
          {/* Video and Action Buttons Container */}
          <div
            className={`relative flex md:h-[85vh] items-end transition-all duration-500 ease-in-out ${
              isAnimating ? 'overflow-hidden' : ''
            }`}
          >
            {/* Left Side Buttons (Up and Down) - Now outside the video and centered */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className='flex flex-col items-center justify-center space-y-4 mr-2 self-center'
            >
              {/* Up button */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className='flex flex-col items-center'
              >
                <Button
                  className='text-gray-800 rounded-full h-10 w-10 border border-gray-400 bg-white hover:bg-gray-100'
                  variant='ghost'
                  style={{ outline: 'none' }}
                  onClick={goToPreviousVideo}
                >
                  <ArrowUp size={20} />
                </Button>
              </motion.div>

              {/* Down button */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className='flex flex-col items-center'
              >
                <Button
                  className='text-gray-800 rounded-full h-10 w-10 border border-gray-400 bg-white hover:bg-gray-100'
                  variant='ghost'
                  style={{ outline: 'none' }}
                  onClick={goToNextVideo}
                >
                  <ArrowDown size={20} />
                </Button>
              </motion.div>
            </motion.div>

            {/* Video Section */}
            <motion.div
              layout
              className={`relative md:w-[340px] w-full h-[75vh] md:h-[85vh] bg-black mx-auto overflow-hidden my-auto transition-all duration-500 ease-in-out ${
                isDetailPanelOpen ? 'ml-0' : 'md:ml-auto md:mr-auto'
              }`}
              transition={{
                layout: {
                  type: 'spring',
                  stiffness: 250,
                  damping: 25,
                  duration: 0.5,
                },
              }}
            >
              {/* Video Player */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className='relative h-full overflow-hidden'
              >
                <video
                  ref={videoRef}
                  src={video.url}
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

                {/* Bottom gradient for visibility */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none'></div>

                {/* Audio control button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleMute()
                  }}
                  className='absolute top-4 right-4 bg-white/70 rounded-full p-2 hover:bg-white/90'
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>

                {/* Creator info at bottom of video */}
                <div className='absolute bottom-4 left-4 flex items-center space-x-2'>
                  <Avatar className='h-8 w-8 border border-white/50'>
                    <AvatarImage src={video.creator.avatar} />
                    <AvatarFallback className='bg-gray-200'>
                      <User size={16} />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className='text-white font-medium text-xs'>
                      {video.creator.name}
                    </h4>
                    <p className='text-white/80 text-xs'>
                      {video.creator.followers} followers
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Action Buttons - Right side */}
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
              {/* 1. Plus button */}
              <motion.div
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 1 }}
                className='flex flex-col items-center mb-4'
              >
                <div>
                  <Button
                    className='text-gray-800 rounded-full h-10 w-10 border border-gray-400 bg-white/70 hover:cursor-pointer'
                    variant='ghost'
                    style={{ outline: 'none' }}
                  >
                    <Plus size={20} />
                  </Button>
                </div>
              </motion.div>

              {/* 2. Minus button */}
              <motion.div
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 1 }}
                className='flex flex-col items-center mb-4'
              >
                <div>
                  <Button
                    className='text-gray-800 rounded-full h-10 w-10 border border-gray-400 bg-white/70'
                    variant='ghost'
                    style={{ outline: 'none' }}
                  >
                    <Minus size={20} />
                  </Button>
                </div>
              </motion.div>

              {/* 3. Send button */}
              <motion.div
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 1 }}
                className='flex flex-col items-center mb-4'
              >
                <div>
                  <Button
                    className='text-gray-800 rounded-full h-10 w-10 border border-gray-400 bg-white/70'
                    variant='ghost'
                    style={{ outline: 'none' }}
                  >
                    <SendHorizontal size={20} className='mx-auto' />
                  </Button>
                </div>
              </motion.div>

              {/* 4. Buy button */}
              <motion.div
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 1 }}
                className='flex flex-col items-center mb-4'
              >
                <div>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='text-gray-800 rounded-full h-10 w-10 border border-gray-400 bg-white/70 hover:cursor-pointer'
                  >
                    <ShoppingBag size={20} />
                  </Button>
                </div>
              </motion.div>

              {/* 5. Info/Detail toggle button (moved to end) */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className='flex flex-col items-center mb-4'
              >
                <div>
                  <Button
                    className='text-gray-800 rounded-full h-10 w-10 border border-gray-400 bg-white/70'
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
              </motion.div>
            </motion.div>
          </div>

          {/* Details Section - now with animation */}
          <AnimatePresence>
            {isDetailPanelOpen && (
              <motion.div
                key='detail-panel'
                initial={{ opacity: 0, x: 200 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 200 }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                className='flex-1 bg-white md:max-w-[340px] md:h-[85vh] border-l border-gray-100 overflow-hidden pt-0'
                onAnimationStart={() => setIsAnimating(true)}
                onAnimationComplete={() => setIsAnimating(false)}
              >
                {/* Video Title and Creator Info */}
                <div className='p-3 pt-0 border-b border-gray-100'>
                  <h2 className='text-lg font-medium text-gray-900 mb-2'>
                    {video.title}
                  </h2>

                  <div className='flex items-center gap-3 mb-2'>
                    <Badge
                      variant='outline'
                      className='bg-gray-50 text-gray-700 border-gray-200 px-2 py-0.5 text-xs'
                    >
                      {video.views} views
                    </Badge>
                    <span className='text-gray-500 text-xs'>
                      Posted 3 days ago
                    </span>
                  </div>

                  {/* Amazon Affiliate Button */}
                  <a
                    href='#'
                    onClick={(e) => {
                      e.preventDefault()
                      window.open(
                        'https://amazon.com/product/ref=YOUR_AFFILIATE_ID',
                        '_blank'
                      )
                    }}
                    className='block w-full bg-gray-900 hover:bg-black text-center py-2 rounded-lg text-sm font-medium text-white transition-colors duration-200 mb-3 border border-gray-800'
                  >
                    <div className='flex items-center justify-center'>
                      <ShoppingBag size={16} className='mr-2' />
                      Buy on Amazon
                    </div>
                  </a>

                  <div>
                    <p
                      className={`text-gray-600 text-sm ${
                        !isDescriptionExpanded ? 'line-clamp-2' : ''
                      }`}
                    >
                      {video.description}
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
                          Show more <ChevronDown size={12} className='ml-1' />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                <div className='px-3 py-4'>
                  <div className='flex justify-between items-center mb-4'>
                    <h3 className='font-medium text-gray-900 text-sm'>
                      Comments ({video.comments})
                    </h3>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setIsCommenting(true)}
                      className='text-xs rounded-full border-gray-200 text-gray-700 hover:bg-gray-50 h-8 px-3'
                    >
                      Add comment
                    </Button>
                  </div>

                  {isCommenting && (
                    <div className='flex items-center space-x-2 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200'>
                      <Avatar className='h-7 w-7'>
                        <AvatarFallback className='bg-gray-100 text-gray-700'>
                          <User size={12} />
                        </AvatarFallback>
                      </Avatar>
                      <Input
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder='Add a comment...'
                        className='flex-1 border-gray-200 bg-transparent focus-visible:ring-gray-400 text-sm h-8'
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
                  )}

                  <motion.div
                    className='space-y-6'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
                  >
                    {video.commentsList.map((comment) => (
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

export default VideoDetailPage
