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
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    isBusinessAccount: false,
    agreeTerms: false,
  })

  // Error states
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: '',
  })

  // Touch tracking (to only show errors after user interaction)
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
    agreeTerms: false,
  })

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
      case 'firstName':
        if (!value || !value.trim()) {
          errorMsg = 'Please enter your first name'
        }
        break
      case 'lastName':
        if (!value || !value.trim()) {
          errorMsg = 'Please enter your last name'
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

  return (
    <div className='min-h-screen flex flex-col justify-between bg-gradient-to-b from-sky-50 to-white p-3 pb-4 overflow-x-hidden max-w-full'>
      <div className='flex flex-col'>
        {/* Header section */}
        <div className='flex justify-center mb-2 pt-4'>
          <div className='text-center'>
            <div className='inline-block border-2 border-sky-500 rounded-xl p-3 mb-2'>
              <h1 className='text-3xl font-medium text-sky-500'>qalani</h1>
            </div>
            <p className='text-sky-600 text-sm tracking-wide uppercase'>
              The marketplace for all services
            </p>
          </div>
        </div>

        {/* Auth forms section */}
        <div className='flex items-start justify-center mb-1'>
          <div className='w-full max-w-md'>
            {!showForgotPassword ? (
              <>
                {/* Tabs */}
                <div className='mx-auto mb-3 rounded-full bg-white p-1.5 max-w-xs overflow-hidden border border-sky-200'>
                  <div className='relative grid grid-cols-2 h-11 rounded-full'>
                    {/* Active Tab Indicator - Positioned absolutely */}
                    <div
                      className={`absolute h-9 rounded-full bg-sky-500 transition-transform duration-300 ease-in-out transform w-[calc(50%-10px)]`}
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
                <div className='relative w-full min-h-[420px]'>
                  {/* Login Content */}
                  <div
                    className={`absolute top-0 left-0 w-full transition-opacity duration-300 ${
                      activeTab === 'login'
                        ? 'opacity-100 z-10'
                        : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    <Card className='bg-white border-sky-200 shadow-lg rounded-xl overflow-hidden max-w-full'>
                      <CardContent className='pt-1 px-4 sm:px-6'>
                        <form onSubmit={(e) => e.preventDefault()}>
                          <div className='space-y-3'>
                            <div className='space-y-1'>
                              <Label
                                htmlFor='email'
                                className='text-sky-700 font-medium text-sm'
                              >
                                Email
                              </Label>
                              <Input
                                id='email'
                                placeholder='name@example.com'
                                className='bg-sky-50 border-sky-200 text-sky-800 focus:ring-sky-400 focus:border-sky-400 rounded-lg'
                              />
                            </div>
                            <div className='space-y-1'>
                              <div className='flex justify-between'>
                                <Label
                                  htmlFor='password'
                                  className='text-sky-700 font-medium text-sm'
                                >
                                  Password
                                </Label>
                                <a
                                  href='#'
                                  className='text-xs text-sky-500 hover:text-sky-600 transition-colors font-medium'
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
                                  placeholder='Password'
                                  className='pr-10 bg-sky-50 border-sky-200 text-sky-800 focus:ring-sky-400 focus:border-sky-400 rounded-lg'
                                />
                                <button
                                  type='button'
                                  className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-sky-400 hover:text-sky-600'
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
                                className='data-[state=checked]:bg-sky-500 border-sky-300 h-4 w-4 flex items-center justify-center [&>*]:border-none'
                              />
                              <label
                                htmlFor='remember'
                                className='text-xs font-medium leading-none text-sky-600 cursor-pointer'
                              >
                                Remember me
                              </label>
                            </div>
                          </div>
                        </form>
                      </CardContent>
                      <CardFooter className='pb-1'>
                        <div className='w-full'>
                          <Button className='w-full bg-sky-500 hover:bg-sky-400 transition-all duration-300 text-white font-medium text-base rounded-lg shadow-md mt-0'>
                            Log In
                          </Button>
                        </div>
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
                  >
                    <Card className='bg-white border-sky-200 shadow-lg rounded-xl overflow-hidden'>
                      <CardContent className='pt-1 px-4 sm:px-6'>
                        <form onSubmit={handleSignup}>
                          <div className='space-y-3'>
                            {/* Account Type Selection - Spacing adjusted here */}
                            <div className='space-y-1'>
                              <Label
                                htmlFor='accountType'
                                className='text-sky-700 font-medium text-sm'
                              >
                                Account Type
                              </Label>
                              <div className='grid grid-cols-2 gap-2 mx-auto'>
                                {/* Individual Account Option */}
                                <div
                                  className={`relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 ${
                                    !signupForm.isBusinessAccount
                                      ? 'border-2 border-sky-500 bg-sky-50 shadow-md'
                                      : 'border border-sky-200 hover:border-sky-400'
                                  }`}
                                  onClick={() => toggleBusinessAccount(false)}
                                >
                                  <div className='p-2'>
                                    <div className='flex flex-col items-center text-center space-y-1'>
                                      <div
                                        className={`p-2 rounded-full ${
                                          !signupForm.isBusinessAccount
                                            ? 'bg-sky-500 bg-opacity-30'
                                            : 'bg-sky-100'
                                        }`}
                                      >
                                        <User
                                          className={`h-4 w-4 ${
                                            !signupForm.isBusinessAccount
                                              ? 'text-white'
                                              : 'text-sky-400'
                                          }`}
                                        />
                                      </div>
                                      <div>
                                        <h3
                                          className={`font-medium text-sm ${
                                            !signupForm.isBusinessAccount
                                              ? 'text-sky-700'
                                              : 'text-sky-600'
                                          }`}
                                        >
                                          Individual
                                        </h3>
                                        <p className='text-xs text-sky-400'>
                                          Personal use
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Business Account Option */}
                                <div
                                  className={`relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 ${
                                    signupForm.isBusinessAccount
                                      ? 'border-2 border-sky-500 bg-sky-50 shadow-md'
                                      : 'border border-sky-200 hover:border-sky-400'
                                  }`}
                                  onClick={() => toggleBusinessAccount(true)}
                                >
                                  <div className='p-2'>
                                    <div className='flex flex-col items-center text-center space-y-1'>
                                      <div
                                        className={`p-2 rounded-full ${
                                          signupForm.isBusinessAccount
                                            ? 'bg-sky-500 bg-opacity-30'
                                            : 'bg-sky-100'
                                        }`}
                                      >
                                        <Building
                                          className={`h-4 w-4 ${
                                            signupForm.isBusinessAccount
                                              ? 'text-white'
                                              : 'text-sky-400'
                                          }`}
                                        />
                                      </div>
                                      <div>
                                        <h3
                                          className={`font-medium text-sm ${
                                            signupForm.isBusinessAccount
                                              ? 'text-sky-700'
                                              : 'text-sky-600'
                                          }`}
                                        >
                                          Business
                                        </h3>
                                        <p className='text-xs text-sky-400'>
                                          Service provider
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='grid grid-cols-2 gap-3'>
                              <div className='space-y-1'>
                                <Label
                                  htmlFor='firstName'
                                  className='text-sky-700 font-medium text-sm'
                                >
                                  First Name
                                </Label>
                                <Input
                                  id='firstName'
                                  name='firstName'
                                  value={signupForm.firstName}
                                  onChange={handleInputChange}
                                  placeholder='First name'
                                  className='bg-sky-50 border-sky-200 text-sky-800 focus:ring-sky-400 focus:border-sky-400 rounded-lg'
                                />
                                {touched.firstName && errors.firstName && (
                                  <p className='text-red-500 text-xs'>
                                    {errors.firstName}
                                  </p>
                                )}
                              </div>
                              <div className='space-y-1'>
                                <Label
                                  htmlFor='lastName'
                                  className='text-sky-700 font-medium text-sm'
                                >
                                  Last Name
                                </Label>
                                <Input
                                  id='lastName'
                                  name='lastName'
                                  value={signupForm.lastName}
                                  onChange={handleInputChange}
                                  placeholder='Last name'
                                  className='bg-sky-50 border-sky-200 text-sky-800 focus:ring-sky-400 focus:border-sky-400 rounded-lg'
                                />
                                {touched.lastName && errors.lastName && (
                                  <p className='text-red-500 text-xs'>
                                    {errors.lastName}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className='space-y-1'>
                              <Label
                                htmlFor='signupEmail'
                                className='text-sky-700 font-medium text-sm'
                              >
                                Email
                              </Label>
                              <Input
                                id='signupEmail'
                                name='email'
                                value={signupForm.email}
                                onChange={handleInputChange}
                                placeholder='name@example.com'
                                className='bg-sky-50 border-sky-200 text-sky-800 focus:ring-sky-400 focus:border-sky-400 rounded-lg'
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
                                className='text-sky-700 font-medium text-sm'
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
                                  placeholder='Password'
                                  className='pr-10 bg-sky-50 border-sky-200 text-sky-800 focus:ring-sky-400 focus:border-sky-400 rounded-lg'
                                />
                                <button
                                  type='button'
                                  className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-sky-400 hover:text-sky-600'
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
                                className='text-sky-700 font-medium text-sm'
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
                                  placeholder='Confirm password'
                                  className='pr-10 bg-sky-50 border-sky-200 text-sky-800 focus:ring-sky-400 focus:border-sky-400 rounded-lg'
                                />
                                <button
                                  type='button'
                                  className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-sky-400 hover:text-sky-600'
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

                            <div className='flex items-center space-x-2 mt-3'>
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
                                className='data-[state=checked]:bg-sky-500 border-sky-300 h-4 w-4 flex items-center justify-center [&>*]:border-none'
                              />
                              <label
                                htmlFor='terms'
                                className='text-xs font-medium leading-none text-sky-600 cursor-pointer'
                              >
                                I agree to the{' '}
                                <a
                                  href='#'
                                  className='text-sky-500 hover:text-sky-600 transition-colors'
                                >
                                  Terms of Service
                                </a>{' '}
                                and{' '}
                                <a
                                  href='#'
                                  className='text-sky-500 hover:text-sky-600 transition-colors'
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
                      <CardFooter className='pb-1'>
                        <div className='w-full'>
                          <Button
                            className='w-full bg-sky-500 hover:bg-sky-400 transition-all duration-300 text-white font-medium text-base rounded-lg shadow-md mt-0'
                            type='submit'
                            onClick={handleSignup}
                          >
                            Sign Up
                          </Button>
                        </div>
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
      <div className='text-center text-sky-500 text-xs mt-3 mb-4'>
        <p>
          &copy; {new Date().getFullYear()} Qalani, LLC. All rights reserved.
        </p>
        <div className='flex justify-center mt-2 space-x-4'>
          <a
            href='#'
            className='text-sky-500 hover:text-sky-600 transition-colors'
          >
            Help
          </a>
          <a
            href='#'
            className='text-sky-500 hover:text-sky-600 transition-colors'
          >
            Privacy
          </a>
          <a
            href='#'
            className='text-sky-500 hover:text-sky-600 transition-colors'
          >
            Terms
          </a>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
