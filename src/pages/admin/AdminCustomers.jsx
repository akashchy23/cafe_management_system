import { useState, useEffect } from 'react'
import { FaUsers, FaSearch, FaKey, FaEnvelope, FaReceipt, FaDollarSign, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa'
import api from '../../api/axios'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/admin/users')
      setCustomers(res.data)
    } catch (err) {
      console.error('Failed to load customers:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  const filteredCustomers = customers.filter((c) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.uid?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#3B2314] tracking-tight">
            Customer Directory
          </h1>
          <p className="text-xs text-[#7A695E] mt-1">
            View customer identity mapping, Firebase UIDs, total spending, and ordering history.
          </p>
        </div>

        <span className="self-start sm:self-auto px-3.5 py-1.5 bg-amber-100 text-amber-900 rounded-xl text-xs font-bold border border-amber-200">
          Total Customers: {customers.length}
        </span>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-[#EBE2D7] shadow-sm">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3.5 top-3 text-gray-400 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search by customer name, email, or Firebase UID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#DED4C7] bg-[#FCFAF8] text-xs text-[#3B2314] focus:outline-none focus:ring-2 focus:ring-amber-700/30"
          />
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-3xl border border-[#EBE2D7] shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-amber-700 border-t-transparent mx-auto"></div>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#8C7A6E]">
            No customers found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-[#8C7A6E] uppercase text-[10px] bg-[#FAF6F0]">
                  <th className="py-3.5 px-4">Customer & Profile</th>
                  <th className="py-3.5 px-4">Firebase UID (Unique)</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Total Orders</th>
                  <th className="py-3.5 px-4">Total Spent</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[#3B2314]">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.uid} className="hover:bg-[#FAF6F0]/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        {customer.photoURL ? (
                          <img
                            src={customer.photoURL}
                            alt=""
                            className="w-9 h-9 rounded-xl object-cover border border-amber-200"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-[#6F4E37] text-white flex items-center justify-center font-black text-xs uppercase">
                            {(customer.name || customer.email || 'U')[0]}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-sm text-[#3B2314]">
                            {customer.name || 'Unnamed Customer'}
                          </p>
                          <p className="text-[11px] text-[#8C7A6E]">{customer.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-[#6F5D53]">
                      <span className="bg-[#FAF6F0] px-2 py-0.5 rounded border border-[#EAE0D5]">
                        {customer.uid}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-[#6F5D53]">
                      <p>{customer.phone || 'No phone'}</p>
                      <p className="text-[10px] text-[#8C7A6E] truncate max-w-[130px]">
                        {customer.address || 'No address'}
                      </p>
                    </td>

                    <td className="py-3 px-4 font-bold text-[#3B2314]">
                      {customer.totalOrders || 0}
                    </td>

                    <td className="py-3 px-4 font-black text-sm text-[#6F4E37]">
                      ${Number(customer.totalSpent || 0).toFixed(2)}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          customer.role === 'admin'
                            ? 'bg-amber-800 text-white'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {customer.role || 'customer'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#6F4E37] bg-amber-50 hover:bg-amber-100 transition-colors"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#EBE2D7] space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-xl font-extrabold text-[#3B2314]">Customer Profile</h2>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#6F4E37] text-white flex items-center justify-center font-black text-xl uppercase">
                  {(selectedCustomer.name || selectedCustomer.email || 'U')[0]}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#3B2314]">
                    {selectedCustomer.name || 'Unnamed Customer'}
                  </h3>
                  <p className="text-[#8C7A6E]">{selectedCustomer.email}</p>
                  <p className="font-mono text-[10px] text-amber-800 mt-0.5">
                    UID: {selectedCustomer.uid}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-[#FAF6F0] p-4 rounded-2xl border border-[#EBE2D7]">
                <div>
                  <span className="text-[10px] text-[#8C7A6E] uppercase font-bold block">Total Orders</span>
                  <span className="text-base font-black text-[#3B2314]">
                    {selectedCustomer.totalOrders || 0}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C7A6E] uppercase font-bold block">Total Spending</span>
                  <span className="text-base font-black text-[#6F4E37]">
                    ${Number(selectedCustomer.totalSpent || 0).toFixed(2)}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-[#8C7A6E] uppercase font-bold block">Delivery Address</span>
                  <span className="font-semibold text-[#3B2314]">
                    {selectedCustomer.address || 'None registered'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#6F4E37]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
