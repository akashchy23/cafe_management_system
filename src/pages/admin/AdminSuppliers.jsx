import { useState, useEffect } from 'react'
import { FaTruck, FaPlus, FaEdit, FaTrash, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaBoxes } from 'react-icons/fa'
import api from '../../api/axios'
import Swal from 'sweetalert2'

export default function AdminSuppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)

  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSup, setEditingSup] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    supplyItems: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadSuppliers = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/suppliers')
      setSuppliers(res.data)
    } catch (err) {
      console.error('Failed to load suppliers:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSuppliers()
  }, [])

  const openAddModal = () => {
    setEditingSup(null)
    setFormData({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      supplyItems: '',
    })
    setModalOpen(true)
  }

  const openEditModal = (sup) => {
    setEditingSup(sup)
    setFormData({
      name: sup.name,
      contactPerson: sup.contactPerson || '',
      email: sup.email || '',
      phone: sup.phone,
      address: sup.address || '',
      supplyItems: Array.isArray(sup.supplyItems) ? sup.supplyItems.join(', ') : (sup.supplyItems || ''),
    })
    setModalOpen(true)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editingSup) {
        await api.patch(`/api/suppliers/${editingSup._id}`, formData)
        Swal.fire({
          icon: 'success',
          title: 'Supplier Updated',
          confirmButtonColor: '#6F4E37',
        })
      } else {
        await api.post('/api/suppliers', formData)
        Swal.fire({
          icon: 'success',
          title: 'Supplier Added',
          confirmButtonColor: '#6F4E37',
        })
      }
      setModalOpen(false)
      loadSuppliers()
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save supplier',
        confirmButtonColor: '#6F4E37',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (sup) => {
    const confirm = await Swal.fire({
      title: `Delete "${sup.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete',
    })
    if (confirm.isConfirmed) {
      try {
        await api.delete(`/api/suppliers/${sup._id}`)
        loadSuppliers()
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete' })
      }
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#3B2314] tracking-tight">
            Suppliers & Vendors Directory
          </h1>
          <p className="text-xs text-[#7A695E] mt-1">
            Maintain vendor partnerships, contact information, and supplied raw materials.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl font-bold text-xs bg-[#6F4E37] text-white hover:bg-[#543825] shadow-sm flex items-center gap-2 active:scale-95"
        >
          <FaPlus />
          <span>Add Supplier</span>
        </button>
      </div>

      {/* Supplier Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-3 border-amber-700 border-t-transparent mx-auto"></div>
        </div>
      ) : suppliers.length === 0 ? (
        <div className="py-16 text-center text-xs text-[#8C7A6E]">
          No suppliers registered yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((sup) => (
            <div
              key={sup._id}
              className="bg-white rounded-3xl border border-[#EBE2D7] p-6 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <FaTruck />
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    Active Vendor
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-[#3B2314] mt-3">{sup.name}</h3>
                <p className="text-xs text-[#6F5D53] font-medium">Contact: {sup.contactPerson || 'General Support'}</p>

                <div className="mt-4 space-y-1.5 text-xs text-[#7A695E] border-t border-gray-100 pt-3">
                  <p className="flex items-center gap-2">
                    <FaPhoneAlt className="text-amber-700 w-3 h-3" />
                    <span>{sup.phone}</span>
                  </p>
                  {sup.email && (
                    <p className="flex items-center gap-2">
                      <FaEnvelope className="text-amber-700 w-3 h-3" />
                      <span>{sup.email}</span>
                    </p>
                  )}
                  {sup.address && (
                    <p className="flex items-start gap-2">
                      <FaMapMarkerAlt className="text-amber-700 w-3 h-3 mt-0.5 shrink-0" />
                      <span className="truncate">{sup.address}</span>
                    </p>
                  )}
                </div>

                {sup.supplyItems && sup.supplyItems.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="text-[10px] font-bold uppercase text-[#8C7A6E] block mb-1.5">
                      Supplied Materials:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(Array.isArray(sup.supplyItems) ? sup.supplyItems : [sup.supplyItems]).map(
                        (item, i) => (
                          <span
                            key={i}
                            className="bg-[#FAF6F0] px-2 py-0.5 rounded text-[10px] font-bold text-[#543825] border border-[#EAE0D5]"
                          >
                            {item}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => openEditModal(sup)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg text-xs"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(sup)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg text-xs"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Supplier Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#EBE2D7] space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-xl font-extrabold text-[#3B2314]">
                {editingSup ? 'Edit Supplier' : 'Add Supplier'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                  Supplier / Vendor Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Highland Roasters"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="e.g. Marcus Vance"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 555-0199"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="orders@vendor.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street, City, State"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                  Supplied Items (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formData.supplyItems}
                  onChange={(e) => setFormData({ ...formData, supplyItems: e.target.value })}
                  placeholder="Coffee Beans, Whole Milk, Vanilla Syrup"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none"
                />
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
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#6F4E37] hover:bg-[#543825]"
                >
                  {isSubmitting ? 'Saving...' : 'Save Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
