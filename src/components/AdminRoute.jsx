import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute({ children }) {
  const { user, dbUser, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (dbUser?.role !== 'admin') {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-md p-8 bg-white rounded-2xl shadow-xl border border-amber-200">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            !
          </div>
          <h2 className="text-2xl font-extrabold text-[#3B2314] mb-2">Access Denied</h2>
          <p className="text-sm text-[#7A695E] mb-6">
            You need Administrator privileges to access the Admin Management Panel.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-2.5 rounded-xl font-bold bg-[#6F4E37] text-white hover:bg-[#543825] transition-all"
          >
            Return to Cafe Home
          </a>
        </div>
      </div>
    )
  }

  return children
}
