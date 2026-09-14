import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaHeart, FaShoppingCart, FaTrash, FaCoffee, FaStar, FaLeaf } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import api from '../api/axios'
import Swal from 'sweetalert2'

export default function Favorites() {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [favoriteFoods, setFavoriteFoods] = useState([])
  const [loading, setLoading] = useState(true)

  const loadFavorites = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/favorites')
      setFavoriteFoods(res.data.foods || [])
    } catch (err) {
      console.error('Failed to load favorites:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadFavorites()
    }
  }, [user])

  const handleRemoveFavorite = async (foodId) => {
    try {
      await api.post('/api/favorites/toggle', { foodId })
      setFavoriteFoods((prev) => prev.filter((f) => f._id.toString() !== foodId.toString()))
      Swal.fire({
        icon: 'success',
        title: 'Removed from Favorites',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
      })
    } catch (err) {
      console.error('Failed to remove favorite:', err)
    }
  }

  const handleAddToCart = async (food) => {
    if (!food) return
    await addToCart(food, 1)
  }

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-700 border-t-transparent mx-auto mb-3"></div>
        <p className="text-xs text-[#7A695E]">Loading your favorite cafe items...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EBE2D7] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider mb-2">
            <FaHeart className="w-3 h-3 text-rose-600" />
            <span>Customer Saved Items</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#3B2314] tracking-tight">
            My Favorite Dishes & Beverages
          </h1>
          <p className="text-xs sm:text-sm text-[#7A695E] mt-1">
            Personalized collection of coffees, treats, and specialties you love.
          </p>
        </div>

        <Link
          to="/menu"
          className="px-5 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#543825] text-white font-bold text-xs shadow-sm self-start sm:self-auto"
        >
          Explore More Menu
        </Link>
      </div>

      {favoriteFoods.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#EBE2D7] p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-2xl mx-auto">
            <FaHeart />
          </div>
          <h2 className="text-xl font-extrabold text-[#3B2314]">No Favorites Saved Yet</h2>
          <p className="text-xs text-[#8C7A6E] max-w-sm mx-auto">
            Browse our artisanal menu and tap the heart icon on any coffee, pastry, or sandwich to save it here.
          </p>
          <Link
            to="/menu"
            className="inline-block px-6 py-3 bg-[#6F4E37] text-white font-bold text-xs rounded-xl shadow-sm hover:bg-[#543825]"
          >
            Browse Full Menu
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteFoods.map((food) => (
            <div
              key={food._id}
              className="bg-white rounded-3xl border border-[#EBE2D7] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#3B2314]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                    {food.category}
                  </div>
                  <button
                    onClick={() => handleRemoveFavorite(food._id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-rose-600 flex items-center justify-center shadow-md transition-all"
                    title="Remove from favorites"
                  >
                    <FaHeart className="w-4 h-4 fill-rose-600" />
                  </button>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={`/menu/${food._id}`}
                      className="font-extrabold text-base text-[#3B2314] hover:text-amber-800 transition-colors"
                    >
                      {food.name}
                    </Link>
                    <span className="font-black text-lg text-[#6F4E37] shrink-0">
                      ${food.price?.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-xs text-[#6F5D53] line-clamp-2">{food.description}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {food.moods?.map((m) => (
                      <span key={m} className="text-[9px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full">
                        #{m}
                      </span>
                    ))}
                    {food.healthy && (
                      <span className="text-[9px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <FaLeaf className="w-2 h-2" />
                        <span>Healthy</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => handleAddToCart(food)}
                  className="w-full py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#543825] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-2xs active:scale-[0.98]"
                >
                  <FaShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Order</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
