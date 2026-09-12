import { Link } from 'react-router-dom'
import { FaCoffee, FaMapMarkerAlt, FaPhoneAlt, FaClock, FaHeart } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-[#2C1810] text-[#E0D3C5] pt-14 pb-8 border-t border-[#3D251A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#432A1F]">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-[#6F4E37] flex items-center justify-center text-white shadow-md">
                <FaCoffee className="text-lg" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                Cafe Delight
              </span>
            </Link>
            <p className="text-xs text-[#B5A496] leading-relaxed">
              Crafting premium artisan coffee, fresh bakery specialties, and delicious dishes in an elegant, cozy atmosphere.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-xs text-[#C5B5A7]">
              <li>
                <Link to="/menu" className="hover:text-amber-400 transition-colors">
                  Food & Beverage Menu
                </Link>
              </li>
              <li>
                <Link to="/reservations" className="hover:text-amber-400 transition-colors">
                  Table Reservations
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition-colors">
                  About Our Story
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="hover:text-amber-400 transition-colors">
                  Track My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <FaClock className="text-amber-500" />
              <span>Opening Hours</span>
            </h3>
            <ul className="space-y-2 text-xs text-[#C5B5A7]">
              <li className="flex justify-between">
                <span>Mon – Fri:</span>
                <span className="font-semibold text-white">7:00 AM – 9:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span className="font-semibold text-white">8:00 AM – 10:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span className="font-semibold text-white">8:00 AM – 8:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Contact & Location
            </h3>
            <ul className="space-y-2.5 text-xs text-[#C5B5A7]">
              <li className="flex items-start gap-2.5">
                <FaMapMarkerAlt className="text-amber-500 mt-0.5 shrink-0" />
                <span>124 Roasted Bean Avenue, Artisan District, Suite 400</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FaPhoneAlt className="text-amber-500 shrink-0" />
                <span>+1 (800) 555-CAFE</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#9E8C7F] gap-3">
          <p>© {new Date().getFullYear()} Cafe Delight Management System. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <FaHeart className="text-amber-600 w-3 h-3" /> for exceptional cafe experiences.
          </p>
        </div>
      </div>
    </footer>
  )
}
