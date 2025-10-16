import React, { useState } from 'react'
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await login({ email, password })
      if (res.ok) {
        window.dispatchEvent(new CustomEvent('zomino:notify', { detail: { message: 'Login successful', severity: 'success' } }))
        // If redirected to login from a protected page, go back there
        const dest = location.state && location.state.from ? location.state.from.pathname : '/'
        navigate(dest)
      } else {
        const msg = res.data && res.data.message ? res.data.message : 'Login failed'
        window.dispatchEvent(new CustomEvent('zomino:notify', { detail: { message: msg, severity: 'error' } }))
      }
    } catch (err) {
      window.dispatchEvent(new CustomEvent('zomino:notify', { detail: { message: err.message || 'Login error', severity: 'error' } }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 480, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      <Box component="form" onSubmit={submit} sx={{ display: 'grid', gap: 2 }}>
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
        <Button component={RouterLink} to="/register" variant="text">Don't have an account? Register</Button>
      </Box>
    </Paper>
  )
}
