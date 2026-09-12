import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaCoffee, FaArrowRight, FaClock, FaCheckCircle, FaTruck, FaTimesCircle, FaReceipt } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function MyOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true)
        const res = await api.get('/api/orders/my-orders', {
          params: { userId: user?.uid, email: user?.email },
        })
        if (res.data) {
          setOrders(res.data)
        } else if (user) {
          const local = JSON.parse(localStorage.getItem(`orders_${user.uid}`) || '[]')
          setOrders(local)
        }
      } catch (err) {
        if (user) {
          const local = JSON.parse(localStorage.getItem(`orders_${user.uid}`) || '[]')
          setOrders(local)
        }
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [user])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-900 border-amber-300'
      case 'Confirmed':
        return 'bg-blue-100 text-blue-900 border-blue-300'
      case 'Preparing':
        return 'bg-purple-100 text-purple-900 border-purple-300'
      case 'Ready':
        return 'bg-teal-100 text-teal-900 border-teal-300'
      case 'Out for Delivery':
        return 'bg-indigo-100 text-indigo-900 border-indigo-300'
      case 'Completed':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300'
      case 'Cancelled':
        return 'bg-red-100 text-red-900 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-700 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] py-10 px-4 sm:px-6 lg:px-8 bg-radial from-[#FAF6F0] to-[#F5ECE1]">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#3B2314] tracking-tight">
              My Orders & Receipts
            </h1>
            <p className="text-xs text-[#7A695E] mt-1">
              Track the progress of your active orders and review order history.
            </p>
          </div>
          <Link
            to="/menu"
            className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold bg-[#6F4E37] text-white hover:bg-[#543825] transition-all"
          >
            Order New Food
          </Link>
        </div>

        {/* Orders list */}
        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white/90 rounded-3xl border border-[#EBE2D7] p-8 max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-[#6F4E37] flex items-center justify-center mx-auto mb-4">
              <FaReceipt className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-[#3B2314]">No Orders Yet</h2>
            <p className="text-xs text-[#7A695E] mt-1 mb-6">
              You haven&apos;t placed any cafe orders yet. Treat yourself to our specialty brews!
            </p>
            <Link
              to="/menu"
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-[#6F4E37] text-white hover:bg-[#543825] transition-all inline-block"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl border border-[#EBE2D7] p-6 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#3B2314]">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${getStatusBadge(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8C7A6E] mt-1">
                      Placed on {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right sm:text-right">
                    <span className="text-base font-black text-[#6F4E37]">
                      ${order.total?.toFixed(2)}
                    </span>
                    <p className="text-[11px] text-[#8C7A6E]">
                      {order.paymentMethod} • <span className="font-semibold">{order.paymentStatus}</span>
                    </p>
                  </div>
                </div>

                {/* Items snapshot */}
                <div className="flex flex-wrap gap-2 items-center">
                  {order.items?.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[#FAF6F0] rounded-xl text-xs font-semibold text-[#543825] border border-[#EAE1D4]"
                    >
                      {item.foodName} × {item.quantity}
                    </span>
                  ))}
                </div>

                {/* Action button */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-[#7A695E]">
                    Delivery: {order.address}
                  </span>

                  <Link
                    to={`/my-orders/${order._id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#6F4E37] bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all"
                  >
                    <span>Track Order Progress</span>
                    <FaArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}