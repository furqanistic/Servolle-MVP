import ForgotPasswordFlow from '@/components/Auth/ForgotPasswordFlow'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  ArrowRight,
  Building,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Mail,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  User,
  UserPlus,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

const AuthPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('signup')
  const [greeting, setGreeting] = useState('')
  const [timeIcon, setTimeIcon] = useState(null)
  const [showForgotPassword, setShowForgotPassword] = useState(false) // New state for forgot password flow

  // Form states
  const [signupForm, setSignupForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    isBusinessAccount: null, // Changed from false to null to represent no selection
    agreeTerms: false,
  })

  // Error states
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: '',
    accountType: '', // Added error field for account type
  })

  // Touch tracking (to only show errors after user interaction)
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
    agreeTerms: false,
    accountType: false, // Added touched field for account type
  })

  // Set initial active tab based on URL path
  useEffect(() => {
    const path = window.location.pathname
    if (path === '/login') {
      setActiveTab('login')
    } else if (path === '/signup') {
      setActiveTab('signup')
    }
  }, []) // Empty dependency array ensures this runs once on mount

  // Set appropriate greeting based on time of day
  useEffect(() => {
    const getTimeBasedGreeting = () => {
      const hour = new Date().getHours()

      if (hour >= 5 && hour < 12) {
        setGreeting('Good Morning')
        setTimeIcon(<Sunrise className='h-5 w-5 text-amber-500' />)
      } else if (hour >= 12 && hour < 17) {
        setGreeting('Good Afternoon')
        setTimeIcon(<Sun className='h-5 w-5 text-amber-500' />)
      } else if (hour >= 17 && hour < 21) {
        setGreeting('Good Evening')
        setTimeIcon(<Sunset className='h-5 w-5 text-orange-500' />)
      } else {
        setGreeting('Good Night')
        setTimeIcon(<Moon className='h-5 w-5 text-indigo-500' />)
      }
    }

    getTimeBasedGreeting()
    // Update greeting every minute in case the user crosses a time boundary
    const intervalId = setInterval(getTimeBasedGreeting, 60000)

    return () => clearInterval(intervalId)
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

  // Common input class for consistent styling
  const inputClass =
    'border border-gray-300 hover:border-black text-black focus:outline-none focus:ring-0 focus:border-transparent rounded-sm transition-colors placeholder:text-black focus:placeholder:text-black'

  const passwordInputClass =
    'pr-10 border border-gray-300 hover:border-black text-black focus:outline-none focus:ring-0 focus:border-transparent rounded-sm transition-colors placeholder:text-gray-400 focus:placeholder:text-sky-800'

  // Consistent button styling to match input fields
  const buttonClass =
    'w-full bg-sky-500 hover:bg-sky-400 transition-all duration-300 text-white font-medium text-base rounded-sm shadow-none mt-0'

  return (
    <div className='min-h-screen flex flex-col justify-between p-3 pb-4 overflow-x-hidden max-w-full'>
      <div className='flex flex-col'>
        {/* Header section - reduced spacing */}
        <div className='flex justify-center pt-3 sm:pt-2'>
          <div className='text-center'>
            <div className='inline-block border-3 border-black rounded-xl p-3 mb-1'>
              <h1 className='text-3xl font-medium text-black'>qalani</h1>
            </div>
            <p className='text-gray-400 sm:text-black text-lg tracking-wide font-montserrat my-1 font-bold whitespace-nowrap'>
              Business-Focused Social Media
            </p>
          </div>
        </div>

        {/* Auth forms section - moved up */}
        <div className='flex items-start justify-center mb-0 mt-0'>
          <div className='w-full max-w-md'>
            {!showForgotPassword ? (
              <>
                {/* Tabs - less bottom margin */}
                <div className='mx-auto mb-0 rounded-full bg-white p-1.5 max-w-xs overflow-hidden'>
                  <div className='relative grid grid-cols-2 gap-3 h-11 rounded-full'>
                    {/* Active Tab Indicator - Positioned absolutely */}
                    <div
                      className='absolute h-9 rounded-full bg-sky-500 transition-transform duration-300 ease-in-out transform w-[calc(50%-10px)]'
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
                        activeTab === 'signup' ? 'text-white' : 'text-sky-600'
                      }`}
                    >
                      Sign Up
                    </button>
                    <button
                      onClick={() => setActiveTab('login')}
                      className={`relative z-10 py-2 px-4 font-medium transition-colors duration-300 rounded-full ${
                        activeTab === 'login' ? 'text-white' : 'text-sky-600'
                      }`}
                    >
                      Log In
                    </button>
                  </div>
                </div>

                {/* Form Content */}
                <div className='relative w-full min-h-[420px] '>
                  {/* Login Content */}
                  <div
                    className={`absolute top-0 left-0 w-full transition-opacity duration-300 ${
                      activeTab === 'login'
                        ? 'opacity-100 z-10'
                        : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    <Card className='rounded-xl overflow-hidden max-w-full border-0 shadow-none '>
                      <CardContent className='pt-1 px-4 sm:px-6'>
                        <form onSubmit={(e) => e.preventDefault()}>
                          <div className='space-y-3 '>
                            <div className='space-y-1'>
                              <Label
                                htmlFor='email'
                                className='text-black font-medium text-sm'
                              >
                                Email
                              </Label>
                              <Input id='email' className={inputClass} />
                            </div>
                            <div className='space-y-1 '>
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
                                  className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-black hover:text-sky-600'
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
                        <Button className={buttonClass}>Log In</Button>
                      </CardFooter>
                    </Card>
                  </div>

                  {/* Sign Up Content - Adjusted padding and spacing */}
                  <div
                    className={`transition-opacity duration-300 ${
                      activeTab === 'signup'
                        ? 'opacity-100 z-10'
                        : 'opacity-0 z-0 absolute top-0 left-0 w-full pointer-events-none'
                    }`}
                  >
                    <Card className='rounded-xl overflow-hidden border-0 shadow-none mt-0'>
                      <CardContent className='px-4 sm:px-6 pt-0'>
                        <form onSubmit={handleSignup}>
                          <div className='space-y-2'>
                            {/* Account Type Selection - Reduced top spacing */}
                            <div className='space-y-1 mt-1'>
                              <Label
                                htmlFor='accountType'
                                className='text-black font-medium text-sm'
                              >
                                Account Type
                              </Label>
                              <div className='grid grid-cols-2 gap-3 mx-auto'>
                                {/* Individual Account Option */}
                                <div
                                  className={`relative overflow-hidden rounded-sm cursor-pointer transition-all duration-300 border ${
                                    signupForm.isBusinessAccount === false
                                      ? 'border-black'
                                      : 'border-gray-300'
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
                                  className={`relative overflow-hidden rounded-sm cursor-pointer transition-all duration-300 border ${
                                    signupForm.isBusinessAccount === true
                                      ? 'border-black'
                                      : 'border-gray-300'
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

                            {/* Full Name field (replaces first and last name) */}
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
                                  className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-black hover:text-sky-600'
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
                                  className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-black hover:text-sky-600'
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

                            <div className='flex items-center space-x-3 mt-2'>
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

      {/* Footer with slightly more space from the form */}
      <div className='text-center text-gray-500 mt-3 mb-4'>
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
