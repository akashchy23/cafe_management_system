import { useState, useEffect } from 'react'
import {
  FaUsers,
  FaUserPlus,
  FaShieldAlt,
  FaTrash,
  FaUserTie,
  FaCheckCircle,
} from 'react-icons/fa'
import api from '../../api/axios'
import Swal from 'sweetalert2'

export default function AdminEmployees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    role: 'staff',
  })
  const [submitting, setSubmitting] = useState(false)

  const loadEmployees = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/admin/employees')
      setEmployees(res.data)
    } catch (err) {
      console.error('Failed to load employees:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEmployees()
  }, [])

  const handleAddEmployee = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      await api.post('/api/admin/employees', formData)
      Swal.fire({
        icon: 'success',
        title: 'Employee Role Assigned!',
        confirmButtonColor: '#6F4E37',
      })
      setModalOpen(false)
      setFormData({ email: '', name: '', phone: '', role: 'staff' })
      loadEmployees()
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.error || 'Failed to add employee.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleRoleChange = async (employee, newRole) => {
    try {
      await api.patch(`/api/admin/employees/${employee._id || employee.uid}/role`, { role: newRole })
      Swal.fire({
        icon: 'success',
        title: 'Role Updated',
        text: `${employee.name || employee.email} is now a ${newRole}.`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
      })
      loadEmployees()
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to update role' })
    }
  }

  const handleRemoveEmployee = async (employee) => {
    const confirm = await Swal.fire({
      title: `Revoke employee permissions for ${employee.name || employee.email}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Revoke Permissions',
    })
    if (confirm.isConfirmed) {
      try {
        await api.delete(`/api/admin/employees/${employee._id || employee.uid}`)
        loadEmployees()
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to revoke permissions' })
      }
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#3B2314] tracking-tight">
            Employee & Staff Directory
          </h1>
          <p className="text-xs text-[#7A695E] mt-1">
            Manage cafe personnel, barista staff, managers, and system administrators.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#6F4E37] text-white hover:bg-[#543825] shadow-sm flex items-center gap-2"
        >
          <FaUserPlus />
          <span>Assign New Staff</span>
        </button>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-3xl border border-[#EBE2D7] shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-amber-700 border-t-transparent mx-auto"></div>
          </div>
        ) : employees.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#8C7A6E]">
            No employees found. Click &ldquo;Assign New Staff&rdquo; to add managers or baristas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-[#8C7A6E] uppercase text-[10px] bg-[#FAF6F0]">
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Assigned Role</th>
                  <th className="py-3.5 px-4">Change Role</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[#3B2314]">
                {employees.map((emp) => (
                  <tr key={emp._id || emp.uid} className="hover:bg-[#FAF6F0]/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-sm text-[#3B2314]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center uppercase">
                          {(emp.name || emp.email)[0]}
                        </div>
                        <div>
                          <span>{emp.name || 'Staff Member'}</span>
                          <span className="block text-[10px] text-[#8C7A6E] font-mono">{emp.uid}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-[#54433A]">
                      {emp.email}
                    </td>

                    <td className="py-3.5 px-4 text-[#8C7A6E]">
                      {emp.phone || 'N/A'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          emp.role === 'admin'
                            ? 'bg-purple-100 text-purple-900 border border-purple-200'
                            : emp.role === 'manager'
                            ? 'bg-blue-100 text-blue-900 border border-blue-200'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        }`}
                      >
                        {emp.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={emp.role}
                        onChange={(e) => handleRoleChange(emp, e.target.value)}
                        className="px-2.5 py-1 rounded-xl border border-[#DED4C7] bg-white text-xs font-bold text-[#3B2314] focus:outline-none"
                      >
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="staff">Staff</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleRemoveEmployee(emp)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Revoke Role"
                      >
                        <FaTrash className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#EBE2D7] space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-xl font-extrabold text-[#3B2314]">Assign Staff Role</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                  Employee Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="barista@cafemanagement.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahim Ahmed"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                    System Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED4C7] text-xs font-bold text-[#3B2314] focus:outline-none"
                  >
                    <option value="staff">Staff (Kitchen/Barista)</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
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
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#6F4E37] hover:bg-[#543825]"
                >
                  {submitting ? 'Assigning...' : 'Assign Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
