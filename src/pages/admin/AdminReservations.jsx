import { useState, useEffect } from 'react'
import { FaCalendarAlt, FaCheck, FaTimes, FaPhoneAlt, FaUsers, FaChair } from 'react-icons/fa'
import api from '../../api/axios'
import Swal from 'sweetalert2'

export default function AdminReservations() {
  const [reservations, setReservations] = useState([])
  const [statusFilter, setStatusFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  const loadReservations = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/admin/reservations')
      setReservations(res.data)
    } catch (err) {
      console.error('Failed to load admin reservations:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReservations()
  }, [])

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/api/admin/reservations/${id}/status`, { status })
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Reservation ${status}`,
        showConfirmButton: false,
        timer: 1500,
      })
      loadReservations()
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update reservation status',
        confirmButtonColor: '#6F4E37',
      })
    }
  }

  const filtered = reservations.filter((r) => {
    if (statusFilter === 'All') return true
    return r.status === statusFilter
  })

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#3B2314] tracking-tight">
            Table Reservations Management
          </h1>
          <p className="text-xs text-[#7A695E] mt-1">
            Review table requests, allocate seating, and manage reservations.
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-[#6F4E37] text-white'
                  : 'bg-white border border-[#DED4C7] text-[#6F5D53] hover:bg-[#FAF6F0]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#EBE2D7] shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-amber-700 border-t-transparent mx-auto"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#8C7A6E]">
            No reservations found for this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-[#8C7A6E] uppercase text-[10px] bg-[#FAF6F0]">
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Table</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Guests</th>
                  <th className="py-3.5 px-4">Special Request</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[#3B2314]">
                {filtered.map((res) => (
                  <tr key={res._id} className="hover:bg-[#FAF6F0]/40 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-sm text-[#3B2314]">{res.customerName}</p>
                      <p className="text-[11px] text-[#8C7A6E] flex items-center gap-1">
                        <FaPhoneAlt className="w-2.5 h-2.5 text-amber-700" />
                        <span>{res.phone}</span>
                      </p>
                    </td>

                    <td className="py-3 px-4 font-bold text-[#6F4E37]">
                      Table #{res.tableNumber}
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-[#3B2314]">{res.reservationDate}</p>
                      <p className="text-[11px] text-[#8C7A6E]">{res.reservationTime}</p>
                    </td>

                    <td className="py-3 px-4 font-semibold">
                      {res.guests} people
                    </td>

                    <td className="py-3 px-4 max-w-[200px] text-[#6F5D53]">
                      {res.specialRequest ? (
                        <span className="italic text-[11px] truncate block">
                          &ldquo;{res.specialRequest}&rdquo;
                        </span>
                      ) : (
                        <span className="text-[#A8988B] text-[11px]">None</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          res.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : res.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : res.status === 'Completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {res.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {res.status === 'Pending' && (
                          <button
                            onClick={() => handleUpdateStatus(res._id, 'Confirmed')}
                            className="p-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-lg text-xs font-bold"
                            title="Confirm Booking"
                          >
                            <FaCheck />
                          </button>
                        )}
                        {res.status !== 'Completed' && res.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleUpdateStatus(res._id, 'Completed')}
                            className="px-2.5 py-1 bg-blue-50 text-blue-800 hover:bg-blue-100 rounded-lg text-[10px] font-bold"
                          >
                            Mark Done
                          </button>
                        )}
                        {res.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleUpdateStatus(res._id, 'Cancelled')}
                            className="p-1.5 bg-red-100 text-red-800 hover:bg-red-200 rounded-lg text-xs font-bold"
                            title="Cancel Booking"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}
