import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { FaSearch, FaCoffee, FaShoppingCart, FaInfoCircle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { useCart } from '../context/CartContext'
import { STATIC_FOODS, STATIC_CATEGORIES } from '../data/staticFoods'
import api from '../api/axios'

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || 'All'

  const [foods, setFoods] = useState(STATIC_FOODS)
  const [categories, setCategories] = useState(STATIC_CATEGORIES)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  // Details Modal State
  const [selectedFood, setSelectedFood] = useState(null)
  const [modalQty, setModalQty] = useState(1)

  const { addToCart } = useCart()

  useEffect(() => {
    async function loadMenu() {
      try {
        const [foodsRes, catRes] = await Promise.all([
          api.get('/api/foods'),
          api.get('/api/categories'),
        ])
        if (foodsRes.data && foodsRes.data.length > 0) {
          setFoods(foodsRes.data)
        }
        if (catRes.data && catRes.data.length > 0) {
          setCategories(catRes.data)
        }
      } catch (err) {
        console.warn('Using static menu fallback:', err)
      }
    }
    loadMenu()
  }, [])

  // Sync with URL query parameter
  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setSelectedCategory(cat)
  }, [searchParams])

  const handleCategoryChange = (catName) => {
    setSelectedCategory(catName)
    if (catName === 'All') {
      searchParams.delete('category')
      setSearchParams(searchParams)
    } else {
      setSearchParams({ category: catName })
    }
  }

  // Filter foods by category and search
  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchCategory =
        selectedCategory === 'All' || food.category.toLowerCase() === selectedCategory.toLowerCase()
      const matchSearch =
        searchQuery.trim() === '' ||
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.description?.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCategory && matchSearch
    })
  }, [foods, selectedCategory, searchQuery])

  const openDetailsModal = (food) => {
    setSelectedFood(food)
    setModalQty(1)
  }

  const closeDetailsModal = () => {
    setSelectedFood(null)
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-radial from-[#FAF6F0] to-[#F5ECE1]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-100/80 text-[#6F4E37] mb-3 shadow-inner ring-1 ring-amber-200">
            <FaCoffee className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#3B2314] tracking-tight">
            Our Cafe Menu
          </h1>
          <p className="mt-2 text-sm text-[#7A695E]">
            Hand-crafted coffees, fresh artisanal bakes, and savory delicacies prepared with passion.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#EBE2D7] p-5 shadow-sm space-y-4">
          
          {/* Search bar */}
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C7A6E]">
              <FaSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search foods, coffee, pastries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DED4C7] bg-[#FCFAF8] text-[#3B2314] placeholder-[#A8988B] text-sm focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:border-amber-700 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
            <button
              onClick={() => handleCategoryChange('All')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === 'All'
                  ? 'bg-[#6F4E37] text-white shadow-sm scale-105'
                  : 'bg-[#F4EDE4] text-[#6F5D53] hover:bg-[#EBE2D7] hover:text-[#3B2314]'
              }`}
            >
              All Items ({foods.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategoryChange(cat.name)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory.toLowerCase() === cat.name.toLowerCase()
                    ? 'bg-[#6F4E37] text-white shadow-sm scale-105'
                    : 'bg-[#F4EDE4] text-[#6F5D53] hover:bg-[#EBE2D7] hover:text-[#3B2314]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Food Items Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-700 border-t-transparent mx-auto mb-4"></div>
            <p className="text-sm font-semibold text-[#7A695E]">Brewing fresh menu items...</p>
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="py-20 text-center bg-white/80 rounded-2xl border border-[#EBE2D7] max-w-md mx-auto p-8">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
              <FaCoffee className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#3B2314]">No items found</h3>
            <p className="text-xs text-[#7A695E] mt-1 mb-4">
              We couldn&apos;t find any food items matching your search criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
              }}
              className="px-4 py-2 bg-[#6F4E37] text-white text-xs font-bold rounded-xl hover:bg-[#543825] transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFoods.map((food) => (
              <div
                key={food._id}
                className="bg-white rounded-2xl border border-[#EBE2D7] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Image & Badges */}
                <div className="relative h-48 overflow-hidden bg-amber-50">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#6F4E37] uppercase tracking-wider shadow-xs">
                    {food.category}
                  </span>

                  {/* Availability Pill */}
                  <span
                    className={`absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-xs ${
                      food.isAvailable !== false
                        ? 'bg-emerald-100/90 text-emerald-800'
                        : 'bg-red-100/90 text-red-800'
                    }`}
                  >
                    {food.isAvailable !== false ? (
                      <>
                        <FaCheckCircle className="w-2.5 h-2.5" /> Available
                      </>
                    ) : (
                      <>
                        <FaTimesCircle className="w-2.5 h-2.5" /> Sold Out
                      </>
                    )}
                  </span>

                  {/* Price Tag */}
                  <span className="absolute bottom-3 right-3 bg-[#3B2314]/90 text-amber-300 px-3 py-1 rounded-xl text-xs font-black shadow-md backdrop-blur-xs">
                    ${food.price.toFixed(2)}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-[#3B2314] mb-1 group-hover:text-[#6F4E37] transition-colors">
                      {food.name}
                    </h3>
                    <p className="text-xs text-[#7A695E] line-clamp-2 leading-relaxed">
                      {food.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => openDetailsModal(food)}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-[#6F4E37] hover:bg-[#F4EDE4] transition-colors flex items-center gap-1"
                    >
                      <FaInfoCircle className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    <button
                      onClick={() => addToCart(food._id, 1)}
                      disabled={food.isAvailable === false}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-[#6F4E37] hover:bg-[#543825] text-white shadow-xs active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaShoppingCart className="w-3 h-3" />
                      <span>{food.isAvailable === false ? 'Sold Out' : 'Add to Cart'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Food Details Modal */}
        {selectedFood && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#EBE2D7] relative animate-in zoom-in-95 duration-200">
              
              {/* Close Button */}
              <button
                onClick={closeDetailsModal}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-all"
              >
                ✕
              </button>

              <div className="h-64 overflow-hidden relative">
                <img
                  src={selectedFood.image}
                  alt={selectedFood.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-black text-[#6F4E37] uppercase">
                  {selectedFood.category}
                </span>
                <span className="absolute bottom-4 right-4 bg-[#3B2314] text-amber-300 px-3.5 py-1.5 rounded-xl text-sm font-black shadow-lg">
                  ${selectedFood.price.toFixed(2)}
                </span>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#3B2314]">
                    {selectedFood.name}
                  </h2>
                  <p className="mt-2 text-sm text-[#6F5D53] leading-relaxed">
                    {selectedFood.description}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EBE2D7] flex items-center justify-between text-xs">
                  <span className="font-bold text-[#543825]">Status:</span>
                  <span className={`font-bold ${selectedFood.isAvailable !== false ? 'text-emerald-700' : 'text-red-600'}`}>
                    {selectedFood.isAvailable !== false ? 'In Stock & Fresh' : 'Currently Unavailable'}
                  </span>
                </div>

                {/* Quantity selector & Add to Cart */}
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center border border-[#DED4C7] rounded-xl overflow-hidden bg-[#FCFAF8]">
                    <button
                      onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                      className="px-3.5 py-2 font-bold text-sm text-[#6F4E37] hover:bg-[#F4EDE4]"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-xs font-extrabold text-[#3B2314] min-w-[32px] text-center">
                      {modalQty}
                    </span>
                    <button
                      onClick={() => setModalQty(modalQty + 1)}
                      className="px-3.5 py-2 font-bold text-sm text-[#6F4E37] hover:bg-[#F4EDE4]"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(selectedFood._id, modalQty)
                      closeDetailsModal()
                    }}
                    disabled={selectedFood.isAvailable === false}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-[#6F4E37] hover:bg-[#543825] text-white shadow-md active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart className="w-4 h-4" />
                    <span>Add {modalQty} to Cart • ${(selectedFood.price * modalQty).toFixed(2)}</span>
                  </button>
                </div>

                <div className="text-center pt-2">
                  <Link
                    to={`/menu/${selectedFood._id}`}
                    className="text-xs font-bold text-[#6F4E37] hover:underline"
                  >
                    Open Standalone Product Page &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}