import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FaCoffee, FaShoppingCart, FaUserCircle, FaShieldAlt } from 'react-icons/fa'
import { HiMenuAlt3, HiX, HiOutlineLogout } from 'react-icons/hi'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, dbUser, isAdmin, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setDropdownOpen(false)
      closeMenu()
      navigate('/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const navItemClass = ({ isActive }) =>
    `px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
      isActive
        ? 'bg-white text-[#3B2314] shadow-xs'
        : 'text-[#6F5D53] hover:text-[#3B2314] hover:bg-white/50'
    }`

  return (
    <header className="sticky top-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#EADDD0] shadow-xs transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-3 group focus:outline-none rounded-lg"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-700 via-[#6F4E37] to-[#3B2314] flex items-center justify-center text-amber-100 shadow-md group-hover:scale-105 transition-all duration-200">
              <FaCoffee className="text-xl group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl text-[#3B2314] tracking-tight block group-hover:text-amber-800 transition-colors">
                Cafe Delight
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-800/80 -mt-1 block">
                Management System
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#F4EDE4]/60 p-1.5 rounded-2xl border border-[#EBE2D7]">
            <NavLink to="/" className={navItemClass}>
              Home
            </NavLink>
            <NavLink to="/menu" className={navItemClass}>
              Menu
            </NavLink>
            <NavLink to="/reservations" className={navItemClass}>
              Book Table
            </NavLink>
            <NavLink to="/about" className={navItemClass}>
              About
            </NavLink>
            {user && (
              <NavLink to="/my-orders" className={navItemClass}>
                My Orders
              </NavLink>
            )}
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-800 text-white shadow-xs'
                      : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                  }`
                }
              >
                <FaShieldAlt className="w-3.5 h-3.5" />
                <span>Admin</span>
              </NavLink>
            )}
          </nav>

          {/* Right Actions: Cart & Profile/Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Cart Button with Count Badge */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl bg-[#F4EDE4] hover:bg-[#EBE2D7] text-[#4A3B32] transition-colors focus:outline-none focus:ring-2 focus:ring-amber-600/30"
              aria-label="Shopping Cart"
            >
              <FaShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-600 to-red-600 text-white text-[11px] font-black rounded-full h-5 w-5 flex items-center justify-center shadow-md animate-pulse">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {user ? (
              /* User Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 bg-[#F4EDE4]/80 hover:bg-[#EFE6DC] py-1.5 pl-2 pr-3 rounded-2xl border border-[#E8DFD3] transition-all focus:outline-none"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-8 h-8 rounded-full object-cover border border-amber-300 shadow-xs"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#6F4E37] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-bold text-[#3B2314] max-w-[110px] truncate">
                    {user.displayName || user.email.split('@')[0]}
                  </span>
                  {isAdmin && (
                    <span className="bg-amber-700 text-white text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider uppercase">
                      Admin
                    </span>
                  )}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#EBE2D7] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-bold text-[#3B2314] truncate">
                        {user.displayName || 'Customer'}
                      </p>
                      <p className="text-[11px] text-[#8C7A6E] truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#4A3B32] hover:bg-amber-50 hover:text-amber-900 transition-colors"
                      >
                        <FaUserCircle className="w-4 h-4 text-amber-700" />
                        <span>My Profile & Stats</span>
                      </Link>
                      <Link
                        to="/my-orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#4A3B32] hover:bg-amber-50 hover:text-amber-900 transition-colors"
                      >
                        <FaCoffee className="w-4 h-4 text-amber-700" />
                        <span>Order History & Tracking</span>
                      </Link>
                      <Link
                        to="/reservations"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#4A3B32] hover:bg-amber-50 hover:text-amber-900 transition-colors"
                      >
                        <span>📅 Table Reservations</span>
                      </Link>

                      {isAdmin && (
                        <div className="border-t border-amber-100 my-1 pt-1">
                          <Link
                            to="/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-amber-900 bg-amber-50/80 hover:bg-amber-100 transition-colors"
                          >
                            <FaShieldAlt className="w-4 h-4 text-amber-800" />
                            <span>Admin Management Panel</span>
                          </Link>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <HiOutlineLogout className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#6F4E37] hover:bg-[#F4EDE4] transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#6F4E37] hover:bg-[#543825] text-white shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Bar: Cart & Hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              to="/cart"
              className="relative p-2 rounded-lg bg-[#F4EDE4] text-[#4A3B32]"
              aria-label="Cart"
            >
              <FaShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-black rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={toggleMenu}
              type="button"
              className="p-2 rounded-lg text-[#6F4E37] hover:bg-[#F3ECE4] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <HiX className="w-6 h-6" /> : <HiMenuAlt3 className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-[#EADDD0] bg-[#FAF6F0] ${
          isOpen ? 'max-h-[500px] opacity-100 py-4 px-4 shadow-xl' : 'max-h-0 opacity-0 py-0 px-4'
        }`}
      >
        <div className="flex flex-col space-y-2">
          <NavLink to="/" onClick={closeMenu} className={navItemClass}>
            Home
          </NavLink>
          <NavLink to="/menu" onClick={closeMenu} className={navItemClass}>
            Menu
          </NavLink>
          <NavLink to="/reservations" onClick={closeMenu} className={navItemClass}>
            Book Table
          </NavLink>
          <NavLink to="/about" onClick={closeMenu} className={navItemClass}>
            About Us
          </NavLink>
          {user && (
            <>
              <NavLink to="/my-orders" onClick={closeMenu} className={navItemClass}>
                My Orders
              </NavLink>
              <NavLink to="/profile" onClick={closeMenu} className={navItemClass}>
                My Profile
              </NavLink>
            </>
          )}

          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={closeMenu}
              className="px-4 py-2.5 rounded-xl font-bold bg-amber-800 text-white flex items-center gap-2"
            >
              <FaShieldAlt />
              <span>Admin Panel</span>
            </NavLink>
          )}

          <div className="pt-3 border-t border-[#EBE2D7]">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full text-center py-2.5 rounded-xl font-bold bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="block text-center py-2 rounded-xl font-bold bg-[#F4EDE4] text-[#6F4E37]"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="block text-center py-2 rounded-xl font-bold bg-[#6F4E37] text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
