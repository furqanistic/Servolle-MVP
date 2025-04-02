import { Bell, Clock, MessageCircle, User, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const NotificationDropdown = ({ isOpen, onClose }) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Check initially
    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile)

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  if (!isOpen) return null

  // Sample notifications data with more entries to enable scrolling
  const notifications = [
    {
      id: 1,
      type: 'message',
      content: 'Sarah sent you a message',
      time: '2 min ago',
      read: false,
      icon: <MessageCircle size={16} />,
    },
    {
      id: 2,
      type: 'user',
      content: 'John started following you',
      time: '1 hour ago',
      read: false,
      icon: <User size={16} />,
    },
    {
      id: 3,
      type: 'reminder',
      content: 'Meeting starts in 30 minutes',
      time: '30 min ago',
      read: true,
      icon: <Clock size={16} />,
    },
    {
      id: 4,
      type: 'system',
      content: 'Your account was verified successfully',
      time: '2 days ago',
      read: true,
      icon: <Bell size={16} />,
    },
    {
      id: 5,
      type: 'message',
      content: 'Alex commented on your post',
      time: '3 hours ago',
      read: false,
      icon: <MessageCircle size={16} />,
    },
    {
      id: 6,
      type: 'user',
      content: 'Emma liked your profile',
      time: '5 hours ago',
      read: true,
      icon: <User size={16} />,
    },
    {
      id: 7,
      type: 'reminder',
      content: 'Project deadline tomorrow',
      time: '12 hours ago',
      read: false,
      icon: <Clock size={16} />,
    },
    {
      id: 8,
      type: 'system',
      content: 'New feature available: Dark mode',
      time: '1 day ago',
      read: true,
      icon: <Bell size={16} />,
    },
    {
      id: 9,
      type: 'message',
      content: 'Team chat: New message from David',
      time: '1 day ago',
      read: true,
      icon: <MessageCircle size={16} />,
    },
    {
      id: 10,
      type: 'user',
      content: 'Michael shared a document with you',
      time: '2 days ago',
      read: true,
      icon: <User size={16} />,
    },
    {
      id: 11,
      type: 'reminder',
      content: 'Weekly review meeting at 10 AM',
      time: '3 days ago',
      read: true,
      icon: <Clock size={16} />,
    },
    {
      id: 12,
      type: 'system',
      content: 'System maintenance scheduled for Sunday',
      time: '4 days ago',
      read: true,
      icon: <Bell size={16} />,
    },
  ]

  // For mobile, position dropdown to stay in viewport
  const dropdownPosition = isMobile
    ? 'fixed top-16 right-2 left-2 mt-0'
    : 'absolute top-full right-0 mt-1 w-80'

  return (
    <div
      className={`${dropdownPosition} max-h-96 rounded-lg shadow-lg overflow-hidden z-[9999] notification-dropdown`}
    >
      {/* Arrow pointer connecting to the bell icon - positioned at the top right */}
      <div
        className={`absolute -top-2 ${
          isMobile ? 'right-12' : 'right-3'
        } w-4 h-4 bg-white transform rotate-45`}
      ></div>

      {/* Content container with its own bg to hide the arrow's bottom part */}
      <div className='relative bg-white rounded-lg'>
        <div className='flex items-center justify-between px-4 py-3 border-b border-gray-100'>
          <h3 className='font-medium text-gray-800'>Notifications</h3>
          <div className='flex items-center space-x-2'>
            <span className='text-xs text-gray-500 cursor-pointer hover:text-gray-700'>
              Mark all as read
            </span>
            <button
              onClick={onClose}
              className='text-gray-500 hover:text-gray-700'
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className='overflow-y-auto max-h-80'>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                  notification.read ? 'bg-white' : 'bg-blue-50'
                }`}
              >
                <div className='flex items-start'>
                  <div
                    className={`p-2 rounded-full mr-3 ${
                      notification.read ? 'bg-gray-100' : 'bg-blue-100'
                    }`}
                  >
                    {notification.icon}
                  </div>
                  <div className='flex-1'>
                    <p
                      className={`text-sm ${
                        notification.read
                          ? 'text-gray-700'
                          : 'text-gray-900 font-medium'
                      }`}
                    >
                      {notification.content}
                    </p>
                    <p className='text-xs text-gray-500 mt-1'>
                      {notification.time}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className='py-6 text-center text-gray-500'>
              <p>No notifications yet</p>
            </div>
          )}
        </div>
        <div className='px-4 py-3 text-center border-t border-gray-100'>
          <button className='text-sm text-blue-500 hover:text-blue-700 font-medium'>
            View all notifications
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationDropdown
