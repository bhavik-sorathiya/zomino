/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import * as api from '../api'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('zomino_cart')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  // Persist local view always
  useEffect(() => {
    try {
      localStorage.setItem('zomino_cart', JSON.stringify(items))
    } catch {
      // ignore
    }
  }, [items])

  // When user logs in, push local items to server then load server cart
  useEffect(() => {
    let mounted = true
    async function sync() {
      if (!user) return
      try {
        // If there are local items, push them to server
        const local = JSON.parse(localStorage.getItem('zomino_cart') || '[]')
        if (Array.isArray(local) && local.length > 0) {
          for (const p of local) {
            const menuItemId = p.id
            const qty = p.quantity || 1
            try {
              await api.addToCart({ userId: user.id, menuItemId, quantity: qty })
            } catch (e) {
              // ignore individual failures
            }
          }
        }
        // Now fetch server cart
        const serverCart = await api.getCart(user.id)
        if (!mounted) return
        // serverCart is array of CartItemDTOs (or items)
        const mapped = (serverCart || []).map((ci) => ({
          id: ci.menuItemId || ci.menuItemID || ci.menu_item_id || ci.menu_item || ci.id,
          cartItemId: ci.id,
          name: ci.menuItemName || ci.menuItemName || ci.menuItem || '',
          price: ci.price,
          quantity: ci.quantity || 1,
          restaurantId: ci.restaurantId || ci.restaurant_id || null
        }))
        setItems(mapped)
      } catch (e) {
        // fallback: keep local items
        console.warn('Failed to sync cart with server', e.message || e)
      }
    }
    sync()
    return () => (mounted = false)
  }, [user])

  async function addToCart(product) {
    // product: { id, name, price, quantity, restaurantId }
    if (user && user.id) {
      try {
        const res = await api.addToCart({ userId: user.id, menuItemId: product.id, quantity: product.quantity || 1 })
        // res is CartItemDTO
        const newItem = {
          id: res.menuItemId || product.id,
          cartItemId: res.id,
          name: res.menuItemName || product.name,
          price: res.price || product.price,
          quantity: res.quantity || product.quantity || 1,
          restaurantId: res.restaurantId || product.restaurantId || null
        }
        setItems((prev) => {
          const idx = prev.findIndex((p) => p.id === newItem.id)
          if (idx >= 0) {
            const copy = [...prev]
            copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + newItem.quantity }
            return copy
          }
          return [...prev, newItem]
        })
        return
      } catch (e) {
        // fall through to local behavior
        console.warn('addToCart (server) failed, falling back to local:', e.message || e)
      }
    }
    // local fallback
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id)
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + (product.quantity || 1) }
        return copy
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }]
    })
  }

  async function removeFromCart(productId) {
    if (user && user.id) {
      try {
        // find cartItemId for given menuItemId
        const item = items.find((p) => String(p.id) === String(productId))
        if (item && item.cartItemId) {
          await api.removeFromCart(item.cartItemId, user.id)
        }
      } catch (e) {
        console.warn('removeFromCart (server) failed:', e.message || e)
      }
    }
    setItems((prev) => prev.filter((p) => p.id !== productId))
  }

  async function updateQuantity(productId, quantity) {
    if (user && user.id) {
      try {
        const item = items.find((p) => String(p.id) === String(productId))
        if (item && item.cartItemId) {
          await api.updateCartItem(item.cartItemId, { userId: user.id, quantity })
        }
      } catch (e) {
        console.warn('updateQuantity (server) failed:', e.message || e)
      }
    }
    setItems((prev) => prev.map((p) => (p.id === productId ? { ...p, quantity } : p)))
  }

  async function clearCart() {
    if (user && user.id) {
      try {
        await api.clearCart(user.id)
      } catch (e) {
        console.warn('clearCart (server) failed:', e.message || e)
      }
    }
    setItems([])
  }

  const totalCount = items.reduce((s, it) => s + (it.quantity || 0), 0)
  const totalPrice = items.reduce((s, it) => s + (parseFloat(it.price) || 0) * (it.quantity || 0), 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
