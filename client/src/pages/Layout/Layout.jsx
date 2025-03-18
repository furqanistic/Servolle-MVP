import { AnimatePresence, motion } from 'framer-motion'
import {
  Bell,
  Bookmark,
  Briefcase,
  Compass,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  PlusCircle,
  Search,
  Settings,
  User,
  Users,
  X,
} from 'lucide-react'
import React, { useState } from 'react'

// Profile Dropdown Menu
const ProfileDropdown = ({ isOpen, toggleDropdown }) => {
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2 },
    },
  }

  const menuItems = [
    { icon: <User size={16} />, label: 'My Profile' },
    { icon: <Bookmark size={16} />, label: 'Saved Services' },
    { icon: <Settings size={16} />, label: 'Settings' },
    { icon: <LogOut size={16} />, label: 'Log Out' },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial='hidden'
          animate='visible'
          exit='hidden'
          variants={dropdownVariants}
          className='absolute right-0 mt-2 w-48 bg-app-medium border border-app-deep rounded-lg shadow-xl z-50 overflow-hidden'
        >
          <div className='py-2'>
            {menuItems.map((item, index) => (
              <motion.a
                key={index}
                whileHover={{ backgroundColor: 'rgba(0, 166, 244, 0.1)' }}
                className='flex items-center px-4 py-2 text-gray-200 hover:text-white cursor-pointer'
              >
                <span className='text-app-lite mr-3'>{item.icon}</span>
                <span>{item.label}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Mobile Navigation Menu with Original Colors
const MobileMenu = ({ isOpen, toggleMenu }) => {
  const menuVariants = {
    closed: {
      opacity: 0,
      x: '100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black z-40'
            onClick={toggleMenu}
          />
          <motion.div
            initial='closed'
            animate='open'
            exit='closed'
            variants={menuVariants}
            className='fixed top-0 right-0 h-full w-72 bg-app-deep shadow-lg z-50 overflow-y-auto border-l border-app-lite/20'
          >
            <div className='flex justify-end p-4'>
              <button onClick={toggleMenu} className='text-white'>
                <X size={24} />
              </button>
            </div>
            <div className='p-4'>
              <div className='space-y-1'>
                <SideNavItem icon={<Home size={20} />} label='Home' active />
                <SideNavItem icon={<Compass size={20} />} label='Discover' />
                <SideNavItem icon={<Users size={20} />} label='Network' />
                <SideNavItem icon={<Briefcase size={20} />} label='Services' />
                <SideNavItem
                  icon={<MessageSquare size={20} />}
                  label='Messages'
                />
                <SideNavItem icon={<Bell size={20} />} label='Notifications' />
                <SideNavItem icon={<Bookmark size={20} />} label='Saved' />
              </div>

              <div className='mt-6 pt-6 border-t border-app-medium'>
                <button className='w-full bg-app-lite hover:bg-opacity-90 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center'>
                  <PlusCircle size={18} className='mr-2' />
                  Create
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Side Navigation Item Component - Matches Screenshot
const SideNavItem = ({ icon, label, badge, active }) => {
  return (
    <motion.div
      whileHover={{ backgroundColor: 'rgba(0, 166, 244, 0.1)' }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center justify-between py-2.5 px-4 mx-2 cursor-pointer rounded-lg ${
        active ? 'text-app-lite' : 'text-gray-100 hover:text-white'
      }`}
    >
      <div className='flex items-center'>
        <div className={`${active ? 'text-app-lite' : 'text-gray-300'}`}>
          {icon}
        </div>
        <span className='ml-3'>{label}</span>
      </div>
      {badge && (
        <span className='bg-app-lite text-white text-xs px-1.5 py-0.5 min-w-[18px] text-center rounded-full'>
          {badge}
        </span>
      )}
    </motion.div>
  )
}

// Search Component
const SearchBar = () => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className='relative max-w-md w-full'>
      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
        <Search
          size={18}
          className={isFocused ? 'text-app-lite' : 'text-gray-400'}
        />
      </div>
      <input
        type='text'
        className={`block w-full pl-10 pr-3 py-2 border ${
          isFocused ? 'border-app-lite' : 'border-gray-700'
        } rounded-full bg-app-deep text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-app-lite focus:border-app-lite transition-all duration-200`}
        placeholder='Search people, services, posts...'
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  )
}

// Create Button
const CreateButton = () => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className='bg-app-lite text-white rounded-full py-2 px-4 flex items-center font-medium shadow-sm'
    >
      <PlusCircle size={18} className='mr-2' />
      <span>Create</span>
    </motion.button>
  )
}

// Top Navigation Item - Matches Screenshot
const TopNavItem = ({ icon, label, active, notification }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center h-16 px-6 relative cursor-pointer ${
        active
          ? 'text-app-lite border-b-2 border-app-lite'
          : 'text-gray-300 hover:text-white'
      }`}
    >
      <div className='relative'>
        {icon}
        {notification && (
          <div className='absolute -top-1 -right-1 bg-app-lite text-white text-xs rounded-full h-4 w-4 flex items-center justify-center'>
            {notification}
          </div>
        )}
      </div>
      <span className='text-xs mt-1'>{label}</span>
    </div>
  )
}

// Topbar Component
const Topbar = ({ toggleMenu }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <div className='bg-app-medium shadow z-10 sticky top-0'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex justify-between items-center h-16 px-4'>
          {/* Logo */}
          <div className='flex items-center'>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='flex items-center mr-6'
            >
              <span className='text-app-lite text-2xl font-bold'>Servolle</span>
            </motion.div>

            {/* Desktop Search */}
            <div className='hidden md:block'>
              <SearchBar />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-1'>
            <TopNavItem icon={<Home size={22} />} label='Home' active={true} />
            <TopNavItem icon={<Users size={22} />} label='Network' />
            <TopNavItem icon={<Compass size={22} />} label='Discover' />
            <TopNavItem icon={<Briefcase size={22} />} label='Services' />
          </div>

          {/* Right Actions */}
          <div className='flex items-center space-x-4'>
            {/* Desktop Only Buttons */}
            <div className='hidden md:flex items-center space-x-3'>
              <CreateButton />

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                className='text-gray-300 hover:text-white relative'
              >
                <MessageSquare size={22} />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className='absolute -top-1 -right-1 bg-app-lite text-white text-xs rounded-full h-4 w-4 flex items-center justify-center'
                >
                  5
                </motion.div>
              </motion.button>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                className='text-gray-300 hover:text-white relative'
              >
                <Bell size={22} />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center'
                >
                  3
                </motion.div>
              </motion.button>
            </div>

            {/* Profile Button - both desktop and mobile */}
            <div className='relative'>
              <motion.button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='relative h-10 w-10 rounded-full overflow-hidden border-2 border-app-lite focus:outline-none'
              >
                <img
                  src='https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
                  alt='Profile'
                  className='h-full w-full object-cover'
                />
              </motion.button>
              <ProfileDropdown
                isOpen={isProfileOpen}
                toggleDropdown={() => setIsProfileOpen(!isProfileOpen)}
              />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className='md:hidden text-gray-200 hover:text-app-lite'
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className='md:hidden px-4 pb-3'>
        <SearchBar />
      </div>
    </div>
  )
}

// Left Sidebar Component to Match Screenshot
const LeftSidebar = () => {
  return (
    <div className='bg-app-deep rounded-lg overflow-hidden shadow-md'>
      <div className='py-2'>
        <div className='space-y-1'>
          <SideNavItem icon={<Home size={20} />} label='Home' active />
          <SideNavItem icon={<Compass size={20} />} label='Discover' />
          <SideNavItem icon={<Users size={20} />} label='Network' />
          <SideNavItem icon={<Briefcase size={20} />} label='Services' />
          <SideNavItem icon={<MessageSquare size={20} />} label='Messages' />
          <SideNavItem icon={<Bell size={20} />} label='Notifications' />
          <SideNavItem icon={<Bookmark size={20} />} label='Saved' />
        </div>

        <div className='mt-6 px-3'>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className='w-full bg-app-lite text-white py-2 px-3 rounded-lg font-medium flex items-center justify-center'
          >
            <PlusCircle size={18} className='mr-2' />
            <span>Create</span>
          </motion.button>
        </div>
      </div>
    </div>
  )
}

// Main Layout Component
const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className='min-h-screen bg-app-base text-white'>
      <Topbar toggleMenu={toggleMobileMenu} />

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />

      {/* Main Content with Sidebar */}
      <div className='max-w-7xl mx-auto px-4 py-4'>
        <div className='grid grid-cols-12 gap-4'>
          {/* Left Sidebar */}
          <div className='hidden md:block md:col-span-3 lg:col-span-2'>
            <LeftSidebar />
          </div>

          {/* Main Content */}
          <div className='col-span-12 md:col-span-9 lg:col-span-7'>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </div>

          {/* Right Content - Only visible on large screens - Matches Screenshot */}
          <div className='hidden lg:block lg:col-span-3'>
            <div className='bg-app-deep rounded-lg overflow-hidden shadow-md'>
              <div className='p-4'>
                <h3 className='font-medium text-white text-lg mb-3'>
                  Trending Services
                </h3>
                <div className='space-y-3'>
                  <div className='flex items-center p-2 hover:bg-app-medium/50 rounded-lg transition-colors'>
                    <div className='h-10 w-10 bg-app-medium rounded-lg flex items-center justify-center mr-3 text-app-lite'>
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <p className='text-white'>Web Development</p>
                      <p className='text-xs text-gray-400'>143 providers</p>
                    </div>
                  </div>
                  <div className='flex items-center p-2 hover:bg-app-medium/50 rounded-lg transition-colors'>
                    <div className='h-10 w-10 bg-app-medium rounded-lg flex items-center justify-center mr-3 text-app-lite'>
                      <Users size={20} />
                    </div>
                    <div>
                      <p className='text-white'>Social Media Marketing</p>
                      <p className='text-xs text-gray-400'>98 providers</p>
                    </div>
                  </div>
                  <div className='flex items-center p-2 hover:bg-app-medium/50 rounded-lg transition-colors'>
                    <div className='h-10 w-10 bg-app-medium rounded-lg flex items-center justify-center mr-3 text-app-lite'>
                      <Settings size={20} />
                    </div>
                    <div>
                      <p className='text-white'>IT Support</p>
                      <p className='text-xs text-gray-400'>72 providers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
