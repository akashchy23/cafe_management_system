import { useState } from 'react'
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import {
  FaChartPie,
  FaUtensils,
  FaTags,
  FaReceipt,
  FaUsers,
  FaCalendarAlt,
  FaBoxes,
  FaTruck,
  FaDatabase,
  FaArrowLeft,
  FaBars,
  FaTimes,
  FaShieldAlt,
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Swal from 'sweetalert2'

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard Overview', icon: FaChartPie, end: true },
  { path: '/admin/orders', label: 'Customer Orders', icon: FaReceipt },
  { path: '/admin/menu', label: 'Food Menu Items', icon: FaUtensils },
  { path: '/admin/categories', label: 'Food Categories', icon: FaTags },
  { path: '/admin/customers', label: 'Customer Directory', icon: FaUsers },
  { path: '/admin/reservations', label: 'Table Reservations', icon: FaCalendarAlt },
  { path: '/admin/inventory', label: 'Inventory & Low Stock', icon: FaBoxes },
  { path: '/admin/suppliers', label: 'Suppliers Directory', icon: FaTruck },
]

export default function AdminLayout() {
  const { user, dbUser } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const navigate = useNavigate()

  const handleSeedDatabase = async () => {
    const confirm = await Swal.fire({
      title: 'Populate Sample Database?',
      text: 'This will seed initial categories, specialty foods, coupons, ingredients, and suppliers.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6F4E37',
      confirmButtonText: 'Seed Database',
    })

    if (confirm.isConfirmed) {
      setSeeding(true)
      try {
        const res = await api.post('/api/seed')
        Swal.fire({
          icon: 'success',
          title: 'Database Seeded!',
          text: res.data.message,
          confirmButtonColor: '#6F4E37',
        }).then(() => {
          window.location.reload()
        })
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Seed Error',
          text: 'Failed to seed database.',
          confirmButtonColor: '#6F4E37',
        })
      } finally {
        setSeeding(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col md:flex-row">
      
      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-[#2C1810] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <FaShieldAlt className="text-amber-400" />
          <span className="font-extrabold text-sm tracking-wide">Cafe Admin Panel</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-amber-200 hover:text-white"
        >
          {sidebarOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-30 h-screen w-64 bg-[#2C1810] text-[#E0D3C5] p-5 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          
          {/* Admin Brand */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 flex items-center justify-center text-white font-black text-lg shadow-md">
              <FaShieldAlt />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base tracking-tight leading-none">
                Admin Center
              </h2>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">
                Cafe Delight
              </span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-amber-700/80 text-white shadow-sm ring-1 ring-amber-500/30'
                        : 'text-[#C5B5A7] hover:bg-[#3D251A] hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-[#432A1F] space-y-3">
          
          {/* Quick Seed Button */}
          <button
            onClick={handleSeedDatabase}
            disabled={seeding}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-amber-900/60 hover:bg-amber-900 text-amber-200 rounded-xl text-xs font-bold border border-amber-800/40 transition-all disabled:opacity-50"
            title="Populate initial demo data"
          >
            <FaDatabase className="w-3.5 h-3.5" />
            <span>{seeding ? 'Seeding...' : 'Seed Sample Data'}</span>
          </button>

          {/* Back to Customer Store */}
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#A8988B] hover:text-white hover:bg-[#3D251A] transition-colors"
          >
            <FaArrowLeft className="w-3 h-3" />
            <span>Customer Storefront</span>
          </Link>

          {/* Admin User Info */}
          <div className="px-2 pt-1 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold text-xs uppercase">
              {(user?.email || 'A')[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user?.displayName || 'Admin'}</p>
              <p className="text-[10px] text-[#A8988B] truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Admin Outlet */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        <Outlet />
      </main>

    </div>
  )
}
