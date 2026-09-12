import { useState, useEffect } from 'react'
import { FaUserCircle, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaKey, FaShieldAlt, FaReceipt, FaShoppingCart, FaCalendarAlt, FaEdit, FaSave } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import Swal from 'sweetalert2'

export default function Profile() {
  const { user, dbUser, isAdmin, updateUserProfile, makeAdmin } = useAuth()
  const { cartCount } = useCart()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: dbUser?.name || user?.displayName || '',
    phone: dbUser?.phone || '',
    address: dbUser?.address || '',
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (dbUser) {
      setFormData({
        name: dbUser.name || user?.displayName || '',
        phone: dbUser.phone || '',
        address: dbUser.address || '',
      })
    }
  }, [dbUser, user])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await updateUserProfile(formData)
      setIsEditing(false)
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your contact and address details have been updated.',
        confirmButtonColor: '#6F4E37',
      })
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update profile.',
        confirmButtonColor: '#6F4E37',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleAdminDemo = async () => {
    try {
      await makeAdmin(user.email)
      Swal.fire({
        icon: 'success',
        title: 'Admin Access Granted!',
        text: 'You now have full access to the Admin Dashboard & Management features.',
        confirmButtonColor: '#6F4E37',
      })
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to toggle admin role.',
        confirmButtonColor: '#6F4E37',
      })
    }
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] py-10 px-4 sm:px-6 lg:px-8 bg-radial from-[#FAF6F0] to-[#F5ECE1]">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-[#EBE2D7] p-7 sm:p-10 shadow-sm space-y-8">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-gray-100 pb-8 text-center sm:text-left">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Profile'}
                className="w-24 h-24 rounded-3xl object-cover border-2 border-amber-300 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-3xl bg-[#6F4E37] text-white flex items-center justify-center font-black text-3xl shadow-md uppercase">
                {(user?.displayName || user?.email || 'U')[0]}
              </div>
            )}

            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-black text-[#3B2314]">
                  {dbUser?.name || user?.displayName || 'Cafe Customer'}
                </h1>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                    isAdmin
                      ? 'bg-amber-800 text-white'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {dbUser?.role || 'Customer'}
                </span>
              </div>
              <p className="text-xs text-[#7A695E] flex items-center justify-center sm:justify-start gap-1.5">
                <FaEnvelope className="text-amber-700" />
                <span>{user?.email}</span>
              </p>
              <p className="text-[11px] text-[#A8988B] font-mono flex items-center justify-center sm:justify-start gap-1">
                <FaKey className="text-amber-600" />
                <span>Firebase UID: {user?.uid}</span>
              </p>
            </div>

            {!isAdmin && (
              <button
                onClick={handleToggleAdminDemo}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition-all flex items-center gap-1.5 shadow-2xs"
                title="Enable admin role for demo purposes"
              >
                <FaShieldAlt />
                <span>Switch to Admin Role</span>
              </button>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#EBE2D7]">
              <FaReceipt className="w-5 h-5 text-amber-800 mx-auto mb-1.5" />
              <div className="text-xl font-black text-[#3B2314]">
                {dbUser?.stats?.totalOrders ?? 0}
              </div>
              <div className="text-[11px] text-[#8C7A6E] font-medium">Orders Placed</div>
            </div>

            <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#EBE2D7]">
              <FaShoppingCart className="w-5 h-5 text-amber-800 mx-auto mb-1.5" />
              <div className="text-xl font-black text-[#3B2314]">
                {cartCount}
              </div>
              <div className="text-[11px] text-[#8C7A6E] font-medium">Active Cart Items</div>
            </div>

            <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#EBE2D7]">
              <FaCalendarAlt className="w-5 h-5 text-amber-800 mx-auto mb-1.5" />
              <div className="text-xl font-black text-[#3B2314]">
                {dbUser?.stats?.totalReservations ?? 0}
              </div>
              <div className="text-[11px] text-[#8C7A6E] font-medium">Reservations</div>
            </div>
          </div>

          {/* Contact & Address Information */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-[#3B2314]">
                Contact & Delivery Preferences
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6F4E37] hover:underline"
                >
                  <FaEdit />
                  <span>Edit Details</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                      Default Delivery Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. 742 Evergreen Terrace"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-[#6F4E37] text-white text-xs font-bold hover:bg-[#543825] transition-all flex items-center gap-1.5"
                  >
                    <FaSave />
                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#FCFAF8] border border-[#EBE2D7] space-y-1">
                  <span className="text-[#8C7A6E] block font-semibold text-[10px] uppercase">
                    Phone Number
                  </span>
                  <p className="font-bold text-[#3B2314]">
                    {dbUser?.phone || 'Not provided yet'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FCFAF8] border border-[#EBE2D7] space-y-1">
                  <span className="text-[#8C7A6E] block font-semibold text-[10px] uppercase">
                    Delivery Address
                  </span>
                  <p className="font-bold text-[#3B2314]">
                    {dbUser?.address || 'Not provided yet'}
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}
