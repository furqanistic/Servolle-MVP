import { AnimatePresence, motion } from 'framer-motion'
import { Copy, Mail, MessageCircle, MessageSquare, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

const SharePopup = ({ isOpen, onClose, currentUrl }) => {
  const [copied, setCopied] = useState(false)
  const popupRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setCopied(false)
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch((err) => {
        console.error('Failed to copy: ', err)
      })
  }

  // Custom SVG Icons
  const XIcon = () => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='22'
      height='22'
      viewBox='0 0 50 50'
      fill='currentColor'
      className='text-white'
    >
      <path d='M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z M 16.914062 15 L 31.021484 35 L 34.085938 35 L 19.978516 15 L 16.914062 15 z' />
    </svg>
  )

  const FacebookIcon = () => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='22'
      height='22'
      viewBox='0 0 50 50'
      fill='currentColor'
      className='text-white'
    >
      <path d='M25,3C12.85,3,3,12.85,3,25c0,11.03,8.125,20.137,18.712,21.728V30.831h-5.443v-5.783h5.443v-3.848 c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877,0.188,4.512,0.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588 l-0.894,5.783h-5.694v15.944C38.716,45.318,47,36.137,47,25C47,12.85,37.15,3,25,3z' />
    </svg>
  )

  const RedditIcon = () => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='22'
      height='22'
      viewBox='0 0 48 48'
      className='text-white'
    >
      <path
        fill='currentColor'
        d='M12.193 19.555c-1.94-1.741-4.79-1.727-6.365.029-1.576 1.756-1.301 5.023.926 6.632L12.193 19.555zM35.807 19.555c1.939-1.741 4.789-1.727 6.365.029 1.575 1.756 1.302 5.023-.927 6.632L35.807 19.555zM38.32 6.975A3.5 3.5 0 1 0 38.32 13.975 3.5 3.5 0 1 0 38.32 6.975z'
      />
      <path
        fill='currentColor'
        d='M24.085 15.665000000000001A18.085 12.946 0 1 0 24.085 41.557A18.085 12.946 0 1 0 24.085 15.665000000000001Z'
      />
      <path
        fill='#D84315'
        d='M30.365 23.506A2.884 2.884 0 1 0 30.365 29.274 2.884 2.884 0 1 0 30.365 23.506zM17.635 23.506A2.884 2.884 0 1 0 17.635 29.274 2.884 2.884 0 1 0 17.635 23.506z'
      />
      <path
        fill='#37474F'
        d='M24.002 34.902c-3.252 0-6.14-.745-8.002-1.902 1.024 2.044 4.196 4 8.002 4 3.802 0 6.976-1.956 7.998-4C30.143 34.157 27.254 34.902 24.002 34.902zM41.83 27.026l-1.17-1.621c.831-.6 1.373-1.556 1.488-2.623.105-.98-.157-1.903-.721-2.531-.571-.637-1.391-.99-2.307-.994-.927.013-1.894.365-2.646 1.041l-1.336-1.488c1.123-1.008 2.545-1.523 3.991-1.553 1.488.007 2.833.596 3.786 1.658.942 1.05 1.387 2.537 1.221 4.081C43.961 24.626 43.121 26.096 41.83 27.026zM6.169 27.026c-1.29-.932-2.131-2.401-2.306-4.031-.166-1.543.279-3.03 1.221-4.079.953-1.062 2.297-1.651 3.785-1.658.009 0 .018 0 .027 0 1.441 0 2.849.551 3.965 1.553l-1.336 1.488c-.753-.676-1.689-1.005-2.646-1.041-.916.004-1.735.357-2.306.994-.563.628-.826 1.55-.721 2.53.115 1.067.657 2.023 1.488 2.624L6.169 27.026zM25 16.84h-2c0-2.885 0-10.548 4.979-10.548 2.154 0 3.193 1.211 3.952 2.096.629.734.961 1.086 1.616 1.086h1.37v2h-1.37c-1.604 0-2.453-.99-3.135-1.785-.67-.781-1.198-1.398-2.434-1.398C25.975 8.292 25 11.088 25 16.84z'
      />
      <path
        fill='#37474F'
        d='M24.085 16.95c9.421 0 17.085 5.231 17.085 11.661 0 6.431-7.664 11.662-17.085 11.662S7 35.042 7 28.611C7 22.181 14.664 16.95 24.085 16.95M24.085 14.95C13.544 14.95 5 21.066 5 28.611c0 7.546 8.545 13.662 19.085 13.662 10.54 0 19.085-6.116 19.085-13.662C43.17 21.066 34.625 14.95 24.085 14.95L24.085 14.95zM38.32 7.975c1.379 0 2.5 1.122 2.5 2.5s-1.121 2.5-2.5 2.5-2.5-1.122-2.5-2.5S36.941 7.975 38.32 7.975M38.32 5.975c-2.484 0-4.5 2.015-4.5 4.5s2.016 4.5 4.5 4.5c2.486 0 4.5-2.015 4.5-4.5S40.807 5.975 38.32 5.975L38.32 5.975z'
      />
    </svg>
  )

  const WhatsAppIcon = () => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='22'
      height='22'
      viewBox='0 0 50 50'
      fill='currentColor'
      className='text-white'
    >
      <path d='M25,2C12.318,2,2,12.318,2,25c0,3.96,1.023,7.854,2.963,11.29L2.037,46.73c-0.096,0.343-0.003,0.711,0.245,0.966 C2.473,47.893,2.733,48,3,48c0.08,0,0.161-0.01,0.24-0.029l10.896-2.699C17.463,47.058,21.21,48,25,48c12.682,0,23-10.318,23-23 S37.682,2,25,2z M36.57,33.116c-0.492,1.362-2.852,2.605-3.986,2.772c-1.018,0.149-2.306,0.213-3.72-0.231 c-0.857-0.27-1.957-0.628-3.366-1.229c-5.923-2.526-9.791-8.415-10.087-8.804C15.116,25.235,13,22.463,13,19.594 s1.525-4.28,2.067-4.864c0.542-0.584,1.181-0.73,1.575-0.73s0.787,0.005,1.132,0.021c0.363,0.018,0.85-0.137,1.329,1.001 c0.492,1.168,1.673,4.037,1.819,4.33c0.148,0.292,0.246,0.633,0.05,1.022c-0.196,0.389-0.294,0.632-0.59,0.973 s-0.62,0.76-0.886,1.022c-0.296,0.291-0.603,0.606-0.259,1.19c0.344,0.584,1.529,2.493,3.285,4.039 c2.255,1.986,4.158,2.602,4.748,2.894c0.59,0.292,0.935,0.243,1.279-0.146c0.344-0.39,1.476-1.703,1.869-2.286 s0.787-0.487,1.329-0.292c0.542,0.194,3.445,1.604,4.035,1.896c0.59,0.292,0.984,0.438,1.132,0.681 C37.062,30.587,37.062,31.755,36.57,33.116z' />
    </svg>
  )

  // Share options with custom icons
  const shareOptions = [
    {
      name: 'Facebook',
      icon: <FacebookIcon />,
      color: '#1877F2',
      action: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            currentUrl
          )}`,
          '_blank'
        ),
    },
    {
      name: 'X',
      icon: <XIcon />,
      color: '#000000',
      action: () =>
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            currentUrl
          )}`,
          '_blank'
        ),
    },
    {
      name: 'Reddit',
      icon: <RedditIcon />,
      color: '#FF4500',
      action: () =>
        window.open(
          `https://www.reddit.com/submit?url=${encodeURIComponent(currentUrl)}`,
          '_blank'
        ),
    },
    {
      name: 'WhatsApp',
      icon: <WhatsAppIcon />,
      color: '#25D366',
      action: () =>
        window.open(
          `https://wa.me/?text=${encodeURIComponent(currentUrl)}`,
          '_blank'
        ),
    },
    {
      name: 'Messages',
      icon: <MessageSquare size={22} className='text-white' />,
      color: '#FAE100',
      action: () => alert('KakaoTalk sharing would be integrated here'),
    },
    {
      name: 'Email',
      icon: <Mail size={22} className='text-white' />,
      color: '#6B7280',
      action: () =>
        window.open(`mailto:?body=${encodeURIComponent(currentUrl)}`, '_blank'),
    },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/70'
        >
          <motion.div
            ref={popupRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='bg-white rounded-md w-[95%] max-w-[480px] overflow-hidden shadow-xl'
          >
            {/* Header */}
            <div className='flex justify-between items-center px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100'>
              <h3 className='text-base sm:text-lg font-semibold text-gray-800'>
                Send
              </h3>
              <button
                onClick={onClose}
                className='text-black cursor-pointer p-1 rounded-full transition-colors'
              >
                <X size={18} />
              </button>
            </div>

            {/* Share options - Responsive grid layout */}
            <div className='px-4 py-5 sm:px-6 sm:py-6'>
              <div className='grid grid-cols-3 sm:grid-cols-6 gap-3'>
                {shareOptions.map((option) => (
                  <div key={option.name} className='flex flex-col items-center'>
                    <button
                      onClick={option.action}
                      className='w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center mb-1 hover:opacity-90 transition-all '
                      style={{ backgroundColor: option.color }}
                    >
                      {option.icon}
                    </button>
                    <span className='text-xs text-gray-600 font-medium'>
                      {option.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className='px-4 pb-5 sm:px-6 sm:pb-6'>
              <div className='flex items-stretch'>
                {/* URL Container with grey borders except right */}
                <div className='flex-1 bg-gray-50 border border-r-0  rounded-l-sm pl-3 py-2 truncate text-xs sm:text-sm'>
                  {currentUrl}
                </div>

                {/* Copy Button with blue left border */}
                <button
                  onClick={copyToClipboard}
                  className='flex items-center gap-2 px-4 bg-blue-800 hover:bg-blue-700 transition-colors text-white border-blue-900 rounded-r-sm'
                >
                  {copied ? (
                    'Copied!'
                  ) : (
                    <>
                      <Copy size={16} className='text-white' />
                      <span className='text-white font-medium'>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SharePopup
