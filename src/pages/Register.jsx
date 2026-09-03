import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiEye, HiEyeOff } from 'react-icons/hi'
import { FcGoogle } from 'react-icons/fc'
import { FaCoffee } from 'react-icons/fa'

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match. Please verify.')
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      alert(`Registration submitted for: ${formData.fullName}`)
    }, 600)
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-10 sm:px-6 bg-radial from-[#FAF6F0] to-[#F5ECE1]">
      <div className="w-full max-w-md">
        
        {/* Compact & Clean Register Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-amber-950/5 border border-[#EBE3D7] p-7 sm:p-9 transition-all duration-300">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-100/80 text-[#6F4E37] mb-3 shadow-inner ring-1 ring-amber-200">
              <FaCoffee className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#3B2314] tracking-tight">
              Create an Account
            </h1>
            <p className="mt-1 text-xs text-[#7A695E]">
              Register to get started
            </p>
          </div>

          {/* Social Google Button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-[#DFD7CC] bg-[#FCFAF8] hover:bg-[#F7F2EA] text-[#4A3B32] font-semibold text-xs transition-all duration-200 hover:shadow-xs active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-amber-600/30"
          >
            <FcGoogle className="w-4 h-4" />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E8DFC0]/80"></div>
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-white px-3 text-[#9C8B7F] font-medium tracking-wider">
                or register with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* Full Name */}
            <div>
              <label 
                htmlFor="fullName" 
                className="block text-[11px] font-bold uppercase tracking-wider text-[#54433A] mb-1"
              >
                Full Name
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9C8B7F]">
                  <HiOutlineUser className="w-4 h-4" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="Arthur Dent"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DED4C7] bg-[#FCFAF8] text-[#2C1810] placeholder-[#B5A599] text-sm focus:outline-none focus:ring-2 focus:ring-amber-700/40 focus:border-amber-700 transition-all duration-200"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-[11px] font-bold uppercase tracking-wider text-[#54433A] mb-1"
              >
                Email Address
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9C8B7F]">
                  <HiOutlineMail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="barista@cafe.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DED4C7] bg-[#FCFAF8] text-[#2C1810] placeholder-[#B5A599] text-sm focus:outline-none focus:ring-2 focus:ring-amber-700/40 focus:border-amber-700 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-[11px] font-bold uppercase tracking-wider text-[#54433A] mb-1"
              >
                Password
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9C8B7F]">
                  <HiOutlineLockClosed className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#DED4C7] bg-[#FCFAF8] text-[#2C1810] placeholder-[#B5A599] text-sm focus:outline-none focus:ring-2 focus:ring-amber-700/40 focus:border-amber-700 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9C8B7F] hover:text-[#54433A] focus:outline-none transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label 
                htmlFor="confirmPassword" 
                className="block text-[11px] font-bold uppercase tracking-wider text-[#54433A] mb-1"
              >
                Confirm Password
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9C8B7F]">
                  <HiOutlineLockClosed className="w-4 h-4" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#DED4C7] bg-[#FCFAF8] text-[#2C1810] placeholder-[#B5A599] text-sm focus:outline-none focus:ring-2 focus:ring-amber-700/40 focus:border-amber-700 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9C8B7F] hover:text-[#54433A] focus:outline-none transition-colors"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-white bg-gradient-to-r from-[#6F4E37] to-[#543825] hover:from-[#5C402C] hover:to-[#432A1B] text-sm font-bold shadow-md shadow-amber-950/15 hover:shadow-lg hover:shadow-amber-950/25 active:scale-[0.99] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </span>
              ) : (
                'Register'
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center text-xs text-[#7A695E]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-[#6F4E37] hover:text-[#432A1B] hover:underline transition-colors"
            >
              Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
