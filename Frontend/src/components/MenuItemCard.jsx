import React, { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import LazyImage from './LazyImage'
import { getDemoImageUrl } from '../utils/demoImages'

export default function MenuItemCard({ item, onAdd }) {
  const [qty, setQty] = useState(1)

  const handleAdd = () => {
    const payload = { ...item, quantity: Number(qty) || 1 }
    if (onAdd) onAdd(payload)
    // Dispatch a global notification for user feedback
    try {
      if (typeof window !== 'undefined' && typeof CustomEvent === 'function') {
        window.dispatchEvent(new CustomEvent('zomino:notify', { detail: { message: `Added ${payload.quantity} x ${payload.name} to cart` } }))
      }
    } catch {
      // ignore in non-browser environments
    }
  }

  const img = getDemoImageUrl({
    title: item.name,
    name: item.name,
    dish: item.dish,
    type: item.type,
    width: 160,
    height: 100,
  })
  const price = Number(item.price) || 0

  return (
    <Card sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center', p: 1 }}>
      <Box sx={{ width: 120, height: 80, flexShrink: 0 }}>
        <LazyImage src={img} alt={item.name} width={120} height={80} />
      </Box>
      <Box sx={{ flex: 1 }}>
        <CardContent sx={{ p: 0 }}>
          <Typography variant="subtitle1">{item.name}</Typography>
          <Typography variant="body2" color="text.secondary">{item.type}</Typography>
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">₹ {price.toFixed(2)}</Typography>
            <TextField
              label="Qty"
              type="number"
              size="small"
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || '1', 10)))}
              inputProps={{ min: 1 }}
              sx={{ width: 90 }}
            />
          </Box>
        </CardContent>
      </Box>
      <CardActions sx={{ pr: 1 }}>
        <Button size="small" variant="contained" onClick={handleAdd} aria-label={`Add ${item.name} to cart`}>Add</Button>
      </CardActions>
    </Card>
  )
}
