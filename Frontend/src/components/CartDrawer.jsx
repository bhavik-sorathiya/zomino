import React from 'react'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { useDrawer } from '../context/DrawerContext'
import { useCart } from '../context/CartContext'
import useMediaQuery from '@mui/material/useMediaQuery'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteIcon from '@mui/icons-material/Delete'
import BoxMui from '@mui/material/Box'
import LazyImage from './LazyImage'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { placeOrder } from '../api'
import { getDemoImageUrl } from '../utils/demoImages'

export default function CartDrawer(){
  const { open, closeDrawer } = useDrawer()
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const isSmall = useMediaQuery('(max-width:600px)')
  const DELIVERY_CHARGE = 50

  async function handleCheckout(){
    if(items.length === 0){
      try { window.dispatchEvent(new CustomEvent('zomino:notify', { detail: { message: 'Cart is empty', severity: 'info' } })) } catch { }
      return
    }

    if (!user) {
      try { window.dispatchEvent(new CustomEvent('zomino:notify', { detail: { message: 'Please login to place an order', severity: 'warning' } })) } catch {}
      closeDrawer()
      navigate('/login')
      return
    }

    // Ensure items belong to same restaurant
    const restaurantId = items[0].restaurantId || items[0].restaurant || null
    if (!restaurantId) {
      try { window.dispatchEvent(new CustomEvent('zomino:notify', { detail: { message: 'Unable to determine restaurant for order', severity: 'error' } })) } catch {}
      return
    }

    const orderRequest = {
      userId: user.id,
      restaurantId,
      deliveryAddress: user.address || '',
      items: items.map((it) => ({ menuItemId: it.id, quantity: it.quantity || 1 }))
    }

    try {
      const resp = await placeOrder(orderRequest)
      // resp is OrderDTO on success
      try { window.dispatchEvent(new CustomEvent('zomino:notify', { detail: { message: `Order placed successfully (ID: ${resp.id || ''})`, severity: 'success' } })) } catch {}
      clearCart()
      closeDrawer()
      navigate('/orders')
    } catch (e) {
      try { window.dispatchEvent(new CustomEvent('zomino:notify', { detail: { message: e.message || 'Failed to place order', severity: 'error' } })) } catch {}
    }
  }

  const anchor = isSmall ? 'bottom' : 'right'
  const paperSx = isSmall ? { height: '92vh', borderTopLeftRadius: 12, borderTopRightRadius: 12 } : { width: 420 }

  return (
    <Drawer anchor={anchor} open={open} onClose={closeDrawer} PaperProps={{ sx: paperSx }}>
      <Box className="drawer-content" sx={{ width: isSmall ? '100%' : 420, p: 2, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }} role="presentation" aria-label="Cart drawer">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Your cart</Typography>
          <IconButton onClick={closeDrawer} aria-label="close cart">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ overflow: 'auto', flex: 1, pr: 1 }}>
          {items.length === 0 ? (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography sx={{ mb: 1 }}>Your cart is empty.</Typography>
              <Typography variant="body2" color="text.secondary">Add delicious items from the menu to get started.</Typography>
            </Box>
          ) : (
            <List>
              {items.map((it) => (
                <ListItem key={it.id} alignItems="flex-start" sx={{ gap: 1, py: 1 }}>
                  <Box sx={{ width: 90, height: 66, flexShrink: 0 }}>
                    <LazyImage
                      src={getDemoImageUrl({ title: it.name, name: it.name, dish: it.dish, type: it.type, width: 120, height: 80 })}
                      alt={it.name}
                      width={90}
                      height={66}
                    />
                  </Box>

                  <ListItemText
                    primary={<Typography sx={{ fontWeight: 700 }}>{it.name}</Typography>}
                    secondary={<Typography variant="caption" color="text.secondary">₹ {(parseFloat(it.price) || 0).toFixed(2)} each</Typography>}
                    sx={{ mr: 1 }}
                  />

                  <BoxMui sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                    <BoxMui sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => updateQuantity(it.id, Math.max(1, (it.quantity || 1) - 1))} aria-label={`Decrease quantity of ${it.name}`}>
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <TextField size="small" value={it.quantity} inputProps={{ min: 1, style: { textAlign: 'center', width: 48 } }} onChange={(e) => updateQuantity(it.id, Math.max(1, parseInt(e.target.value || '1', 10)))} aria-label={`Quantity for ${it.name}`} />
                      <IconButton size="small" onClick={() => updateQuantity(it.id, (it.quantity || 1) + 1)} aria-label={`Increase quantity of ${it.name}`}>
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </BoxMui>

                    <BoxMui sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">₹ {( (parseFloat(it.price) || 0) * (it.quantity || 1) ).toFixed(2)}</Typography>
                      <IconButton edge="end" color="error" onClick={() => removeFromCart(it.id)} aria-label={`Remove ${it.name} from cart`}>
                        <DeleteIcon />
                      </IconButton>
                    </BoxMui>
                  </BoxMui>
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1">Subtotal</Typography>
          <Typography variant="subtitle1">₹ {totalPrice.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">Delivery</Typography>
          <Typography variant="body2">₹ {DELIVERY_CHARGE.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">Tax</Typography>
          <Typography variant="body2">₹ {(totalPrice * 0.05).toFixed(2)}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          <Typography variant="h6">Total</Typography>
          <Typography variant="h6">₹ {(totalPrice + totalPrice*0.05 + DELIVERY_CHARGE).toFixed(2)}</Typography>
        </Box>

        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button variant="outlined" fullWidth onClick={() => { clearCart(); closeDrawer(); }}>Clear</Button>
          <Button variant="contained" fullWidth onClick={handleCheckout}>Checkout</Button>
        </Box>
      </Box>
    </Drawer>
  )
}
