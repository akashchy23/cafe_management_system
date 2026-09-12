import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [dbUser, setDbUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Sync Firebase user with MongoDB backend
  const syncUserWithDB = useCallback(async (firebaseUser) => {
    if (!firebaseUser) {
      setDbUser(null)
      return
    }

    try {
      // Save/Upsert baseline user data
      const res = await api.post('/api/users', {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || '',
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL || '',
        provider: firebaseUser.providerData?.[0]?.providerId || 'email',
      })
      if (res.data?.user) {
        setDbUser(res.data.user)
      } else {
        // Fetch fresh profile
        const profileRes = await api.get('/api/users/me')
        setDbUser(profileRes.data)
      }
    } catch (err) {
      console.error('Failed to sync user with MongoDB:', err)
    }
  }, [])

  const refreshUser = useCallback(async () => {
    if (!auth.currentUser) return
    try {
      const res = await api.get('/api/users/me')
      setDbUser(res.data)
    } catch (err) {
      console.error('Failed to refresh user profile:', err)
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        await syncUserWithDB(firebaseUser)
      } else {
        setDbUser(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [syncUserWithDB])

  const logout = async () => {
    await signOut(auth)
    setUser(null)
    setDbUser(null)
  }

  const updateUserProfile = async (data) => {
    const res = await api.patch('/api/users/profile', data)
    await refreshUser()
    return res.data
  }

  const makeAdmin = async (targetEmail) => {
    const res = await api.post('/api/users/make-admin', { targetEmail })
    await refreshUser()
    return res.data
  }

  const isAdmin = dbUser?.role === 'admin'

  return (
    <AuthContext.Provider
      value={{
        user,
        dbUser,
        isAdmin,
        loading,
        logout,
        refreshUser,
        updateUserProfile,
        makeAdmin,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
