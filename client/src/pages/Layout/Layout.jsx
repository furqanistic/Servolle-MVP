// Layout.jsx
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bell,
  Building2,
  Clock,
  Compass,
  Home,
  LogIn,
  Menu,
  MoreHorizontal,
  PlusCircle,
  Search,
  Settings,
  Upload,
  User,
  Users,
  X,
  Zap,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import NotificationDropdown from './NotificationDropdown'

const Layout = ({ children }) => {
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileSearchQuery, setMobileSearchQuery] = useState('')
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [initialRender, setInitialRender] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 768)
    }

    // Initial check
    checkIfDesktop()

    // Add event listener for window resize
    window.addEventListener('resize', checkIfDesktop)

    // Set initial render to false after mount
    setInitialRender(false)

    // Cleanup
    return () => window.removeEventListener('resize', checkIfDesktop)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
  }

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showNotifications &&
        !event.target.closest('.notification-btn') &&
        !event.target.closest('.notification-dropdown')
      ) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showNotifications])

  return (
    <div className='flex flex-col h-screen bg-gray-50'>
      {/* Topbar */}
      <div className='flex items-center justify-between px-4 py-3 bg-white shadow-sm h-16 z-10'>
        <div className='flex items-center'>
          <button
            className='md:hidden mr-4 focus:outline-none'
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          {/* Logo in topbar - only shown on desktop */}
          <div className='hidden md:flex items-center'>
            <img src='/Logo.png' alt='Qalani Logo' className='h-12 my-1' />
          </div>
        </div>

        <div className='flex-1 max-w-xl mx-4 hidden sm:block'>
          <div className='relative'>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all'
            />
            <div className='absolute inset-y-0 left-0 flex items-center pl-3'>
              <Search size={18} className='text-gray-400' />
            </div>
            {searchQuery.length > 0 && (
              <button
                className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600'
                onClick={() => setSearchQuery('')}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile search icon & notification */}
        <div className='sm:hidden flex items-center'>
          {showMobileSearch ? (
            <div className='relative w-full max-w-xs'>
              <input
                type='text'
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                className='w-full py-2 pl-10 pr-8 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all'
                autoFocus
              />
              <div className='absolute inset-y-0 left-0 flex items-center pl-3'>
                <Search size={18} className='text-gray-400' />
              </div>
              <div className='absolute inset-y-0 right-0 flex items-center pr-2'>
                {mobileSearchQuery.length > 0 ? (
                  <button
                    className='p-1 text-gray-400 hover:text-gray-600'
                    onClick={() => setMobileSearchQuery('')}
                  >
                    <X size={16} />
                  </button>
                ) : (
                  <button
                    className='p-1 text-gray-400 hover:text-gray-600'
                    onClick={() => setShowMobileSearch(false)}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <button
                className='p-2 text-gray-700 rounded-full hover:bg-gray-100 transition-colors mr-1'
                onClick={() => setShowMobileSearch(true)}
              >
                <Search size={20} />
              </button>
              <div className='mr-1 relative'>
                <button
                  className='p-2 text-gray-700 rounded-full hover:bg-gray-100 transition-colors relative notification-btn'
                  onClick={toggleNotifications}
                >
                  <Bell size={20} className='text-gray-800' />
                  <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
                </button>
                {/* Position notification dropdown directly below the bell button */}
                <NotificationDropdown
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                />
              </div>
            </>
          )}
        </div>

        <div className='flex items-center space-x-3 md:flex hidden'>
          <div className='mr-2 relative'>
            <button
              className='p-2 text-gray-700 rounded-full hover:bg-gray-100 transition-colors relative notification-btn'
              onClick={toggleNotifications}
            >
              <Bell size={20} className='text-gray-800' />
              <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
            </button>
            {/* Position notification dropdown directly below the bell button */}
            <NotificationDropdown
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>
          <button className='h-9 w-20 px-4 text-gray-700 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors whitespace-nowrap flex items-center justify-center'>
            Sign Up
          </button>
          <button className='h-9 w-20 px-4 text-white bg-black rounded-full hover:bg-gray-800 transition-colors whitespace-nowrap flex items-center justify-center'>
            Log In
          </button>
        </div>
      </div>

      <div className='flex flex-1 overflow-hidden'>
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black z-20 md:hidden'
              onClick={toggleSidebar}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <div
          className={`fixed md:static inset-y-0 left-0 w-64 bg-white shadow-md z-30 overflow-y-auto flex flex-col justify-between md:translate-x-0 transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className='flex flex-col py-2'>
            <div className='px-4 mb-2'>
              {/* Mobile logo - only shown on mobile */}
              <div className='md:hidden flex items-center justify-center px-2'>
                <img src='/Logo.png' alt='Qalani Logo' className='h-12' />
              </div>
              {/* Removed duplicate desktop logo from sidebar */}
            </div>

            <div className='sm:hidden mx-4 mb-6 hidden'>
              <div className='relative'>
                <input
                  type='text'
                  placeholder=''
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  className='w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200'
                />
                <div className='absolute inset-y-0 left-0 flex items-center pl-3'>
                  <Search size={18} className='text-gray-500' />
                </div>
                {mobileSearchQuery.length > 0 && (
                  <button className='absolute inset-y-0 right-0 flex items-center pr-3'>
                    <Search size={18} className='text-gray-700' />
                  </button>
                )}
              </div>
            </div>

            <SidebarItem icon={<Home size={24} />} text='Home' path='/home' />
            <SidebarItem
              icon={<Zap size={24} />}
              text='Quicks'
              path='/quicks'
            />
            <SidebarItem
              icon={<Users size={24} />}
              text='Connect'
              path='/connect'
            />
            <SidebarItem
              icon={<Clock size={24} />}
              text='History'
              path='/history'
            />
            <SidebarItem
              icon={<User size={24} />}
              text='Profile'
              path='/profile'
            />
            <SidebarItem
              icon={<Settings size={24} />}
              text='Settings'
              path='/settings'
            />

            {/* Mobile-only auth buttons */}
            <div className='md:hidden mt-6 px-4 space-y-3'>
              <button className='w-full h-9 px-4 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center'>
                Sign Up
              </button>
              <button className='w-full h-9 px-4 text-white bg-black rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center'>
                Log In
              </button>
            </div>

            {/* New button at the end of sidebar */}
            <div className='px-4 mt-auto pt-6'>
              <button className='w-full flex items-center justify-center py-2 text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition-colors'>
                <PlusCircle size={18} className='mr-2' />
                New
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className='flex-1 overflow-auto p-4 bg-gray-50'>{children}</main>
      </div>
    </div>
  )
}

// Sidebar Item Component
const SidebarItem = ({ icon, text, path }) => {
  const location = useLocation()
  const isActive =
    location.pathname === path ||
    (path === '/home' && location.pathname === '/')

  return (
    <Link to={path} className='block'>
      <div
        className={`flex items-center px-4 py-3 cursor-pointer ${
          isActive ? 'text-black font-medium' : 'text-gray-600'
        } hover:bg-gray-100 transition-colors hover:translate-x-1 transition-transform`}
      >
        <div className='mr-4'>{icon}</div>
        <span>{text}</span>
      </div>
    </Link>
  )
}

export default Layout
