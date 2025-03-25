// Layout.jsx
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Menu, Search, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import NotificationDropdown from './NotificationDropdown'

// Custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #E5E7EB;
    border-radius: 20px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #D1D5DB;
  }
  
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #E5E7EB transparent;
  }

  /* Hide scrollbar for filter tags */
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileSearchQuery, setMobileSearchQuery] = useState('')
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

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
      {/* Inject custom scrollbar styles */}
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />

      {/* Topbar */}
      <div className='flex items-center justify-between px-4 py-3 bg-white h-16 z-10'>
        <div className='flex items-center'>
          <button
            className='md:hidden mr-4 focus:outline-none'
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          {/* Logo in topbar - only shown on desktop */}
          <div className='hidden md:flex items-center pl-4'>
            <img src='/Logo.png' alt='Qalani Logo' className='h-16 my-1 mt-2' />
          </div>
        </div>

        <div className='flex-1 max-w-xl mx-4 hidden sm:block'>
          <div className='relative'>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-black focus:ring-0 transition-all'
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
                className='w-full py-2 pl-10 pr-8 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-black focus:ring-0 transition-all'
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
            <div className='flex items-center space-x-1'>
              <button
                className='p-2 text-gray-700 rounded-full hover:bg-gray-100 transition-colors'
                onClick={() => setShowMobileSearch(true)}
              >
                <Search size={20} />
              </button>
              <div className='relative'>
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
              {/* Mobile New button */}
              <button className='px-3 py-1 text-white bg-blue-800 rounded-md hover:bg-blue-900 transition-colors flex items-center justify-center'>
                <span className='font-medium'>+ New</span>
              </button>
            </div>
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
          <Link
            to='/signup'
            className='h-9 w-20 px-4 text-gray-700 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors whitespace-nowrap flex items-center justify-center'
          >
            Sign Up
          </Link>
          <Link
            to='/login'
            className='h-9 w-20 px-4 text-white bg-black rounded-full hover:bg-gray-800 transition-colors whitespace-nowrap flex items-center justify-center'
          >
            Log In
          </Link>
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

        {/* Sidebar - reduced width to w-48 */}
        <div
          className={`fixed md:static inset-y-0 left-0 w-48 bg-white z-30 overflow-y-auto custom-scrollbar flex flex-col justify-between md:translate-x-0 transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className='flex flex-col py-2'>
            <div className='px-4 mb-2'>
              {/* Mobile logo - only shown on mobile */}
              <div className='md:hidden flex items-center justify-center px-2'>
                <img src='/Logo.png' alt='Qalani Logo' className='h-16' />
              </div>
            </div>

            <SidebarItem text='Home' path='/home' />
            <SidebarItem text='Quicks' path='/quicks' />
            <SidebarItem text='Connect' path='/connect' />
            <SidebarItem text='History' path='/history' />
            <SidebarItem text='Profile' path='/profile' />
            <SidebarItem text='Settings' path='/settings' />

            {/* New button moved to bottom of sidebar - with darker blue */}
            <div className='px-4 mt-6 hidden md:block'>
              <button className='h-9 w-full px-4 text-white bg-blue-800 rounded-md hover:bg-blue-900 transition-colors flex items-center justify-center'>
                <span className='font-medium'>+ New</span>
              </button>
            </div>

            {/* Popular Categories section */}
            <div className='px-4 mt-6'>
              <h3 className='font-bold text-black whitespace-nowrap mb-2'>
                Popular Categories
              </h3>
              <div className='flex flex-col space-y-2'>
                <a
                  href='#'
                  className='text-gray-400 hover:text-black transition-colors'
                >
                  Advertising
                </a>
                <a
                  href='#'
                  className='text-gray-400 hover:text-black transition-colors'
                >
                  Automotive
                </a>
                <a
                  href='#'
                  className='text-gray-400 hover:text-black transition-colors'
                >
                  Construction
                </a>
                <a
                  href='#'
                  className='text-gray-400 hover:text-black transition-colors'
                >
                  Finance
                </a>
                <a
                  href='#'
                  className='text-gray-400 hover:text-black transition-colors'
                >
                  Food
                </a>
                <a
                  href='#'
                  className='text-gray-400 hover:text-black transition-colors'
                >
                  Health
                </a>
                <a
                  href='#'
                  className='text-gray-400 hover:text-black transition-colors'
                >
                  Media
                </a>
                <a
                  href='#'
                  className='text-gray-400 hover:text-black transition-colors'
                >
                  Professional
                </a>
                <a
                  href='#'
                  className='text-gray-400 hover:text-black transition-colors'
                >
                  Real Estate
                </a>
                <a
                  href='#'
                  className='text-gray-400 hover:text-black transition-colors'
                >
                  Science
                </a>
                <a
                  href='#'
                  className='text-gray-400 hover:text-black transition-colors'
                >
                  Technology
                </a>
                <a
                  href='#'
                  className='text-gray-400 hover:text-black transition-colors'
                >
                  Travel
                </a>
              </div>
            </div>

            {/* Mobile-only auth buttons */}
            <div className='md:hidden mt-6 px-4 space-y-3'>
              <Link
                to='/signup'
                className='w-full h-9 px-4 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center'
              >
                Sign Up
              </Link>
              <Link
                to='/login'
                className='w-full h-9 px-4 text-white bg-black rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center'
              >
                Log In
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className='flex-1 overflow-auto custom-scrollbar bg-white'>
          {/* Filter Tags */}
          <div className='relative border-b border-gray-100'>
            <div className='flex overflow-x-auto py-4 px-4 hide-scrollbar gap-4 md:gap-6 whitespace-nowrap'>
              <button className='text-base md:text-lg font-bold text-black hover:text-gray-700 transition-colors flex-shrink-0 px-1'>
                AI
              </button>
              <button className='text-base md:text-lg font-bold text-black hover:text-gray-700 transition-colors flex-shrink-0 px-1'>
                Helpful
              </button>
              <button className='text-base md:text-lg font-bold text-black hover:text-gray-700 transition-colors flex-shrink-0 px-1'>
                How-Tos
              </button>
              <button className='text-base md:text-lg font-bold text-black hover:text-gray-700 transition-colors flex-shrink-0 px-1'>
                Ingenious
              </button>
              <button className='text-base md:text-lg font-bold text-black hover:text-gray-700 transition-colors flex-shrink-0 px-1'>
                Innovative
              </button>
              <button className='text-base md:text-lg font-bold text-black hover:text-gray-700 transition-colors flex-shrink-0 px-1'>
                Life Hacks
              </button>
              <button className='text-base md:text-lg font-bold text-black hover:text-gray-700 transition-colors flex-shrink-0 px-1'>
                Motivational
              </button>
              <button className='text-base md:text-lg font-bold text-black hover:text-gray-700 transition-colors flex-shrink-0 px-1'>
                Productivity
              </button>
              <button className='text-base md:text-lg font-bold text-black hover:text-gray-700 transition-colors flex-shrink-0 px-1'>
                Creativity
              </button>
              <button className='text-base md:text-lg font-bold text-black hover:text-gray-700 transition-colors flex-shrink-0 px-1'>
                Technology
              </button>
              <button className='text-base md:text-lg font-bold text-black hover:text-gray-700 transition-colors flex-shrink-0 px-1'>
                Business
              </button>
              <button className='text-base md:text-lg font-bold text-black hover:text-gray-700 transition-colors flex-shrink-0 px-1'>
                Health
              </button>
              <button className='text-base md:text-lg font-bold text-black hover:text-gray-700 transition-colors flex-shrink-0 px-1'>
                Finance
              </button>
            </div>
            {/* Fade effect on edges for better scrolling indication */}
            <div className='absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-white to-transparent pointer-events-none'></div>
            <div className='absolute top-0 left-0 h-full w-6 bg-gradient-to-r from-white to-transparent pointer-events-none'></div>
          </div>

          {/* Main Content */}
          <div className='p-4'>{children}</div>
        </main>
      </div>
    </div>
  )
}

// Sidebar Item Component - Removed icons
const SidebarItem = ({ text, path }) => {
  const location = useLocation()
  const isActive =
    location.pathname === path ||
    (path === '/home' && location.pathname === '/')

  return (
    <Link to={path} className='block'>
      <div
        className={`flex items-center px-4 py-3 cursor-pointer ${
          isActive ? 'text-black font-bold' : 'text-gray-400 font-bold'
        } hover:text-black hover:translate-x-1 transition-transform transition-colors`}
      >
        <span>{text}</span>
      </div>
    </Link>
  )
}

export default Layout
