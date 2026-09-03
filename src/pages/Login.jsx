import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineMail, HiOutlineLockClosed, HiEye, HiEyeOff } from 'react-icons/hi'
import { FcGoogle } from 'react-icons/fc'
import { FaCoffee } from 'react-icons/fa'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    // Frontend demo UI submit simulation
    setTimeout(() => {
      setIsLoading(false)
      alert(`Login submitted with Email: ${formData.email}`)
    }, 600)
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-radial from-[#FAF6F0] to-[#F5ECE1]">
      <div className="w-full max-w-md">
        
        {/* Main Login Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-amber-950/5 border border-[#EBE3D7] p-8 sm:p-10 transition-all duration-300">
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-100/80 text-[#6F4E37] mb-4 shadow-inner ring-1 ring-amber-200">
              <FaCoffee className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3B2314] tracking-tight">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-[#7A695E]">
              Login to your account
            </p>
          </div>

          {/* Social Login Button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[#DFD7CC] bg-[#FCFAF8] hover:bg-[#F7F2EA] text-[#4A3B32] font-semibold text-sm transition-all duration-200 hover:shadow-xs active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-amber-600/30"
          >
            <FcGoogle className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E8DFC0]/80"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-[#9C8B7F] font-medium tracking-wider">
                or continue with email
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-xs font-bold uppercase tracking-wider text-[#54433A] mb-1.5"
              >
                Email Address
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9C8B7F]">
                  <HiOutlineMail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="barista@cafe.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3 rounded-xl border border-[#DED4C7] bg-[#FCFAF8] text-[#2C1810] placeholder-[#B5A599] text-sm focus:outline-none focus:ring-2 focus:ring-amber-700/40 focus:border-amber-700 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label 
                  htmlFor="password" 
                  className="block text-xs font-bold uppercase tracking-wider text-[#54433A]"
                >
                  Password
                </label>
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault()
                    alert('Password reset link will be sent to your registered email.')
                  }}
                  className="text-xs font-semibold text-amber-800 hover:text-amber-900 hover:underline transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9C8B7F]">
                  <HiOutlineLockClosed className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-11 py-3 rounded-xl border border-[#DED4C7] bg-[#FCFAF8] text-[#2C1810] placeholder-[#B5A599] text-sm focus:outline-none focus:ring-2 focus:ring-amber-700/40 focus:border-amber-700 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9C8B7F] hover:text-[#54433A] focus:outline-none transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <HiEyeOff className="w-5 h-5" />
                  ) : (
                    <HiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 rounded border-[#D0C4B6] text-[#6F4E37] focus:ring-amber-600 transition"
              />
              <label htmlFor="rememberMe" className="ml-2.5 block text-xs text-[#6F5D53]">
                Remember this device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-white bg-gradient-to-r from-[#6F4E37] to-[#543825] hover:from-[#5C402C] hover:to-[#432A1B] text-sm font-bold shadow-md shadow-amber-950/15 hover:shadow-lg hover:shadow-amber-950/25 active:scale-[0.99] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center text-sm text-[#7A695E]">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="font-bold text-[#6F4E37] hover:text-[#432A1B] hover:underline transition-colors"
            >
              Register
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
