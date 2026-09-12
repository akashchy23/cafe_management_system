import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../api/axios'
import { useAuth } from './AuthContext'
import { STATIC_FOODS } from '../data/staticFoods'
import Swal from 'sweetalert2'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    discount: 0,
    couponCode: null,
    total: 0,
  })
  const [loading, setLoading] = useState(false)

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart({
        items: [],
        subtotal: 0,
        discount: 0,
        couponCode: null,
        total: 0,
      })
      return
    }

    try {
      setLoading(true)
      const res = await api.get('/api/cart')
      if (res.data) {
        setCart(res.data)
      }
    } catch (err) {
      console.warn('Backend cart unavailable, using local cart:', err)
      const local = JSON.parse(localStorage.getItem(`cart_${user.uid}`) || 'null')
      if (local) setCart(local)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  // Save to local storage for backup
  useEffect(() => {
    if (user && cart) {
      localStorage.setItem(`cart_${user.uid}`, JSON.stringify(cart))
    }
  }, [cart, user])

  const recalculateLocalCart = (items, couponCode = cart.couponCode) => {
    const subtotal = items.reduce((sum, i) => sum + (Number(i.price) * Number(i.quantity)), 0)
    let discount = 0
    if (couponCode === 'WELCOME20') discount = Math.min(15, subtotal * 0.2)
    else if (couponCode === 'CAFE10') discount = Math.min(10, subtotal * 0.1)
    else if (couponCode === 'SAVE5') discount = 5

    discount = Math.round(discount * 100) / 100
    const total = Math.max(0, Math.round((subtotal - discount) * 100) / 100)
    return {
      userId: user?.uid,
      email: user?.email,
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      discount,
      couponCode,
      total,
    }
  }

  const addToCart = async (foodId, quantity = 1, silent = false) => {
    if (!user) {
      Swal.fire({
        icon: 'info',
        title: 'Please Sign In',
        text: 'You need to be logged in to add items to your cart.',
        confirmButtonColor: '#6F4E37',
      })
      return false
    }

    try {
      try {
        const res = await api.post('/api/cart', { foodId, quantity })
        if (res.data?.cart) {
          setCart(res.data.cart)
        }
      } catch (netErr) {
        console.warn('Backend unavailable, using local cart fallback:', netErr)
        const staticItem = STATIC_FOODS.find((f) => f._id === foodId || f.name.toLowerCase() === foodId.toLowerCase())
        const items = [...(cart.items || [])]
        const existingIdx = items.findIndex((i) => i.foodId === foodId)
        
        if (existingIdx > -1) {
          items[existingIdx].quantity += quantity
          items[existingIdx].subtotal = items[existingIdx].quantity * items[existingIdx].price
        } else if (staticItem) {
          items.push({
            foodId: staticItem._id,
            foodName: staticItem.name,
            price: staticItem.price,
            image: staticItem.image,
            quantity: quantity,
            subtotal: staticItem.price * quantity,
          })
        }
        const updated = recalculateLocalCart(items)
        setCart(updated)
      }

      if (!silent) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Added to cart!',
          showConfirmButton: false,
          timer: 1800,
          timerProgressBar: true,
        })
      }
      return true
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.error || 'Failed to add item to cart',
        confirmButtonColor: '#6F4E37',
      })
      return false
    }
  }

  const updateQuantity = async (foodId, quantity) => {
    if (!user) return
    try {
      try {
        const res = await api.patch(`/api/cart/${foodId}`, { quantity })
        if (res.data?.cart) setCart(res.data.cart)
      } catch (netErr) {
        let items = [...(cart.items || [])]
        if (quantity <= 0) {
          items = items.filter((i) => i.foodId !== foodId)
        } else {
          const item = items.find((i) => i.foodId === foodId)
          if (item) {
            item.quantity = quantity
            item.subtotal = quantity * item.price
          }
        }
        setCart(recalculateLocalCart(items))
      }
    } catch (err) {
      console.error('Error updating quantity:', err)
    }
  }

  const removeFromCart = async (foodId) => {
    if (!user) return
    try {
      try {
        const res = await api.delete(`/api/cart/${foodId}`)
        if (res.data?.cart) setCart(res.data.cart)
      } catch (netErr) {
        const items = (cart.items || []).filter((i) => i.foodId !== foodId)
        setCart(recalculateLocalCart(items))
      }
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: 'Item removed',
        showConfirmButton: false,
        timer: 1500,
      })
    } catch (err) {
      console.error('Error removing item:', err)
    }
  }

  const clearCart = async () => {
    if (!user) return
    try {
      try {
        await api.delete('/api/cart')
      } catch (netErr) {}
      setCart({
        items: [],
        subtotal: 0,
        discount: 0,
        couponCode: null,
        total: 0,
      })
    } catch (err) {
      console.error('Error clearing cart:', err)
    }
  }

  const applyCoupon = async (code) => {
    if (!user) return false
    try {
      try {
        const res = await api.post('/api/coupons/validate', { code })
        await fetchCart()
        Swal.fire({
          icon: 'success',
          title: 'Coupon Applied!',
          text: res.data.message,
          confirmButtonColor: '#6F4E37',
        })
        return true
      } catch (netErr) {
        const upper = code.toUpperCase().trim()
        if (['WELCOME20', 'CAFE10', 'SAVE5'].includes(upper)) {
          const updated = recalculateLocalCart(cart.items, upper)
          setCart(updated)
          Swal.fire({
            icon: 'success',
            title: 'Coupon Applied!',
            text: `Coupon "${upper}" applied!`,
            confirmButtonColor: '#6F4E37',
          })
          return true
        } else {
          throw new Error('Invalid coupon code')
        }
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Coupon',
        text: err.response?.data?.error || err.message || 'Failed to apply coupon',
        confirmButtonColor: '#6F4E37',
      })
      return false
    }
  }

  const removeCoupon = async () => {
    if (!user) return
    try {
      try {
        const res = await api.delete('/api/coupons/remove')
        if (res.data?.cart) setCart(res.data.cart)
      } catch (netErr) {
        setCart(recalculateLocalCart(cart.items, null))
      }
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: 'Coupon removed',
        showConfirmButton: false,
        timer: 1500,
      })
    } catch (err) {
      console.error('Error removing coupon:', err)
    }
  }

  const cartCount = cart.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
