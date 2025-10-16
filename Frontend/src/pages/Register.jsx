import React, { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import MenuItem from '@mui/material/MenuItem'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('USER')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await register({ name, email, password, role, phone, address })
      if (res.ok) {
        window.dispatchEvent(new CustomEvent('zomino:notify', { detail: { message: 'Registration successful', severity: 'success' } }))
        navigate('/')
      } else {
        const msg = res.data && res.data.message ? res.data.message : 'Registration failed'
        window.dispatchEvent(new CustomEvent('zomino:notify', { detail: { message: msg, severity: 'error' } }))
      }
    } catch (err) {
      window.dispatchEvent(new CustomEvent('zomino:notify', { detail: { message: err.message || 'Registration error', severity: 'error' } }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>Register</Typography>
      <Box component="form" onSubmit={submit} sx={{ display: 'grid', gap: 2 }}>
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <TextField select label="Role" value={role} onChange={(e) => setRole(e.target.value)}>
          <MenuItem value="USER">User</MenuItem>
          <MenuItem value="RESTAURANT">Restaurant</MenuItem>
          <MenuItem value="ADMIN">Admin</MenuItem>
        </TextField>
        <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <TextField label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Registering...' : 'Register'}</Button>
        <Button component={RouterLink} to="/login" variant="text">Already have an account? Login</Button>
      </Box>
    </Paper>
  )
}

