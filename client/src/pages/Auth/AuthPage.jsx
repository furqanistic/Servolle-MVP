import ForgotPasswordFlow from '@/components/Auth/ForgotPasswordFlow'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Building, Eye, EyeOff, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const AuthPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('signup')
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  // Form states
  const [signupForm, setSignupForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    isBusinessAccount: null,
    agreeTerms: false,
  })

  // Error states
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: '',
    accountType: '',
  })

  // Touch tracking (to only show errors after user interaction)
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
    agreeTerms: false,
    accountType: false,
  })

  // Set initial active tab based on URL path
  useEffect(() => {
    const path = window.location.pathname
    if (path === '/login') {
      setActiveTab('login')
    } else if (path === '/signup') {
      setActiveTab('signup')
    }
  }, [])

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const inputValue = type === 'checkbox' ? checked : value

    setSignupForm((prev) => ({
      ...prev,
      [name]: inputValue,
    }))

    // Mark field as touched
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))

    // Validate field
    validateField(name, inputValue)
  }

  // Validate individual field
  const validateField = (name, value) => {
    let errorMsg = ''

    switch (name) {
      case 'fullName':
        if (!value || !value.trim()) {
          errorMsg = 'Please enter your full name'
        }
        break
      case 'email':
        if (!value || !value.trim()) {
          errorMsg = 'Please enter your email address'
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errorMsg = 'Please enter a valid email address'
        }
        break
      case 'password':
        if (!value) {
          errorMsg = 'Please create a password'
        } else if (value.length < 8) {
          errorMsg = 'Your password must be at least 8 characters'
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          errorMsg =
            'Include at least 1 uppercase letter, 1 lowercase letter, and 1 number'
        }

        // Also validate confirm password if needed
        if (signupForm.confirmPassword && touched.confirmPassword) {
          if (value !== signupForm.confirmPassword) {
            setErrors((prev) => ({
              ...prev,
              confirmPassword: 'The passwords you entered do not match',
            }))
          } else {
            setErrors((prev) => ({
              ...prev,
              confirmPassword: '',
            }))
          }
        }
        break
      case 'confirmPassword':
        if (!value) {
          errorMsg = 'Please confirm your password'
        } else if (value !== signupForm.password) {
          errorMsg = 'The passwords you entered do not match'
        }
        break
      case 'agreeTerms':
        if (!value) {
          errorMsg = 'You must agree to the terms to continue'
        }
        break
      default:
        break
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }))

    return !errorMsg
  }

  // Toggle business account
  const toggleBusinessAccount = (value) => {
    setSignupForm((prev) => ({
      ...prev,
      isBusinessAccount: value,
    }))

    // Mark the field as touched when selection is made
    setTouched((prev) => ({
      ...prev,
      accountType: true,
    }))

    // Clear any error message
    setErrors((prev) => ({
      ...prev,
      accountType: '',
    }))
  }

  // Validate all fields
  const validateForm = () => {
    let isValid = true
    const newTouched = {}

    // Mark all fields as touched
    Object.keys(signupForm).forEach((key) => {
      if (key !== 'isBusinessAccount') {
        newTouched[key] = true
      }
    })
    newTouched.accountType = true // Mark account type as touched

    setTouched((prev) => ({
      ...prev,
      ...newTouched,
    }))

    // Validate each field
    Object.keys(signupForm).forEach((key) => {
      if (key !== 'isBusinessAccount') {
        const fieldIsValid = validateField(key, signupForm[key])
        if (!fieldIsValid) {
          isValid = false
        }
      }
    })

    // Validate account type selection
    if (signupForm.isBusinessAccount === null) {
      setErrors((prev) => ({
        ...prev,
        accountType: 'Please select an account type',
      }))
      isValid = false
    }

    return isValid
  }

  // Handle form submission
  const handleSignup = (e) => {
    if (e) e.preventDefault()

    if (validateForm()) {
      // Proceed with signup logic
      console.log('Form is valid, submitting:', signupForm)
      // Here you would typically call your API
      alert('Account created successfully!')
      // Reset form or redirect
    }
  }

  // Handle forgot password click
  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true)
  }

  // Handle back to login from forgot password flow
  const handleBackToLogin = () => {
    setShowForgotPassword(false)
    setActiveTab('login')
  }

  // Common input class for consistent styling - only focus border updated
  const inputClass =
    'border border-gray-300 hover:border-2 hover:border-black text-black focus:outline-none focus:ring-0 focus:border-black focus:border-2 rounded-sm placeholder:text-black focus:placeholder:text-black'

  // Consistent button styling to match input fields
  const passwordInputClass =
    'pr-10 border border-gray-300 hover:border-2 hover:border-black text-black focus:outline-none focus:ring-0 focus:border-black focus:border-2 rounded-sm placeholder:text-gray-400 focus:placeholder:text-black'

  // Consistent button styling to match input fields
  const buttonClass =
    'w-full bg-black hover:bg-gray-800 transition-all duration-300 text-white font-medium text-base rounded-sm shadow-none mt-0'

  return (
    <div className='min-h-screen flex flex-col justify-between p-3 pb-4 overflow-x-hidden max-w-full'>
      {/* Content container */}
      <div className='flex flex-col flex-grow'>
        {/* Logo - Regular positioning on mobile, absolute on desktop */}
        <div className='relative w-full text-center mb-4 mt-2 sm:absolute sm:top-5 sm:left-5 sm:w-auto sm:mb-0 sm:text-left'>
          <img
            src='/Logo.svg'
            alt='Qalani Logo'
            width='180'
            height='60'
            className='max-w-full h-auto inline-block'
          />
        </div>

        {/* Single Tagline Section - Proper Responsive Handling */}
        <div className='w-full mx-auto text-center px-2 mb-0'>
          <p className='text-gray-400 font-montserrat my-0 font-bold'>
            {/* Mobile Version - Block on small screens, hidden on medium+ */}
            <span className='block sm:hidden text-3xl tracking-tight'>
              Amazon-Focused
              <span
                className='block'
                style={{ lineHeight: '1', marginTop: '-2px' }}
              >
                Social Commerce
              </span>
            </span>
            {/* Desktop Version - Hidden on small screens, block on medium+ */}
            <span
              className='hidden sm:block sm:mt-4 tracking-wide'
              style={{ fontSize: '2.6rem', lineHeight: '1.2' }}
            >
              Amazon-Focused
              <br />
              Social Commerce
            </span>
          </p>
        </div>
        {/* NO SECOND TAGLINE HERE - REMOVED DUPLICATE */}

        {/* Auth forms section - with consistent spacing on mobile */}
        <div className='flex items-start justify-center mb-auto mt-2'>
          <div className='w-full max-w-md'>
            {!showForgotPassword ? (
              <>
                {/* Tabs - consistent margin for mobile */}
                <div className='mx-auto mb-0 sm:mb-2 rounded-full bg-white p-1.5 max-w-xs overflow-hidden'>
                  <div className='relative grid grid-cols-2 gap-3 h-11 rounded-full'>
                    {/* Active Tab Indicator - Positioned absolutely */}
                    <div
                      className='absolute h-9 rounded-full bg-black transition-transform duration-300 ease-in-out transform w-[calc(50%-10px)]'
                      style={{
                        top: '4px',
                        left: '5px',
                        transform:
                          activeTab === 'signup'
                            ? 'translateX(0)'
                            : 'translateX(calc(100% + 10px))',
                      }}
                    />
                    {/* Buttons - These define clickable areas */}
                    <button
                      onClick={() => setActiveTab('signup')}
                      className={`relative z-10 py-2 px-4 font-medium transition-colors duration-300 rounded-full ${
                        activeTab === 'signup' ? 'text-white' : 'text-black'
                      }`}
                    >
                      Sign Up
                    </button>
                    <button
                      onClick={() => setActiveTab('login')}
                      className={`relative z-10 py-2 px-4 font-medium transition-colors duration-300 rounded-full ${
                        activeTab === 'login' ? 'text-white' : 'text-black'
                      }`}
                    >
                      Log In
                    </button>
                  </div>
                </div>

                {/* Form Content - with both tabs having the same height and eliminated top margin on mobile */}
                <div className='relative w-full sm:mt-0'>
                  {/* Login Content */}
                  <div
                    className={`transition-opacity duration-300 ${
                      activeTab === 'login'
                        ? 'opacity-100 z-10'
                        : 'opacity-0 z-0 absolute w-full pointer-events-none'
                    }`}
                    style={{ minHeight: '380px' }}
                  >
                    <Card className='rounded-xl overflow-hidden max-w-full border-0 shadow-none '>
                      <CardContent className='pt-3 sm:pt-6 px-4  sm:px-6 pb-0'>
                        <form onSubmit={(e) => e.preventDefault()}>
                          <div className='space-y-3 mt-6  sm:mt-1'>
                            <div className='space-y-1 '>
                              <Label
                                htmlFor='email'
                                className='text-black font-medium text-sm'
                              >
                                Email
                              </Label>
                              <Input id='email' className={inputClass} />
                            </div>
                            <div className='space-y-1'>
                              <div className='flex justify-between'>
                                <Label
                                  htmlFor='password'
                                  className='text-black font-medium text-sm'
                                >
                                  Password
                                </Label>
                                <a
                                  href='#'
                                  className='text-xs text-gray-500 hover:text-black transition-colors font-medium'
                                  onClick={(e) => {
                                    e.preventDefault()
                                    handleForgotPasswordClick()
                                  }}
                                >
                                  Forgot password?
                                </a>
                              </div>
                              <div className='relative'>
                                <Input
                                  id='password'
                                  type={showPassword ? 'text' : 'password'}
                                  className={passwordInputClass}
                                />
                                <button
                                  type='button'
                                  className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-black hover:text-black'
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className='h-4 w-4' />
                                  ) : (
                                    <Eye className='h-4 w-4' />
                                  )}
                                </button>
                              </div>
                            </div>

                            <div className='flex items-center space-x-2 mt-1'>
                              <Checkbox
                                id='remember'
                                className='data-[state=checked]:bg-white border-gray-300 h-6 w-6 flex items-center justify-center data-[state=checked]:[&>span]:text-black data-[state=checked]:[&>span]:visible [&>span]:text-black'
                              />
                              <label
                                htmlFor='remember'
                                className='text-sm font-medium leading-none text-gray-500 cursor-pointer'
                              >
                                Remember me
                              </label>
                            </div>
                          </div>
                        </form>
                      </CardContent>
                      <CardFooter className='pb-1 px-4 sm:px-6'>
                        <Button
                          className={buttonClass}
                          onClick={() => (window.location.href = '/')}
                        >
                          Log In
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>

                  {/* Sign Up Content */}
                  <div
                    className={`transition-opacity duration-300 ${
                      activeTab === 'signup'
                        ? 'opacity-100 z-10'
                        : 'opacity-0 z-0 absolute top-0 left-0 w-full pointer-events-none'
                    }`}
                    style={{ minHeight: '380px' }}
                  >
                    <Card className='rounded-xl overflow-hidden border-0 shadow-none mt-0'>
                      <CardContent className='px-4 sm:px-6 pt-3 sm:pt-6 pb-0'>
                        <form onSubmit={handleSignup}>
                          <div className='space-y-2 mt-6 sm:mt-1'>
                            {/* Account Type Selection - Precisely aligned with login form */}
                            <div className='space-y-1'>
                              <Label
                                htmlFor='accountType'
                                className='text-black font-medium text-sm'
                              >
                                Account Type
                              </Label>
                              <div className='grid grid-cols-2 gap-3 mx-auto'>
                                {/* Individual Account Option */}
                                <div
                                  className={`relative overflow-hidden rounded-sm cursor-pointer ${
                                    signupForm.isBusinessAccount === false
                                      ? 'ring-0 border-2 border-black'
                                      : 'border border-gray-300 hover:border-2 hover:border-black'
                                  } group`}
                                  onClick={() => toggleBusinessAccount(false)}
                                >
                                  <div className='p-2'>
                                    <div className='flex flex-col items-center text-center space-y-1'>
                                      <div
                                        className={`p-2 rounded-full transition-colors ${
                                          signupForm.isBusinessAccount === false
                                            ? 'bg-black'
                                            : 'bg-gray-100 group-hover:bg-black'
                                        }`}
                                      >
                                        <User
                                          className={`h-4 w-4 ${
                                            signupForm.isBusinessAccount ===
                                            false
                                              ? 'text-white'
                                              : 'text-black group-hover:text-white'
                                          } transition-colors`}
                                        />
                                      </div>
                                      <div>
                                        <h3 className='font-medium text-sm text-black'>
                                          Individual
                                        </h3>
                                        <p className='text-xs text-gray-500'>
                                          Personal use
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Business Account Option */}
                                <div
                                  className={`relative overflow-hidden rounded-sm cursor-pointer ${
                                    signupForm.isBusinessAccount === true
                                      ? 'ring-0 border-2 border-black'
                                      : 'border border-gray-300 hover:border-2 hover:border-black'
                                  } group`}
                                  onClick={() => toggleBusinessAccount(true)}
                                >
                                  <div className='p-2'>
                                    <div className='flex flex-col items-center text-center space-y-1'>
                                      <div
                                        className={`p-2 rounded-full transition-colors ${
                                          signupForm.isBusinessAccount === true
                                            ? 'bg-black'
                                            : 'bg-gray-100 group-hover:bg-black'
                                        }`}
                                      >
                                        <Building
                                          className={`h-4 w-4 ${
                                            signupForm.isBusinessAccount ===
                                            true
                                              ? 'text-white'
                                              : 'text-black group-hover:text-white'
                                          } transition-colors`}
                                        />
                                      </div>
                                      <div>
                                        <h3 className='font-medium text-sm text-black'>
                                          Business
                                        </h3>
                                        <p className='text-xs text-gray-500'>
                                          Professional use
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {touched.accountType && errors.accountType && (
                                <p className='text-red-500 text-xs mt-1'>
                                  {errors.accountType}
                                </p>
                              )}
                            </div>

                            {/* Full Name field - Reduced spacing */}
                            <div className='space-y-1'>
                              <Label
                                htmlFor='fullName'
                                className='text-black font-medium text-sm'
                              >
                                Full Name
                              </Label>
                              <Input
                                id='fullName'
                                name='fullName'
                                value={signupForm.fullName}
                                onChange={handleInputChange}
                                className={inputClass}
                              />
                              {touched.fullName && errors.fullName && (
                                <p className='text-red-500 text-xs'>
                                  {errors.fullName}
                                </p>
                              )}
                            </div>

                            <div className='space-y-1'>
                              <Label
                                htmlFor='signupEmail'
                                className='text-black font-medium text-sm'
                              >
                                Email
                              </Label>
                              <Input
                                id='signupEmail'
                                name='email'
                                value={signupForm.email}
                                onChange={handleInputChange}
                                className={inputClass}
                              />
                              {touched.email && errors.email && (
                                <p className='text-red-500 text-xs'>
                                  {errors.email}
                                </p>
                              )}
                            </div>
                            <div className='space-y-1'>
                              <Label
                                htmlFor='signupPassword'
                                className='text-black font-medium text-sm'
                              >
                                Password
                              </Label>
                              <div className='relative'>
                                <Input
                                  id='signupPassword'
                                  name='password'
                                  value={signupForm.password}
                                  onChange={handleInputChange}
                                  type={showPassword ? 'text' : 'password'}
                                  className={passwordInputClass}
                                />
                                <button
                                  type='button'
                                  className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-black hover:text-black'
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className='h-4 w-4' />
                                  ) : (
                                    <Eye className='h-4 w-4' />
                                  )}
                                </button>
                              </div>
                              {touched.password && errors.password && (
                                <p className='text-red-500 text-xs'>
                                  {errors.password}
                                </p>
                              )}
                            </div>
                            <div className='space-y-1'>
                              <Label
                                htmlFor='confirmPassword'
                                className='text-black font-medium text-sm'
                              >
                                Confirm Password
                              </Label>
                              <div className='relative'>
                                <Input
                                  id='confirmPassword'
                                  name='confirmPassword'
                                  value={signupForm.confirmPassword}
                                  onChange={handleInputChange}
                                  type={
                                    showConfirmPassword ? 'text' : 'password'
                                  }
                                  className={passwordInputClass}
                                />
                                <button
                                  type='button'
                                  className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-black hover:text-black'
                                  onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                  }
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className='h-4 w-4' />
                                  ) : (
                                    <Eye className='h-4 w-4' />
                                  )}
                                </button>
                              </div>
                              {touched.confirmPassword &&
                                errors.confirmPassword && (
                                  <p className='text-red-500 text-xs'>
                                    {errors.confirmPassword}
                                  </p>
                                )}
                            </div>

                            <div className='flex items-center space-x-3 mt-1'>
                              <Checkbox
                                id='terms'
                                name='agreeTerms'
                                checked={signupForm.agreeTerms}
                                onCheckedChange={(checked) => {
                                  setSignupForm((prev) => ({
                                    ...prev,
                                    agreeTerms: checked,
                                  }))
                                  setTouched((prev) => ({
                                    ...prev,
                                    agreeTerms: true,
                                  }))
                                  validateField('agreeTerms', checked)
                                }}
                                className='data-[state=checked]:bg-white border-gray-300 h-6 w-6 flex items-center justify-center data-[state=checked]:[&>span]:text-black data-[state=checked]:[&>span]:visible [&>span]:text-black'
                              />
                              <label
                                htmlFor='terms'
                                className='text-sm font-medium leading-none text-gray-500 cursor-pointer'
                              >
                                I agree to the{' '}
                                <a
                                  href='#'
                                  className='text-black hover:text-gray-700 transition-colors font-semibold'
                                >
                                  Terms of Service
                                </a>{' '}
                                and{' '}
                                <a
                                  href='#'
                                  className='text-black hover:text-gray-700 transition-colors font-semibold'
                                >
                                  Privacy Policy
                                </a>
                              </label>
                            </div>
                            {touched.agreeTerms && errors.agreeTerms && (
                              <p className='text-red-500 text-xs'>
                                {errors.agreeTerms}
                              </p>
                            )}
                          </div>
                        </form>
                      </CardContent>
                      <CardFooter className='pb-1 px-4 sm:px-6'>
                        <Button
                          className={buttonClass}
                          type='submit'
                          onClick={handleSignup}
                        >
                          Sign Up
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </>
            ) : (
              <ForgotPasswordFlow
                onClose={() => setShowForgotPassword(false)}
                onBack={handleBackToLogin}
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer - now fixed at bottom */}
      <div className='text-center text-gray-500 mt-2 mb-4'>
        <div className='flex flex-col font-poppins sm:flex-row justify-center items-center gap-2 sm:gap-4'>
          <span className='text-sm font-bold text-gray-400'>
            &copy; Copyright 2025 Qalani. All rights reserved.
          </span>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
