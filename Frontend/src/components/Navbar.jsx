import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import Badge from '@mui/material/Badge'
import { useCart } from '../context/CartContext'
import { useDrawer } from '../context/DrawerContext'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import { useEffect, useState, useRef } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Tooltip from '@mui/material/Tooltip'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'

export default function Navbar({ themeMode = 'light', toggleTheme = () => {} }) {
  const { totalCount } = useCart()
  const { openDrawer } = useDrawer()
  const { user, logout } = useAuth()
  const [pulse, setPulse] = useState(false)
  const isSmall = useMediaQuery('(max-width:600px)')
  const [openSearch, setOpenSearch] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const timeoutRef = useRef(null)
  const navigate = useNavigate()

  const handleSearchKey = (e) => {
    if (e.key === 'Enter') {
      const q = e.target.value.trim()
      window.dispatchEvent(new CustomEvent('zomino:search', { detail: q }))
      if (isSmall) setOpenSearch(false)
    }
  }

  useEffect(() => {
    const onNotify = () => {
      setPulse(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        setPulse(false)
        timeoutRef.current = null
      }, 800)
    }
    window.addEventListener('zomino:notify', onNotify)
    return () => {
      window.removeEventListener('zomino:notify', onNotify)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Keyboard shortcut: focus search input using '/'
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/') {
        const el = document.querySelector('#zomino-search-input')
        if (el) el.focus()
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <AppBar position="fixed" sx={{ background: themeMode === 'dark' ? 'linear-gradient(90deg,#08121a,#06121a)' : 'linear-gradient(90deg,#ff6b35,#ff8a65)', color: '#fff' }}>
        <Toolbar sx={{ gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RestaurantMenuIcon sx={{ fontSize: 28 }} aria-hidden />
            {!isSmall && (
              <Typography variant="h6" component="div">
                <Link component={RouterLink} to="/" color="inherit" underline="none" aria-label="Go to home">
                  ZOMINO
                </Link>
              </Typography>
            )}
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            {!isSmall ? (
              <TextField
                id="zomino-search-input"
                placeholder="Search restaurants, dishes... (press / to focus)"
                size="small"
                variant="filled"
                onKeyDown={handleSearchKey}
                InputProps={{
                  startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>),
                  disableUnderline: true,
                  sx: (theme) => ({ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.9)', borderRadius: 2, color: theme.palette.text.primary })
                }}
                inputProps={{ 'aria-label': 'Search restaurants and dishes' }}
                fullWidth
              />
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <IconButton color="inherit" onClick={() => setOpenSearch(true)} aria-label="open search">
                  <SearchIcon />
                </IconButton>
              </Box>
            )}
          </Box>

          <Tooltip title={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            <IconButton color="inherit" onClick={toggleTheme} aria-label="Toggle theme" sx={{ ml: 1 }}>
              {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Auth buttons: show Login/Register when not logged in; show profile avatar + Logout when logged in */}
          {!user ? (
            <>
              <Button color="inherit" component={RouterLink} to="/login" sx={{ ml: 1 }}>Login</Button>
              <Button color="inherit" component={RouterLink} to="/register" sx={{ ml: 1 }}>Register</Button>
            </>
          ) : (
            <>
              {/* Replaced simple avatar + logout buttons with a dropdown menu */}
              <Tooltip title={user.name || user.email}>
                <IconButton
                  color="inherit"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  sx={{ ml: 1 }}
                  aria-controls={Boolean(anchorEl) ? 'user-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
                >
                  <Avatar sx={{ width: 32, height: 32 }}>{(user.name || user.email || 'U').charAt(0).toUpperCase()}</Avatar>
                </IconButton>
              </Tooltip>

              {/* Menu for avatar */}
              <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                onClick={() => setAnchorEl(null)}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
                <MenuItem onClick={() => navigate('/orders')}>Orders</MenuItem>
                <Divider />
                <MenuItem onClick={() => { logout(); navigate('/'); window.dispatchEvent(new CustomEvent('zomino:notify', { detail: { message: 'Logged out', severity: 'info' } })) }}>Logout</MenuItem>
              </Menu>
            </>
          )}

          <IconButton color="inherit" onClick={openDrawer} aria-label={`Open cart with ${totalCount} items`} sx={{ ml: 1 }}>
            <Badge badgeContent={totalCount} color="secondary" className={pulse ? 'badge-pulse' : ''}>
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Dialog open={openSearch} onClose={() => setOpenSearch(false)} fullWidth>
        <DialogTitle>Search</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            placeholder="Search restaurants, dishes..."
            size="small"
            variant="outlined"
            onKeyDown={handleSearchKey}
            inputProps={{ 'aria-label': 'Search restaurants and dishes' }}
            fullWidth
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
