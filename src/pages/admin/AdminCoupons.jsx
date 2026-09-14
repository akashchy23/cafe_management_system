import { useState, useEffect } from 'react'
import {
  FaTags,
  FaPlus,
  FaEdit,
  FaTrash,
  FaPercent,
  FaDollarSign,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa'
import api from '../../api/axios'
import Swal from 'sweetalert2'

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)

  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 15,
    minimumPurchase: 10,
    usageLimit: 100,
    expiresAt: '',
    active: true,
  })
  const [submitting, setSubmitting] = useState(false)

  const loadCoupons = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/admin/coupons')
      setCoupons(res.data)
    } catch (err) {
      console.error('Failed to load coupons:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCoupons()
  }, [])

  const openAddModal = () => {
    setEditingCoupon(null)
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: 15,
      minimumPurchase: 10,
      usageLimit: 100,
      expiresAt: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      active: true,
    })
    setModalOpen(true)
  }

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType || 'percentage',
      discountValue: coupon.discountValue || coupon.discountAmount || 0,
      minimumPurchase: coupon.minimumPurchase || coupon.minOrderAmount || 0,
      usageLimit: coupon.usageLimit || 100,
      expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : '',
      active: coupon.active !== false,
    })
    setModalOpen(true)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      if (editingCoupon) {
        await api.patch(`/api/admin/coupons/${editingCoupon._id}`, formData)
        Swal.fire({
          icon: 'success',
          title: 'Coupon Updated!',
          confirmButtonColor: '#6F4E37',
        })
      } else {
        await api.post('/api/admin/coupons', formData)
        Swal.fire({
          icon: 'success',
          title: 'Coupon Created!',
          confirmButtonColor: '#6F4E37',
        })
      }
      setModalOpen(false)
      loadCoupons()
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.error || 'Failed to save coupon.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteCoupon = async (coupon) => {
    const confirm = await Swal.fire({
      title: `Delete coupon "${coupon.code}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete',
    })
    if (confirm.isConfirmed) {
      try {
        await api.delete(`/api/admin/coupons/${coupon._id}`)
        loadCoupons()
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete coupon' })
      }
    }
  }

  const handleToggleActive = async (coupon) => {
    try {
      await api.patch(`/api/admin/coupons/${coupon._id}`, { active: !coupon.active })
      loadCoupons()
    } catch (err) {
      console.error('Failed to toggle active:', err)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#3B2314] tracking-tight">
            Coupons & Promo Codes
          </h1>
          <p className="text-xs text-[#7A695E] mt-1">
            Create percentage or flat discount vouchers with usage limits and expiration validation.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#6F4E37] text-white hover:bg-[#543825] shadow-sm flex items-center gap-2"
        >
          <FaPlus />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl border border-[#EBE2D7] shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-amber-700 border-t-transparent mx-auto"></div>
          </div>
        ) : coupons.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#8C7A6E]">
            No coupons found. Click &ldquo;Create New Coupon&rdquo; to launch promotional discounts.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-[#8C7A6E] uppercase text-[10px] bg-[#FAF6F0]">
                  <th className="py-3.5 px-4">Coupon Code</th>
                  <th className="py-3.5 px-4">Discount Value</th>
                  <th className="py-3.5 px-4">Min. Spend</th>
                  <th className="py-3.5 px-4">Usage / Limit</th>
                  <th className="py-3.5 px-4">Expires</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[#3B2314]">
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-[#FAF6F0]/40 transition-colors">
                    <td className="py-3.5 px-4 font-black text-sm text-[#6F4E37] font-mono tracking-wide">
                      {coupon.code}
                    </td>

                    <td className="py-3.5 px-4 font-bold">
                      {coupon.discountType === 'percentage'
                        ? `${coupon.discountValue || coupon.discountAmount}% OFF`
                        : `$${coupon.discountValue || coupon.discountAmount} Flat OFF`}
                    </td>

                    <td className="py-3.5 px-4 text-[#54433A]">
                      ${coupon.minimumPurchase || coupon.minOrderAmount || 0}
                    </td>

                    <td className="py-3.5 px-4 text-[#8C7A6E]">
                      {coupon.usedCount || 0} / {coupon.usageLimit || '∞'} used
                    </td>

                    <td className="py-3.5 px-4 text-[#8C7A6E]">
                      {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'No Expiry'}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(coupon)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                          coupon.active !== false
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {coupon.active !== false ? (
                          <>
                            <FaCheckCircle className="w-2.5 h-2.5" /> Active
                          </>
                        ) : (
                          <>
                            <FaTimesCircle className="w-2.5 h-2.5" /> Inactive
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(coupon)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <FaEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCoupon(coupon)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <FaTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Coupon Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#EBE2D7] space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-xl font-extrabold text-[#3B2314]">
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SUMMER25"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED4C7] text-xs font-mono uppercase text-[#3B2314] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED4C7] text-xs font-bold text-[#3B2314] focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                    Min. Purchase ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minimumPurchase}
                    onChange={(e) => setFormData({ ...formData, minimumPurchase: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                  Expiration Date
                </label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded text-amber-700 focus:ring-amber-500"
                />
                <label htmlFor="activeCheck" className="text-xs font-bold text-[#3B2314]">
                  Active & Redeemable by Customers
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#6F4E37] hover:bg-[#543825]"
                >
                  {submitting ? 'Saving...' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
