import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext'
import { DrawerProvider } from './context/DrawerContext'
import { AuthProvider } from './context/AuthContext' // NEW

// Suppress repetitive React Router future-flag warnings during development only.
// These warnings come from react-router internals about v7 future flags and can be
// noisy; this filter ignores just those specific messages while leaving other warnings intact.
if (import.meta.env && import.meta.env.DEV) {
  const _origWarn = console.warn.bind(console)
  console.warn = (...args) => {
    try {
      const first = args[0]
      const text = typeof first === 'string' ? first : (first && first.message) ? String(first.message) : ''
      if (text && (
        text.includes('React Router Future Flag Warning') ||
        text.includes('v7_startTransition') ||
        text.includes('v7_relativeSplatPath') ||
        text.includes('React Router will begin wrapping state updates')
      )) {
        // swallow these known router future-flag warnings in development
        return
      }
    } catch (e) {
      // ignore filter errors and fallthrough to original
    }
    _origWarn(...args)
  }
}

console.log('Zomino frontend starting...')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <DrawerProvider>
          <App />
        </DrawerProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
