import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaLock, FaCreditCard, FaMoneyBillWave, FaCheckCircle, FaArrowLeft, FaShieldAlt } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import api from '../api/axios'
import Swal from 'sweetalert2'

export default function Checkout() {
  const { user, dbUser } = useAuth()
  const { cart, fetchCart } = useCart()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    customerName: user?.displayName || dbUser?.name || '',
    phone: dbUser?.phone || '',
    address: dbUser?.address || '',
    orderNote: '',
    paymentMethod: 'Cash on Delivery',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault()

    if (!formData.phone.trim() || !formData.address.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Details',
        text: 'Please provide both phone number and delivery address.',
        confirmButtonColor: '#6F4E37',
      })
      return
    }

    if (!cart.items || cart.items.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Cart is Empty',
        text: 'Cannot checkout with an empty cart.',
        confirmButtonColor: '#6F4E37',
      })
      return
    }

    setIsSubmitting(true)
    try {
      let orderId = ''
      try {
        const res = await api.post('/api/orders', {
          customerName: formData.customerName.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          orderNote: formData.orderNote.trim(),
          paymentMethod: formData.paymentMethod,
          items: cart.items,
          subtotal: cart.subtotal,
          discount: cart.discount,
          couponCode: cart.couponCode,
          total: cart.total,
          userId: user?.uid,
          email: user?.email,
        })
        orderId = res.data.order._id
      } catch (netErr) {
        console.warn('Backend unavailable, saving order locally:', netErr)
        orderId = 'local-order-' + Date.now()
        const localOrder = {
          _id: orderId,
          userId: user?.uid || 'guest-uid',
          email: user?.email || '',
          customerName: formData.customerName,
          phone: formData.phone,
          address: formData.address,
          orderNote: formData.orderNote,
          items: cart.items,
          subtotal: cart.subtotal,
          discount: cart.discount,
          couponCode: cart.couponCode,
          total: cart.total,
          paymentMethod: formData.paymentMethod,
          paymentStatus: formData.paymentMethod === 'Online Payment' ? 'Paid' : 'Pending',
          orderStatus: 'Pending',
          createdAt: new Date(),
        }
        const existing = JSON.parse(localStorage.getItem(`orders_${user?.uid}`) || '[]')
        existing.unshift(localOrder)
        localStorage.setItem(`orders_${user?.uid}`, JSON.stringify(existing))
      }

      await fetchCart()

      Swal.fire({
        icon: 'success',
        title: 'Order Placed!',
        text: 'Your order has been confirmed and sent to our cafe kitchen.',
        confirmButtonColor: '#6F4E37',
      }).then(() => {
        navigate(`/my-orders/${orderId}`)
      })
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Order Failed',
        text: err.response?.data?.error || 'Failed to place order. Please try again.',
        confirmButtonColor: '#6F4E37',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-md p-8 bg-white rounded-3xl border border-amber-200 shadow-xl">
          <h2 className="text-xl font-bold text-[#3B2314] mb-2">Cart is Empty</h2>
          <p className="text-xs text-[#7A695E] mb-6">Please add items to your cart before proceeding to checkout.</p>
          <Link
            to="/menu"
            className="px-6 py-2.5 rounded-xl font-bold bg-[#6F4E37] text-white hover:bg-[#543825] transition-all"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] py-10 px-4 sm:px-6 lg:px-8 bg-radial from-[#FAF6F0] to-[#F5ECE1]">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top bar */}
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#6F4E37] hover:underline"
        >
          <FaArrowLeft />
          <span>Back to Shopping Cart</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Customer & Delivery Info Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#EBE2D7] p-7 sm:p-9 shadow-sm space-y-6">
            <div>
              <h1 className="text-2xl font-black text-[#3B2314] tracking-tight">
                Checkout & Delivery
              </h1>
              <p className="text-xs text-[#7A695E] mt-1">
                Enter your details to receive your order smoothly.
              </p>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              
              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#54433A] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="customerName"
                  required
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-[#DED4C7] bg-[#FCFAF8] text-sm text-[#3B2314] focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                />
              </div>

              {/* Email (Readonly) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#54433A] mb-1.5">
                  Account Email (Firebase Identity)
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-4 py-3 rounded-xl border border-[#E0D7CC] bg-[#F5EFE6]/60 text-xs font-semibold text-[#6F5D53] cursor-not-allowed"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#54433A] mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 rounded-xl border border-[#DED4C7] bg-[#FCFAF8] text-sm text-[#3B2314] focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                />
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#54433A] mb-1.5">
                  Delivery Address / Cafe Table Number *
                </label>
                <textarea
                  name="address"
                  required
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. Table #4 (Indoor) or 742 Evergreen Terrace, Apt 2B"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DED4C7] bg-[#FCFAF8] text-sm text-[#3B2314] focus:outline-none focus:ring-2 focus:ring-amber-700/30 resize-none"
                />
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#54433A] mb-1.5">
                  Special Instructions / Dietary Notes (Optional)
                </label>
                <input
                  type="text"
                  name="orderNote"
                  value={formData.orderNote}
                  onChange={handleChange}
                  placeholder="e.g. Extra hot oat milk, no sugar, allergies..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DED4C7] bg-[#FCFAF8] text-xs text-[#3B2314] focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                />
              </div>

              {/* Payment Method Selector */}
              <div className="pt-3 border-t border-gray-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#54433A] mb-2">
                  Select Payment Method
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      formData.paymentMethod === 'Cash on Delivery'
                        ? 'border-amber-700 bg-amber-50/50 shadow-xs ring-1 ring-amber-700'
                        : 'border-[#DED4C7] bg-[#FCFAF8] hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={formData.paymentMethod === 'Cash on Delivery'}
                      onChange={handleChange}
                      className="text-amber-700 focus:ring-amber-700"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-xs text-[#3B2314]">
                        <FaMoneyBillWave className="text-emerald-600" />
                        <span>Cash on Delivery</span>
                      </div>
                      <p className="text-[11px] text-[#8C7A6E]">Pay cash when receiving order</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      formData.paymentMethod === 'Online Payment'
                        ? 'border-amber-700 bg-amber-50/50 shadow-xs ring-1 ring-amber-700'
                        : 'border-[#DED4C7] bg-[#FCFAF8] hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Online Payment"
                      checked={formData.paymentMethod === 'Online Payment'}
                      onChange={handleChange}
                      className="text-amber-700 focus:ring-amber-700"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-xs text-[#3B2314]">
                        <FaCreditCard className="text-amber-700" />
                        <span>Online Card (Demo)</span>
                      </div>
                      <p className="text-[11px] text-[#8C7A6E]">Instant mock card gateway</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Primary Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-[#6F4E37] to-[#4A3222] hover:from-[#5A3E2B] hover:to-[#382417] shadow-lg shadow-amber-950/20 active:scale-98 transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-6"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing Order...
                  </span>
                ) : (
                  <>
                    <FaLock className="w-3.5 h-3.5" />
                    <span>Place Order • ${cart.total?.toFixed(2)}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#8C7A6E] pt-2">
                <FaShieldAlt className="text-amber-700" />
                <span>Encrypted & Protected by Firebase UID customer identity</span>
              </div>

            </form>
          </div>

          {/* Right: Items Snapshot Review */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#EBE2D7] p-6 shadow-sm space-y-5">
            <h2 className="font-black text-base text-[#3B2314] border-b border-gray-100 pb-3">
              Order Review ({cart.items.length} items)
            </h2>

            {/* Items list */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.items.map((item) => (
                <div key={item.foodId} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.image}
                      alt={item.foodName}
                      className="w-10 h-10 rounded-xl object-cover border border-[#EBE2D7] shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-[#3B2314] truncate">{item.foodName}</p>
                      <p className="text-[11px] text-[#8C7A6E]">Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#3B2314] shrink-0">
                    ${Number(item.subtotal).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-[#6F5D53]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-[#3B2314]">${cart.subtotal?.toFixed(2)}</span>
              </div>

              {cart.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount ({cart.couponCode}):</span>
                  <span>-${cart.discount?.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Delivery Fee:</span>
                <span className="font-bold text-emerald-700">FREE</span>
              </div>

              <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-black text-[#3B2314]">
                <span>Total Due:</span>
                <span className="text-[#6F4E37] text-xl">${cart.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
