import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { getRestaurants, getMenu } from '../api'
import { useCart } from '../context/CartContext'
import { useDrawer } from '../context/DrawerContext'
import MenuItemCard from '../components/MenuItemCard'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import StarIcon from '@mui/icons-material/Star'
import LazyImage from '../components/LazyImage'
import { getDemoImageUrl } from '../utils/demoImages'

export default function RestaurantDetail() {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addToCart } = useCart()
  const { openDrawer } = useDrawer()

  useEffect(() => {
    let mounted = true
    Promise.all([getRestaurants(), getMenu(id)])
      .then(([restaurants, menuData]) => {
        if (!mounted) return
        const r = restaurants.find((x) => String(x.id) === String(id))
        setRestaurant(r || null)
        setMenu(menuData || [])
      })
      .catch((e) => setError(e.message || 'Failed to load'))
      .finally(() => mounted && setLoading(false))
    return () => (mounted = false)
  }, [id])

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )

  if (error)
    return (
      <Typography color="error" sx={{ mt: 4 }}>
        {error}
      </Typography>
    )

  if (!restaurant)
    return (
      <Typography sx={{ mt: 4 }}>
        Restaurant not found
      </Typography>
    )

  const handleAdd = (item) => {
    // include restaurant id in cart item and preserve quantity if provided
    const payload = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      restaurantId: restaurant.id
    }
    addToCart(payload)
    // open the cart drawer for immediate feedback
    openDrawer()
    // dispatch a notification event for the Notifier component
    try {
      if (typeof window !== 'undefined' && typeof CustomEvent === 'function') {
        window.dispatchEvent(new CustomEvent('zomino:notify', { detail: { message: `Added ${payload.quantity} x ${payload.name} to cart`, severity: 'success', openCart: true } }))
      }
    } catch {
      // ignore
    }
  }

  const imgUrl = getDemoImageUrl({
    title: restaurant.name,
    name: restaurant.name,
    cuisines: restaurant.cuisines,
    width: 1200,
    height: 500,
  })
  const rating = Number(restaurant.rating) || Number((Math.random() * 1.5 + 3.7).toFixed(1))

  return (
    <Box component="main" aria-labelledby="restaurant-title">
      <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', mb: 2 }}>
        <LazyImage src={imgUrl} alt={restaurant.name} height={260} />
        <Box sx={{ position: 'absolute', left: 20, bottom: 20, color: '#fff' }}>
          <Typography id="restaurant-title" variant="h4" sx={{ fontWeight: 800, textShadow: '0 6px 18px rgba(0,0,0,0.5)' }}>{restaurant.name}</Typography>
          <Typography variant="body1" sx={{ mt: 0.5, textShadow: '0 6px 18px rgba(0,0,0,0.35)' }}>{restaurant.address}</Typography>
          <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
            <StarIcon sx={{ color: '#ffd54f' }} aria-hidden />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{rating}</Typography>
            {restaurant.cuisines && restaurant.cuisines.slice(0,3).map((c) => <Chip key={c} label={c} size="small" sx={{ ml: 1, bgcolor: 'rgba(255,255,255,0.85)' }} />)}
          </Box>
        </Box>
      </Box>

      <Typography variant="h6" sx={{ mb: 1 }}>Menu</Typography>

      {menu.length === 0 ? (
        <Typography color="text.secondary">No items available.</Typography>
      ) : (
        <Grid container spacing={2} role="list">
          {menu.map((item) => (
            <Grid item xs={12} md={6} key={item.id} role="listitem">
              <MenuItemCard item={item} onAdd={handleAdd} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}
