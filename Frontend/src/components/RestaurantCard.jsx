import React, { useRef } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import Rating from '@mui/material/Rating'
import Chip from '@mui/material/Chip'
import StarIcon from '@mui/icons-material/Star'
import LazyImage from './LazyImage'
import { getDemoImageUrl } from '../utils/demoImages'

export default function RestaurantCard({ restaurant }) {
  const rating = Number(restaurant.rating) || Number((Math.random() * 1.5 + 3.5).toFixed(1))
  const isVeg = restaurant.menu && restaurant.menu.every((m) => (m.type || '').toLowerCase() === 'veg')
  const imgUrl = getDemoImageUrl({
    title: restaurant.name,
    name: restaurant.name,
    cuisines: restaurant.cuisines,
    width: 800,
    height: 400,
  })
  const navigate = useNavigate()
  const cardRef = useRef(null)

  const openDetail = () => navigate(`/restaurants/${restaurant.id}`)
  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openDetail()
    }
  }

  // 3D tilt handlers - lightweight and performant
  const handleMove = (e) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top
    const rx = ((y - rect.height / 2) / rect.height) * -8 // rotateX
    const ry = ((x - rect.width / 2) / rect.width) * 8 // rotateY
    // write directly to style for smooth updates
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.01)`
    el.style.transition = 'transform 120ms cubic-bezier(.22,.9,.32,1)'
  }

  const handleLeave = () => {
    const el = cardRef.current
    if (!el) return
    el.style.transform = 'none'
    el.style.transition = 'transform 360ms cubic-bezier(.22,.9,.32,1)'
  }

  return (
    <Card
      ref={cardRef}
      className="card-hover animate-fade-in card-tilt"
      sx={{ minWidth: 250, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', transformStyle: 'preserve-3d' }}
      tabIndex={0}
      role="link"
      aria-label={`Open ${restaurant.name} details`}
      onClick={openDetail}
      onKeyDown={onKeyDown}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onTouchMove={handleMove}
      onTouchEnd={handleLeave}
    >
      <Box sx={{ position: 'relative', height: 140, overflow: 'hidden' }}>
        <LazyImage src={imgUrl} alt={restaurant.name} height={140} />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.35))' }} />
        <Chip label={isVeg ? 'Veg' : 'Mixed'} size="small" color="secondary" sx={{ position: 'absolute', left: 12, top: 12 }} />
        <Box sx={{ position: 'absolute', right: 12, top: 12, display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(0,0,0,0.55)', color: '#fff', px: 1, py: 0.4, borderRadius: 1 }}>
          <StarIcon sx={{ fontSize: 14 }} />
          <Typography variant="caption" sx={{ color: '#fff', ml: 0.3 }}>{rating}</Typography>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.5 }}>
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700 }}>{restaurant.name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{restaurant.address}</Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'text.secondary' }} />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
          <Chip label={`${Math.floor(Math.random() * 20 + 15)} mins`} size="small" />
          <Chip label={`${Math.floor(Math.random() * 1500)} orders`} size="small" />
          {restaurant.cuisines && Array.isArray(restaurant.cuisines) && restaurant.cuisines.slice(0,3).map((c)=> (
            <Chip key={c} label={c} size="small" variant="outlined" />
          ))}
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2 }}>
        <Box sx={{ flexGrow: 1 }} />
        <Button size="small" component={RouterLink} to={`/restaurants/${restaurant.id}`} variant="contained" color="primary" sx={{ textTransform: 'none', fontWeight: 700 }}>View menu</Button>
      </CardActions>
    </Card>
  )
}
