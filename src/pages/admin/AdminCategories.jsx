import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaTags } from 'react-icons/fa'
import api from '../../api/axios'
import Swal from 'sweetalert2'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCat, setEditingCat] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '', image: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadCategories = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/categories')
      setCategories(res.data)
    } catch (err) {
      console.error('Failed to load categories:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const openAddModal = () => {
    setEditingCat(null)
    setFormData({
      name: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500',
    })
    setModalOpen(true)
  }

  const openEditModal = (cat) => {
    setEditingCat(cat)
    setFormData({
      name: cat.name,
      description: cat.description || '',
      image: cat.image || '',
    })
    setModalOpen(true)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editingCat) {
        await api.patch(`/api/categories/${editingCat._id}`, formData)
        Swal.fire({
          icon: 'success',
          title: 'Category Updated',
          confirmButtonColor: '#6F4E37',
        })
      } else {
        await api.post('/api/categories', formData)
        Swal.fire({
          icon: 'success',
          title: 'Category Added',
          confirmButtonColor: '#6F4E37',
        })
      }
      setModalOpen(false)
      loadCategories()
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.error || 'Failed to save category',
        confirmButtonColor: '#6F4E37',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCategory = async (cat) => {
    const confirm = await Swal.fire({
      title: `Delete category "${cat.name}"?`,
      text: 'Note: Categories with active food items cannot be deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6F4E37',
      confirmButtonText: 'Yes, Delete',
    })

    if (confirm.isConfirmed) {
      try {
        await api.delete(`/api/categories/${cat._id}`)
        Swal.fire({
          icon: 'success',
          title: 'Category Deleted',
          confirmButtonColor: '#6F4E37',
        })
        loadCategories()
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Cannot Delete',
          text: err.response?.data?.error || 'Failed to delete category.',
          confirmButtonColor: '#6F4E37',
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#3B2314] tracking-tight">
            Food & Beverage Categories
          </h1>
          <p className="text-xs text-[#7A695E] mt-1">
            Organize menu classifications and maintain category relationships.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="self-start sm:self-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-[#6F4E37] text-white hover:bg-[#543825] shadow-sm transition-all flex items-center gap-2 active:scale-95"
        >
          <FaPlus />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-3 border-amber-700 border-t-transparent mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white rounded-3xl border border-[#EBE2D7] shadow-sm overflow-hidden flex flex-col justify-between"
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 right-3 bg-[#3B2314]/90 text-amber-300 px-3 py-1 rounded-xl text-xs font-black shadow-md">
                  {cat.foodCount || 0} Foods
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-[#3B2314]">{cat.name}</h3>
                  <p className="text-xs text-[#7A695E] mt-1 leading-relaxed line-clamp-2">
                    {cat.description || 'No description provided.'}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Category"
                  >
                    <FaEdit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Category"
                  >
                    <FaTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#EBE2D7] space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-lg font-extrabold text-[#3B2314]">
                {editingCat ? 'Edit Category' : 'Add Category'}
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
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Specialty Beverages"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Category overview..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none resize-none"
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
                  {isSubmitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
