import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaCheck, FaTimes, FaUtensils } from 'react-icons/fa'
import api from '../../api/axios'
import Swal from 'sweetalert2'

export default function AdminMenu() {
  const [foods, setFoods] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  // Modal states
  const [modalOpen, setModalOpen] = useState(false)
  const [editingFood, setEditingFood] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    image: '',
    isAvailable: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const [foodsRes, catRes] = await Promise.all([
        api.get('/api/foods'),
        api.get('/api/categories'),
      ])
      setFoods(foodsRes.data)
      setCategories(catRes.data)
    } catch (err) {
      console.error('Failed to load menu data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const openAddModal = () => {
    setEditingFood(null)
    setFormData({
      name: '',
      description: '',
      category: categories[0]?.name || 'Coffee & Espresso',
      price: '',
      image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500',
      isAvailable: true,
    })
    setModalOpen(true)
  }

  const openEditModal = (food) => {
    setEditingFood(food)
    setFormData({
      name: food.name,
      description: food.description || '',
      category: food.category,
      price: food.price,
      image: food.image,
      isAvailable: food.isAvailable !== false,
    })
    setModalOpen(true)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editingFood) {
        await api.patch(`/api/foods/${editingFood._id}`, formData)
        Swal.fire({
          icon: 'success',
          title: 'Food Item Updated',
          confirmButtonColor: '#6F4E37',
        })
      } else {
        await api.post('/api/foods', formData)
        Swal.fire({
          icon: 'success',
          title: 'Food Item Added',
          confirmButtonColor: '#6F4E37',
        })
      }
      setModalOpen(false)
      loadData()
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.error || 'Failed to save food item',
        confirmButtonColor: '#6F4E37',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteFood = async (food) => {
    const confirm = await Swal.fire({
      title: `Delete "${food.name}"?`,
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6F4E37',
      confirmButtonText: 'Yes, Delete',
    })

    if (confirm.isConfirmed) {
      try {
        await api.delete(`/api/foods/${food._id}`)
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Food item deleted successfully.',
          confirmButtonColor: '#6F4E37',
        })
        loadData()
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete food item.',
          confirmButtonColor: '#6F4E37',
        })
      }
    }
  }

  const handleToggleAvailability = async (food) => {
    try {
      const newStatus = food.isAvailable === false ? true : false
      await api.patch(`/api/foods/${food._id}`, { isAvailable: newStatus })
      loadData()
    } catch (err) {
      console.error('Failed to toggle availability:', err)
    }
  }

  const filteredFoods = foods.filter((food) => {
    const matchCat = selectedCategory === 'All' || food.category === selectedCategory
    const matchSearch =
      search.trim() === '' ||
      food.name.toLowerCase().includes(search.toLowerCase()) ||
      food.description?.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#3B2314] tracking-tight">
            Manage Food Menu
          </h1>
          <p className="text-xs text-[#7A695E] mt-1">
            Add new delicacies, adjust pricing, edit recipes, and manage availability.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="self-start sm:self-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-[#6F4E37] text-white hover:bg-[#543825] shadow-sm transition-all flex items-center gap-2 active:scale-95"
        >
          <FaPlus />
          <span>Add New Food</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EBE2D7] shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <FaSearch className="absolute left-3.5 top-3 text-gray-400 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#DED4C7] bg-[#FCFAF8] text-xs text-[#3B2314] focus:outline-none focus:ring-2 focus:ring-amber-700/30"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-[#DED4C7] bg-[#FCFAF8] text-xs font-bold text-[#3B2314] focus:outline-none"
          >
            <option value="All">All Categories ({foods.length})</option>
            {categories.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Foods Table */}
      <div className="bg-white rounded-3xl border border-[#EBE2D7] shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-amber-700 border-t-transparent mx-auto"></div>
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#8C7A6E]">
            No food items found. Click &ldquo;Add New Food&rdquo; to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-[#8C7A6E] uppercase text-[10px] bg-[#FAF6F0]">
                  <th className="py-3.5 px-4">Item</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Availability</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[#3B2314]">
                {filteredFoods.map((food) => (
                  <tr key={food._id} className="hover:bg-[#FAF6F0]/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-12 h-12 rounded-xl object-cover border border-[#EBE2D7]"
                        />
                        <div>
                          <p className="font-bold text-sm text-[#3B2314]">{food.name}</p>
                          <p className="text-[11px] text-[#8C7A6E] line-clamp-1 max-w-xs">
                            {food.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#6F5D53]">
                      <span className="bg-[#FAF6F0] px-2.5 py-1 rounded-lg border border-[#EBE2D7]">
                        {food.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-black text-sm text-[#6F4E37]">
                      ${Number(food.price).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleAvailability(food)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-all ${
                          food.isAvailable !== false
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                        title="Click to toggle availability"
                      >
                        {food.isAvailable !== false ? (
                          <>
                            <FaCheck className="w-2.5 h-2.5" /> In Stock
                          </>
                        ) : (
                          <>
                            <FaTimes className="w-2.5 h-2.5" /> Out of Stock
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(food)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Food"
                        >
                          <FaEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteFood(food)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Food"
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

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#EBE2D7] relative animate-in zoom-in-95 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-xl font-extrabold text-[#3B2314]">
                {editingFood ? 'Edit Food Item' : 'Add New Food Item'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                  Food Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vanilla Bean Flat White"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 5.50"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none"
                />
                {formData.image && (
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-12 h-12 rounded-lg object-cover border"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                    <span className="text-[10px] text-[#8C7A6E]">Image Preview</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description of the food item, notes, taste profile..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="rounded text-amber-700 focus:ring-amber-700"
                />
                <label htmlFor="isAvailable" className="text-xs font-bold text-[#3B2314]">
                  In Stock & Available to Order
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#6F4E37] hover:bg-[#543825] transition-all"
                >
                  {isSubmitting ? 'Saving...' : editingFood ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
