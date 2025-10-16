import { Suspense, lazy, useMemo, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Navbar from './components/Navbar'
import { AuthProvider } from './context/AuthContext'
// Lazy route imports
const Restaurants = lazy(() => import('./pages/Restaurants'))
const RestaurantDetail = lazy(() => import('./pages/RestaurantDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Profile = lazy(() => import('./pages/Profile'))
const Orders = lazy(() => import('./pages/Orders'))
import './App.css'
import ErrorBoundary from './components/ErrorBoundary'
import CartDrawer from './components/CartDrawer'
import Notifier from './components/Notifier'
import RequireAuth from './components/RequireAuth'

// Theme imports
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress'
import BoxMui from '@mui/material/Box'

function createAppTheme(mode) {
  const isDark = mode === 'dark'
  return createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
          // slightly warmer, slightly higher contrast on dark
        main: isDark ? '#ff7043' : '#ff6b35',
        contrastText: '#fff'
      },
      secondary: {
        main: isDark ? '#ffab91' : '#ff8a65',
      },
      background: {
        default: isDark ? '#0b1220' : '#fff7f2',
        paper: isDark ? '#0e1722' : '#ffffff'
      },
      text: {
        primary: isDark ? '#e6eef8' : '#263238',
        secondary: isDark ? 'rgba(230,238,248,0.82)' : '#546e7a'
      }
    },
    typography: {
      fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
      h4: { fontWeight: 800 }
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backdropFilter: 'saturate(120%) blur(6px)'
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            background: isDark ? 'linear-gradient(180deg,#07121b,#081525)' : '#fff',
            color: isDark ? '#e6eef8' : undefined,
            boxShadow: isDark ? '0 10px 36px rgba(2,6,23,0.6)' : '0 6px 20px rgba(0,0,0,0.08)'
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            background: isDark ? '#071826' : undefined,
            color: isDark ? '#e6eef8' : undefined,
            borderRadius: 14,
            transition: 'transform 260ms cubic-bezier(.22,.9,.32,1), box-shadow 260ms cubic-bezier(.22,.9,.32,1)'
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            transition: 'transform 160ms cubic-bezier(.2,.9,.3,1), box-shadow 160ms cubic-bezier(.2,.9,.3,1)'
          },
          containedPrimary: {
            background: isDark ? 'linear-gradient(90deg,#ff8a65,#ff7043)' : 'linear-gradient(90deg,#ff6b35,#ff8a65)',
            boxShadow: isDark ? '0 10px 30px rgba(255,112,67,0.12)' : '0 8px 24px rgba(255,107,53,0.12)',
            '&:hover': {
              transform: 'translateY(-2px)'
            }
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 700
          },
          colorSecondary: {
            backgroundColor: isDark ? 'rgba(255,138,101,0.12)' : undefined
          }
        }
      }
    }
  })
}

function App() {
  const [mode, setMode] = useState(() => {
    try {
      const saved = localStorage.getItem('zomino_theme')
      if (saved === 'light' || saved === 'dark') return saved
    } catch { /* ignore: localStorage not available */ }
    // default to light theme
    return 'light'
  })

  useEffect(() => {
    try { localStorage.setItem('zomino_theme', mode) } catch { /* ignore: localStorage write failed */ }
  }, [mode])

  // Apply a data-theme attribute on the root element so css dark helpers in index.css work properly
  useEffect(() => {
    try {
      const docEl = document.documentElement
      // Always set the data-theme to the current mode so styles depending
      // on [data-theme="dark"] toggle reliably when switching back to light.
      // Setting explicit 'light' is safe because our CSS checks for dark only.
      docEl.setAttribute('data-theme', mode)
    } catch {
      // ignore server or non-browser
    }
  }, [mode])

  const theme = useMemo(() => createAppTheme(mode), [mode])
  const toggleTheme = () => setMode((m) => (m === 'light' ? 'dark' : 'light'))

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
         <Navbar themeMode={mode} toggleTheme={toggleTheme} />

        {/* Page container controls the background so dark theme can fully change page surface */}
        <Box
          sx={{
            minHeight: '100vh',
            transition: 'background 420ms ease, color 300ms ease',
            background: (theme) => theme.palette.mode === 'dark'
              ? 'linear-gradient(180deg, #071019 0%, #081526 50%, #0b1220 100%)'
              : 'linear-gradient(180deg, #fff7f2 0%, #fff2ea 50%, #fff7f2 100%)',
            color: (theme) => theme.palette.text.primary,
            pb: 6
          }}
        >
          <Box sx={{ mt: 10 }}>
            <Container maxWidth="md">
              <ErrorBoundary>
                <Suspense fallback={<BoxMui sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></BoxMui>}>
                  <Routes>
                    <Route path="/" element={<Restaurants />} />
                    <Route path="/restaurants/:id" element={<RestaurantDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
                    <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </Container>
          </Box>
        </Box>

        <CartDrawer />
        <Notifier />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
