import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  FaCoffee,
  FaShoppingCart,
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaHeart,
  FaLeaf,
  FaFire,
  FaRegStar,
  FaQuoteLeft,
  FaShieldAlt,
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { STATIC_FOODS } from '../data/staticFoods'
import api from '../api/axios'
import Swal from 'sweetalert2'

export default function FoodDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [food, setFood] = useState(() => STATIC_FOODS.find((f) => f._id === id || f.name.toLowerCase() === id.toLowerCase()) || STATIC_FOODS[0])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  // Review states
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  const loadFoodData = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/api/foods/${id}`)
      if (res.data) setFood(res.data)
    } catch (err) {
      const fallback = STATIC_FOODS.find((f) => f._id === id || f.name.toLowerCase() === id.toLowerCase())
      if (fallback) setFood(fallback)
    } finally {
      setLoading(false)
    }
  }

  const checkFavorite = async () => {
    if (!user) return
    try {
      const res = await api.get('/api/favorites')
      if (res.data?.foodIds?.includes(id)) {
        setIsFavorite(true)
      }
    } catch (err) {}
  }

  useEffect(() => {
    loadFoodData()
    if (user) {
      checkFavorite()
    }
  }, [id, user])

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    try {
      const res = await api.post('/api/favorites/toggle', { foodId: food._id })
      setIsFavorite(res.data.isFavorite)
      Swal.fire({
        icon: 'success',
        title: res.data.isFavorite ? 'Saved to Favorites!' : 'Removed from Favorites',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
      })
    } catch (err) {
      console.error('Favorite toggle error:', err)
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }

    try {
      setSubmittingReview(true)
      const res = await api.post('/api/reviews', {
        foodId: food._id,
        foodName: food.name,
        rating,
        comment,
      })
      Swal.fire({
        icon: 'success',
        title: 'Review Posted!',
        text: 'Thank you for your valuable feedback.',
        confirmButtonColor: '#6F4E37',
      })
      setComment('')
      loadFoodData()
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Review Submission Note',
        text: err.response?.data?.error || 'Only verified purchasers can submit food ratings.',
      })
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleAddToCart = async () => {
    if (!food) return
    await addToCart(food, quantity)
  }

  if (loading && !food) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-700 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] py-10 px-4 sm:px-6 lg:px-8 bg-radial from-[#FAF6F0] to-[#F5ECE1]">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Back and Breadcrumbs */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#6F4E37] hover:text-[#3B2314] transition-colors"
          >
            <FaArrowLeft />
            <span>Back to Menu</span>
          </button>

          <button
            onClick={handleToggleFavorite}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              isFavorite
                ? 'bg-rose-100 text-rose-700 border border-rose-200'
                : 'bg-white text-gray-700 border border-[#EBE2D7] hover:bg-rose-50'
            }`}
          >
            <FaHeart className={isFavorite ? 'fill-rose-600 text-rose-600' : 'text-gray-400'} />
            <span>{isFavorite ? 'Favorited' : 'Save as Favorite'}</span>
          </button>
        </div>

        {/* Main Details Card */}
        <div className="bg-white rounded-3xl border border-[#EBE2D7] shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          
          {/* Image */}
          <div className="relative h-80 md:h-full min-h-[340px] overflow-hidden bg-amber-50">
            <img
              src={food.image}
              alt={food.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-xl text-xs font-black text-[#6F4E37] uppercase tracking-wider shadow-sm">
              {food.category}
            </span>
            {food.healthy && (
              <span className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm">
                <FaLeaf className="w-3 h-3" />
                <span>Healthy Choice</span>
              </span>
            )}
          </div>

          {/* Details */}
          <div className="p-8 md:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-amber-500 text-sm">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < Math.round(food.averageRating || 5) ? 'text-amber-500' : 'text-gray-300'}
                    />
                  ))}
                  <span className="ml-1.5 text-xs text-[#3B2314] font-black">
                    {food.averageRating || 5.0} ({food.totalReviews || food.reviews?.length || 0} reviews)
                  </span>
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

              <h1 className="text-2xl sm:text-3xl font-black text-[#3B2314]">
                {food.name}
              </h1>

              <div className="flex items-center gap-4">
                <span className="text-3xl font-black text-[#6F4E37]">
                  ${food.price?.toFixed(2)}
                </span>
                {food.calories > 0 && (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                    <FaFire className="text-amber-500" />
                    {food.calories} calories
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-[#6F5D53] leading-relaxed">
                {food.description}
              </p>

              {/* Ingredients Badges */}
              {food.ingredients && food.ingredients.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold text-[#8C7A6E] uppercase tracking-wider block">
                    Fresh Ingredients:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {food.ingredients.map((ing) => (
                      <span
                        key={ing}
                        className="text-[11px] font-semibold bg-[#F4EDE4] text-[#543825] px-2.5 py-1 rounded-lg"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Mood & Tag Badges */}
              {((food.moods && food.moods.length > 0) || (food.tags && food.tags.length > 0)) && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {food.moods?.map((m) => (
                    <span key={m} className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                      Mood: #{m}
                    </span>
                  ))}
                  {food.tags?.map((t) => (
                    <span key={t} className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              )}
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
                  onClick={handleAddToCart}
                  disabled={food.isAvailable === false}
                  className="flex-1 py-3.5 px-6 rounded-xl font-bold text-sm bg-[#6F4E37] hover:bg-[#543825] text-white shadow-md active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FaShoppingCart className="w-4 h-4" />
                  <span>
                    Add to Cart • ${((food.price || 0) * quantity).toFixed(2)}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews & Rating Module (Module 4.8) */}
        <div className="bg-white rounded-3xl border border-[#EBE2D7] p-8 sm:p-10 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#3B2314]">Customer Ratings & Reviews</h2>
              <p className="text-xs text-[#8C7A6E] mt-0.5">
                Authentic feedback from verified cafe diners who ordered this item
              </p>
            </div>
            <div className="flex items-center gap-2 bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200">
              <FaStar className="text-amber-500 w-4 h-4" />
              <span className="font-black text-sm text-[#3B2314]">
                {food.averageRating || 5.0} / 5.0
              </span>
              <span className="text-xs text-[#8C7A6E]">
                ({food.reviews?.length || food.totalReviews || 0} reviews)
              </span>
            </div>
          </div>

          {/* Write Review Form */}
          <form onSubmit={handleReviewSubmit} className="bg-[#FAF6F0] p-6 rounded-2xl border border-[#E8DFD3] space-y-4">
            <h3 className="font-extrabold text-sm text-[#3B2314]">Rate this dish</h3>

            {/* Star selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#54433A]">Your Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-none"
                  >
                    <FaStar
                      className={`w-5 h-5 ${star <= rating ? 'text-amber-500' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-[#6F4E37] ml-2">{rating} Star(s)</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#54433A] mb-1">
                Your Review / Tasting Notes
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was the flavor, temperature, and presentation?"
                className="w-full p-3 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none bg-white"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="px-6 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#543825] text-white font-bold text-xs transition-all shadow-sm"
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>

          {/* Reviews List */}
          <div className="space-y-4">
            {(!food.reviews || food.reviews.length === 0) ? (
              <div className="py-8 text-center text-xs text-[#8C7A6E]">
                No customer reviews yet. Be the first to try and review this specialty!
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {food.reviews.map((rev, idx) => (
                  <div key={rev._id || idx} className="py-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#6F4E37] text-white font-bold text-xs flex items-center justify-center uppercase">
                          {rev.userName?.[0] || 'C'}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-[#3B2314] block">
                            {rev.userName || 'Verified Diner'}
                          </span>
                          <span className="text-[10px] text-[#8C7A6E]">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-amber-500 text-xs">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < rev.rating ? 'text-amber-500' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-[#54433A] leading-relaxed pl-10">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}