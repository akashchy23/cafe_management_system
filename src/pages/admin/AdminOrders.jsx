import { useState, useEffect } from 'react'
import { FaSearch, FaEye, FaFilter, FaReceipt, FaKey, FaPhoneAlt, FaMapMarkerAlt, FaSync } from 'react-icons/fa'
import api from '../../api/axios'
import Swal from 'sweetalert2'

const ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Ready',
  'Out for Delivery',
  'Completed',
  'Cancelled',
]

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  // Details Modal
  const [selectedOrder, setSelectedOrder] = useState(null)

  const loadOrders = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/admin/orders', {
        params: {
          search: search.trim() || undefined,
          status: statusFilter !== 'All' ? statusFilter : undefined,
        },
      })
      setOrders(res.data)
    } catch (err) {
      console.error('Failed to load admin orders:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [statusFilter])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    loadOrders()
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/api/admin/orders/${orderId}/status`, { status: newStatus })
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Order status updated to ${newStatus}`,
        showConfirmButton: false,
        timer: 1800,
      })
      loadOrders()
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus })
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update order status',
        confirmButtonColor: '#6F4E37',
      })
    }
  }

  const handleUpdatePaymentStatus = async (orderId, newPaymentStatus) => {
    try {
      await api.patch(`/api/admin/orders/${orderId}/payment-status`, { paymentStatus: newPaymentStatus })
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Payment status updated to ${newPaymentStatus}`,
        showConfirmButton: false,
        timer: 1800,
      })
      loadOrders()
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, paymentStatus: newPaymentStatus })
      }
    } catch (err) {
      console.error('Failed to update payment status:', err)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#3B2314] tracking-tight">
            Customer Orders Management
          </h1>
          <p className="text-xs text-[#7A695E] mt-1">
            Track kitchen preparation, dispatch deliveries, and update customer order statuses.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="self-start sm:self-auto px-4 py-2 bg-white border border-[#DED4C7] rounded-xl text-xs font-bold text-[#543825] hover:bg-[#FAF6F0] flex items-center gap-1.5 shadow-2xs"
        >
          <FaSync className="w-3 h-3 text-amber-800" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EBE2D7] shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <FaSearch className="absolute left-3.5 top-3 text-gray-400 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search by ID, name, email, UID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-14 py-2 rounded-xl border border-[#DED4C7] bg-[#FCFAF8] text-xs text-[#3B2314] focus:outline-none focus:ring-2 focus:ring-amber-700/30"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-2.5 py-1 bg-[#6F4E37] text-white text-[10px] font-bold rounded-lg"
          >
            Find
          </button>
        </form>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              statusFilter === 'All'
                ? 'bg-[#6F4E37] text-white'
                : 'bg-[#F4EDE4] text-[#6F5D53] hover:bg-[#EBE2D7]'
            }`}
          >
            All Orders ({orders.length})
          </button>

          {ORDER_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === status
                  ? 'bg-[#6F4E37] text-white'
                  : 'bg-[#F4EDE4] text-[#6F5D53] hover:bg-[#EBE2D7]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#EBE2D7] shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-amber-700 border-t-transparent mx-auto"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#8C7A6E]">
            No orders found matching the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-[#8C7A6E] uppercase text-[10px] bg-[#FAF6F0]">
                  <th className="py-3.5 px-4">Order ID & Date</th>
                  <th className="py-3.5 px-4">Customer Identity</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Order Status</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[#3B2314]">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#FAF6F0]/40 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-sm block text-[#3B2314]">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                      <span className="text-[10px] text-[#8C7A6E]">
                        {new Date(order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-sm text-[#3B2314]">{order.customerName}</p>
                      <p className="text-[11px] text-[#8C7A6E]">{order.email}</p>
                      <span className="text-[9px] font-mono text-[#A8988B] block truncate max-w-[120px]">
                        UID: {order.userId}
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-[200px]">
                      <div className="text-[11px] text-[#6F5D53] truncate">
                        {order.items?.map((i) => `${i.foodName} (×${i.quantity})`).join(', ')}
                      </div>
                      <span className="text-[10px] text-[#A8988B]">
                        {order.items?.length || 0} unique item(s)
                      </span>
                    </td>

                    <td className="py-3 px-4 font-black text-sm text-[#6F4E37]">
                      ${order.total?.toFixed(2)}
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => handleUpdatePaymentStatus(order._id, e.target.value)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                          order.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Failed">Failed</option>
                      </select>
                      <span className="block text-[9px] text-[#8C7A6E] mt-0.5">
                        {order.paymentMethod}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        className="text-xs font-bold px-2.5 py-1.5 rounded-xl border border-[#DED4C7] bg-[#FCFAF8] text-[#3B2314] focus:outline-none focus:ring-1 focus:ring-amber-700"
                      >
                        {ORDER_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 bg-amber-50 hover:bg-amber-100 text-[#6F4E37] rounded-xl transition-colors font-bold text-xs inline-flex items-center gap-1"
                        title="View Full Order Receipt"
                      >
                        <FaEye />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#EBE2D7] space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded">
                  Admin Receipt View
                </span>
                <h2 className="text-xl font-extrabold text-[#3B2314] mt-1">
                  Order #{selectedOrder._id.slice(-6).toUpperCase()}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Customer Details & UID */}
            <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#EBE2D7] space-y-2 text-xs">
              <h3 className="font-extrabold text-[#3B2314] uppercase text-[10px] tracking-wider">
                Customer & Firebase Identity
              </h3>
              <div className="grid grid-cols-2 gap-2 text-[#6F5D53]">
                <div>
                  <strong>Customer:</strong> {selectedOrder.customerName}
                </div>
                <div>
                  <strong>Email:</strong> {selectedOrder.email}
                </div>
                <div className="col-span-2 flex items-center gap-1 text-[11px] font-mono text-amber-900 bg-amber-100/60 p-1.5 rounded-lg">
                  <FaKey className="text-amber-700 shrink-0" />
                  <span className="truncate">Firebase UID: {selectedOrder.userId}</span>
                </div>
                <div>
                  <strong>Phone:</strong> {selectedOrder.phone}
                </div>
                <div>
                  <strong>Payment:</strong> {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})
                </div>
                <div className="col-span-2">
                  <strong>Delivery Address:</strong> {selectedOrder.address}
                </div>
                {selectedOrder.orderNote && (
                  <div className="col-span-2 italic text-amber-900 bg-white p-2 rounded border border-amber-200">
                    <strong>Note:</strong> {selectedOrder.orderNote}
                  </div>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <h3 className="font-extrabold text-xs uppercase text-[#3B2314] tracking-wider">
                Ordered Items
              </h3>
              <div className="divide-y divide-gray-100 border border-[#EBE2D7] rounded-2xl overflow-hidden">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      {item.image && (
                        <img src={item.image} alt="" className="w-9 h-9 rounded-lg object-cover" />
                      )}
                      <div>
                        <p className="font-bold text-[#3B2314]">{item.foodName}</p>
                        <p className="text-[10px] text-[#8C7A6E]">
                          Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-[#3B2314]">
                      ${Number(item.subtotal).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financials */}
            <div className="space-y-1.5 text-xs text-[#6F5D53] border-t border-gray-100 pt-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-[#3B2314]">${selectedOrder.subtotal?.toFixed(2)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount ({selectedOrder.couponCode}):</span>
                  <span>-${selectedOrder.discount?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-[#3B2314] pt-1">
                <span>Total Amount:</span>
                <span className="text-[#6F4E37]">${selectedOrder.total?.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#6F4E37] hover:bg-[#543825]"
              >
                Close Receipt
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
