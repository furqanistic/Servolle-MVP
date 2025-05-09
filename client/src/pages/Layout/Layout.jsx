import MediaUploadPopup from '@/components/Home/MediaUploadPopup'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Menu, Search, ShoppingCart, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import CartPopup from './CartPopup' // Import the CartPopup component
import NotificationSlide from './NotificationSlide' // Import the new NotificationSlide component

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

// Popular categories data
const popularCategories = [
  'Automotive',
  'Art',
  'Baby',
  'Beauty',
  'Books',
  'Clothes',
  'Collectibles',
  'Computer',
  'Digital',
  'Electronics',
  'Fitness',
  'Games',
  'Garden',
  'Health',
  'Home',
  'Jewelry',
  'Mobile',
  'Musical Instruments',
  'Kitchen',
  'Office',
  'Outdoors',
  'Personal Care',
  'Pets',
  'Photography',
  'Shoes',
  'Sports',
  'Subscriptions',
  'Tools',
  'Toys',
  'Travel',
  'Video Games',
]

// Sample cart items for demonstration
const sampleCartItems = [
  {
    id: 1,
    name: 'Wireless Bluetooth Earbuds',
    seller: 'AudioTech',
    price: 49.99,
    quantity: 1,
    image: 'https://havitstore.pk/cdn/shop/files/I62_19.png?v=1728113247',
  },
  {
    id: 2,
    name: 'Smart Fitness Tracker',
    seller: 'FitGear',
    price: 89.95,
    quantity: 1,
    image: 'https://havitstore.pk/cdn/shop/files/I62_19.png?v=1728113247',
  },
  {
    id: 3,
    name: 'Portable Power Bank 20000mAh',
    seller: 'PowerPlus',
    price: 35.5,
    quantity: 2,
    image: 'https://havitstore.pk/cdn/shop/files/I62_19.png?v=1728113247',
  },
]

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileSearchQuery, setMobileSearchQuery] = useState('')
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showBanner, setShowBanner] = useState(true)
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [showCartPopup, setShowCartPopup] = useState(false) // New state for cart popup
  const [cartItems, setCartItems] = useState(sampleCartItems) // Add cart items state
  const [showMediaUploadPopup, setShowMediaUploadPopup] = useState(false)
  //  handle opening the popup
  const handleNewButtonClick = () => {
    setShowMediaUploadPopup(true)

    // Close other menus if they're open
    setIsSidebarOpen(false)
    setShowNotifications(false)
    setShowCartPopup(false)
  }
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
    // Close cart popup when notifications are opened
    if (!showNotifications) {
      setShowCartPopup(false)
    }
  }

  const toggleCartPopup = () => {
    setShowCartPopup(!showCartPopup)
    // Close notifications when cart is opened
    if (!showCartPopup) {
      setShowNotifications(false)
    }
  }

  const closeBanner = () => {
    setShowBanner(false)
  }

  return (
    <>
      {/* Inject custom scrollbar styles */}
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />

      <div className='flex flex-col h-screen bg-gray-50'>
        {/* Topbar */}
        <div className='flex items-center justify-between px-2 py-3 bg-white h-16 z-20'>
          <div className='flex items-center'>
            {/* Logo in topbar - smaller */}
            <div className='flex items-center'>
              <img src='/Logo.svg' alt='Qalani Logo' className='h-10 my-1' />
            </div>
          </div>

          {/* Search bar - more prominent like Pinterest */}
          <div className='flex-1 max-w-3xl mx-4 hidden sm:block'>
            <div className='relative'>
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full h-10 py-2 pl-10 pr-4 text-gray-700 bg-gray-100 border-2 border-transparent rounded-full focus:outline-none focus:border-black focus:ring-0 focus:bg-white transition-all duration-75'
              />
              <div className='absolute inset-y-0 left-0 flex items-center pl-3'>
                <Search size={18} className='text-gray-500' />
              </div>
              {searchQuery.length > 0 && (
                <button
                  className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700'
                  onClick={() => setSearchQuery('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Right side controls */}
          <div className='flex items-center space-x-2 mr-2 relative'>
            {/* Search icon - mobile only */}
            <button
              className='p-2 text-gray-700 rounded-full hover:bg-gray-100 transition-colors sm:hidden'
              onClick={() => setShowMobileSearch(true)}
            >
              <Search size={20} />
            </button>

            {/* Notifications button */}
            <div className='relative'>
              <button
                className='p-2 text-blue-800 rounded-full hover:bg-blue-50 transition-colors notification-btn border-2 border-blue-800 bg-white focus:outline-none'
                onClick={toggleNotifications}
                style={{ zIndex: showNotifications ? 40 : 30 }}
              >
                <Bell size={20} className='text-blue-800' />
              </button>
              <span className='absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border border-white shadow-sm'></span>
            </div>

            {/* Cart button - Modified to handle opening the cart popup */}
            <div className='relative sm:ml-1'>
              <button
                className='p-2 text-blue-800 rounded-full hover:bg-blue-50 transition-colors cart-btn border-2 border-blue-800 bg-white focus:outline-none'
                onClick={toggleCartPopup}
                style={{ zIndex: showCartPopup ? 40 : 30 }}
              >
                <ShoppingCart size={20} className='text-blue-800' />
              </button>
              {cartItems.length > 0 && (
                <span className='absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border border-white shadow-sm'></span>
              )}
            </div>

            {/* Hamburger menu */}
            <button
              className='p-2 text-blue-800 border-2 border-blue-800 bg-white rounded-full hover:bg-blue-50 transition-colors sidebar-toggle-btn focus:outline-none sm:ml-1'
              onClick={toggleSidebar}
              style={{ zIndex: isSidebarOpen ? 40 : 30 }}
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Mobile search overlay */}
          {showMobileSearch && (
            <div className='fixed inset-x-0 top-0 bg-white p-3 z-50 h-16 flex items-center'>
              <div className='relative w-full'>
                <input
                  type='text'
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  className='w-full h-10 py-2 pl-10 pr-8 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-black focus:border-2 focus:ring-0 transition-all'
                  autoFocus
                />
                <div className='absolute inset-y-0 left-0 flex items-center pl-3'>
                  <Search size={18} className='text-gray-500' />
                </div>
                <button
                  className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700'
                  onClick={() => setShowMobileSearch(false)}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className='flex flex-1 overflow-hidden'>
          {/* Left Sidebar - Categories */}
          <div className='w-48 bg-white overflow-hidden flex-shrink-0 hidden md:flex md:flex-col left-sidebar'>
            {/* Fixed top section */}
            <div className='p-4 flex-shrink-0'>
              {/* New button moved above categories with original pill shape */}
              <button
                className='h-10 mb-6 px-6 text-white bg-blue-800 rounded-md hover:bg-blue-900 transition-colors flex items-center justify-center'
                onClick={handleNewButtonClick}
              >
                <span className='font-medium whitespace-nowrap'>+ New</span>
              </button>

              <h2 className='text-xl font-bold border-b-0 border-gray-200'>
                Popular Categories
              </h2>
            </div>

            {/* Scrollable categories section - Fixed height with overflow */}
            <div className='h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar px-4 pb-4 -mt-2'>
              <ul className='border-t border-gray-200 pt-1'>
                {popularCategories.map((category, index) => (
                  <li key={index}>
                    <a
                      href='#'
                      className='block py-0.5 text-gray-400 hover:text-black transition-colors'
                    >
                      {category}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <main className='flex-1 overflow-auto custom-scrollbar bg-white relative'>
            {/* Simple Clean Banner with Minimal Left Padding */}
            {showBanner && (
              <div className='bg-black text-white py-6 md:py-7 relative'>
                {/* Close button positioned in top-right corner */}
                <button
                  className='absolute top-3 right-3 md:top-4 md:right-4 bg-transparent hover:bg-gray-800 p-2 rounded-full text-white transition-all focus:outline-none'
                  onClick={closeBanner}
                  aria-label='Close banner'
                >
                  <X size={18} />
                </button>

                <div className='max-w-6xl mx-auto pl-4 pr-4 md:pl-4 md:pr-8'>
                  <div className='md:flex md:items-center md:justify-between'>
                    <div className='md:flex-1 md:max-w-3xl'>
                      {/* Mobile/Tablet view - stacked text */}
                      <div className='md:hidden'>
                        <div className='mb-2'>
                          <div className='text-2xl font-medium leading-tight mb-1'>
                            How it works: Affiliates
                          </div>
                          <div className='text-2xl font-medium leading-tight'>
                            create or upload content
                          </div>
                          <div className='text-2xl font-medium leading-tight'>
                            about Amazon products.
                          </div>
                        </div>
                        <div className='text-gray-400 text-base md:text-lg mb-4'>
                          <div className='leading-tight'>
                            Then once a product sells and ships, both
                          </div>
                          <div className='leading-tight'>
                            buyer and affiliate earn a commission.
                          </div>
                        </div>
                      </div>

                      {/* Desktop view - inline text with no line breaks */}
                      <div className='hidden md:block'>
                        <div className='text-lg sm:text-lg md:text-lg lg:text-xl xl:text-2xl font-medium mb-2 whitespace-nowrap max-w-full'>
                          How it works: Affiliates create or upload content
                          about Amazon products.
                        </div>
                        <div className='text-gray-400 text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg mb-0'>
                          Then once a product sells and ships, both buyer and
                          affiliate earn a commission.
                        </div>
                      </div>
                    </div>
                    <div className='flex justify-center w-full mx-auto px-4 md:mx-0 md:px-0 md:w-auto md:justify-start md:ml-6 md:flex-shrink-0 md:mt-4 lg:mt-0'>
                      <button className='bg-white text-black px-5 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors w-full max-w-[280px] md:max-w-none md:w-auto'>
                        Get Started
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content - Modified to have p-2 on mobile and p-4 on larger screens */}
            <div className='p-2 sm:p-4'>{children}</div>
          </main>

          {/* Sidebar Overlay */}
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className='fixed inset-0 bg-black z-20'
                onClick={toggleSidebar}
              />
            )}
          </AnimatePresence>

          {/* Right Sidebar */}
          <div
            className={`fixed inset-y-0 right-0 w-48 bg-white z-30 overflow-y-auto custom-scrollbar flex flex-col justify-between transition-transform duration-300 sidebar ${
              isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className='flex flex-col py-6 h-full'>
              {/* Top row with close button at right and navigation items inline for desktop only */}
              <div className='px-4 flex justify-between items-center'>
                {/* Desktop - Navigation items moved up to be left-aligned with close button */}
                <div className='hidden sm:block'>
                  <SidebarItem text='Home' path='/home' />
                </div>

                {/* Mobile-only New button with matching desktop styling */}
                <button
                  className='h-10 px-6 text-white bg-blue-800 rounded-md hover:bg-blue-900 transition-colors flex items-center justify-center sm:hidden'
                  onClick={handleNewButtonClick}
                >
                  <span className='font-medium whitespace-nowrap'>+ New</span>
                </button>

                {/* Close button - always at right for all screen sizes */}
                <button
                  className='focus:outline-none ml-auto'
                  onClick={toggleSidebar}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Desktop navigation items - rendered below first item with minimal gap */}
              <div className='hidden sm:block px-4 mt-0'>
                <SidebarItem text='Connect' path='/connect' />
                <SidebarItem text='History' path='/history' />
                <SidebarItem text='Profile' path='/profile' />
                <SidebarItem text='Settings' path='/settings' />
              </div>

              {/* Mobile-only navigation items - keep original structure */}
              <div className='px-4 mt-6 sm:hidden'>
                <SidebarItem text='Home' path='/home' />
                <SidebarItem text='Connect' path='/connect' />
                <SidebarItem text='History' path='/history' />
                <SidebarItem text='Profile' path='/profile' />
                <SidebarItem text='Settings' path='/settings' />
              </div>

              {/* Mobile-only categories */}
              <div className='px-4 mt-6 md:hidden'>
                <h3 className='font-bold text-lg mb-0'>Popular Categories</h3>
                <ul>
                  {(showAllCategories
                    ? popularCategories
                    : popularCategories.slice(0, 8)
                  ).map((category, index) => (
                    <li key={index}>
                      <a
                        href='#'
                        className='block py-0.5 text-gray-400 hover:text-black transition-colors'
                      >
                        {category}
                      </a>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() => setShowAllCategories(!showAllCategories)}
                      className='block py-0.5 pb-1 text-blue-800 font-medium w-full text-left'
                    >
                      {showAllCategories ? 'Show less' : 'Show all'}
                    </button>
                  </li>
                </ul>
              </div>

              {/* Auth buttons pushed to the bottom */}
              <div className='mt-auto px-4 space-y-3 mb-6'>
                <Link
                  to='/signup'
                  className='w-full h-10 px-4 text-gray-700 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center'
                >
                  Sign Up
                </Link>
                <Link
                  to='/login'
                  className='w-full h-10 px-4 text-white bg-black rounded-full hover:bg-gray-800 transition-colors flex items-center justify-center'
                >
                  Log In
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* NotificationSlide - Use new component */}
        <NotificationSlide
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />

        {/* Cart Popup */}
        <CartPopup
          isOpen={showCartPopup}
          onClose={() => setShowCartPopup(false)}
          cartItems={cartItems}
          setCartItems={setCartItems}
        />
      </div>
      <MediaUploadPopup
        isOpen={showMediaUploadPopup}
        onClose={() => setShowMediaUploadPopup(false)}
      />
    </>
  )
}

// Sidebar Item Component
const SidebarItem = ({ text, path }) => {
  const location = useLocation()
  const isActive =
    location.pathname === path ||
    (path === '/home' && location.pathname === '/')

  return (
    <Link to={path} className='block w-full'>
      <div
        className={`flex items-center sm:py-1.5 py-0.5 cursor-pointer ${
          isActive ? 'text-black font-bold' : 'text-gray-400 font-bold'
        } hover:text-black hover:translate-x-1 transition-transform transition-colors`}
      >
        <span className='text-base font-semibold'>{text}</span>
      </div>
    </Link>
  )
}

export default Layout
