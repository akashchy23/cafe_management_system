import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  FaCheckCircle,
  FaClock,
  FaUtensils,
  FaBox,
  FaTruck,
  FaSmile,
  FaTimesCircle,
  FaArrowLeft,
  FaSync,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaReceipt,
} from 'react-icons/fa'
import api from '../api/axios'

const STATUS_STEPS = [
  { key: 'Pending', label: 'Order Received', desc: 'Sent to cafe kitchen', icon: FaClock },
  { key: 'Confirmed', label: 'Order Confirmed', desc: 'Barista accepted order', icon: FaCheckCircle },
  { key: 'Preparing', label: 'Brewing & Cooking', desc: 'Freshly prepared for you', icon: FaUtensils },
  { key: 'Ready', label: 'Ready for Pickup', desc: 'Packaged & hot', icon: FaCheckCircle },
  { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'En route to your location', icon: FaTruck },
  { key: 'Completed', label: 'Completed & Enjoyed', desc: 'Enjoy your coffee & meal!', icon: FaSmile },
]

export default function OrderDetails() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const loadOrder = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true)
      const res = await api.get(`/api/orders/${id}`)
      setOrder(res.data)
      setError('')
    } catch (err) {
      // Check local storage
      const keys = Object.keys(localStorage).filter((k) => k.startsWith('orders_'))
      let found = null
      for (const k of keys) {
        const list = JSON.parse(localStorage.getItem(k) || '[]')
        const item = list.find((o) => o._id === id)
        if (item) {
          found = item
          break
        }
      }
      if (found) {
        setOrder(found)
        setError('')
      } else {
        setError(err.response?.data?.error || 'Failed to fetch order details.')
      }
    } finally {
      setLoading(false)
      if (isManual) setRefreshing(false)
    }
  }

  useEffect(() => {
    loadOrder()
    // Poll every 10 seconds for real-time order status changes
    const interval = setInterval(() => {
      loadOrder()
    }, 10000)
    return () => clearInterval(interval)
  }, [id])

  const getCurrentStepIndex = () => {
    if (!order || order.orderStatus === 'Cancelled') return -1
    return STATUS_STEPS.findIndex((s) => s.key === order.orderStatus)
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-700 border-t-transparent"></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-md p-8 bg-white rounded-3xl border border-amber-200 shadow-xl">
          <h2 className="text-xl font-bold text-[#3B2314] mb-2">Order Not Found</h2>
          <p className="text-xs text-[#7A695E] mb-6">{error || 'Unable to find this order.'}</p>
          <Link
            to="/my-orders"
            className="px-6 py-2.5 rounded-xl font-bold bg-[#6F4E37] text-white hover:bg-[#543825] transition-all"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  const currentStep = getCurrentStepIndex()

  return (
    <div className="min-h-[calc(100vh-5rem)] py-10 px-4 sm:px-6 lg:px-8 bg-radial from-[#FAF6F0] to-[#F5ECE1]">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation & Refresh Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/my-orders"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#6F4E37] hover:underline"
          >
            <FaArrowLeft />
            <span>Back to My Orders</span>
          </Link>

          <button
            onClick={() => loadOrder(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DED4C7] rounded-xl text-xs font-bold text-[#543825] hover:bg-[#FAF6F0] transition-all shadow-2xs"
          >
            <FaSync className={`w-3 h-3 ${refreshing ? 'animate-spin text-amber-700' : ''}`} />
            <span>Refresh Status</span>
          </button>
        </div>

        {/* Order Status Stepper Card */}
        <div className="bg-white rounded-3xl border border-[#EBE2D7] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md">
                Live Order Tracking
              </span>
              <h1 className="text-2xl font-black text-[#3B2314] mt-1.5">
                Order #{order._id.slice(-6).toUpperCase()}
              </h1>
              <p className="text-xs text-[#8C7A6E]">
                Placed on {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xl font-black text-[#6F4E37]">
                ${order.total?.toFixed(2)}
              </span>
              <div className="text-xs text-[#8C7A6E] mt-0.5">
                Status: <strong className="text-[#3B2314]">{order.orderStatus}</strong>
              </div>
            </div>
          </div>

          {/* Stepper Timeline */}
          {order.orderStatus === 'Cancelled' ? (
            <div className="p-5 bg-red-50 rounded-2xl border border-red-200 flex items-center gap-3 text-red-800">
              <FaTimesCircle className="w-6 h-6 text-red-600 shrink-0" />
              <div>
                <h3 className="font-bold text-sm">Order Cancelled</h3>
                <p className="text-xs text-red-700">This order has been cancelled by customer or admin.</p>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {STATUS_STEPS.map((step, idx) => {
                  const Icon = step.icon
                  const isCompleted = idx <= currentStep
                  const isCurrent = idx === currentStep

                  return (
                    <div
                      key={step.key}
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        isCurrent
                          ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-300'
                          : isCompleted
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                          : 'bg-gray-50 text-gray-400 border-gray-200 opacity-60'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl mx-auto mb-2 flex items-center justify-center text-sm ${
                          isCurrent
                            ? 'bg-white text-amber-700 shadow-sm'
                            : isCompleted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        <Icon />
                      </div>
                      <h4 className="font-bold text-xs leading-tight mb-0.5">{step.label}</h4>
                      <p className={`text-[10px] leading-tight ${isCurrent ? 'text-amber-100' : ''}`}>
                        {step.desc}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Detailed Receipt Card */}
        <div className="bg-white rounded-3xl border border-[#EBE2D7] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <FaReceipt className="text-[#6F4E37] w-4 h-4" />
            <h2 className="font-black text-base text-[#3B2314]">Order & Delivery Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Customer & Location */}
            <div className="space-y-3 bg-[#FCFAF8] p-4 rounded-2xl border border-[#EBE2D7]">
              <h3 className="font-bold text-[#3B2314] uppercase text-[11px] tracking-wider">
                Customer Information
              </h3>
              <div className="space-y-1 text-[#6F5D53]">
                <p><strong className="text-[#3B2314]">Name:</strong> {order.customerName}</p>
                <p><strong className="text-[#3B2314]">Email:</strong> {order.email}</p>
                <p className="flex items-center gap-1.5"><FaPhoneAlt className="text-amber-700" /> {order.phone}</p>
                <p className="flex items-start gap-1.5"><FaMapMarkerAlt className="text-amber-700 mt-0.5 shrink-0" /> {order.address}</p>
                {order.orderNote && (
                  <p className="mt-2 p-2 bg-amber-50 rounded-lg text-amber-900 border border-amber-200">
                    <strong>Note:</strong> {order.orderNote}
                  </p>
                )}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="space-y-3 bg-[#FCFAF8] p-4 rounded-2xl border border-[#EBE2D7]">
              <h3 className="font-bold text-[#3B2314] uppercase text-[11px] tracking-wider">
                Payment Info
              </h3>
              <div className="space-y-1.5 text-[#6F5D53]">
                <div className="flex justify-between">
                  <span>Method:</span>
                  <strong className="text-[#3B2314]">{order.paymentMethod}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status:</span>
                  <span className={`font-bold ${order.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                {order.couponCode && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Coupon Used:</span>
                    <strong>{order.couponCode}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ordered Items Table */}
          <div className="space-y-3">
            <h3 className="font-bold text-[#3B2314] uppercase text-[11px] tracking-wider">
              Ordered Food Items
            </h3>
            <div className="divide-y divide-gray-100 border border-[#EBE2D7] rounded-2xl overflow-hidden">
              {order.items?.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between text-xs hover:bg-[#FAF6F0]/50">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.foodName}
                        className="w-10 h-10 rounded-xl object-cover border border-[#EBE2D7]"
                      />
                    )}
                    <div>
                      <p className="font-extrabold text-[#3B2314]">{item.foodName}</p>
                      <p className="text-[#8C7A6E]">Quantity: {item.quantity} × ${Number(item.price).toFixed(2)}</p>
                    </div>
                  </div>
                  <span className="font-black text-sm text-[#3B2314]">
                    ${Number(item.subtotal).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-[#6F5D53] max-w-xs ml-auto">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-bold text-[#3B2314]">${order.subtotal?.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount:</span>
                <span>-${order.discount?.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-[#3B2314] pt-2 border-t border-gray-200">
              <span>Final Total:</span>
              <span className="text-[#6F4E37] text-lg">${order.total?.toFixed(2)}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}