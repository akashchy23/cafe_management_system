import { useState, useEffect } from 'react'
import { FaCalendarAlt, FaClock, FaUsers, FaChair, FaCheckCircle, FaTimesCircle, FaBan } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Swal from 'sweetalert2'

export default function Reservations() {
  const { user, dbUser } = useAuth()
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    customerName: user?.displayName || dbUser?.name || '',
    phone: dbUser?.phone || '',
    tableNumber: 4,
    reservationDate: new Date().toISOString().split('T')[0],
    reservationTime: '18:00',
    guests: 2,
    specialRequest: '',
  })

  const loadReservations = async () => {
    if (!user) return
    try {
      setLoading(true)
      const res = await api.get('/api/reservations/my', {
        params: { userId: user.uid, email: user.email },
      })
      if (res.data) {
        setReservations(res.data)
      }
    } catch (err) {
      console.warn('Backend reservations unreachable, checking local fallback:', err)
      const local = JSON.parse(localStorage.getItem(`reservations_${user.uid}`) || '[]')
      setReservations(local)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReservations()
  }, [user])

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleBookTable = async (e) => {
    e.preventDefault()
    if (!user) {
      Swal.fire({
        icon: 'info',
        title: 'Sign In Required',
        text: 'Please sign in to make a table reservation.',
        confirmButtonColor: '#6F4E37',
      })
      return
    }

    setSubmitting(true)
    try {
      await api.post('/api/reservations', {
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        tableNumber: Number(formData.tableNumber),
        reservationDate: formData.reservationDate,
        reservationTime: formData.reservationTime,
        guests: Number(formData.guests),
        specialRequest: formData.specialRequest.trim(),
        userId: user.uid,
        email: user.email,
      })

      Swal.fire({
        icon: 'success',
        title: 'Table Reserved!',
        text: 'Your table reservation has been saved in MongoDB database.',
        confirmButtonColor: '#6F4E37',
      })
      setFormData({
        customerName: user?.displayName || dbUser?.name || '',
        phone: dbUser?.phone || '',
        tableNumber: Math.floor(Math.random() * 6) + 1,
        reservationDate: new Date().toISOString().split('T')[0],
        reservationTime: '18:00',
        guests: 2,
        specialRequest: '',
      })
      await loadReservations()
    } catch (err) {
      console.error('Reservation error:', err)
      Swal.fire({
        icon: 'error',
        title: 'Reservation Failed',
        text: err.response?.data?.error || 'Unable to book table. Please check server connection.',
        confirmButtonColor: '#6F4E37',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancelReservation = async (id) => {
    const result = await Swal.fire({
      title: 'Cancel Reservation?',
      text: 'Are you sure you want to cancel this table booking?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6F4E37',
      confirmButtonText: 'Yes, Cancel',
    })

    if (result.isConfirmed) {
      try {
        if (id.startsWith('local-res-')) {
          const local = JSON.parse(localStorage.getItem(`reservations_${user.uid}`) || '[]')
          const updated = local.map((r) => (r._id === id ? { ...r, status: 'Cancelled' } : r))
          localStorage.setItem(`reservations_${user.uid}`, JSON.stringify(updated))
        } else {
          await api.patch(`/api/reservations/${id}/cancel`)
        }
        Swal.fire({
          icon: 'success',
          title: 'Cancelled',
          text: 'Your reservation has been cancelled.',
          confirmButtonColor: '#6F4E37',
        })
        loadReservations()
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to cancel reservation.',
          confirmButtonColor: '#6F4E37',
        })
      }
    }
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] py-10 px-4 sm:px-6 lg:px-8 bg-radial from-[#FAF6F0] to-[#F5ECE1]">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-100/80 text-[#6F4E37] mb-3 shadow-inner ring-1 ring-amber-200">
            <FaCalendarAlt className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#3B2314] tracking-tight">
            Table Reservations
          </h1>
          <p className="mt-2 text-sm text-[#7A695E]">
            Reserve an intimate corner or group table at Cafe Delight for your special occasion.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Reservation Form */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-[#EBE2D7] p-7 sm:p-9 shadow-sm space-y-5">
            <h2 className="text-xl font-extrabold text-[#3B2314] border-b border-gray-100 pb-3">
              Book a Table
            </h2>

            <form onSubmit={handleBookTable} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#54433A] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  required
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DED4C7] bg-[#FCFAF8] text-sm text-[#3B2314] focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#54433A] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 555-0199"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DED4C7] bg-[#FCFAF8] text-sm text-[#3B2314] focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#54433A] mb-1">
                    Number of Guests *
                  </label>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DED4C7] bg-[#FCFAF8] text-sm text-[#3B2314] focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#54433A] mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="reservationDate"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.reservationDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DED4C7] bg-[#FCFAF8] text-sm text-[#3B2314] focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#54433A] mb-1">
                    Time *
                  </label>
                  <select
                    name="reservationTime"
                    value={formData.reservationTime}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DED4C7] bg-[#FCFAF8] text-sm text-[#3B2314] focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                  >
                    {['08:00', '09:30', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30', '20:00'].map(
                      (time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#54433A] mb-1">
                  Preferred Table Area
                </label>
                <select
                  name="tableNumber"
                  value={formData.tableNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DED4C7] bg-[#FCFAF8] text-sm text-[#3B2314] focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                >
                  <option value={1}>Table #1 - Cozy Window View (2 Seats)</option>
                  <option value={2}>Table #2 - Sunlight Patio (2 Seats)</option>
                  <option value={3}>Table #3 - Quiet Garden Terrace (4 Seats)</option>
                  <option value={4}>Table #4 - Main Lounge Booth (4 Seats)</option>
                  <option value={5}>Table #5 - Barista Bar Counter (1-2 Seats)</option>
                  <option value={6}>Table #6 - Private Family Dining (6-8 Seats)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#54433A] mb-1">
                  Special Notes or Dietary Requests
                </label>
                <textarea
                  name="specialRequest"
                  rows={2}
                  value={formData.specialRequest}
                  onChange={handleChange}
                  placeholder="e.g. Birthday anniversary, high chair needed..."
                  className="w-full px-4 py-2 rounded-xl border border-[#DED4C7] bg-[#FCFAF8] text-xs text-[#3B2314] focus:outline-none focus:ring-2 focus:ring-amber-700/30 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-[#6F4E37] to-[#4A3222] hover:from-[#5A3E2B] hover:to-[#382417] shadow-md active:scale-98 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? 'Confirming Reservation...' : 'Confirm Table Booking'}
              </button>
            </form>
          </div>

          {/* My Reservations List */}
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-xl font-extrabold text-[#3B2314]">
              My Bookings ({reservations.length})
            </h2>

            {loading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-3 border-amber-700 border-t-transparent mx-auto"></div>
              </div>
            ) : reservations.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#EBE2D7] p-8 text-center space-y-2">
                <FaChair className="w-10 h-10 text-amber-700 mx-auto opacity-60" />
                <h3 className="font-bold text-sm text-[#3B2314]">No Active Reservations</h3>
                <p className="text-xs text-[#7A695E]">
                  Use the booking form on the left to reserve your table.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {reservations.map((res) => (
                  <div
                    key={res._id}
                    className="bg-white rounded-2xl border border-[#EBE2D7] p-5 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#3B2314]">
                          Table #{res.tableNumber}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            res.status === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : res.status === 'Cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {res.status}
                        </span>
                      </div>

                      {res.status === 'Pending' && (
                        <button
                          onClick={() => handleCancelReservation(res._id)}
                          className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <FaBan className="w-3 h-3" />
                          <span>Cancel</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs text-[#6F5D53] border-t border-gray-100 pt-3">
                      <div>
                        <span className="text-[#8C7A6E] block text-[10px]">DATE</span>
                        <strong className="text-[#3B2314]">{res.reservationDate}</strong>
                      </div>
                      <div>
                        <span className="text-[#8C7A6E] block text-[10px]">TIME</span>
                        <strong className="text-[#3B2314]">{res.reservationTime}</strong>
                      </div>
                      <div>
                        <span className="text-[#8C7A6E] block text-[10px]">GUESTS</span>
                        <strong className="text-[#3B2314]">{res.guests} people</strong>
                      </div>
                    </div>

                    {res.specialRequest && (
                      <p className="text-[11px] text-[#8C7A6E] italic bg-[#FAF6F0] p-2 rounded-lg">
                        Note: &ldquo;{res.specialRequest}&rdquo;
                      </p>
                    )}
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