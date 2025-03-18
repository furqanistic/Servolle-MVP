import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'

const App = () => {
  useEffect(() => {
    document.body.style.margin = '0'
    document.body.style.padding = '0'
    document.body.style.backgroundColor = '#0b1425'
    document.body.style.overflow = 'hidden'
    document.body.style.fontFamily = '"Inter", sans-serif'

    return () => {
      document.body.style.margin = ''
      document.body.style.padding = ''
      document.body.style.backgroundColor = ''
      document.body.style.overflow = ''
      document.body.style.fontFamily = ''
    }
  }, [])

  // Text animation variants
  const letterVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  // Generate fewer stars for better performance
  const stars = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    animationDuration: Math.floor(Math.random() * 5 + 3),
    animationDelay: Math.floor(Math.random() * 5),
  }))

  // Text to animate
  const text = 'SERVOLLE'

  return (
    <div className='relative flex h-screen w-full items-center justify-center bg-blue-base text-white overflow-hidden'>
      {/* Stars background */}
      <div className='fixed inset-0 z-0'>
        {stars.map((star) => (
          <div
            key={star.id}
            className='absolute rounded-full bg-white star-blink'
            style={{
              width: star.size,
              height: star.size,
              left: `${star.x}%`,
              top: `${star.y}%`,
              animationDuration: `${star.animationDuration}s`,
              animationDelay: `${star.animationDelay}s`,
            }}
          />
        ))}
      </div>

      {/* CSS-based nebula effect instead of JS-driven motion */}
      <div className='fixed inset-0 z-0 opacity-15 nebula-effect' />

      {/* Static gradient orbs with pure CSS animation */}
      <div
        className='absolute w-96 h-96 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl -z-10 orb-animation-1'
        style={{ left: '30%', top: '20%' }}
      />

      <div
        className='absolute w-80 h-80 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-700/20 blur-3xl -z-10 orb-animation-2'
        style={{ right: '25%', top: '60%' }}
      />

      {/* Main content */}
      <div className='relative z-10 text-center px-4 py-6 max-w-4xl mx-auto'>
        {/* Main title with letter animation */}
        <div className='flex flex-wrap justify-center overflow-hidden mb-2 sm:mb-3'>
          {text.split('').map((letter, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              initial='hidden'
              animate='visible'
              className='inline-block text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-wider'
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </div>

        {/* Animated futuristic elements */}
        <div className='relative h-2 sm:h-3 w-40 sm:w-48 md:w-64 mx-auto mb-4 sm:mb-6 overflow-hidden'>
          <motion.div
            className='absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600'
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, delay: 1 }}
          />
          <div className='absolute top-0 h-full w-1 bg-white scanner-animation' />
        </div>

        {/* Tagline */}
        <motion.p
          className='text-sm text-blue-300 mt-8 max-w-md mx-auto'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3.5 }}
        >
          Servolle: The marketplace where talent meets demand. Launching March
          19, 2025.
        </motion.p>

        {/* Service icons */}
        <motion.div
          className='flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-12 my-6 sm:my-8'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.2 }}
        >
          {[
            { icon: '👩‍⚕️', label: 'Healthcare' },
            { icon: '🏠', label: 'Home' },
            { icon: '💻', label: 'Tech' },
            { icon: '🚗', label: 'Transport' },
            { icon: '🍽️', label: 'Food' },
          ].map((service, i) => (
            <div key={i} className='flex flex-col items-center hover-scale'>
              <div className='text-3xl sm:text-4xl mb-2'>{service.icon}</div>
              <div className='text-xs sm:text-sm text-blue-200'>
                {service.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Countdown timer */}
        <motion.div
          className='my-6 sm:my-8'
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.5 }}
        >
          <CountdownTimer targetDate={new Date('2025-03-19T23:00:00+05:00')} />
        </motion.div>

        {/* Added CSS styles for performance optimization */}
        <style jsx global>{`
          /* Star blinking animation */
          @keyframes starBlink {
            0%,
            100% {
              opacity: 0.1;
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.2);
            }
          }

          .star-blink {
            animation: starBlink var(--duration, 4s) infinite both;
            animation-delay: var(--delay, 0s);
          }

          /* Nebula effect animation */
          @keyframes nebulaMove {
            0% {
              background-position: 0% 0%;
            }
            100% {
              background-position: 100% 100%;
            }
          }

          .nebula-effect {
            background: radial-gradient(
              circle at 50% 50%,
              rgba(59, 130, 246, 0.2) 0%,
              rgba(16, 25, 65, 0) 40%
            );
            background-size: 200% 200%;
            animation: nebulaMove 30s infinite alternate ease-in-out;
          }

          /* Orb animations */
          @keyframes orbFloat1 {
            0% {
              transform: translate(0, 0);
            }
            50% {
              transform: translate(30px, -20px);
            }
            100% {
              transform: translate(0, 0);
            }
          }

          @keyframes orbFloat2 {
            0% {
              transform: translate(0, 0);
            }
            50% {
              transform: translate(-20px, 30px);
            }
            100% {
              transform: translate(0, 0);
            }
          }

          .orb-animation-1 {
            animation: orbFloat1 20s infinite ease-in-out;
          }

          .orb-animation-2 {
            animation: orbFloat2 25s infinite ease-in-out;
          }

          /* Scanner animation */
          @keyframes scannerMove {
            0% {
              left: 0%;
              opacity: 0;
            }
            10% {
              opacity: 0.8;
            }
            90% {
              opacity: 0.8;
            }
            100% {
              left: 100%;
              opacity: 0;
            }
          }

          .scanner-animation {
            animation: scannerMove 8s infinite;
            animation-delay: 2s;
          }

          /* Simple hover scale */
          .hover-scale {
            transition: transform 0.3s ease;
          }

          .hover-scale:hover {
            transform: scale(1.1);
          }
        `}</style>
      </div>
    </div>
  )
}

// Countdown timer component
const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate))

  function calculateTimeLeft(targetDate) {
    const difference = targetDate - new Date()

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className='flex justify-center gap-2 sm:gap-4 md:gap-6 text-center'>
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className='flex flex-col items-center'>
          <div className='relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-blue-900/50 rounded-lg flex items-center justify-center backdrop-blur-lg timer-box'>
            <div className='absolute inset-0 border border-blue-500 rounded-lg timer-pulse' />
            <span className='text-xl sm:text-2xl md:text-3xl font-bold'>
              {value}
            </span>
          </div>
          <span className='text-xs sm:text-sm text-blue-300 capitalize mt-2'>
            {unit}
          </span>
        </div>
      ))}

      <style jsx>{`
        @keyframes timerPulse {
          0%,
          100% {
            box-shadow: 0 0 0px rgba(59, 130, 246, 0);
          }
          50% {
            box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
          }
        }

        .timer-pulse {
          animation: timerPulse 3s infinite ease-in-out;
        }

        .timer-box {
          transition: transform 0.3s ease;
        }

        .timer-box:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  )
}

export default App
