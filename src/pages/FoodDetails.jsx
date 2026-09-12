import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FaCoffee, FaShoppingCart, FaArrowLeft, FaCheckCircle, FaTimesCircle, FaStar } from 'react-icons/fa'
import { useCart } from '../context/CartContext'
import { STATIC_FOODS } from '../data/staticFoods'
import api from '../api/axios'

export default function FoodDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [food, setFood] = useState(() => STATIC_FOODS.find((f) => f._id === id || f.name.toLowerCase() === id.toLowerCase()) || STATIC_FOODS[0])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { addToCart } = useCart()

  useEffect(() => {
    async function loadFood() {
      try {
        const res = await api.get(`/api/foods/${id}`)
        if (res.data) setFood(res.data)
      } catch (err) {
        const fallback = STATIC_FOODS.find((f) => f._id === id || f.name.toLowerCase() === id.toLowerCase())
        if (fallback) {
          setFood(fallback)
        }
      }
    }
    loadFood()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-700 border-t-transparent"></div>
      </div>
    )
  }

  if (error || !food) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-md p-8 bg-white rounded-3xl border border-amber-200 shadow-xl">
          <div className="w-14 h-14 bg-red-100 text-red-700 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-xl">
            !
          </div>
          <h2 className="text-2xl font-bold text-[#3B2314] mb-2">Item Not Found</h2>
          <p className="text-xs text-[#7A695E] mb-6">{error || 'This food item may have been removed.'}</p>
          <Link
            to="/menu"
            className="px-6 py-2.5 rounded-xl font-bold bg-[#6F4E37] text-white hover:bg-[#543825] transition-all inline-block"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] py-12 px-4 sm:px-6 lg:px-8 bg-radial from-[#FAF6F0] to-[#F5ECE1]">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#6F4E37] hover:text-[#3B2314] transition-colors"
        >
          <FaArrowLeft />
          <span>Back to Menu</span>
        </button>

        {/* Main Details Card */}
        <div className="bg-white rounded-3xl border border-[#EBE2D7] shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          
          {/* Image */}
          <div className="relative h-72 md:h-full min-h-[300px] overflow-hidden bg-amber-50">
            <img
              src={food.image}
              alt={food.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-black text-[#6F4E37] uppercase tracking-wider shadow-sm">
              {food.category}
            </span>
          </div>

          {/* Details */}
          <div className="p-8 md:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-amber-500 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                  <span className="ml-1 text-gray-500 font-semibold">(4.9)</span>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                    food.isAvailable !== false
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {food.isAvailable !== false ? (
                    <>
                      <FaCheckCircle className="w-3 h-3" /> Available
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="w-3 h-3" /> Sold Out
                    </>
                  )}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3B2314]">
                {food.name}
              </h1>

              <div className="text-3xl font-black text-[#6F4E37]">
                ${food.price.toFixed(2)}
              </div>

              <p className="text-sm text-[#6F5D53] leading-relaxed">
                {food.description}
              </p>

              <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-[#827165]">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-bold text-[#3B2314]">{food.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Preparation:</span>
                  <span className="font-bold text-[#3B2314]">Freshly Made to Order</span>
                </div>
                <div className="flex justify-between">
                  <span>Dietary Notes:</span>
                  <span className="font-bold text-[#3B2314]">Vegetarian & Non-GMO Options</span>
                </div>
              </div>
            </div>

            {/* Quantity and Add to Cart button */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#DED4C7] rounded-xl overflow-hidden bg-[#FCFAF8]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2.5 font-bold text-base text-[#6F4E37] hover:bg-[#F4EDE4] transition-colors"
                  >
                    -
                  </button>
                  <span className="px-5 py-2.5 text-sm font-black text-[#3B2314] min-w-[36px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2.5 font-bold text-base text-[#6F4E37] hover:bg-[#F4EDE4] transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => addToCart(food._id, quantity)}
                  disabled={food.isAvailable === false}
                  className="flex-1 py-3.5 px-6 rounded-xl font-bold text-sm bg-[#6F4E37] hover:bg-[#543825] text-white shadow-md active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FaShoppingCart className="w-4 h-4" />
                  <span>
                    Add to Cart • ${(food.price * quantity).toFixed(2)}
                  </span>
                </button>
              </div>

              <Link
                to="/cart"
                className="block text-center text-xs font-bold text-[#6F4E37] hover:underline"
              >
                Go to Shopping Cart &rarr;
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}