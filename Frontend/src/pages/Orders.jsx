import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Button from '@mui/material/Button'
import { getUserOrders } from '../api'
import { useAuth } from '../context/AuthContext'
import { formatDate } from '../utils/date'

export default function Orders(){
  const { user } = useAuth()
  const [orders, setOrders] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    async function load(){
      try {
        setLoading(true)
        const data = await getUserOrders(user?.id)
        if (mounted) setOrders(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to load orders', err)
        if (mounted) setError(err.message || 'Failed to load orders')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    if (user && user.id) load()
    else { setOrders([]); setLoading(false) }
    return () => { mounted = false }
  }, [user])

  if (loading) return <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
  if (error) return <Box sx={{ mt: 4 }}><Typography color="error">{error}</Typography></Box>

  if (!orders || orders.length === 0) return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">No recent orders</Typography>
      <Typography color="text.secondary">You have not placed any orders yet.</Typography>
    </Box>
  )

  return (
    <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5">Your Orders</Typography>
      <List>
        {orders.map((o) => (
          <ListItem key={o.id} disableGutters sx={{ mb: 1 }}>
            <Card sx={{ width: '100%' }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1">Order #{o.id} — {o.restaurantName || '—'}</Typography>
                  <Typography variant="body2" color="text.secondary">{o.items?.length || 0} items • {o.status || '—'}</Typography>
                  <Box sx={{ mt: 1 }}>
                    {o.items && o.items.slice(0,3).map((it, idx) => (
                      <Typography key={idx} variant="body2">{it.name} x{it.quantity}</Typography>
                    ))}
                    {o.items && o.items.length > 3 && <Typography variant="body2">+{o.items.length - 3} more items</Typography>}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                  <Typography variant="subtitle2">{o.grandTotal ? `₹${o.grandTotal}` : '—'}</Typography>
                  <Typography variant="caption" color="text.secondary">{o.createdAt ? formatDate(o.createdAt) : ''}</Typography>
                  <Chip label={o.status || '—'} size="small" />
                </Box>
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
