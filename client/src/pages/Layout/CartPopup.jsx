import { Checkbox } from '@/components/ui/checkbox'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

const CartPopup = ({
  isOpen,
  onClose,
  cartItems: initialCartItems = [],
  setCartItems,
}) => {
  const [items, setItems] = useState(initialCartItems)
  const popupRef = useRef(null)
  const [showDisclaimerPopup, setShowDisclaimerPopup] = useState(false)
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false)

  // Update internal items when prop changes
  useEffect(() => {
    setItems(initialCartItems)
  }, [initialCartItems])

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        !event.target.closest('.cart-btn')
      ) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  // Handle quantity change
  const updateQuantity = (id, change) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change)
        return { ...item, quantity: newQuantity }
      }
      return item
    })

    setItems(updatedItems)
    if (setCartItems) setCartItems(updatedItems)
  }

  // Handle item removal
  const removeItem = (id) => {
    const updatedItems = items.filter((item) => item.id !== id)
    setItems(updatedItems)
    if (setCartItems) setCartItems(updatedItems)
  }

  // Calculate total price
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  // Calculate total items
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  // Handle Buy on Amazon click
  const handleBuyClick = () => {
    setShowDisclaimerPopup(true)
  }

  // Handle disclaimer confirmation
  const handleConfirmPurchase = () => {
    // Here you would redirect to Amazon with affiliate link
    setShowDisclaimerPopup(false)
    // Proceed with checkout logic
    console.log('Proceeding to Amazon checkout')
    // You could add a redirect here: window.location.href = amazonAffiliateUrl
  }

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

          {/* Cart popup - full height on all devices */}
          <motion.div
            ref={popupRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className='relative h-full w-full max-w-md bg-white shadow-xl flex flex-col z-10 overflow-hidden'
          >
            {/* Header */}
            <div className='flex items-center justify-between px-4 py-3 border-b border-gray-100'>
              <div className='flex items-center'>
                <h2 className='text-base font-semibold'>Your Cart</h2>
                {totalItems > 0 && (
                  <span className='ml-2 px-2 py-0.5 bg-blue-50 text-blue-800 text-xs rounded-full font-medium'>
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className='p-1 rounded-full transition-colors focus:outline-none mr-1 pr-1'
                aria-label='Close cart'
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart items */}
            <div className='flex-1 overflow-y-auto custom-scrollbar'>
              {items.length === 0 ? (
                <div className='flex flex-col items-center justify-center h-full px-4 py-8 text-center'>
                  <div className='bg-gray-50 p-4 rounded-full mb-3'>
                    <ShoppingBag size={24} className='text-gray-400' />
                  </div>
                  <p className='text-gray-900 font-medium text-base mb-1'>
                    Your Cart is Empty
                  </p>
                  <p className='text-gray-500 text-xs mb-4 max-w-xs'>
                    Add items to earn commission when they sell on Amazon.
                  </p>
                  <button className='px-4 py-2 bg-blue-800 text-white text-sm rounded-sm hover:bg-blue-900 transition-colors shadow-sm'>
                    Browse Products
                  </button>
                </div>
              ) : (
                <ul className='divide-y divide-gray-100'>
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className='hover:bg-gray-50 transition-colors h-24 relative'
                    >
                      {/* Trash icon positioned at top right */}
                      <button
                        className='absolute top-2 right-5.5 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors focus:outline-none'
                        onClick={() => removeItem(item.id)}
                        aria-label='Remove item'
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className='px-5 py-3 flex items-center h-full'>
                        <div className='h-18 w-18 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden mr-3 border border-gray-200'>
                          <img
                            src={item.image}
                            alt={item.name}
                            className='h-full w-full object-cover'
                          />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='font-medium text-sm text-gray-900 leading-snug line-clamp-2'>
                            {item.name}
                          </p>
                          <p className='text-xs text-gray-500 mb-2'>
                            {item.seller}
                          </p>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center bg-gray-50 rounded-lg border border-gray-200'>
                              <button
                                className='w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-l-lg transition-colors'
                                onClick={() => updateQuantity(item.id, -1)}
                                disabled={item.quantity <= 1}
                                aria-label='Decrease quantity'
                              >
                                <Minus size={12} />
                              </button>
                              <span className='mx-1 w-5 text-center text-sm font-medium text-gray-800'>
                                {item.quantity}
                              </span>
                              <button
                                className='w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-r-lg transition-colors'
                                onClick={() => updateQuantity(item.id, 1)}
                                aria-label='Increase quantity'
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <span className='font-semibold text-sm text-black'>
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Commission info */}
            {items.length > 0 && (
              <div className='bg-blue-50 px-4 py-3 border-t border-blue-100'>
                <div className='flex items-start'>
                  <AlertCircle
                    size={14}
                    className='text-blue-800 mt-0.5 mr-2 flex-shrink-0'
                  />
                  <p className='text-xs text-blue-800'>
                    You'll earn an estimated{' '}
                    <span className='font-semibold'>
                      ${(totalPrice * 0.05).toFixed(2)}
                    </span>{' '}
                    in commission when these items ship.
                  </p>
                </div>
              </div>
            )}

            {/* Footer with checkout button */}
            {items.length > 0 && (
              <div className='border-t border-gray-200 px-4 py-3 bg-white'>
                <div className='space-y-2 mb-3'>
                  <div className='flex justify-between items-center text-gray-600 text-sm'>
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between items-center text-gray-600 text-sm'>
                    <span>Taxes</span>
                    <span>Calculated at Amazon checkout</span>
                  </div>
                  <div className='flex justify-between items-center font-semibold text-black text-sm'>
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  className='w-full py-2 bg-[#ffd814] text-black text-sm rounded-sm hover:bg-[#f7ca00] transition-colors flex items-center justify-center'
                  onClick={handleBuyClick}
                >
                  Buy on Amazon
                </button>
                <div className='mt-3 flex justify-center'>
                  <button
                    className='text-xs text-gray-500 hover:text-gray-700 transition-colors py-1 px-4 focus:outline-none'
                    onClick={onClose}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}

            {/* Affiliate Disclaimer Popup */}
            <AnimatePresence>
              {showDisclaimerPopup && (
                <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className='absolute inset-0 bg-black'
                    onClick={() => setShowDisclaimerPopup(false)}
                  />

                  {/* Popup */}
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: 'spring', damping: 30, stiffness: 500 }}
                    className='bg-white rounded-lg shadow-xl w-full max-w-md z-10 overflow-hidden'
                  >
                    <div className='p-5'>
                      <div className='flex justify-between items-center mb-4'>
                        <h3 className='text-lg font-semibold text-gray-900'>
                          Affiliate Disclaimer
                        </h3>
                        <button
                          onClick={() => setShowDisclaimerPopup(false)}
                          className='text-black hover:text-gray-500 focus:outline-none'
                        >
                          <X size={20} />
                        </button>
                      </div>

                      <div className='mb-5'>
                        <p className='text-sm text-gray-700 mb-4'>
                          Commissions are usually processed at the end of the
                          following month after a completed sale and takes a
                          minimum of 60 days. Returns aren't commission
                          eligible.
                        </p>

                        <div className='flex items-center mt-4'>
                          <label className='flex items-center cursor-pointer'>
                            <Checkbox
                              id='terms'
                              name='agreeTerms'
                              className='data-[state=checked]:bg-white border-gray-300 h-6 w-6 flex items-center justify-center data-[state=checked]:[&>span]:text-black data-[state=checked]:[&>span]:visible [&>span]:text-black'
                              onCheckedChange={(checked) =>
                                setDisclaimerAccepted(checked)
                              }
                            />
                            <span className='ml-2 text-sm text-gray-600'>
                              I understand and agree to the affiliate terms
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className='flex justify-end space-x-3'>
                        <button
                          onClick={() => setShowDisclaimerPopup(false)}
                          className='px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-sm transition-colors'
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleConfirmPurchase}
                          disabled={!disclaimerAccepted}
                          className={`px-4 py-2 text-sm text-black rounded-sm transition-colors ${
                            disclaimerAccepted
                              ? 'bg-[#ffd814] hover:bg-[#ffd814d2]'
                              : 'bg-gray-200 cursor-not-allowed text-gray-500'
                          }`}
                        >
                          Proceed to Amazon
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default CartPopup
