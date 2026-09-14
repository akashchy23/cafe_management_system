import { useState, useEffect } from 'react'
import {
  FaBoxes,
  FaPlus,
  FaExclamationTriangle,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaFilter,
  FaDollarSign,
} from 'react-icons/fa'
import api from '../../api/axios'
import Swal from 'sweetalert2'

export default function AdminInventory() {
  const [ingredients, setIngredients] = useState([])
  const [summary, setSummary] = useState(null)
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    quantity: 10,
    unit: 'kg',
    minimumStock: 5,
    supplierId: '',
    purchasePrice: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const [invRes, supRes] = await Promise.all([
        api.get('/api/inventory', { params: { search, status: statusFilter } }),
        api.get('/api/suppliers'),
      ])
      setIngredients(invRes.data.ingredients || [])
      setSummary(invRes.data.summary || null)
      setSuppliers(supRes.data || [])
    } catch (err) {
      console.error('Failed to load inventory data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [search, statusFilter])

  const openAddModal = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      quantity: 10,
      unit: 'kg',
      minimumStock: 5,
      supplierId: suppliers[0]?.name || '',
      purchasePrice: 0,
    })
    setModalOpen(true)
  }

  const openEditModal = (item) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      minimumStock: item.minimumStock,
      supplierId: item.supplierId || '',
      purchasePrice: item.purchasePrice || item.costPerUnit || 0,
    })
    setModalOpen(true)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editingItem) {
        await api.patch(`/api/inventory/${editingItem._id}`, formData)
        Swal.fire({
          icon: 'success',
          title: 'Ingredient Updated',
          confirmButtonColor: '#6F4E37',
        })
      } else {
        await api.post('/api/inventory', formData)
        Swal.fire({
          icon: 'success',
          title: 'Ingredient Added',
          confirmButtonColor: '#6F4E37',
        })
      }
      setModalOpen(false)
      loadData()
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save inventory item',
        confirmButtonColor: '#6F4E37',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAdjustQuantity = async (item, delta) => {
    const newQty = Math.max(0, Number(item.quantity) + delta)
    try {
      await api.patch(`/api/inventory/${item._id}/stock`, { quantity: newQty })
      loadData()
    } catch (err) {
      console.error('Failed to adjust quantity:', err)
    }
  }

  const handleDeleteItem = async (item) => {
    const confirm = await Swal.fire({
      title: `Delete "${item.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete',
    })
    if (confirm.isConfirmed) {
      try {
        await api.delete(`/api/inventory/${item._id}`)
        loadData()
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
            Inventory & Ingredient Stocks
          </h1>
          <p className="text-xs text-[#7A695E] mt-1">
            Monitor raw coffee beans, dairy, syrups, suppliers, and track minimum threshold alerts.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#6F4E37] text-white hover:bg-[#543825] shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <FaPlus />
          <span>Add Ingredient</span>
        </button>
      </div>

      {/* Stock Summary Metrics Cards (Module 4.5) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#EBE2D7] shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#8C7A6E] uppercase">Total Ingredients</span>
            <FaBoxes className="text-amber-800" />
          </div>
          <div className="text-2xl font-black text-[#3B2314]">
            {summary?.totalIngredients || ingredients.length}
          </div>
          <p className="text-[10px] text-gray-500">Tracked raw items</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#EBE2D7] shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#8C7A6E] uppercase">Available Stock</span>
            <FaCheckCircle className="text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">
            {summary?.availableStock || 0}
          </div>
          <p className="text-[10px] text-emerald-600">Above minimum threshold</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#EBE2D7] shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#8C7A6E] uppercase">Low Stock Alert</span>
            <FaExclamationTriangle className="text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700">
            {summary?.lowStock || 0}
          </div>
          <p className="text-[10px] text-amber-600">Restocking recommended</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#EBE2D7] shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#8C7A6E] uppercase">Out of Stock</span>
            <FaTimesCircle className="text-red-600" />
          </div>
          <div className="text-2xl font-black text-red-700">
            {summary?.outOfStock || 0}
          </div>
          <p className="text-[10px] text-red-600">0 quantity remaining</p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-[#EBE2D7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-sm">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search ingredients or suppliers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DED4C7] focus:outline-none text-[#3B2314]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['All', 'Available', 'Low Stock', 'Out of Stock'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                statusFilter === st
                  ? 'bg-[#6F4E37] text-white shadow-xs'
                  : 'bg-[#FAF6F0] text-gray-700 hover:bg-[#EFE6DC]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-[#EBE2D7] shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-amber-700 border-t-transparent mx-auto"></div>
          </div>
        ) : ingredients.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#8C7A6E]">
            No ingredients match your search or filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-[#8C7A6E] uppercase text-[10px] bg-[#FAF6F0]">
                  <th className="py-3.5 px-4">Ingredient Name</th>
                  <th className="py-3.5 px-4">Current Stock</th>
                  <th className="py-3.5 px-4">Min. Threshold</th>
                  <th className="py-3.5 px-4">Purchase Price</th>
                  <th className="py-3.5 px-4">Stock Status</th>
                  <th className="py-3.5 px-4">Supplier</th>
                  <th className="py-3.5 px-4">Quick Adjust</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[#3B2314]">
                {ingredients.map((item) => (
                  <tr
                    key={item._id}
                    className={`transition-colors ${
                      item.stockStatus === 'Out of Stock'
                        ? 'bg-red-100/50 hover:bg-red-100/80'
                        : item.stockStatus === 'Low Stock'
                        ? 'bg-amber-50/70 hover:bg-amber-100/70'
                        : 'hover:bg-[#FAF6F0]/40'
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-sm text-[#3B2314]">
                      {item.name}
                    </td>

                    <td className="py-3 px-4 font-black text-sm text-[#6F4E37]">
                      {item.quantity} {item.unit}
                    </td>

                    <td className="py-3 px-4 text-[#6F5D53]">
                      {item.minimumStock} {item.unit}
                    </td>

                    <td className="py-3 px-4 text-[#54433A] font-semibold">
                      ${(item.purchasePrice || item.costPerUnit || 0).toFixed(2)} / {item.unit}
                    </td>

                    <td className="py-3 px-4">
                      {item.stockStatus === 'Out of Stock' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-red-600 text-white flex items-center gap-1 w-fit">
                          <FaTimesCircle className="w-2.5 h-2.5" />
                          <span>Out of Stock</span>
                        </span>
                      ) : item.stockStatus === 'Low Stock' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 w-fit">
                          <FaExclamationTriangle className="w-2.5 h-2.5" />
                          <span>Low Stock ({item.quantity} {item.unit} left)</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit">
                          <FaCheckCircle className="w-2.5 h-2.5" />
                          <span>Available</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-[#6F5D53] font-semibold">
                      {item.supplierId || 'Direct Market'}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleAdjustQuantity(item, -1)}
                          className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center text-xs"
                          title="Decrease 1"
                        >
                          -
                        </button>
                        <button
                          onClick={() => handleAdjustQuantity(item, 1)}
                          className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center text-xs"
                          title="Increase 1"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <FaEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item)}
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

      {/* Add / Edit Ingredient Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#EBE2D7] space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-xl font-extrabold text-[#3B2314]">
                {editingItem ? 'Edit Ingredient' : 'Add New Ingredient'}
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
                  Ingredient Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ethiopian Espresso Roast"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                    Current Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                    Unit (kg, liters, pcs) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="kg"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                    Min Stock Threshold *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.minimumStock}
                    onChange={(e) => setFormData({ ...formData, minimumStock: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                    Purchase Price ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                    placeholder="22.50"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                  Assigned Supplier
                </label>
                <select
                  value={formData.supplierId}
                  onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED4C7] text-xs font-bold text-[#3B2314] focus:outline-none"
                >
                  <option value="">Direct Market / Local</option>
                  {suppliers.map((s) => (
                    <option key={s._id} value={s.name}>
                      {s.name} ({s.companyName || s.name})
                    </option>
                  ))}
                </select>
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
                  {isSubmitting ? 'Saving...' : 'Save Ingredient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
