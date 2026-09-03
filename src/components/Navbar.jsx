import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FaCoffee } from 'react-icons/fa'
import { HiMenuAlt3, HiX } from 'react-icons/hi'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <header className="sticky top-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#EADDD0] shadow-xs transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left Side: Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-800 via-[#6F4E37] to-[#3B2314] flex items-center justify-center text-amber-100 shadow-md group-hover:scale-105 transition-all duration-200">
              <FaCoffee className="text-lg group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="font-bold text-lg sm:text-xl text-[#3B2314] tracking-tight group-hover:text-amber-800 transition-colors">
              Cafe Management System
            </span>
          </Link>

          {/* Middle: 2 Links (Home & About Us) */}
          <nav className="hidden md:flex items-center gap-1 bg-[#F4EDE4]/60 p-1.5 rounded-xl border border-[#EBE2D7]">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-[#3B2314] shadow-xs'
                    : 'text-[#6F5D53] hover:text-[#3B2314] hover:bg-white/50'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-[#3B2314] shadow-xs'
                    : 'text-[#6F5D53] hover:text-[#3B2314] hover:bg-white/50'
                }`
              }
            >
              About Us
            </NavLink>
          </nav>

          {/* Right Side: Login Button */}
          <div className="hidden md:flex items-center">
            <Link
              to="/login"
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[#6F4E37] hover:bg-[#573d2a] text-white shadow-sm hover:shadow-md hover:shadow-amber-950/20 active:scale-[0.98] transition-all duration-200"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              type="button"
              className="p-2.5 rounded-lg text-[#6F4E37] hover:bg-[#F3ECE4] focus:outline-none focus:ring-2 focus:ring-amber-700 transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <HiX className="w-6 h-6" /> : <HiMenuAlt3 className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-[#EADDD0] bg-[#FAF6F0] ${
          isOpen ? 'max-h-64 opacity-100 py-4 px-4 shadow-lg' : 'max-h-0 opacity-0 py-0 px-4'
        }`}
      >
        <div className="flex flex-col space-y-2">
          <NavLink
            to="/"
            onClick={closeMenu}
            className={({ isActive }) =>
              `px-4 py-2.5 rounded-lg text-base font-semibold transition-colors ${
                isActive
                  ? 'bg-amber-200/70 text-[#432311]'
                  : 'text-[#6F5D53] hover:bg-[#F0E6DA] hover:text-[#3B2314]'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            onClick={closeMenu}
            className={({ isActive }) =>
              `px-4 py-2.5 rounded-lg text-base font-semibold transition-colors ${
                isActive
                  ? 'bg-amber-200/70 text-[#432311]'
                  : 'text-[#6F5D53] hover:bg-[#F0E6DA] hover:text-[#3B2314]'
              }`
            }
          >
            About Us
          </NavLink>
          <Link
            to="/login"
            onClick={closeMenu}
            className="w-full text-center mt-2 px-4 py-2.5 rounded-lg font-bold bg-[#6F4E37] text-white hover:bg-[#573d2a] shadow-sm transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  )
}
