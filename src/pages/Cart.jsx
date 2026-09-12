import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaTrash, FaShoppingCart, FaArrowRight, FaTag, FaCheck, FaTimes } from 'react-icons/fa'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cart, loading, updateQuantity, removeFromCart, clearCart, applyCoupon, removeCoupon } = useCart()
  const [couponInput, setCouponInput] = useState('')
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const navigate = useNavigate()

  const handleApplyCoupon = async (e) => {
    e.preventDefault()
    if (!couponInput.trim()) return
    setIsApplyingCoupon(true)
    const success = await applyCoupon(couponInput.trim())
    if (success) setCouponInput('')
    setIsApplyingCoupon(false)
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-700 border-t-transparent"></div>
      </div>
    )
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 py-12 bg-radial from-[#FAF6F0] to-[#F5ECE1]">
        <div className="max-w-md w-full text-center p-8 bg-white/90 backdrop-blur-md rounded-3xl border border-[#EBE2D7] shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-[#6F4E37] flex items-center justify-center mx-auto mb-4 shadow-inner">
            <FaShoppingCart className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-[#3B2314] mb-2">Your Cart is Empty</h2>
          <p className="text-xs text-[#7A695E] mb-6">
            Looks like you haven&apos;t added any delicious food or beverages to your cart yet.
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-[#6F4E37] hover:bg-[#543825] text-white shadow-md transition-all active:scale-95"
          >
            <span>Explore Menu</span>
            <FaArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] py-10 px-4 sm:px-6 lg:px-8 bg-radial from-[#FAF6F0] to-[#F5ECE1]">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#3B2314] tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-xs text-[#7A695E] mt-1">
              Review and adjust your selected cafe specialties before checkout.
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1.5 self-start sm:self-auto py-1.5 px-3 rounded-lg hover:bg-red-50 transition-colors"
          >
            <FaTrash className="w-3 h-3" />
            <span>Clear Cart</span>
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl border border-[#EBE2D7] shadow-sm overflow-hidden divide-y divide-gray-100">
              {cart.items.map((item) => (
                <div
                  key={item.foodId}
                  className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-[#FAF7F2]/40 transition-colors"
                >
                  {/* Food Info */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={item.image}
                      alt={item.foodName}
                      className="w-16 h-16 rounded-2xl object-cover border border-[#EBE2D7] shrink-0"
                    />
                    <div>
                      <h3 className="font-extrabold text-sm text-[#3B2314]">
                        {item.foodName}
                      </h3>
                      <p className="text-xs text-[#8C7A6E] mt-0.5">
                        ${Number(item.price).toFixed(2)} each
                      </p>
                    </div>
                  </div>

                  {/* Quantity & Controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <div className="flex items-center border border-[#DED4C7] rounded-xl overflow-hidden bg-[#FCFAF8]">
                      <button
                        onClick={() => updateQuantity(item.foodId, item.quantity - 1)}
                        className="px-3 py-1.5 font-bold text-xs text-[#6F4E37] hover:bg-[#F4EDE4]"
                      >
                        -
                      </button>
                      <span className="px-3 py-1.5 text-xs font-black text-[#3B2314] min-w-[28px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.foodId, item.quantity + 1)}
                        className="px-3 py-1.5 font-bold text-xs text-[#6F4E37] hover:bg-[#F4EDE4]"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <span className="font-black text-sm text-[#3B2314]">
                        ${Number(item.subtotal).toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.foodId)}
                      className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Remove item"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                to="/menu"
                className="text-xs font-bold text-[#6F4E37] hover:underline flex items-center gap-1"
              >
                &larr; Add more items from Menu
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary & Coupon */}
          <div className="space-y-6">
            
            {/* Coupon Box */}
            <div className="bg-white rounded-3xl border border-[#EBE2D7] p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <FaTag className="text-[#6F4E37] w-4 h-4" />
                <h3 className="font-extrabold text-sm text-[#3B2314]">Have a Coupon Code?</h3>
              </div>

              {cart.couponCode ? (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <FaCheck className="w-3 h-3 text-emerald-600" />
                    <span>Applied: {cart.couponCode} (-${cart.discount?.toFixed(2)})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-gray-400 hover:text-red-600 text-xs p-1"
                    title="Remove coupon"
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. WELCOME20, CAFE10"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#DED4C7] bg-[#FCFAF8] text-xs font-bold uppercase placeholder:normal-case placeholder-[#B5A599] text-[#3B2314] focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingCoupon || !couponInput.trim()}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#6F4E37] hover:bg-[#543825] text-white shadow-xs disabled:opacity-50 transition-all active:scale-95"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Order Summary Card */}
            <div className="bg-white rounded-3xl border border-[#EBE2D7] p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-[#3B2314] border-b border-gray-100 pb-3">
                Order Summary
              </h3>

              <div className="space-y-2.5 text-xs text-[#6F5D53]">
                <div className="flex justify-between">
                  <span>Items Subtotal:</span>
                  <span className="font-bold text-[#3B2314]">${cart.subtotal?.toFixed(2)}</span>
                </div>

                {cart.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount ({cart.couponCode}):</span>
                    <span>-${cart.discount?.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Tax (included):</span>
                  <span className="font-bold text-[#3B2314]">$0.00</span>
                </div>

                <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-black text-[#3B2314]">
                  <span>Total Amount:</span>
                  <span className="text-[#6F4E37] text-xl">${cart.total?.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 px-4 rounded-2xl font-black text-sm bg-gradient-to-r from-[#6F4E37] to-[#4A3222] hover:from-[#5A3E2B] hover:to-[#382417] text-white shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>Proceed to Checkout</span>
                <FaArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
