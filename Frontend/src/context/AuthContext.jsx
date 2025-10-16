import React, { createContext, useContext, useEffect, useState } from 'react'
import { loginUser, registerUser } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('zomino_user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    try {
      if (user) localStorage.setItem('zomino_user', JSON.stringify(user))
      else localStorage.removeItem('zomino_user')
    } catch {}
  }, [user])

  async function login({ email, password }) {
    const data = await loginUser({ email, password })
    // backend returns { message, user }
    if (data && data.user) {
      setUser(data.user)
      return { ok: true, data }
    }
    return { ok: false, data }
  }

  async function register(payload) {
    const data = await registerUser(payload)
    if (data && data.user) {
      setUser(data.user)
      return { ok: true, data }
    }
    return { ok: false, data }
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

