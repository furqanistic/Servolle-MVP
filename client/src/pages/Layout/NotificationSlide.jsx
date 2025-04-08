import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Clock, DollarSign, ShoppingCart, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

const NotificationSlide = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'cart',
      content: 'Your shared Bose headphones have been added to 3 carts',
      time: '2 min ago',
      read: false,
      icon: <ShoppingCart size={14} />,
    },
    {
      id: 2,
      type: 'commission',
      content: 'You earned $12.50 commission from Sony TV purchase',
      time: '1 hour ago',
      read: false,
      icon: <DollarSign size={14} />,
    },
    {
      id: 3,
      type: 'info',
      content: 'Your Samsung review reached 150 views',
      time: '30 min ago',
      read: true,
      icon: <Bell size={14} />,
    },
    {
      id: 4,
      type: 'commission',
      content: 'Lisa earned $3.25 from your shared link',
      time: '2 hours ago',
      read: true,
      icon: <DollarSign size={14} />,
    },
    {
      id: 5,
      type: 'cart',
      content: 'iPhone 14 case you shared is selling fast',
      time: '3 hours ago',
      read: false,
      icon: <ShoppingCart size={14} />,
    },
    {
      id: 6,
      type: 'info',
      content: 'Upcoming Amazon sale on your tracked items',
      time: '5 hours ago',
      read: true,
      icon: <Bell size={14} />,
    },
    {
      id: 7,
      type: 'commission',
      content: 'You received $5.75 commission from Echo Dot',
      time: '12 hours ago',
      read: false,
      icon: <DollarSign size={14} />,
    },
    {
      id: 8,
      type: 'info',
      content: 'Your content got featured on Qalani homepage',
      time: '1 day ago',
      read: true,
      icon: <Bell size={14} />,
    },
  ])
  const slideRef = useRef(null)

  // Close slide when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        slideRef.current &&
        !slideRef.current.contains(event.target) &&
        !event.target.closest('.notification-btn')
      ) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  // Count unread notifications
  const unreadCount = notifications.filter((notif) => !notif.read).length

  return (
    <AnimatePresence>
      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-start justify-end'>
          {/* Backdrop/overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 bg-black'
            onClick={onClose}
          />

          {/* Notification slide - full height on all devices */}
          <motion.div
            ref={slideRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className='relative h-full w-full max-w-md bg-white shadow-xl flex flex-col z-10 overflow-hidden'
          >
            {/* Header */}
            <div className='flex items-center justify-between px-4 py-3 border-b border-gray-100'>
              <div className='flex items-center'>
                <h2 className='text-base font-semibold'>Notifications</h2>
                {unreadCount > 0 && (
                  <span className='ml-2 px-2 py-0.5 bg-blue-50 text-blue-800 text-xs rounded-full font-medium'>
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className='p-1 rounded-full transition-colors focus:outline-none mr-1 pr-1'
                aria-label='Close notifications'
              >
                <X size={20} />
              </button>
            </div>

            {/* Notifications list */}
            <div className='flex-1 overflow-y-auto custom-scrollbar'>
              {notifications.length === 0 ? (
                <div className='flex flex-col items-center justify-center h-full px-4 py-8 text-center'>
                  <div className='bg-gray-50 p-4 rounded-full mb-3'>
                    <Bell size={24} className='text-gray-400' />
                  </div>
                  <p className='text-gray-900 font-medium text-base mb-1'>
                    No Notifications Yet
                  </p>
                  <p className='text-gray-500 text-xs mb-4 max-w-xs'>
                    We'll notify you when something important happens.
                  </p>
                </div>
              ) : (
                <div className='divide-y divide-gray-100'>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-blue-50/20' : 'bg-white'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className='flex items-start'>
                        <div
                          className={`p-2 rounded-full mr-3 flex-shrink-0 ${
                            !notification.read
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {notification.icon}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p
                            className={`text-sm ${
                              !notification.read
                                ? 'text-gray-900 font-medium'
                                : 'text-gray-800'
                            }`}
                          >
                            {notification.content}
                          </p>
                          <p className='text-xs text-gray-400 mt-1 flex items-center'>
                            <Clock size={12} className='mr-1' />
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className='w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-3 mt-1.5'></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with actions */}
            <div className='border-t border-gray-200 px-4 py-3 bg-white'>
              <div className='flex justify-between'>
                {unreadCount > 0 && (
                  <button
                    className='text-xs text-blue-600 hover:text-blue-800 transition-colors py-1 px-2 focus:outline-none'
                    onClick={() => {
                      setNotifications(
                        notifications.map((notif) => ({ ...notif, read: true }))
                      )
                    }}
                  >
                    Mark all as read
                  </button>
                )}
                <button
                  className='text-xs text-gray-500 hover:text-gray-700 transition-colors py-1 px-2 focus:outline-none ml-auto'
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default NotificationSlide
