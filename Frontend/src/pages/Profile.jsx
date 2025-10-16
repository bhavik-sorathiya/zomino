import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { getUserOrders } from '../api'
import { useEffect, useState } from 'react'
import { formatDate } from '../utils/date'

export default function Profile(){
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [recent, setRecent] = useState(null)
  const [loading, setLoading] = useState(false)

  if (!user) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Not signed in</Typography>
        <Typography>Please login to view your profile.</Typography>
      </Box>
    )
  }

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        const data = await getUserOrders(user.id)
        if (mounted) setRecent(Array.isArray(data) ? data.slice(0,3) : [])
      } catch (err) {
        console.error('Failed to load recent orders', err)
        if (mounted) setRecent([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [user])

  return (
    <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Avatar sx={{ width: 64, height: 64, fontSize: 28 }}>{(user.name || user.email || 'U').charAt(0).toUpperCase()}</Avatar>
        <Box>
          <Typography variant="h5">{user.name || user.email}</Typography>
          <Typography variant="body2" color="text.secondary">{user.email}</Typography>
        </Box>
      </Box>

      <Box>
        <Typography variant="subtitle1">Contact</Typography>
        <Typography>{user.phone || '—'}</Typography>
        <Typography variant="subtitle1" sx={{ mt: 1 }}>Address</Typography>
        <Typography>{user.address || '—'}</Typography>
      </Box>

      <Box sx={{ width: '100%' }}>
        <Typography variant="h6">Recent orders</Typography>
        {loading && <Typography color="text.secondary">Loading...</Typography>}
        {!loading && recent && recent.length === 0 && <Typography color="text.secondary">No recent orders</Typography>}
        {!loading && recent && recent.length > 0 && (
          <List sx={{ width: '100%' }}>
            {recent.map((o) => (
              <ListItem key={o.id} divider secondaryAction={<Button size="small" onClick={() => navigate(`/orders`)}>View all</Button>}>
                <ListItemText primary={`Order #${o.id} — ${o.restaurantName || '—'}`} secondary={`${o.items?.length || 0} items • ${o.status || '—'} • ${o.createdAt ? formatDate(o.createdAt) : ''}`} />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="outlined" onClick={() => { logout(); navigate('/'); window.dispatchEvent(new CustomEvent('zomino:notify', { detail: { message: 'Logged out', severity: 'info' } })) }}>Logout</Button>
      </Box>
    </Box>
  )
}
