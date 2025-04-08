import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  FileVideo,
  Hash,
  Image,
  ImagePlus,
  Plus,
  Upload,
  X,
  XCircle,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

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

const MediaUploadPopup = ({ isOpen, onClose }) => {
  // Input classes from AuthPage for consistent styling
  const inputClass =
    'border border-gray-300 hover:border-2 hover:border-black text-black focus:outline-none focus:ring-0 focus:border-black focus:border-2 rounded-sm placeholder:text-black focus:placeholder:text-black'
  const textareaClass =
    'border border-gray-300 hover:border-2 hover:border-black text-black focus:outline-none focus:ring-0 focus:border-black focus:border-2 rounded-sm placeholder:text-black focus:placeholder:text-black resize-none'

  // State for form fields
  const [formData, setFormData] = useState({
    brandName: '',
    productName: '',
    description: '',
    amazonUrl: '',
    productPrice: '',
    tags: [],
  })

  // State for media upload
  const [mediaFile, setMediaFile] = useState(null)
  const [mediaPreview, setMediaPreview] = useState(null)
  const [mediaType, setMediaType] = useState(null) // 'image' or 'video'
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [newTag, setNewTag] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const [tagInputFocused, setTagInputFocused] = useState(false)
  const [filteredCategories, setFilteredCategories] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const fileInputRef = useRef(null)
  const thumbnailInputRef = useRef(null)
  const tagInputRef = useRef(null)
  const suggestionsRef = useRef(null)

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle Amazon URL validation on blur
  const handleAmazonUrlBlur = (e) => {
    const value = e.target.value
    if (value && !value.toLowerCase().includes('amazon.com')) {
      setError('Please enter a valid Amazon URL')
    } else if (error === 'Please enter a valid Amazon URL') {
      // Only clear the error message if it's the Amazon URL error
      setError('')
    }
  }

  // Handle media file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const fileType = file.type.split('/')[0]
    if (fileType !== 'image' && fileType !== 'video') {
      setError('Please select an image or video file')
      return
    }

    setMediaFile(file)
    setMediaType(fileType)
    setError('')

    // If switching from video to image, clear thumbnail
    if (fileType === 'image' && thumbnailFile) {
      setThumbnailFile(null)
      setThumbnailPreview(null)
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setMediaPreview(previewUrl)
  }

  // Handle thumbnail file selection
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const fileType = file.type.split('/')[0]
    if (fileType !== 'image') {
      setError('Please select an image file for the thumbnail')
      return
    }

    // Check file size (max 1MB)
    if (file.size > 1024 * 1024) {
      setError('Thumbnail image must be less than 1MB')
      setThumbnailFile(null)
      setThumbnailPreview(null)

      // Reset file input
      if (thumbnailInputRef.current) {
        thumbnailInputRef.current.value = ''
      }
      return
    }

    setThumbnailFile(file)
    setError('')

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setThumbnailPreview(previewUrl)
  }

  // Handle tag input change
  const handleTagInputChange = (e) => {
    const value = e.target.value
    setNewTag(value)

    if (value.trim() === '') {
      setFilteredCategories([])
      setShowSuggestions(false)
    } else {
      // Filter categories that match the input and aren't already selected
      const filtered = popularCategories
        .filter(
          (category) =>
            category.toLowerCase().includes(value.toLowerCase()) &&
            !formData.tags.includes(category)
        )
        .slice(0, 5) // Limit to 5 suggestions

      setFilteredCategories(filtered)
      setShowSuggestions(true)
    }
  }

  // Handle category selection
  const handleCategorySelect = (category) => {
    if (formData.tags.length < 7 && !formData.tags.includes(category)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, category],
      })
    }
    setNewTag('')
    setFilteredCategories([])
    setShowSuggestions(false)
    if (tagInputRef.current) {
      tagInputRef.current.focus()
    }
  }

  // Handle tag removal
  const handleRemoveTag = (index) => {
    const updatedTags = [...formData.tags]
    updatedTags.splice(index, 1)

    setFormData({
      ...formData,
      tags: updatedTags,
    })
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate required fields
    if (!mediaFile) {
      setError('Please upload a media file')
      return
    }

    // If it's a video, require a thumbnail
    if (mediaType === 'video' && !thumbnailFile) {
      setError('Please upload a thumbnail image for your video')
      return
    }

    if (
      !formData.brandName ||
      !formData.productName ||
      !formData.description ||
      !formData.amazonUrl ||
      !formData.productPrice
    ) {
      setError('Please fill in all required fields')
      return
    }

    // Validate Amazon URL
    if (!formData.amazonUrl.toLowerCase().includes('amazon.com')) {
      setError('Please enter a valid Amazon URL')
      return
    }

    // Validate price format
    const priceRegex = /^\d+(\.\d{1,2})?$/
    if (!priceRegex.test(formData.productPrice)) {
      setError('Please enter a valid price format (e.g., 19.99)')
      return
    }

    // Handle form submission logic here
    console.log('Form Data:', formData)
    console.log('Media File:', mediaFile)
    if (thumbnailFile) {
      console.log('Thumbnail File:', thumbnailFile)
    }

    // Close the popup after submission
    onClose()
  }

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current.click()
  }

  // Remove uploaded media
  const handleRemoveMedia = () => {
    setMediaFile(null)
    setMediaPreview(null)
    setMediaType(null)

    // Also clear thumbnail when main media is removed
    setThumbnailFile(null)
    setThumbnailPreview(null)

    // Reset file inputs
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = ''
    }
  }

  // Remove uploaded thumbnail
  const handleRemoveThumbnail = () => {
    setThumbnailFile(null)
    setThumbnailPreview(null)

    // Reset file input
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = ''
    }
  }

  // Trigger thumbnail input click
  const handleThumbnailUploadClick = () => {
    thumbnailInputRef.current.click()
  }

  // Handle key press for adding tags
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()

      if (filteredCategories.length > 0) {
        // Select the first suggestion when Enter is pressed
        handleCategorySelect(filteredCategories[0])
      }
    } else if (e.key === 'ArrowDown' && filteredCategories.length > 0) {
      // Navigate to suggestions with arrow keys
      e.preventDefault()
      const firstSuggestion = document.querySelector('.category-suggestion')
      if (firstSuggestion) {
        firstSuggestion.focus()
      }
    }
  }

  // Handle keyboard navigation in suggestions
  const handleSuggestionKeyDown = (e, category, index) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleCategorySelect(category)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const nextSuggestion = document.querySelectorAll('.category-suggestion')[
        index + 1
      ]
      if (nextSuggestion) {
        nextSuggestion.focus()
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (index === 0) {
        // Move focus back to input if at first suggestion
        if (tagInputRef.current) {
          tagInputRef.current.focus()
        }
      } else {
        const prevSuggestion = document.querySelectorAll(
          '.category-suggestion'
        )[index - 1]
        if (prevSuggestion) {
          prevSuggestion.focus()
        }
      }
    }
  }

  // Add click outside listener to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        tagInputRef.current &&
        !tagInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (!file) return

    const fileType = file.type.split('/')[0]
    if (fileType !== 'image' && fileType !== 'video') {
      setError('Please select an image or video file')
      return
    }

    setMediaFile(file)
    setMediaType(fileType)
    setError('')

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setMediaPreview(previewUrl)
  }

  if (!isOpen) return null

  // Tags section component - moved outside to be positioned properly
  const TagsSection = () => (
    <div>
      <Label className='mb-1 block text-xs sm:text-sm flex items-center'>
        <Hash size={14} className='mr-1 text-gray-500 sm:hidden' />
        <Hash size={16} className='mr-1 text-gray-500 hidden sm:block' />
        Tags{' '}
      </Label>

      {/* Tag Input Field - Updated to match other inputs with fixed padding */}
      <div className='relative'>
        <div
          className={`flex items-center mt-1 ${inputClass} h-auto min-h-8 sm:min-h-10 px-3`}
        >
          <div className='flex flex-wrap gap-2 flex-1 py-1'>
            <AnimatePresence>
              {formData.tags.map((tag, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    transition: { duration: 0.15 },
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 20,
                  }}
                >
                  <Badge
                    variant='secondary'
                    className='flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200 text-xs'
                  >
                    <span>{tag}</span>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='h-4 w-4 p-0 ml-1 text-gray-500 hover:text-gray-700 hover:bg-transparent rounded-full'
                      onClick={() => handleRemoveTag(index)}
                    >
                      <X size={10} />
                    </Button>
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Only show input if we haven't reached the max tags */}
            {formData.tags.length < 7 && (
              <input
                ref={tagInputRef}
                type='text'
                value={newTag}
                onChange={handleTagInputChange}
                onKeyDown={handleTagKeyPress}
                onFocus={() => {
                  setTagInputFocused(true)
                  if (newTag.trim()) {
                    setShowSuggestions(true)
                  }
                }}
                onBlur={() => setTagInputFocused(false)}
                maxLength={20}
                className='flex-1 min-w-20 border-none focus:outline-none focus:ring-0 text-xs sm:text-sm p-0 m-0 h-6 bg-transparent leading-normal'
                placeholder={
                  formData.tags.length === 0
                    ? 'Search for a category...'
                    : 'Add another category...'
                }
                style={{ lineHeight: '1.5rem' }}
              />
            )}
          </div>
        </div>

        {/* Category Suggestions Dropdown - Improved styling */}
        {showSuggestions && filteredCategories.length > 0 && (
          <div
            ref={suggestionsRef}
            className='absolute z-10 mt-1 w-full max-w-full bg-white shadow-md max-h-48 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm border border-gray-200'
          >
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category, index) => (
                <button
                  key={index}
                  className='category-suggestion text-left w-full px-4 py-1.5 text-xs sm:text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors duration-150'
                  onClick={() => handleCategorySelect(category)}
                  onKeyDown={(e) => handleSuggestionKeyDown(e, category, index)}
                  tabIndex={0}
                >
                  {category}
                </button>
              ))
            ) : (
              <div className='px-4 py-2 text-xs sm:text-sm text-gray-500'>
                No matching categories
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tag counter */}
      <div className='flex justify-between'>
        <p className='text-xs text-gray-500 mt-1'>
          Select from preset categories only
        </p>
        <p
          className={`text-xs mt-1 ${
            formData.tags.length >= 5
              ? 'text-blue-800 font-medium'
              : formData.tags.length >= 7
              ? 'text-amber-600'
              : 'text-gray-500'
          }`}
        >
          {formData.tags.length}/7 categories
        </p>
      </div>
    </div>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - darker black background */}
          <motion.div
            className='fixed inset-0 bg-black/60 z-40'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Popup - fullscreen on mobile, centered on desktop */}
          <motion.div
            className='fixed inset-0 z-50 flex items-start sm:items-center justify-center p-0 sm:p-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className='bg-white w-full h-full sm:h-auto sm:rounded-lg sm:shadow-xl sm:w-full sm:max-w-4xl relative flex flex-col max-h-screen sm:max-h-[calc(100vh-32px)] overflow-hidden'
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - smaller text on mobile, fullwidth style */}
              <div className='flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-100'>
                <h2 className='text-base sm:text-xl font-semibold text-gray-800'>
                  Create New Post
                </h2>
                {/* Updated close button to match sidebar close button */}
                <button className='focus:outline-none' onClick={onClose}>
                  <X size={20} />
                </button>
              </div>

              {/* Error message - updated to stay within boundaries */}
              {error && (
                <div className='mx-4 mt-4 bg-red-50 text-red-800 border border-red-200 rounded-md px-3 py-2 flex items-center text-sm'>
                  <AlertCircle className='h-4 w-4 mr-2 flex-shrink-0' />
                  <div className='flex-1 text-xs sm:text-sm'>{error}</div>
                  <button
                    onClick={() => setError('')}
                    className='ml-2 text-gray-500 hover:text-gray-700 flex-shrink-0'
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Form - Mobile fullscreen layout */}
              <div className='p-4 overflow-y-auto custom-scrollbar flex-grow'>
                <div className='flex flex-col lg:grid lg:grid-cols-2 gap-0 sm:gap-6'>
                  {/* Media Upload Column */}
                  <div className='lg:order-1 order-1 mb-4 sm:mb-0'>
                    <Label className='mb-1 sm:mb-2 block text-xs sm:text-sm'>
                      Upload Media <span className='text-red-500'>*</span>
                    </Label>

                    {!mediaPreview ? (
                      <div
                        className={`border-2 ${
                          isDragging
                            ? 'border-blue-800 bg-blue-50'
                            : 'border-gray-200'
                        } border-dashed rounded-lg p-3 sm:p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-800 transition-colors h-40 sm:h-56`}
                        onClick={handleUploadClick}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      >
                        <div className='mb-2 sm:mb-3 flex space-x-2'>
                          <Image size={24} className='text-gray-400' />
                          <FileVideo size={24} className='text-gray-400' />
                        </div>
                        <p className='text-gray-700 font-medium text-center mb-1 text-sm sm:text-base'>
                          Drag and drop or click to upload
                        </p>
                        <p className='text-gray-400 text-xs text-center'>
                          Supported formats: JPG, PNG, MP4, MOV
                        </p>
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className='mt-3 sm:mt-4'
                        >
                          <Button
                            type='button'
                            className='bg-blue-800 hover:bg-blue-900 text-xs sm:text-sm h-8 sm:h-10'
                          >
                            Select File
                          </Button>
                        </motion.div>
                        <input
                          type='file'
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept='image/*,video/*'
                          className='hidden'
                        />
                      </div>
                    ) : (
                      <div className='space-y-4'>
                        <div className='relative rounded-lg overflow-hidden border border-gray-200 h-40 sm:h-56'>
                          {mediaType === 'image' ? (
                            <img
                              src={mediaPreview}
                              alt='Preview'
                              className='w-full h-full object-cover'
                            />
                          ) : (
                            <video
                              src={mediaPreview}
                              controls
                              className='w-full h-full object-cover'
                            />
                          )}
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            onClick={handleRemoveMedia}
                            className='absolute top-2 right-2 bg-white/80 rounded-full h-7 w-7 sm:h-8 sm:w-8 p-1.5 hover:bg-white'
                          >
                            <XCircle size={16} className='sm:hidden' />
                            <XCircle size={18} className='hidden sm:block' />
                          </Button>
                          <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2'>
                            <p className='text-white text-xs'>
                              {mediaFile?.name} (
                              {(mediaFile?.size / (1024 * 1024)).toFixed(2)} MB)
                            </p>
                          </div>
                        </div>

                        {/* Thumbnail uploader - only show for video uploads */}
                        {mediaType === 'video' && (
                          <div className='border-t border-gray-100 pt-2'>
                            <Label className='mb-1 block text-xs sm:text-sm'>
                              Upload Thumbnail{' '}
                              <span className='text-red-500'>*</span>
                              <span className='text-xs text-gray-500 ml-1'>
                                (max 1MB)
                              </span>
                            </Label>

                            {!thumbnailPreview ? (
                              <div
                                className='border-2 border-gray-200 border-dashed rounded-lg p-2 sm:p-3 flex flex-col items-center justify-center cursor-pointer hover:border-blue-800 transition-colors'
                                onClick={handleThumbnailUploadClick}
                              >
                                <div className='flex items-center justify-center gap-2'>
                                  <ImagePlus
                                    size={16}
                                    className='text-gray-400'
                                  />
                                  <p className='text-gray-700 text-xs sm:text-sm'>
                                    Upload a thumbnail for your video
                                  </p>
                                </div>
                                <motion.div className='mt-2'>
                                  <Button
                                    type='button'
                                    size='sm'
                                    variant='outline'
                                    className='border-blue-800 text-blue-800 hover:bg-blue-50 text-xs h-6 sm:h-7 py-0'
                                  >
                                    Select Image
                                  </Button>
                                </motion.div>
                                <input
                                  type='file'
                                  ref={thumbnailInputRef}
                                  onChange={handleThumbnailChange}
                                  accept='image/*'
                                  className='hidden'
                                />
                              </div>
                            ) : (
                              <div className='relative rounded-lg overflow-hidden border border-gray-200 h-16 sm:h-20'>
                                <img
                                  src={thumbnailPreview}
                                  alt='Thumbnail Preview'
                                  className='w-full h-full object-cover'
                                />
                                <Button
                                  type='button'
                                  variant='ghost'
                                  size='icon'
                                  onClick={handleRemoveThumbnail}
                                  className='absolute top-1 right-1 bg-white/80 rounded-full h-5 w-5 sm:h-6 sm:w-6 p-1 hover:bg-white'
                                >
                                  <XCircle
                                    size={12}
                                    className='text-gray-700 sm:hidden'
                                  />
                                  <XCircle
                                    size={14}
                                    className='text-gray-700 hidden sm:block'
                                  />
                                </Button>
                                <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1'>
                                  <p className='text-white text-xs'>
                                    {(
                                      thumbnailFile?.size /
                                      (1024 * 1024)
                                    ).toFixed(2)}{' '}
                                    MB
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tags moved to its own section, shown on desktop only */}
                    <div className='hidden lg:block mt-4'>
                      <TagsSection />
                    </div>
                  </div>

                  {/* Product Info Column */}
                  <div className='lg:order-2 order-2'>
                    {/* Brand Name */}
                    <div className='mb-4'>
                      <Label className='mb-1 block text-xs sm:text-sm'>
                        Brand Name <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        type='text'
                        name='brandName'
                        value={formData.brandName}
                        onChange={handleInputChange}
                        maxLength={50}
                        className={
                          inputClass + ' text-xs sm:text-sm h-8 sm:h-10'
                        }
                        placeholder='Enter brand name'
                        required
                      />
                      <div className='flex justify-end'>
                        <p className='text-xs text-gray-500 mt-1'>
                          {formData.brandName.length}/50
                        </p>
                      </div>
                    </div>

                    {/* Product Name */}
                    <div className='mb-4'>
                      <Label className='mb-1 block text-xs sm:text-sm'>
                        Product Name <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        type='text'
                        name='productName'
                        value={formData.productName}
                        onChange={handleInputChange}
                        maxLength={60}
                        className={
                          inputClass + ' text-xs sm:text-sm h-8 sm:h-10'
                        }
                        placeholder='Enter product name'
                        required
                      />
                      <div className='flex justify-end'>
                        <p className='text-xs text-gray-500 mt-1'>
                          {formData.productName.length}/60
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className='mb-4'>
                      <Label className='mb-1 block text-xs sm:text-sm'>
                        Description <span className='text-red-500'>*</span>
                      </Label>
                      <Textarea
                        name='description'
                        value={formData.description}
                        onChange={handleInputChange}
                        maxLength={200}
                        rows={3}
                        className={textareaClass + ' text-xs sm:text-sm'}
                        placeholder='Enter product description'
                        required
                      />
                      <div className='flex justify-end'>
                        <p className='text-xs text-gray-500 mt-1'>
                          {formData.description.length}/200
                        </p>
                      </div>
                    </div>

                    {/* Amazon Product URL */}
                    <div className='mb-4'>
                      <Label className='mb-1 block text-xs sm:text-sm'>
                        Amazon Product URL{' '}
                        <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        type='url'
                        name='amazonUrl'
                        value={formData.amazonUrl}
                        onChange={handleInputChange}
                        onBlur={handleAmazonUrlBlur}
                        className={
                          inputClass + ' text-xs sm:text-sm h-8 sm:h-10'
                        }
                        placeholder='https://www.amazon.com/...'
                        required
                      />
                    </div>

                    {/* Product Price */}
                    <div className='mb-4 pt-3'>
                      <Label className='mb-1 block text-xs sm:text-sm'>
                        Product Price <span className='text-red-500'>*</span>
                      </Label>
                      <div className='relative'>
                        <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-gray-700 z-10 text-xs sm:text-sm'>
                          $
                        </span>
                        <Input
                          type='text'
                          name='productPrice'
                          value={formData.productPrice}
                          onChange={handleInputChange}
                          maxLength={10}
                          className={`pl-7 ${inputClass} text-xs sm:text-sm h-8 sm:h-10`}
                          placeholder='0.00'
                          pattern='^\d+(\.\d{1,2})?$'
                          required
                        />
                      </div>
                      <p className='text-xs text-gray-500 mt-1'>
                        Example: 19.99
                      </p>
                    </div>
                  </div>

                  {/* Tags section for mobile view - at the end */}
                  <div className='lg:hidden order-3 pt-4 mt-0'>
                    <TagsSection />
                  </div>
                </div>
              </div>

              {/* Footer - smaller buttons on mobile */}
              <div className='px-3 sm:px-6 py-2 sm:py-4 border-t border-gray-100 flex justify-end gap-2 sm:gap-3 flex-shrink-0'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={onClose}
                  className='px-3 sm:px-4 text-xs sm:text-sm h-8 sm:h-10'
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  onClick={handleSubmit}
                  className='px-3 sm:px-4 bg-blue-800 hover:bg-blue-900 text-xs sm:text-sm h-8 sm:h-10'
                >
                  Create Post
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MediaUploadPopup
