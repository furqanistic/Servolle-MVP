import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

/**
 * ForgotPasswordFlow - A comprehensive password reset flow component
 *
 * Handles the complete password reset process with email verification,
 * OTP validation, password creation, and success confirmation.
 *
 * @param {Object} props
 * @param {Function} props.onBack - Function to return to login screen
 * @param {Function} props.onPasswordReset - Optional callback when password is reset successfully
 */
const ForgotPasswordFlow = ({ onBack, onPasswordReset }) => {
  // Flow state management
  const [step, setStep] = useState('email') // email, otp, newPassword, success
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)

  // Form values
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // UI state
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)

  // Refs for OTP inputs
  const otpRefs = Array(4)
    .fill(0)
    .map(() => useRef(null))

  const initialFocusRef = useRef(null)

  // Focus first input on step change
  useEffect(() => {
    if (initialFocusRef.current) {
      setTimeout(() => initialFocusRef.current.focus(), 100)
    }
  }, [step])

  // Timer logic with localStorage persistence
  useEffect(() => {
    const timerStartTime = localStorage.getItem('otpTimerStart')
    const currentTime = new Date().getTime()

    if (timerStartTime && step === 'otp') {
      // Calculate remaining time
      const elapsedSeconds = Math.floor(
        (currentTime - parseInt(timerStartTime)) / 1000
      )
      const remainingSeconds = Math.max(0, 60 - elapsedSeconds)

      setTimeLeft(remainingSeconds)
      setCanResend(remainingSeconds === 0)

      // If timer hasn't expired yet, start countdown
      if (remainingSeconds > 0) {
        const timer = setInterval(() => {
          setTimeLeft((prevTime) => {
            const newTime = prevTime - 1
            if (newTime <= 0) {
              clearInterval(timer)
              setCanResend(true)
              return 0
            }
            return newTime
          })
        }, 1000)

        // Clean up timer
        return () => clearInterval(timer)
      }
    } else if (step === 'otp') {
      // Initialize timer when first entering OTP step
      localStorage.setItem('otpTimerStart', currentTime.toString())

      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1
          if (newTime <= 0) {
            clearInterval(timer)
            setCanResend(true)
            return 0
          }
          return newTime
        })
      }, 1000)

      // Clean up timer
      return () => clearInterval(timer)
    }
  }, [step])

  // Track attempts in localStorage for rate limiting
  useEffect(() => {
    const savedAttempts = localStorage.getItem('otpAttempts')
    if (savedAttempts) {
      setAttemptCount(parseInt(savedAttempts))
    }
  }, [])

  // Handle email step submission with validation
  const handleEmailStep = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Validate email format
      if (!email || !email.trim() || !/\S+@\S+\.\S+/.test(email)) {
        throw new Error('Please enter a valid email address')
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Reset timer when sending a new code
      localStorage.setItem('otpTimerStart', new Date().getTime().toString())
      localStorage.setItem('otpAttempts', '0')
      setAttemptCount(0)
      setTimeLeft(60)
      setCanResend(false)
      setStep('otp')
    } catch (error) {
      setError(error.message || 'An error occurred. Please try again')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle OTP verification with security measures
  const handleOtpStep = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Validate OTP is complete
      if (otp.some((digit) => !digit)) {
        throw new Error('Please enter the complete verification code')
      }

      // Rate limiting check
      if (attemptCount >= 5) {
        throw new Error(
          'Too many unsuccessful attempts. Please request a new verification code'
        )
      }

      await new Promise((resolve) => setTimeout(resolve, 800))

      // Implement specific OTP validation - only 0000 works
      const otpValue = otp.join('')
      if (otpValue !== '0000' && otpValue !== '2222') {
        // Increment attempt counter
        const newAttemptCount = attemptCount + 1
        localStorage.setItem('otpAttempts', newAttemptCount.toString())
        setAttemptCount(newAttemptCount)
        throw new Error(
          'The verification code you entered is invalid. Please check and try again'
        )
      }

      setStep('newPassword')
    } catch (error) {
      setError(error.message || 'An error occurred. Please try again')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle password reset with strong validation
  const handlePasswordStep = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Basic validation
      if (!newPassword) {
        throw new Error('Please create a new password')
      }

      // Length validation
      if (newPassword.length < 8) {
        throw new Error('Your password must be at least 8 characters long')
      }

      // Complexity validation
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
        throw new Error(
          'Your password must include at least one uppercase letter, one lowercase letter, and one number'
        )
      }

      // Match validation
      if (newPassword !== confirmPassword) {
        throw new Error(
          'The passwords you entered do not match. Please ensure both fields contain the same password'
        )
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Clear localStorage items
      localStorage.removeItem('otpTimerStart')
      localStorage.removeItem('otpAttempts')

      // Trigger callback if provided
      if (typeof onPasswordReset === 'function') {
        onPasswordReset()
      }

      setStep('success')
    } catch (error) {
      setError(error.message || 'An error occurred. Please try again')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle OTP input with focus management
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(0, 1)
    setOtp(newOtp)
    setError('')

    // Auto-focus next input
    if (value && index < 3) {
      otpRefs[index + 1].current.focus()
    }
  }

  // Handle OTP keyboard navigation
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current.focus()
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpRefs[index - 1].current.focus()
    } else if (e.key === 'ArrowRight' && index < 3) {
      otpRefs[index + 1].current.focus()
    }
  }

  // Paste handler for OTP with validation
  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    const digits = pastedData.replace(/\D/g, '').slice(0, 4).split('')

    if (digits.length) {
      const newOtp = [...otp]
      digits.forEach((digit, index) => {
        if (index < 4) newOtp[index] = digit
      })
      setOtp(newOtp)

      if (digits.length < 4) {
        otpRefs[digits.length].current.focus()
      } else {
        otpRefs[3].current.focus()
      }
    }
  }

  // Handle resend code with rate limiting
  const handleResendCode = async () => {
    if (!canResend) return

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Reset timer
      localStorage.setItem('otpTimerStart', new Date().getTime().toString())
      localStorage.setItem('otpAttempts', '0')
      setAttemptCount(0)
      setTimeLeft(60)
      setCanResend(false)

      // Reset OTP fields
      setOtp(['', '', '', ''])

      // Focus on first field
      otpRefs[0].current.focus()

      // Show success message for resend
      setError('A new verification code has been sent to your email.')
    } catch (err) {
      setError(
        'Unable to send a new verification code. Please try again or contact support.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render email step
  const renderEmailStep = () => (
    <Card className='mt-2 border-gray-300 shadow-lg rounded-xl overflow-hidden'>
      <CardContent className='p-6'>
        <div className='flex flex-col items-center mb-4'>
          <div className='w-14 h-14 rounded-full bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center mb-2'>
            <Mail className='h-7 w-7 text-black' aria-hidden='true' />
          </div>
          <h2
            className='text-lg font-medium text-black mb-1'
            id='reset-heading'
          >
            Reset Your Password
          </h2>
          <p className='text-gray-500 text-xs text-center'>
            Enter your email and we'll send you a verification code
          </p>
        </div>

        <form
          onSubmit={handleEmailStep}
          className='space-y-4'
          aria-labelledby='reset-heading'
        >
          <div className='space-y-1.5'>
            <Label
              htmlFor='reset-email'
              className='text-black font-medium text-sm'
            >
              Email
            </Label>
            <Input
              id='reset-email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='border border-gray-300 hover:border-black text-black focus:outline-none focus:ring-0 focus:border-transparent rounded-sm transition-colors placeholder:text-gray-400'
              aria-describedby='email-error'
              disabled={isSubmitting}
              ref={initialFocusRef}
              autoComplete='email'
            />
            {error && (
              <p className='text-red-500 text-xs' id='email-error' role='alert'>
                {error}
              </p>
            )}
          </div>

          <Button
            type='submit'
            className='w-full bg-sky-500 hover:bg-sky-400 transition-all duration-300 text-white font-medium text-base rounded-sm shadow-none'
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2
                  className='h-4 w-4 mr-2 animate-spin'
                  aria-hidden='true'
                />
                Sending...
              </>
            ) : (
              'Send Verification Code'
            )}
          </Button>

          <div className='w-full'>
            <Button
              type='button'
              onClick={onBack}
              className='w-full bg-transparent hover:bg-gray-50 text-black font-medium text-sm rounded-sm border border-gray-300 transition-all duration-300'
              disabled={isSubmitting}
            >
              <ArrowLeft className='h-4 w-4 mr-2' aria-hidden='true' />
              Back to Log In
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )

  // Render OTP verification step
  const renderOtpStep = () => (
    <Card className='bg-white border-gray-300 mt-2 shadow-lg rounded-xl overflow-hidden'>
      <CardContent className='p-6'>
        <div className='flex flex-col items-center mb-4'>
          <div className='w-14 h-14 rounded-full bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center mb-2'>
            <ShieldCheck className='h-7 w-7 text-black' aria-hidden='true' />
          </div>
          <h2 className='text-lg font-medium text-black mb-1' id='otp-heading'>
            Verify Your Email
          </h2>
          <p className='text-gray-500 text-xs text-center'>
            Enter the 4-digit code sent to{' '}
            <span className='font-medium'>{email}</span>
          </p>
          {attemptCount > 0 && (
            <p className='text-amber-600 text-xs mt-1'>
              Attempts remaining: {5 - attemptCount}
            </p>
          )}
        </div>

        <form
          onSubmit={handleOtpStep}
          className='space-y-4'
          aria-labelledby='otp-heading'
        >
          <div
            className='flex justify-center space-x-3 mb-1'
            role='group'
            aria-label='Verification code input'
          >
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  // Handle the case for the first input
                  if (index === 0) {
                    initialFocusRef.current = el
                    otpRefs[0].current = el
                  } else {
                    otpRefs[index].current = el
                  }
                }}
                type='text'
                inputMode='numeric'
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                onPaste={index === 0 ? handleOtpPaste : undefined}
                className='w-12 h-12 text-center text-xl font-semibold border border-gray-300 hover:border-black text-black focus:outline-none focus:ring-0 focus:border-transparent rounded-sm transition-colors'
                aria-label={`Digit ${index + 1}`}
                disabled={isSubmitting}
                autoComplete='one-time-code'
              />
            ))}
          </div>

          {error && (
            <p className='text-red-500 text-xs text-center' role='alert'>
              {error}
            </p>
          )}

          <div className='text-center space-y-0.5'>
            <button
              type='button'
              className={`text-xs font-medium transition-colors ${
                canResend && !isSubmitting
                  ? 'text-black hover:text-gray-700 cursor-pointer'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
              onClick={handleResendCode}
              disabled={!canResend || isSubmitting}
              aria-live='polite'
            >
              Didn't receive a code? Resend
            </button>
            {!canResend && (
              <p className='text-xs text-gray-500' aria-live='polite'>
                Resend available in{' '}
                <span className='font-medium'>{timeLeft}s</span>
              </p>
            )}
          </div>

          <Button
            type='submit'
            className='w-full bg-sky-500 hover:bg-sky-400 transition-all duration-300 text-white font-medium text-base rounded-sm shadow-none'
            disabled={isSubmitting || otp.some((digit) => !digit)}
          >
            {isSubmitting ? (
              <>
                <Loader2
                  className='h-4 w-4 mr-2 animate-spin'
                  aria-hidden='true'
                />
                Verifying...
              </>
            ) : (
              'Verify Code'
            )}
          </Button>

          <Button
            type='button'
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to go back? You'll need to restart the process."
                )
              ) {
                setStep('email')
              }
            }}
            className='w-full bg-transparent hover:bg-gray-50 text-black font-medium text-sm rounded-sm border border-gray-300 transition-all duration-300'
            disabled={isSubmitting}
          >
            <ArrowLeft className='h-4 w-4 mr-2' aria-hidden='true' />
            Back
          </Button>
        </form>
      </CardContent>
    </Card>
  )

  // Render new password step with strength indicators
  const renderPasswordStep = () => (
    <Card className='bg-white border-gray-300 mt-2 shadow-lg rounded-xl overflow-hidden'>
      <CardContent className='p-6'>
        <div className='flex flex-col items-center mb-4'>
          <div className='w-14 h-14 rounded-full bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center mb-2'>
            <Lock className='h-7 w-7 text-black' aria-hidden='true' />
          </div>
          <h2
            className='text-lg font-medium text-black mb-1'
            id='password-heading'
          >
            Create New Password
          </h2>
          <p className='text-gray-500 text-xs text-center'>
            Your password must be different from previous passwords
          </p>
        </div>

        <form
          onSubmit={handlePasswordStep}
          className='space-y-4'
          aria-labelledby='password-heading'
        >
          <div className='space-y-3'>
            <div className='space-y-1.5'>
              <Label
                htmlFor='new-password'
                className='text-black font-medium text-sm'
              >
                New Password
              </Label>
              <div className='relative'>
                <Input
                  id='new-password'
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className='pr-10 border border-gray-300 hover:border-black text-black focus:outline-none focus:ring-0 focus:border-transparent rounded-sm transition-colors placeholder:text-gray-400'
                  aria-describedby='password-requirements'
                  disabled={isSubmitting}
                  ref={initialFocusRef}
                  autoComplete='new-password'
                />
                <button
                  type='button'
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-black hover:text-gray-600'
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex='-1'
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4' aria-hidden='true' />
                  ) : (
                    <Eye className='h-4 w-4' aria-hidden='true' />
                  )}
                </button>
              </div>
            </div>

            <div className='space-y-1.5'>
              <Label
                htmlFor='confirm-password'
                className='text-black font-medium text-sm'
              >
                Confirm Password
              </Label>
              <div className='relative'>
                <Input
                  id='confirm-password'
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className='pr-10 border border-gray-300 hover:border-black text-black focus:outline-none focus:ring-0 focus:border-transparent rounded-sm transition-colors placeholder:text-gray-400'
                  disabled={isSubmitting}
                  autoComplete='new-password'
                />
                <button
                  type='button'
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-black hover:text-gray-600'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                  tabIndex='-1'
                >
                  {showConfirmPassword ? (
                    <EyeOff className='h-4 w-4' aria-hidden='true' />
                  ) : (
                    <Eye className='h-4 w-4' aria-hidden='true' />
                  )}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className='text-red-500 text-xs mt-1'>
                  Passwords do not match. Please ensure both entries are
                  identical.
                </p>
              )}
            </div>

            {error && (
              <p className='text-red-500 text-xs' role='alert'>
                {error}
              </p>
            )}

            <div
              className='bg-gray-50 rounded-sm p-3 border border-gray-200'
              id='password-requirements'
            >
              <p className='text-black font-medium text-xs mb-2'>
                Password requirements:
              </p>
              <ul className='space-y-1'>
                <li className='flex items-center text-xs'>
                  <div
                    className={`w-2 h-2 rounded-full mr-1.5 ${
                      newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                    aria-hidden='true'
                  ></div>
                  <span className='text-gray-500'>At least 8 characters</span>
                </li>
                <li className='flex items-center text-xs'>
                  <div
                    className={`w-2 h-2 rounded-full mr-1.5 ${
                      /[A-Z]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                    aria-hidden='true'
                  ></div>
                  <span className='text-gray-500'>
                    Include uppercase letter
                  </span>
                </li>
                <li className='flex items-center text-xs'>
                  <div
                    className={`w-2 h-2 rounded-full mr-1.5 ${
                      /[a-z]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                    aria-hidden='true'
                  ></div>
                  <span className='text-gray-500'>
                    Include lowercase letter
                  </span>
                </li>
                <li className='flex items-center text-xs'>
                  <div
                    className={`w-2 h-2 rounded-full mr-1.5 ${
                      /\d/.test(newPassword) ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                    aria-hidden='true'
                  ></div>
                  <span className='text-gray-500'>Include number</span>
                </li>
              </ul>
            </div>
          </div>

          <Button
            type='submit'
            className='w-full bg-sky-500 hover:bg-sky-400 transition-all duration-300 text-white font-medium text-base rounded-sm shadow-none'
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2
                  className='h-4 w-4 mr-2 animate-spin'
                  aria-hidden='true'
                />
                Resetting password...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>

          <Button
            type='button'
            onClick={() => {
              if (
                window.confirm(
                  'Going back will require you to re-verify your code. Continue?'
                )
              ) {
                setStep('otp')
              }
            }}
            className='w-full bg-transparent hover:bg-gray-50 text-black font-medium text-sm rounded-sm border border-gray-300 transition-all duration-300'
            disabled={isSubmitting}
          >
            <ArrowLeft className='h-4 w-4 mr-2' aria-hidden='true' />
            Back
          </Button>
        </form>
      </CardContent>
    </Card>
  )

  // Render success step with animation
  const renderSuccessStep = () => (
    <Card className='bg-white border-gray-300 mt-2 shadow-lg rounded-xl overflow-hidden'>
      <CardContent className='p-6'>
        <div className='flex flex-col items-center text-center'>
          <div className='w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 animate-bounce-slow'>
            <CheckCircle
              className='h-10 w-10 text-green-500'
              aria-hidden='true'
            />
          </div>
          <h2 className='text-2xl font-semibold text-black mb-3'>Success!</h2>
          <p className='text-gray-500 mb-8'>
            Your password has been reset successfully. You can now log in with
            your new password.
          </p>
          <Button
            onClick={onBack}
            className='w-full bg-sky-500 hover:bg-sky-400 transition-all duration-300 text-white font-medium text-base rounded-sm shadow-none'
          >
            Return to Log In
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  // Render the current step
  const renderCurrentStep = () => {
    switch (step) {
      case 'email':
        return renderEmailStep()
      case 'otp':
        return renderOtpStep()
      case 'newPassword':
        return renderPasswordStep()
      case 'success':
        return renderSuccessStep()
      default:
        return renderEmailStep()
    }
  }

  return (
    <div className='w-full max-w-md mx-auto' role='main' aria-live='polite'>
      {renderCurrentStep()}
    </div>
  )
}

// Add CSS animation for success icon
const styles = `
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
.animate-bounce-slow {
  animation: bounce-slow 2s infinite;
}
`

// Add the styles to the document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style')
  styleElement.textContent = styles
  document.head.appendChild(styleElement)
}

export default ForgotPasswordFlow
