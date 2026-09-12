import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaCoffee, FaUtensils, FaClock, FaCalendarAlt, FaStar, FaShoppingCart } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { STATIC_FOODS, STATIC_CATEGORIES } from '../data/staticFoods'
import api from '../api/axios'

export default function Home() {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [featuredFoods, setFeaturedFoods] = useState(STATIC_FOODS.slice(0, 4))
  const [categories, setCategories] = useState(STATIC_CATEGORIES.slice(0, 4))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [foodsRes, catRes] = await Promise.all([
          api.get('/api/foods'),
          api.get('/api/categories'),
        ])
        if (foodsRes.data && foodsRes.data.length > 0) {
          setFeaturedFoods(foodsRes.data.slice(0, 4))
        }
        if (catRes.data && catRes.data.length > 0) {
          setCategories(catRes.data.slice(0, 4))
        }
      } catch (err) {
        console.warn('Using static home fallback:', err)
      }
    }
    loadHomeData()
  }, [])

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-radial from-[#FAF6F0] via-[#F6EDE2] to-[#EFE2D2] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#EBE2D7]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Text */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold tracking-wide uppercase shadow-xs">
              <FaCoffee className="text-amber-700" />
              <span>Artisan Coffee & Culinary Excellence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#3B2314] tracking-tight leading-tight">
              Savor Every Moment <br />
              <span className="text-[#6F4E37] bg-clip-text">One Cup At A Time</span>
            </h1>

            <p className="text-[#6F5D53] text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Experience handcrafted specialty brews, freshly baked pastries, and gourmet sandwiches. Order online for instant pickup, or reserve your table in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/menu"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-white bg-gradient-to-r from-[#6F4E37] to-[#4A3222] hover:from-[#5A3E2B] hover:to-[#382417] shadow-lg shadow-amber-950/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base"
              >
                <FaUtensils />
                <span>Explore Full Menu</span>
              </Link>
              <Link
                to="/reservations"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-[#6F4E37] bg-white border border-[#DED4C7] hover:bg-[#F9F5F0] shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base"
              >
                <FaCalendarAlt />
                <span>Book a Table</span>
              </Link>
            </div>

            {/* Quick Feature Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E8DFC0]/70 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <p className="text-2xl font-black text-[#3B2314]">100%</p>
                <p className="text-xs text-[#827165] font-medium">Arabica Beans</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl font-black text-[#3B2314]">Fresh</p>
                <p className="text-xs text-[#827165] font-medium">Daily Pastries</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl font-black text-[#3B2314]">Fast</p>
                <p className="text-xs text-[#827165] font-medium">Table Booking</p>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="relative mx-auto lg:ml-auto max-w-md lg:max-w-none w-full">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-amber-950/20 border-4 border-white/80 transform hover:scale-[1.01] transition-transform duration-300">
              <img
                src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900&auto=format&fit=crop&q=80"
                alt="Cozy Cafe Atmosphere"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="flex items-center gap-1 text-amber-400 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <h3 className="font-bold text-lg">Voted #1 Artisan Cafe in Town</h3>
                  <p className="text-xs text-amber-100">Over 5,000+ happy coffee lovers served</p>
                </div>
              </div>
            </div>

            {/* Decorative ambient blobs */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#6F4E37]/20 rounded-full blur-3xl pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3B2314] tracking-tight">
            Explore By Category
          </h2>
          <p className="mt-2 text-sm text-[#7A695E]">
            Browse our handpicked selections tailored for every coffee break, breakfast, and sweet craving.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/menu?category=${encodeURIComponent(cat.name)}`}
                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-[#EBE2D7] bg-white transition-all duration-300"
              >
                <div className="h-32 sm:h-40 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-sm sm:text-base text-[#3B2314] group-hover:text-amber-800 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-[#8C7A6E] mt-0.5">
                    {cat.foodCount || 0} items
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-4 text-center py-8 text-[#8C7A6E]">
              Loading categories...
            </div>
          )}
        </div>
      </section>

      {/* Featured Chef Specials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3B2314] tracking-tight">
              Featured Specialties
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#7A695E]">
              Our baristas and chefs recommend these popular customer favorites.
            </p>
          </div>
          <Link
            to="/menu"
            className="text-xs sm:text-sm font-bold text-[#6F4E37] hover:text-[#3B2314] hover:underline"
          >
            View All Menu Items &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredFoods.map((food) => (
            <div
              key={food._id}
              className="bg-white rounded-2xl border border-[#EBE2D7] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group"
            >
              <div className="relative h-44 overflow-hidden bg-amber-50">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#6F4E37] uppercase tracking-wider shadow-xs">
                  {food.category}
                </span>
                <span className="absolute bottom-3 right-3 bg-[#3B2314]/90 text-amber-300 px-3 py-1 rounded-xl text-xs font-black shadow-md">
                  ${food.price.toFixed(2)}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-[#3B2314] mb-1 group-hover:text-[#6F4E37] transition-colors">
                    {food.name}
                  </h3>
                  <p className="text-xs text-[#7A695E] line-clamp-2 leading-relaxed">
                    {food.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <Link
                    to={`/menu/${food._id}`}
                    className="text-xs font-bold text-[#6F4E37] hover:underline"
                  >
                    Details
                  </Link>
                  <button
                    onClick={() => addToCart(food._id, 1)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#6F4E37] hover:bg-[#543825] text-white shadow-xs active:scale-95 transition-all"
                  >
                    <FaShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Special Coupon Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#6F4E37] via-[#543825] to-[#3B2314] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <span className="inline-block px-3 py-1 bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider rounded-lg">
              Limited Time Special
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Get 20% OFF Your First Online Order!
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/80 leading-relaxed">
              Use code <strong className="text-white font-mono bg-white/20 px-2 py-0.5 rounded">WELCOME20</strong> at checkout to claim instant 20% discount on orders over $10.
            </p>
          </div>
          <Link
            to="/menu"
            className="shrink-0 px-8 py-4 rounded-2xl font-black text-[#3B2314] bg-amber-300 hover:bg-amber-200 shadow-md transition-all active:scale-95 text-sm uppercase tracking-wide"
          >
            Order & Claim Coupon
          </Link>
        </div>
      </section>
    </div>
  )
}