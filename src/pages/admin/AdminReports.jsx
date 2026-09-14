import { useState, useEffect } from 'react'
import {
  FaFileAlt,
  FaDollarSign,
  FaDownload,
  FaPrint,
  FaCalendarAlt,
  FaReceipt,
  FaCheckCircle,
  FaClock,
} from 'react-icons/fa'
import api from '../../api/axios'

export default function AdminReports() {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const loadReport = async () => {
    try {
      setLoading(true)
      const params = {}
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate

      const res = await api.get('/api/admin/reports', { params })
      setReport(res.data)
    } catch (err) {
      console.error('Failed to load reports:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReport()
  }, [])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#3B2314] tracking-tight">
            Financial & Revenue Reports
          </h1>
          <p className="text-xs text-[#7A695E] mt-1">
            Exportable ledger of gross earnings, net revenue, applied discounts, and order statuses.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#6F4E37] text-white hover:bg-[#543825] shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <FaPrint />
          <span>Print / Save PDF</span>
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white p-5 rounded-3xl border border-[#EBE2D7] shadow-sm flex flex-col sm:flex-row sm:items-center gap-4 text-xs font-bold text-[#3B2314]">
        <div className="flex items-center gap-2 flex-1">
          <label className="text-gray-500 uppercase text-[10px]">From:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#DED4C7] bg-[#FCFAF8] focus:outline-none flex-1"
          />
        </div>

        <div className="flex items-center gap-2 flex-1">
          <label className="text-gray-500 uppercase text-[10px]">To:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#DED4C7] bg-[#FCFAF8] focus:outline-none flex-1"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadReport}
            className="px-5 py-2 rounded-xl bg-[#3B2314] hover:bg-[#2C1810] text-white font-bold transition-all shadow-xs"
          >
            Apply Filter
          </button>
          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate('')
                setEndDate('')
                api.get('/api/admin/reports').then((res) => setReport(res.data))
              }}
              className="px-3 py-2 text-gray-500 hover:text-gray-800"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Report Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#EBE2D7] shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-[#8C7A6E] uppercase">Gross Order Total</span>
          <div className="text-2xl font-black text-[#3B2314]">${report?.grossRevenue?.toFixed(2) || '0.00'}</div>
          <p className="text-[10px] text-gray-500">Before promotions</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#EBE2D7] shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-[#8C7A6E] uppercase">Discounts Granted</span>
          <div className="text-2xl font-black text-rose-700">-${report?.discounts?.toFixed(2) || '0.00'}</div>
          <p className="text-[10px] text-rose-600">Promotional savings</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#EBE2D7] shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-[#8C7A6E] uppercase">Net Realized Revenue</span>
          <div className="text-2xl font-black text-emerald-700">${report?.netRevenue?.toFixed(2) || '0.00'}</div>
          <p className="text-[10px] text-emerald-600">Actual collected revenue</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#EBE2D7] shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-[#8C7A6E] uppercase">Orders Breakdown</span>
          <div className="text-sm font-black text-[#3B2314] flex items-center gap-3 pt-1">
            <span className="text-emerald-700">{report?.paidOrders || 0} Paid</span>
            <span>•</span>
            <span className="text-amber-700">{report?.pendingOrders || 0} Pending</span>
          </div>
          <p className="text-[10px] text-gray-500">{report?.totalOrders || 0} Total Orders</p>
        </div>
      </div>

      {/* Transaction Records Table */}
      <div className="bg-white rounded-3xl border border-[#EBE2D7] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-extrabold text-sm text-[#3B2314]">Individual Order Receipts</h2>
          <span className="text-xs text-[#8C7A6E]">Showing recent transactions</span>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-amber-700 border-t-transparent mx-auto"></div>
          </div>
        ) : (!report?.orders || report.orders.length === 0) ? (
          <div className="py-12 text-center text-xs text-[#8C7A6E]">
            No transaction records match the specified date criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-[#8C7A6E] uppercase text-[10px] bg-[#FAF6F0]">
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Subtotal</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Net Total</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[#3B2314]">
                {report.orders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#FAF6F0]/40">
                    <td className="py-3 px-4 font-mono font-bold">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      {order.customerName}
                    </td>
                    <td className="py-3 px-4 text-[#6F5D53]">
                      ${(order.subtotal || order.total).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-rose-700 font-bold">
                      {order.discount ? `-$${order.discount.toFixed(2)}` : '$0.00'}
                    </td>
                    <td className="py-3 px-4 font-black text-[#6F4E37]">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          order.paymentStatus === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.paymentStatus || 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#8C7A6E]">
                      {new Date(order.createdAt).toLocaleDateString()}
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
