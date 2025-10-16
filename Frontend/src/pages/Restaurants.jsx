import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import RestaurantCard from '../components/RestaurantCard'
import { getRestaurants } from '../api'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import Paper from '@mui/material/Paper'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import { useEffect as useEff } from 'react'

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [showRaw, setShowRaw] = useState(false)

  useEffect(() => {
    let mounted = true
    getRestaurants()
      .then((data) => {
        console.log('fetched restaurants count:', Array.isArray(data) ? data.length : 'non-array', data)
        if (mounted) {
          // ensure any prior search is cleared and full data is shown by default
          setRestaurants(data)
          setFiltered(data)
          setQuery('')
        }
      })
      .catch((e) => setError(e.message || 'Failed to load'))
      .finally(() => mounted && setLoading(false))
    return () => (mounted = false)
  }, [])

  useEffect(() => {
    // Global search event (from Navbar). We keep `query` as the raw typed value so the
    // input shows what the user typed; matching is done with a lowercased derived value.
    const onSearch = (e) => {
      const raw = String(e.detail || '')
      setQuery(raw)
      const q = raw.trim().toLowerCase()
      if (!q) {
        setFiltered(restaurants)
        return
      }
      setFiltered(
        restaurants.filter((r) => {
          return (
            (r.name && r.name.toLowerCase().includes(q)) ||
            (r.address && r.address.toLowerCase().includes(q))
          )
        }),
      )
    }

    window.addEventListener('zomino:search', onSearch)
    return () => window.removeEventListener('zomino:search', onSearch)
  }, [restaurants])

  useEffect(() => {
    console.log('Restaurants page: restaurants.length=', restaurants.length, 'filtered.length=', filtered.length, 'query=', query)
  }, [restaurants, filtered, query])

  const handleLocalSearch = (e) => {
    const raw = e.target.value
    setQuery(raw)
    const low = raw.trim().toLowerCase()
    if (!low) return setFiltered(restaurants)
    setFiltered(
      restaurants.filter((r) => (r.name && r.name.toLowerCase().includes(low)) || (r.address && r.address.toLowerCase().includes(low))),
    )
  }

  function resetFilters(){
    setQuery('')
    setFiltered(restaurants)
    // dispatch a global clear so other components (if any) reset
    if (typeof window !== 'undefined' && typeof CustomEvent === 'function') {
      window.dispatchEvent(new CustomEvent('zomino:search', { detail: '' }))
    }
  }

  // Scroll reveal effect: observe elements with .reveal and add .reveal-visible when in viewport
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const els = Array.from(document.querySelectorAll('.reveal'))
    const io = new IntersectionObserver((entries) => {
      entries.forEach((ent) => {
        if (ent.isIntersecting) {
          ent.target.classList.add('reveal-visible')
          io.unobserve(ent.target)
        }
      })
    }, { threshold: 0.12 })

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [filtered])

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

  // Small helper to render a decorative hero at the top of Restaurants
  const Hero = () => (
    <Box className="page-hero" sx={{ mb: 4, borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
      <Box className="hero-bg" />
      <Box className="hero-content" sx={{ py: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.02em' }}>Discover great food nearby</Typography>
        <Typography variant="subtitle1" sx={{ mt: 1, maxWidth: 720, mx: 'auto' }}>Handpicked local restaurants and trending dishes — find something delicious in seconds.</Typography>
      </Box>
    </Box>
  )

  return (
    <Box>
      <Hero />

      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Search restaurants or address"
          size="small"
          value={query}
          onChange={handleLocalSearch}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          fullWidth
        />
        <Button variant="outlined" onClick={resetFilters}>Reset</Button>
        <Button variant="text" onClick={() => setShowRaw((s) => !s)}>{showRaw ? 'Hide raw' : 'Show raw'}</Button>
      </Box>

      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Showing {filtered.length} restaurants
      </Typography>

      <Collapse in={showRaw}>
        <Paper sx={{ p: 2, mb: 2, whiteSpace: 'pre-wrap', maxHeight: 220, overflow: 'auto' }}>
          {JSON.stringify(restaurants, null, 2)}
        </Paper>
      </Collapse>

      {restaurants.length > 0 && filtered.length === 0 ? (
        <Stack sx={{ mb: 2 }} spacing={1}>
          <Alert severity="warning" action={<Button color="inherit" size="small" onClick={() => setFiltered(restaurants)}>Show all</Button>}>
            Restaurants were loaded ({restaurants.length}) but none match the current filter — click "Show all" to restore.
          </Alert>
        </Stack>
      ) : null}

      {filtered.length === 0 ? (
        <Typography sx={{ mt: 4 }}>No restaurants found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {filtered.map((r) => (
            <Grid item xs={12} sm={6} md={4} key={r.id}>
              <div className="reveal">
                <RestaurantCard restaurant={r} />
              </div>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}
