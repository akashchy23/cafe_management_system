import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineMail, HiOutlineLockClosed, HiEye, HiEyeOff } from 'react-icons/hi'
import { FcGoogle } from 'react-icons/fc'
import { FaCoffee } from 'react-icons/fa'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

const API_URL = 'http://localhost:5000'

async function saveUserToDB(user, provider) {
  try {
    await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: user.uid,
        name: user.displayName || '',
        email: user.email,
        photoURL: user.photoURL || '',
        provider,
      }),
    })
  } catch (err) {
    console.error('Failed to sync user to database:', err)
  }
}

function getFriendlyError(code) {
  switch (code) {
    case 'auth/user-not-found': return 'No account found with this email.'
    case 'auth/wrong-password': return 'Incorrect password.'
    case 'auth/invalid-email': return 'Invalid email address.'
    case 'auth/invalid-credential': return 'Invalid email or password.'
    case 'auth/popup-closed-by-user': return 'Google sign-in was cancelled.'
    default: return 'Something went wrong. Please try again.'
  }
}

export default function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const result = await signInWithEmailAndPassword(auth, formData.email, formData.password)
      await saveUserToDB(result.user, 'email')
      navigate('/')
    } catch (err) {
      setError(getFriendlyError(err.code))
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setIsLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      await saveUserToDB(result.user, 'google')
      navigate('/')
    } catch (err) {
      setError(getFriendlyError(err.code))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-radial from-[#FAF6F0] to-[#F5ECE1]">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-amber-950/5 border border-[#EBE3D7] p-8 sm:p-10">

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-100/80 text-[#6F4E37] mb-4 shadow-inner ring-1 ring-amber-200">
              <FaCoffee className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3B2314] tracking-tight">Welcome Back</h1>
            <p className="mt-2 text-sm text-[#7A695E]">Login to your account</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[#DFD7CC] bg-[#FCFAF8] hover:bg-[#F7F2EA] text-[#4A3B32] font-semibold text-sm transition-all duration-200 hover:shadow-xs active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-amber-600/30 disabled:opacity-60"
          >
            <FcGoogle className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E8DFC0]/80"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-[#9C8B7F] font-medium tracking-wider">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#54433A] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9C8B7F]">
                  <HiOutlineMail className="w-5 h-5" />
                </div>
                <input
                  id="email" name="email" type="email" required autoComplete="email"
                  placeholder="barista@cafe.com" value={formData.email} onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3 rounded-xl border border-[#DED4C7] bg-[#FCFAF8] text-[#2C1810] placeholder-[#B5A599] text-sm focus:outline-none focus:ring-2 focus:ring-amber-700/40 focus:border-amber-700 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-[#54433A] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9C8B7F]">
                  <HiOutlineLockClosed className="w-5 h-5" />
                </div>
                <input
                  id="password" name="password" type={showPassword ? 'text' : 'password'} required
                  autoComplete="current-password" placeholder="••••••••"
                  value={formData.password} onChange={handleChange}
                  className="block w-full pl-11 pr-11 py-3 rounded-xl border border-[#DED4C7] bg-[#FCFAF8] text-[#2C1810] placeholder-[#B5A599] text-sm focus:outline-none focus:ring-2 focus:ring-amber-700/40 focus:border-amber-700 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9C8B7F] hover:text-[#54433A]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-white bg-gradient-to-r from-[#6F4E37] to-[#543825] hover:from-[#5C402C] hover:to-[#432A1B] text-sm font-bold shadow-md active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Authenticating...
                </span>
              ) : 'Login'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-[#7A695E]">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-bold text-[#6F4E37] hover:text-[#432A1B] hover:underline">Register</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
