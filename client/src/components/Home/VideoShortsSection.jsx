import { motion } from 'framer-motion'
import { Eye, Play, ShoppingCart } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const VideoShortsSection = () => {
  const navigate = useNavigate() // Add React Router's useNavigate hook

  // Create media items with stable data that won't change on re-renders
  // Alternating between videos and photos
  const allMediaItems = useMemo(
    () =>
      Array(20)
        .fill()
        .map((_, index) => ({
          id: index + 1,
          type: index % 2 === 0 ? 'video' : 'photo', // Alternate between video and photo
          videoSrc: '/sample.mp4',
          photoSrc:
            'https://static.vecteezy.com/system/resources/thumbnails/024/558/880/small_2x/red-wireless-headphones-isolated-on-transparent-background-ai-generated-png.png',
          thumbnailSrc: '/sample-thumbnail.webp',
          views: Math.floor(Math.random() * 5000) + 500,
          username: index % 2 === 0 ? '@OrganizedLife' : '@vintagefinds',
          description:
            index % 4 === 0
              ? 'Home Depot Organizer Changed My Workspace!'
              : index % 4 === 1
              ? 'Premium Wireless Headphones | Crystal Clear Sound'
              : index % 4 === 2
              ? 'RED Dragon Amazing Cable Management System!'
              : 'Curated collection of rare vintage pieces from around the world',
          price: Math.floor(Math.random() * 90) + 10 + 0.99, // Random price between $10.99 and $99.99
        })),
    []
  )

  // State management
  const [visibleCount, setVisibleCount] = useState(8)
  const [activeToggle, setActiveToggle] = useState('trending')
  const [inViewport, setInViewport] = useState({})
  const [playingVideos, setPlayingVideos] = useState({})
  const [isMobile, setIsMobile] = useState(false)
  const [videosLoaded, setVideosLoaded] = useState({})
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Setup intersection observer to detect visible media items
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const updates = {}

        entries.forEach((entry) => {
          const id = parseInt(entry.target.dataset.id, 10)
          updates[id] = entry.isIntersecting

          // Only handle video playback for video type items
          const mediaItem = allMediaItems.find((item) => item.id === id)
          if (!mediaItem || mediaItem.type !== 'video') return

          if (isMobile && entry.isIntersecting && !playingVideos[id]) {
            playVideo(id)
          } else if (!entry.isIntersecting && playingVideos[id]) {
            pauseVideo(id)
          }
        })

        // Batch update the inViewport state to prevent multiple re-renders
        setInViewport((prev) => ({ ...prev, ...updates }))
      },
      { threshold: 0.2, rootMargin: '100px 0px' }
    )

    // Observe all media containers after a small delay to ensure DOM is ready
    setTimeout(() => {
      document.querySelectorAll('[data-id]').forEach((el) => {
        observer.observe(el)
      })
    }, 100)

    return () => observer.disconnect()
  }, [playingVideos, isMobile, allMediaItems])

  // Functions to control video playback
  const playVideo = (id) => {
    const mediaItem = allMediaItems.find((item) => item.id === id)
    if (!mediaItem || mediaItem.type !== 'video') return

    const video = document.getElementById(`video-${id}`)
    if (video) {
      // Load video source if not loaded yet
      if (!videosLoaded[id]) {
        // Only add source if it doesn't already exist
        if (video.querySelector('source') === null) {
          const source = document.createElement('source')
          source.src = mediaItem.videoSrc || '/sample.mp4'
          source.type = 'video/mp4'
          video.appendChild(source)
          video.load()
        }
        setVideosLoaded((prev) => ({ ...prev, [id]: true }))
      }

      // Play the video after a small delay to ensure loading
      setTimeout(() => {
        video
          .play()
          .then(() => {
            setPlayingVideos((prev) => ({ ...prev, [id]: true }))
          })
          .catch((e) => console.log('Autoplay prevented:', e))
      }, 50)
    }
  }

  const pauseVideo = (id) => {
    const mediaItem = allMediaItems.find((item) => item.id === id)
    if (!mediaItem || mediaItem.type !== 'video') return

    const video = document.getElementById(`video-${id}`)
    if (video) {
      video.pause()
      setPlayingVideos((prev) => ({ ...prev, [id]: false }))
    }
  }

  // Setup scroll observer for infinite loading
  useEffect(() => {
    // Only set up if there are more items to load
    if (visibleCount >= allMediaItems.length) return

    const loadMoreObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !isLoadingMore) {
          // Show loading state
          setIsLoadingMore(true)

          // Simulate loading delay (remove this in production with real API calls)
          setTimeout(() => {
            // Load more items when reaching the sentinel
            setVisibleCount((prev) => Math.min(prev + 8, allMediaItems.length))
            setIsLoadingMore(false)
          }, 1200) // Adjust delay as needed for user experience
        }
      },
      { rootMargin: '200px 0px' }
    )

    // Observe the sentinel element
    const sentinel = document.getElementById('load-more-sentinel')
    if (sentinel) {
      loadMoreObserver.observe(sentinel)
    }

    return () => {
      if (sentinel) {
        loadMoreObserver.unobserve(sentinel)
      }
    }
  }, [visibleCount, allMediaItems.length, isLoadingMore])

  // Event handlers
  const handleMediaHover = (id) => {
    const mediaItem = allMediaItems.find((item) => item.id === id)
    if (!mediaItem) return

    if (mediaItem.type === 'video' && !isMobile && inViewport[id]) {
      playVideo(id)
    }
  }

  const handleMediaLeave = (id) => {
    const mediaItem = allMediaItems.find((item) => item.id === id)
    if (!mediaItem) return

    if (mediaItem.type === 'video' && !isMobile) {
      pauseVideo(id)
    }
  }

  // Handle media click to navigate to media detail page
  const handleMediaClick = (id) => {
    // Navigate to the media detail page
    navigate(`/video/${id}`)
  }

  // Handle add to cart click
  const handleAddToCart = (e, id) => {
    e.stopPropagation() // Prevent navigation to media detail page
    console.log(`Added item ${id} to cart`)
    // Add your cart logic here
  }

  // Get currently visible media items
  const mediaItems = allMediaItems.slice(0, visibleCount)

  return (
    <section className='pt-1 pb-6 px-0 md:px-4'>
      {/* Removed all padding for mobile view */}
      <div className='w-full px-0 md:px-0'>
        {/* Text Toggle Bar - Properly centered on mobile */}
        <div
          className={`flex ${
            isMobile ? 'justify-center w-full' : 'justify-end'
          } mb-6`}
        >
          <div className='inline-flex rounded-full bg-gray-200 p-1 shadow-sm scale-90 transform origin-center md:origin-right md:scale-100'>
            {[
              { id: 'latest', label: 'latest' },
              { id: 'trending', label: 'trending' },
              { id: 'random', label: 'random' },
            ].map((toggle) => (
              <button
                key={toggle.id}
                onClick={() => setActiveToggle(toggle.id)}
                className={`w-20 py-1 text-xs font-medium capitalize transition-all duration-200 text-center ${
                  activeToggle === toggle.id
                    ? 'bg-white text-gray-900 rounded-full shadow'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {toggle.label}
              </button>
            ))}
          </div>
        </div>

        {/* Media Grid - Minimal horizontal gap, added row gap for mobile */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-x-1 gap-y-4 md:gap-4 mx-auto'>
          {mediaItems.map((item) => (
            <div key={item.id} className='flex flex-col'>
              <motion.div
                data-id={item.id}
                className='relative rounded-md overflow-hidden cursor-pointer'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: item.id * 0.05 }}
                onMouseEnter={() => handleMediaHover(item.id)}
                onMouseLeave={() => handleMediaLeave(item.id)}
                onClick={() => handleMediaClick(item.id)}
              >
                {/* Media Container - Adjusted aspect ratio for mobile */}
                <div className='aspect-[9/13] md:aspect-[9/12] border border-gray-200 rounded-md overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 relative z-10'>
                  {/* Amazon icon moved to top left corner */}
                  <div className='absolute top-0 left-0 p-1.5 z-30'>
                    <img src='/amazon-icon.svg' alt='Amazon' className='h-4' />
                  </div>

                  {/* View count in top right corner of entire card */}
                  <div className='absolute top-0 right-0 p-1.5 rounded-bl-md z-30'>
                    <span
                      className={`flex items-center text-xs ${
                        item.type === 'video' ? 'text-white' : 'text-black'
                      }`}
                    >
                      {item.type === 'video' ? (
                        <Play size={10} className='mr-1' />
                      ) : (
                        <Eye size={12} className='mr-1' />
                      )}
                      {item.views >= 1000
                        ? `${Math.floor(item.views / 1000)}${
                            item.views % 1000 === 0
                              ? ''
                              : '.' + Math.floor((item.views % 1000) / 100)
                          }K`
                        : item.views}
                    </span>
                  </div>

                  {item.type === 'video' ? (
                    // Video content
                    <>
                      {/* Thumbnail Image - Always visible until video plays */}
                      <img
                        src={item.thumbnailSrc}
                        alt={`${item.username} thumbnail`}
                        className={`w-full h-full object-cover absolute inset-0 z-10 transition-opacity duration-300 ${
                          playingVideos[item.id] && videosLoaded[item.id]
                            ? 'opacity-0'
                            : 'opacity-100'
                        }`}
                        loading='eager'
                      />

                      {/* Video Element - Empty initially, source added when needed */}
                      <video
                        id={`video-${item.id}`}
                        className='w-full h-full object-cover absolute inset-0'
                        loop
                        muted
                        playsInline
                        preload='none'
                      />
                    </>
                  ) : (
                    // Photo content
                    <div className='relative w-full h-full absolute inset-0 z-10 bg-white'>
                      <img
                        src={item.photoSrc}
                        alt={`${item.username} photo`}
                        className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[85%] max-h-[85%] object-contain'
                        loading='eager'
                      />
                    </div>
                  )}

                  {/* Description Overlay at bottom - Only for videos or keep for all? */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 ${
                      item.type === 'video'
                        ? 'bg-gradient-to-t from-black to-transparent'
                        : ''
                    } h-24 opacity-90 rounded-b-md z-20`}
                  >
                    {/* Description at bottom of overlay */}
                    <div className='absolute bottom-2 left-2 max-w-full pr-2'>
                      <div
                        className='text-xs line-clamp-2'
                        style={{ fontSize: '0.65rem' }}
                      >
                        {item.description.split(' ').map((word, idx) => (
                          <span
                            key={idx}
                            className={
                              idx < 2
                                ? item.type === 'video'
                                  ? 'text-white font-medium'
                                  : 'text-black font-medium'
                                : item.type === 'video'
                                ? 'text-gray-300'
                                : 'text-gray-700'
                            }
                          >
                            {word}{' '}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Price Tag with Add to Cart button - Reduced spacing */}
              <div className='mt-2 flex justify-between items-center px-1'>
                <div className='flex items-center pl-0.5'>
                  <span className='text-gray-800 font-bold text-base'>$</span>
                  <span className='text-gray-800 font-bold text-base'>
                    {Math.floor(item.price)}
                  </span>
                  <span className='text-gray-800 font-bold text-base'>
                    {item.price
                      .toFixed(2)
                      .substring(item.price.toString().indexOf('.'))}
                  </span>
                </div>
                {/* Add to Cart button with #ffd814 background */}
                <button
                  onClick={(e) => handleAddToCart(e, item.id)}
                  className='bg-yellow-300 rounded font-medium flex items-center text-xs px-2 py-1 md:text-xs md:px-2 md:py-1'
                  style={{
                    backgroundColor: '#ffd814',
                    fontSize: isMobile ? '0.65rem' : '0.75rem',
                  }}
                >
                  <ShoppingCart size={isMobile ? 10 : 12} className='mr-1' />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Loader and sentinel element for infinite scrolling */}
        {visibleCount < allMediaItems.length && (
          <div className='w-full my-8 flex flex-col items-center'>
            {isLoadingMore ? (
              <div className='flex items-center py-4'>
                <style>
                  {`
                    @keyframes customBounce {
                      0%, 100% {
                        transform: translateY(0);
                      }
                      50% {
                        transform: translateY(-8px);
                      }
                    }
                    .dot-1 {
                      animation: customBounce 0.8s infinite;
                    }
                    .dot-2 {
                      animation: customBounce 0.8s infinite 0.2s;
                    }
                    .dot-3 {
                      animation: customBounce 0.8s infinite 0.4s;
                    }
                  `}
                </style>
                <div className='flex space-x-2'>
                  <div className='w-2 h-2 bg-blue-900 rounded-full dot-1'></div>
                  <div className='w-2 h-2 bg-blue-900 rounded-full dot-2'></div>
                  <div className='w-2 h-2 bg-blue-900 rounded-full dot-3'></div>
                </div>
              </div>
            ) : (
              <div id='load-more-sentinel' className='w-full h-4' />
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default VideoShortsSection
