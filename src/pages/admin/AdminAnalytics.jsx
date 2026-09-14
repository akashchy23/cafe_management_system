import { useState, useEffect } from 'react'
import {
  FaChartLine,
  FaDollarSign,
  FaShoppingBag,
  FaUtensils,
  FaTags,
  FaClock,
  FaCalendarAlt,
  FaArrowUp,
} from 'react-icons/fa'
import api from '../../api/axios'

export default function AdminAnalytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState('All')

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/admin/analytics')
      setData(res.data)
    } catch (err) {
      console.error('Failed to load analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-700 border-t-transparent mx-auto mb-3"></div>
        <p className="text-xs text-[#7A695E]">Generating sales analytics & charts...</p>
      </div>
    )
  }

  const maxRevenueTrend = Math.max(...(data?.revenueTrends?.map((t) => t.amount) || [100]), 50)

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#3B2314] tracking-tight">
            Sales & Revenue Analytics
          </h1>
          <p className="text-xs text-[#7A695E] mt-1">
            Visual performance breakdown by date, product categories, top-sellers, and ordering peaks.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-[#EBE2D7] text-xs font-bold">
          {['Today', 'This Week', 'This Month', 'All'].map((f) => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                timeFilter === f
                  ? 'bg-[#6F4E37] text-white shadow-xs'
                  : 'text-[#6F5D53] hover:text-[#3B2314]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#EBE2D7] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#8C7A6E] uppercase">Gross Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm">
              <FaDollarSign />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#3B2314]">
            ${data?.totalRevenue?.toFixed(2) || '0.00'}
          </div>
          <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
            <FaArrowUp /> Lifetime processed transactions
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#EBE2D7] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#8C7A6E] uppercase">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center text-sm">
              <FaShoppingBag />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#3B2314]">
            {data?.totalOrders || 0}
          </div>
          <p className="text-[10px] text-[#8C7A6E]">Across all customer channels</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#EBE2D7] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#8C7A6E] uppercase">Avg Order Value</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center text-sm">
              <FaChartLine />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-900">
            ${data?.averageOrderValue?.toFixed(2) || '0.00'}
          </div>
          <p className="text-[10px] text-amber-700 font-semibold">Per completed checkout</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#EBE2D7] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#8C7A6E] uppercase">Total Discounts</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center text-sm">
              <FaTags />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-700">
            ${data?.totalDiscount?.toFixed(2) || '0.00'}
          </div>
          <p className="text-[10px] text-rose-600 font-semibold">Redeemed via promo vouchers</p>
        </div>
      </div>

      {/* Visual Revenue Trend Chart (SVG Bar Chart) */}
      <div className="bg-white rounded-3xl border border-[#EBE2D7] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-lg font-extrabold text-[#3B2314]">Recent Daily Revenue Trend</h2>
            <p className="text-xs text-[#8C7A6E]">Aggregated sales per calendar day</p>
          </div>
          <span className="text-xs font-bold text-[#6F4E37] bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
            Past 14 Days
          </span>
        </div>

        {(!data?.revenueTrends || data.revenueTrends.length === 0) ? (
          <div className="py-12 text-center text-xs text-[#8C7A6E]">No sales data in this date range.</div>
        ) : (
          <div className="space-y-4">
            <div className="h-64 flex items-end gap-2 sm:gap-4 pt-8 pb-4 px-2 border-b border-gray-200">
              {data.revenueTrends.map((trend) => {
                const heightPct = Math.max(12, Math.min(100, (trend.amount / maxRevenueTrend) * 100))
                return (
                  <div key={trend.date} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#3B2314] text-white text-[10px] font-bold py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap shadow-md z-10">
                      ${trend.amount.toFixed(2)}
                    </div>
                    {/* Bar */}
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full max-w-[40px] bg-gradient-to-t from-[#6F4E37] to-amber-500 rounded-t-xl transition-all duration-500 group-hover:from-amber-700 group-hover:to-amber-400 shadow-xs"
                    ></div>
                    {/* Date label */}
                    <span className="text-[10px] font-bold text-[#8C7A6E] rotate-45 sm:rotate-0 mt-1">
                      {trend.date.slice(5)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Category Performance & Best-Selling Foods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Category Performance */}
        <div className="bg-white rounded-3xl border border-[#EBE2D7] p-6 sm:p-8 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-base font-extrabold text-[#3B2314]">Category Revenue Breakdown</h2>
            <p className="text-xs text-[#8C7A6E]">Share of sales by culinary category</p>
          </div>

          <div className="space-y-4">
            {data?.popularCategories?.map((cat) => {
              const pct = data.totalRevenue > 0 ? Math.round((cat.revenue / data.totalRevenue) * 100) : 0
              return (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#3B2314]">
                    <span>{cat.name}</span>
                    <span className="text-[#6F4E37] font-black">${cat.revenue.toFixed(2)} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full bg-gradient-to-r from-amber-600 to-[#6F4E37] rounded-full"
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Best-Selling Foods */}
        <div className="bg-white rounded-3xl border border-[#EBE2D7] p-6 sm:p-8 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-base font-extrabold text-[#3B2314]">Top Best-Selling Menu Items</h2>
            <p className="text-xs text-[#8C7A6E]">Highest volume dishes and specialty coffees</p>
          </div>

          <div className="divide-y divide-gray-100">
            {data?.topSellingFoods?.map((food, idx) => (
              <div key={food.name} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-xs">
                    #{idx + 1}
                  </div>
                  <span className="font-bold text-xs text-[#3B2314]">{food.name}</span>
                </div>
                <span className="font-black text-xs text-[#6F4E37] bg-[#FAF6F0] px-2.5 py-1 rounded-lg border border-[#E8DFD3]">
                  {food.count} units sold
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}
