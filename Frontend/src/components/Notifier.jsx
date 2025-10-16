import React, { useState, useEffect } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

export default function Notifier(){
  const [open, setOpen] = useState(false)
  const [msg, setMsg] = useState('')
  const [severity, setSeverity] = useState('info')

  useEffect(() => {
    const handler = (e) => {
      const d = e.detail || {}
      setMsg(d.message || String(d || ''))
      setSeverity(d.severity || 'success')
      setOpen(true)
      // if the payload requests opening the cart, dispatch a dedicated event
      if (d.openCart) {
        try { window.dispatchEvent(new CustomEvent('zomino:openCart')) } catch { /* ignore */ }
      }
    }
    window.addEventListener('zomino:notify', handler)
    return () => window.removeEventListener('zomino:notify', handler)
  }, [])

  return (
    <Snackbar open={open} autoHideDuration={2500} onClose={() => setOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert onClose={() => setOpen(false)} severity={severity} sx={{ width: '100%' }}>
        {msg}
      </Alert>
    </Snackbar>
  )
}
