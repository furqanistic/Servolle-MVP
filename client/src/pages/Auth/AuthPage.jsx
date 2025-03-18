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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  const [activeTab, setActiveTab] = useState('login')
  const [greeting, setGreeting] = useState('')
  const [timeIcon, setTimeIcon] = useState(null)

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
        setTimeIcon(<Sunrise className='h-5 w-5 text-yellow-400' />)
      } else if (hour >= 12 && hour < 17) {
        setGreeting('Good Afternoon')
        setTimeIcon(<Sun className='h-5 w-5 text-yellow-400' />)
      } else if (hour >= 17 && hour < 21) {
        setGreeting('Good Evening')
        setTimeIcon(<Sunset className='h-5 w-5 text-orange-400' />)
      } else {
        setGreeting('Good Night')
        setTimeIcon(<Moon className='h-5 w-5 text-blue-400' />)
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
          errorMsg = 'First name is required'
        }
        break
      case 'lastName':
        if (!value || !value.trim()) {
          errorMsg = 'Last name is required'
        }
        break
      case 'email':
        if (!value || !value.trim()) {
          errorMsg = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errorMsg = 'Email is invalid'
        }
        break
      case 'password':
        if (!value) {
          errorMsg = 'Password is required'
        } else if (value.length < 8) {
          errorMsg = 'Password must be at least 8 characters'
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          errorMsg = 'Password must include uppercase, lowercase, and number'
        }

        // Also validate confirm password if needed
        if (signupForm.confirmPassword && touched.confirmPassword) {
          if (value !== signupForm.confirmPassword) {
            setErrors((prev) => ({
              ...prev,
              confirmPassword: 'Passwords do not match',
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
          errorMsg = 'Passwords do not match'
        }
        break
      case 'agreeTerms':
        if (!value) {
          errorMsg = 'You must agree to the terms'
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

  return (
    <div className='min-h-screen flex items-center justify-center bg-app-base p-4'>
      <div className='w-full max-w-md'>
        <div className='mb-8'>
          {/* Animated welcome message */}
          <div className='text-center mb-4'>
            <div className='flex items-center justify-center mb-2'>
              {timeIcon}
              <h2 className='ml-2 text-2xl font-semibold text-white'>
                {greeting}!
              </h2>
            </div>
            <div className='bg-gradient-to-r from-sky-400 to-indigo-500 h-1 w-16 mx-auto rounded-full mb-4' />
          </div>

          <div className='text-center'>
            <h1 className='text-4xl font-bold text-white mb-2'>Servolle</h1>
            <p className='text-gray-300'>Connect. Serve. Simplify.</p>
          </div>
        </div>

        <div>
          {/* Fixed Tab Design - Inspired by the screenshot */}
          <div className='mx-auto mb-8 rounded-full p-1 bg-app-deep max-w-xs overflow-hidden'>
            <div className='relative flex h-12'>
              {/* Active Tab Background */}
              <div
                className='absolute bg-sky-500 rounded-full h-10 transition-transform duration-300 w-1/2'
                style={{
                  transform:
                    activeTab === 'signup'
                      ? 'translateX(100%)'
                      : 'translateX(0)',
                  top: '4px',
                  left: '4px',
                }}
              />

              {/* Login Tab */}
              <button
                className={`relative z-10 flex items-center justify-center w-1/2 transition-colors duration-300 text-base font-medium rounded-full ${
                  activeTab === 'login' ? 'text-white' : 'text-gray-300'
                }`}
                onClick={() => setActiveTab('login')}
              >
                <LogIn className='mr-2 h-4 w-4' />
                Login
              </button>

              {/* Sign Up Tab */}
              <button
                className={`relative z-10 flex items-center justify-center w-1/2 transition-colors duration-300 text-base font-medium rounded-full ${
                  activeTab === 'signup' ? 'text-white' : 'text-gray-300'
                }`}
                onClick={() => setActiveTab('signup')}
              >
                <UserPlus className='mr-2 h-4 w-4' />
                Sign Up
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div>
            {/* Login Content */}
            <div className={activeTab === 'login' ? 'block' : 'hidden'}>
              <Card className='bg-app-medium border-app-deep shadow-lg'>
                <CardHeader>
                  <CardTitle className='text-white'>Welcome Back</CardTitle>
                  <CardDescription className='text-gray-300'>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className='space-y-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='email' className='text-white'>
                          Email
                        </Label>
                        <div className='relative'>
                          <Mail className='absolute left-3 top-3 h-4 w-4 text-gray-300' />
                          <Input
                            id='email'
                            placeholder='name@example.com'
                            className='pl-10 bg-app-deep border-app-deep text-white focus:ring-sky-400 focus:border-sky-400'
                          />
                        </div>
                      </div>
                      <div className='space-y-2'>
                        <div className='flex justify-between'>
                          <Label htmlFor='password' className='text-white'>
                            Password
                          </Label>
                          <a
                            href='#'
                            className='text-sm text-sky-400 hover:text-sky-300 transition-colors'
                          >
                            Forgot password?
                          </a>
                        </div>
                        <div className='relative'>
                          <Lock className='absolute left-3 top-3 h-4 w-4 text-gray-300' />
                          <Input
                            id='password'
                            type={showPassword ? 'text' : 'password'}
                            placeholder='••••••••'
                            className='pl-10 pr-10 bg-app-deep border-app-deep text-white focus:ring-sky-400 focus:border-sky-400'
                          />
                          <button
                            type='button'
                            className='absolute right-3 top-3 cursor-pointer text-gray-300 hover:text-white'
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
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='remember'
                          className='data-[state=checked]:bg-sky-400 border-gray-300'
                        />
                        <label
                          htmlFor='remember'
                          className='text-sm font-medium leading-none text-gray-300 cursor-pointer'
                        >
                          Remember me
                        </label>
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter>
                  <div className='w-full'>
                    <Button className='w-full bg-sky-500 hover:bg-sky-400 transition-all duration-300 text-white font-medium text-base'>
                      <LogIn className='mr-2 h-4 w-4' /> Login
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* Sign Up Content */}
            <div className={activeTab === 'signup' ? 'block' : 'hidden'}>
              <Card className='bg-app-medium border-app-deep shadow-lg'>
                <CardHeader>
                  <CardTitle className='text-white'>
                    Create an Account
                  </CardTitle>
                  <CardDescription className='text-gray-300'>
                    Fill in your details to join Servolle
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup}>
                    <div className='space-y-4'>
                      <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <Label htmlFor='firstName' className='text-white'>
                            First Name
                          </Label>
                          <div className='relative'>
                            <User className='absolute left-3 top-3 h-4 w-4 text-gray-300' />
                            <Input
                              id='firstName'
                              name='firstName'
                              value={signupForm.firstName}
                              onChange={handleInputChange}
                              placeholder='John'
                              className='pl-10 bg-app-deep border-app-deep text-white focus:ring-sky-400 focus:border-sky-400'
                            />
                          </div>
                          {touched.firstName && errors.firstName && (
                            <p className='text-red-400 text-xs mt-1'>
                              {errors.firstName}
                            </p>
                          )}
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='lastName' className='text-white'>
                            Last Name
                          </Label>
                          <Input
                            id='lastName'
                            name='lastName'
                            value={signupForm.lastName}
                            onChange={handleInputChange}
                            placeholder='Doe'
                            className='bg-app-deep border-app-deep text-white focus:ring-sky-400 focus:border-sky-400'
                          />
                          {touched.lastName && errors.lastName && (
                            <p className='text-red-400 text-xs mt-1'>
                              {errors.lastName}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='signupEmail' className='text-white'>
                          Email
                        </Label>
                        <div className='relative'>
                          <Mail className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                          <Input
                            id='signupEmail'
                            name='email'
                            value={signupForm.email}
                            onChange={handleInputChange}
                            placeholder='name@example.com'
                            className='pl-10 bg-app-deep border-app-deep text-white focus:ring-sky-400 focus:border-sky-400'
                          />
                        </div>
                        {touched.email && errors.email && (
                          <p className='text-red-400 text-xs mt-1'>
                            {errors.email}
                          </p>
                        )}
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='signupPassword' className='text-white'>
                          Password
                        </Label>
                        <div className='relative'>
                          <Lock className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                          <Input
                            id='signupPassword'
                            name='password'
                            value={signupForm.password}
                            onChange={handleInputChange}
                            type={showPassword ? 'text' : 'password'}
                            placeholder='••••••••'
                            className='pl-10 pr-10 bg-app-deep border-app-deep text-white focus:ring-sky-400 focus:border-sky-400'
                          />
                          <button
                            type='button'
                            className='absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-gray-300'
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
                          <p className='text-red-400 text-xs mt-1'>
                            {errors.password}
                          </p>
                        )}
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='confirmPassword' className='text-white'>
                          Confirm Password
                        </Label>
                        <div className='relative'>
                          <Lock className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                          <Input
                            id='confirmPassword'
                            name='confirmPassword'
                            value={signupForm.confirmPassword}
                            onChange={handleInputChange}
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder='••••••••'
                            className='pl-10 pr-10 bg-app-deep border-app-deep text-white focus:ring-sky-400 focus:border-sky-400'
                          />
                          <button
                            type='button'
                            className='absolute right-3 top-3 cursor-pointer text-gray-300 hover:text-white'
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
                        {touched.confirmPassword && errors.confirmPassword && (
                          <p className='text-red-400 text-xs mt-1'>
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>

                      {/* Account Type Selection - Visual Card-based approach with improved spacing */}
                      <div className='space-y-3 pt-2 pb-4'>
                        <Label className='text-white'>Account Type</Label>
                        <div className='grid grid-cols-2 gap-4'>
                          {/* Individual Account Option */}
                          <div
                            className={`relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 ${
                              !signupForm.isBusinessAccount
                                ? 'border-2 border-sky-500 bg-sky-500 bg-opacity-10 shadow-md shadow-sky-500/20'
                                : 'border border-gray-700 hover:border-sky-400 hover:-translate-y-1'
                            }`}
                            onClick={() => toggleBusinessAccount(false)}
                          >
                            <div className='p-4'>
                              <div className='flex flex-col items-center text-center space-y-3'>
                                <div
                                  className={`p-3 rounded-full ${
                                    !signupForm.isBusinessAccount
                                      ? 'bg-sky-500 bg-opacity-30'
                                      : 'bg-gray-700'
                                  }`}
                                >
                                  <User className='h-5 w-5 text-white' />
                                </div>
                                <div>
                                  <h3 className='font-medium text-white'>
                                    Individual
                                  </h3>
                                  <p className='text-xs text-gray-300 mt-1'>
                                    For personal use
                                  </p>
                                </div>
                              </div>
                            </div>
                            {!signupForm.isBusinessAccount && (
                              <div className='absolute top-0 right-0'>
                                <div className='bg-sky-500 h-6 w-6 flex items-center justify-center transform rotate-45 translate-y-3 -translate-x-3'>
                                  <span className='text-white text-xs transform -rotate-45'>
                                    ✓
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Business Account Option */}
                          <div
                            className={`relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 ${
                              signupForm.isBusinessAccount
                                ? 'border-2 border-sky-500 bg-sky-500 bg-opacity-10 shadow-md shadow-sky-500/20'
                                : 'border border-gray-700 hover:border-sky-400 hover:-translate-y-1'
                            }`}
                            onClick={() => toggleBusinessAccount(true)}
                          >
                            <div className='p-4'>
                              <div className='flex flex-col items-center text-center space-y-3'>
                                <div
                                  className={`p-3 rounded-full ${
                                    signupForm.isBusinessAccount
                                      ? 'bg-sky-500 bg-opacity-30'
                                      : 'bg-gray-700'
                                  }`}
                                >
                                  <Building className='h-5 w-5 text-white' />
                                </div>
                                <div>
                                  <h3 className='font-medium text-white'>
                                    Business
                                  </h3>
                                  <p className='text-xs text-gray-300 mt-1'>
                                    For service providers
                                  </p>
                                </div>
                              </div>
                            </div>
                            {signupForm.isBusinessAccount && (
                              <div className='absolute top-0 right-0'>
                                <div className='bg-sky-500 h-6 w-6 flex items-center justify-center transform rotate-45 translate-y-3 -translate-x-3'>
                                  <span className='text-white text-xs transform -rotate-45'>
                                    ✓
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className='flex items-center space-x-2 mt-2'>
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
                          className='data-[state=checked]:bg-sky-400 border-gray-300'
                        />
                        <label
                          htmlFor='terms'
                          className='text-sm font-medium leading-none text-gray-300 cursor-pointer'
                        >
                          I agree to the{' '}
                          <a
                            href='#'
                            className='text-sky-400 hover:text-sky-300 transition-colors'
                          >
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a
                            href='#'
                            className='text-sky-400 hover:text-sky-300 transition-colors'
                          >
                            Privacy Policy
                          </a>
                        </label>
                      </div>
                      {touched.agreeTerms && errors.agreeTerms && (
                        <p className='text-red-400 text-xs'>
                          {errors.agreeTerms}
                        </p>
                      )}
                    </div>
                  </form>
                </CardContent>
                <CardFooter>
                  <div className='w-full'>
                    <Button
                      className='w-full bg-sky-500 hover:bg-sky-400 transition-all duration-300 text-white font-medium text-base'
                      type='submit'
                      onClick={handleSignup}
                    >
                      <UserPlus className='mr-2 h-4 w-4' /> Create Account
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>

        <div className='mt-6 text-center text-gray-300 text-sm'>
          <p>
            &copy; {new Date().getFullYear()} Servolle. All rights reserved.
          </p>
          <div className='flex justify-center mt-2 space-x-4'>
            <a
              href='#'
              className='text-gray-300 hover:text-sky-400 transition-colors'
            >
              Help
            </a>
            <a
              href='#'
              className='text-gray-300 hover:text-sky-400 transition-colors'
            >
              Privacy
            </a>
            <a
              href='#'
              className='text-gray-300 hover:text-sky-400 transition-colors'
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
