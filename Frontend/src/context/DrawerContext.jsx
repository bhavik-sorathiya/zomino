/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react'

const DrawerContext = createContext(null)

export function DrawerProvider({ children }) {
  const [open, setOpen] = useState(false)
  const openDrawer = () => setOpen(true)
  const closeDrawer = () => setOpen(false)

  useEffect(() => {
    const handler = () => {
      setOpen(true)
    }
    const handlerClose = () => setOpen(false)
    window.addEventListener('zomino:openCart', handler)
    window.addEventListener('zomino:closeCart', handlerClose)
    return () => {
      window.removeEventListener('zomino:openCart', handler)
      window.removeEventListener('zomino:closeCart', handlerClose)
    }
  }, [])

  return (
    <DrawerContext.Provider value={{ open, openDrawer, closeDrawer }}>
      {children}
    </DrawerContext.Provider>
  )
}

export function useDrawer() {
  const ctx = useContext(DrawerContext)
  if (!ctx) throw new Error('useDrawer must be used within DrawerProvider')
  return ctx
}
