import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const VideoShortsSection = () => {
  const navigate = useNavigate() // Add React Router's useNavigate hook

  // Create videos with stable data that won't change on re-renders
  const allVideos = useMemo(
    () =>
      Array(20)
        .fill()
        .map((_, index) => ({
          id: index + 1,
          videoSrc: '/sample.mp4',
          thumbnailSrc: '/sample-thumbnail.webp',
          views: Math.floor(Math.random() * 5000) + 500,
          username: index % 2 === 0 ? '@cpkrueger' : '@vintagefinds',
          description:
            index % 2 === 0
              ? 'Handcrafted vintage-inspired accessories with modern flair'
              : 'Curated collection of rare vintage pieces from around the world',
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

  // Setup intersection observer to detect visible videos
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const updates = {}

        entries.forEach((entry) => {
          const id = parseInt(entry.target.dataset.id, 10)
          updates[id] = entry.isIntersecting

          // Only handle video playback here, don't modify other states
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

    // Observe all video containers after a small delay to ensure DOM is ready
    setTimeout(() => {
      document.querySelectorAll('[data-id]').forEach((el) => {
        observer.observe(el)
      })
    }, 100)

    return () => observer.disconnect()
  }, [playingVideos, isMobile])

  // Functions to control video playback
  const playVideo = (id) => {
    const video = document.getElementById(`video-${id}`)
    if (video) {
      // Load video source if not loaded yet
      if (!videosLoaded[id]) {
        // Only add source if it doesn't already exist
        if (video.querySelector('source') === null) {
          const source = document.createElement('source')
          source.src =
            allVideos.find((v) => v.id === id)?.videoSrc || '/sample.mp4'
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
    const video = document.getElementById(`video-${id}`)
    if (video) {
      video.pause()
      setPlayingVideos((prev) => ({ ...prev, [id]: false }))
    }
  }

  // Setup scroll observer for infinite loading
  useEffect(() => {
    // Only set up if there are more videos to load
    if (visibleCount >= allVideos.length) return

    const loadMoreObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !isLoadingMore) {
          // Show loading state
          setIsLoadingMore(true)

          // Simulate loading delay (remove this in production with real API calls)
          setTimeout(() => {
            // Load more videos when reaching the sentinel
            setVisibleCount((prev) => Math.min(prev + 8, allVideos.length))
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
  }, [visibleCount, allVideos.length, isLoadingMore])

  // Event handlers
  const handleVideoHover = (id) => {
    if (!isMobile && inViewport[id]) {
      playVideo(id)
    }
  }

  const handleVideoLeave = (id) => {
    if (!isMobile) {
      pauseVideo(id)
    }
  }

  // Handle video click to navigate to video page
  const handleVideoClick = (id) => {
    // Navigate to the video detail page
    navigate(`/video/${id}`)
  }

  // Get currently visible videos
  const videos = allVideos.slice(0, visibleCount)

  return (
    <section className='pt-1 pb-6 px-4'>
      <div className='container mx-auto'>
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

        {/* Video Grid */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {videos.map((item) => (
            <motion.div
              key={item.id}
              data-id={item.id}
              className='relative rounded-md overflow-hidden cursor-pointer'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: item.id * 0.05 }}
              onMouseEnter={() => handleVideoHover(item.id)}
              onMouseLeave={() => handleVideoLeave(item.id)}
              onClick={() => handleVideoClick(item.id)}
            >
              {/* Video Container */}
              <div className='aspect-[9/16] border border-gray-200 rounded-md overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 relative z-10'>
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

                {/* View count moved to top right */}
                <div className='absolute top-2 right-2 z-20'>
                  <span className='flex items-center text-white text-xs'>
                    <Play size={10} className='mr-1' />
                    {item.views >= 1000
                      ? `${Math.floor(item.views / 1000)}${
                          item.views % 1000 === 0
                            ? ''
                            : '.' + Math.floor((item.views % 1000) / 100)
                        }K`
                      : item.views}
                  </span>
                </div>

                {/* Username moved to top left */}
                <div className='absolute top-2 left-2 z-20'>
                  <div className='text-xs md:text-sm font-semibold truncate text-white'>
                    {item.username}
                  </div>
                </div>

                {/* Description Overlay at bottom */}
                <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-16 opacity-90 rounded-b-md z-20'>
                  <div className='absolute bottom-2 left-2 text-white max-w-full pr-2'>
                    <div
                      className='text-xs text-white line-clamp-2 text-xs md:text-xs'
                      style={{ fontSize: '0.65rem' }}
                    >
                      {item.description}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Loader and sentinel element for infinite scrolling */}
        {visibleCount < allVideos.length && (
          <div className='w-full my-8 flex flex-col items-center'>
            {isLoadingMore ? (
              <div className='flex flex-col items-center py-4'>
                <div className='animate-bounce flex space-x-1'>
                  <div className='w-2 h-2 bg-gray-500 rounded-full'></div>
                  <div className='w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75'></div>
                  <div className='w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150'></div>
                </div>
                <div className='text-sm text-gray-500 mt-2'>
                  Loading more videos...
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
