import { FaCoffee, FaUserCheck } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 bg-radial from-[#FAF6F0] to-[#F5ECE1]">
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100/80 text-[#6F4E37] mb-6 shadow-inner ring-1 ring-amber-200">
          <FaCoffee className="w-8 h-8" />
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#3B2314] tracking-tight">
          Welcome to Cafe
        </h1>
        <p className="mt-3 text-base sm:text-lg text-[#7A695E] font-medium">
          Management System
        </p>

        {user ? (
          <div className="mt-8 p-6 bg-white/90 backdrop-blur-md rounded-2xl border border-[#EBE3D7] shadow-lg shadow-amber-950/5 text-left flex items-start gap-4">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-14 h-14 rounded-2xl object-cover border border-amber-300 shadow-sm"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-[#6F4E37] text-white flex items-center justify-center font-bold text-xl uppercase shadow-sm">
                {(user.displayName || user.email || 'U')[0]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-1.5">
                <FaUserCheck className="w-3 h-3" />
                <span>Authenticated</span>
              </div>
              <h2 className="text-lg font-bold text-[#3B2314] truncate">
                {user.displayName || 'Cafe Member'}
              </h2>
              <p className="text-xs text-[#7A695E] truncate">{user.email}</p>
              <p className="text-[11px] text-[#A8988B] mt-1">
                Synced with MongoDB Atlas Database
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold bg-[#6F4E37] hover:bg-[#573d2a] text-white shadow-md hover:shadow-lg hover:shadow-amber-950/20 active:scale-[0.98] transition-all duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold bg-white hover:bg-[#F9F5F0] text-[#6F4E37] border border-[#DED4C7] shadow-xs active:scale-[0.98] transition-all duration-200"
            >
              Create Account
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
