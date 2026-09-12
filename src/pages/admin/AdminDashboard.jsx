import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FaDollarSign,
  FaReceipt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUsers,
  FaUtensils,
  FaTags,
  FaCalendarAlt,
  FaArrowRight,
  FaSync,
} from 'react-icons/fa'
import api from '../../api/axios'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadStats = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/admin/stats')
      setStats(res.data)
    } catch (err) {
      console.error('Failed to load admin stats:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-700 border-t-transparent mx-auto mb-3"></div>
        <p className="text-xs text-[#7A695E]">Loading dashboard metrics...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#3B2314] tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-[#7A695E] mt-1">
            Real-time cafe revenue, pending orders, and business metrics.
          </p>
        </div>

        <button
          onClick={loadStats}
          className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold bg-white border border-[#DED4C7] text-[#543825] hover:bg-[#FAF6F0] transition-all flex items-center gap-1.5 shadow-2xs"
        >
          <FaSync className="w-3 h-3 text-amber-800" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-[#EBE2D7] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#8C7A6E] uppercase">Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm">
              <FaDollarSign />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#3B2314]">
            ${stats?.totalRevenue?.toFixed(2) || '0.00'}
          </div>
          <p className="text-[10px] text-emerald-700 font-semibold">From all confirmed orders</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-3xl border border-[#EBE2D7] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#8C7A6E] uppercase">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center text-sm">
              <FaReceipt />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#3B2314]">
            {stats?.totalOrders || 0}
          </div>
          <p className="text-[10px] text-[#8C7A6E]">{stats?.todayOrders || 0} placed today</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-3xl border border-[#EBE2D7] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#8C7A6E] uppercase">Pending Orders</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center text-sm">
              <FaClock />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-800">
            {stats?.pendingOrders || 0}
          </div>
          <p className="text-[10px] text-amber-700 font-semibold">Requires kitchen action</p>
        </div>

        {/* Low Stock Items Alert */}
        <div className="bg-white p-5 rounded-3xl border border-[#EBE2D7] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#8C7A6E] uppercase">Low Stock Alerts</span>
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-800 flex items-center justify-center text-sm">
              <FaExclamationTriangle />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-700">
            {stats?.lowStockItems || 0}
          </div>
          <p className="text-[10px] text-red-600 font-semibold">Below minimum threshold</p>
        </div>

      </div>

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-[#EBE2D7] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <FaUsers />
          </div>
          <div>
            <div className="text-lg font-black text-[#3B2314]">{stats?.totalCustomers || 0}</div>
            <div className="text-[11px] text-[#8C7A6E]">Customers</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#EBE2D7] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <FaUtensils />
          </div>
          <div>
            <div className="text-lg font-black text-[#3B2314]">{stats?.totalMenuItems || 0}</div>
            <div className="text-[11px] text-[#8C7A6E]">Menu Items</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#EBE2D7] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <FaTags />
          </div>
          <div>
            <div className="text-lg font-black text-[#3B2314]">{stats?.totalCategories || 0}</div>
            <div className="text-[11px] text-[#8C7A6E]">Categories</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#EBE2D7] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <FaCalendarAlt />
          </div>
          <div>
            <div className="text-lg font-black text-[#3B2314]">{stats?.activeReservations || 0}</div>
            <div className="text-[11px] text-[#8C7A6E]">Active Bookings</div>
          </div>
        </div>

      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-[#EBE2D7] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-base font-extrabold text-[#3B2314]">Recent Customer Orders</h2>
            <p className="text-xs text-[#7A695E]">Latest incoming orders from customers</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-[#6F4E37] hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <FaArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {stats?.recentOrders?.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#8C7A6E]">
            No recent orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-[#8C7A6E] uppercase text-[10px]">
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[#3B2314]">
                {stats?.recentOrders?.map((order) => (
                  <tr key={order._id} className="hover:bg-[#FAF6F0]/50">
                    <td className="py-3 px-3 font-mono font-bold">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3 px-3 font-semibold">
                      {order.customerName}
                      <span className="block text-[10px] text-[#8C7A6E] font-normal">{order.email}</span>
                    </td>
                    <td className="py-3 px-3 text-[#6F5D53]">
                      {order.items?.map((i) => `${i.foodName} (${i.quantity})`).join(', ')}
                    </td>
                    <td className="py-3 px-3 font-black text-[#6F4E37]">
                      ${order.total?.toFixed(2)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          order.orderStatus === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.orderStatus === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#8C7A6E]">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}
