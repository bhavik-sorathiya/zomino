import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import DeleteIcon from '@mui/icons-material/Delete'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { placeOrder } from '../api'

export default function Cart(){
  const { items, updateQuantity, removeFromCart, clearCart, totalCount, totalPrice } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const DELIVERY_CHARGE = 50

  async function handleCheckout(){
    // if empty
    if(items.length === 0){
      try { window.dispatchEvent(new CustomEvent('zomino:notify', { detail: { message: 'Cart is empty', severity: 'info' } })) } catch {}
      return
    }

    // Require authentication
    if (!user) {
      try { window.dispatchEvent(new CustomEvent('zomino:notify', { detail: { message: 'Please login to checkout', severity: 'warning' } })) } catch {}
      navigate('/login')
      return
    }

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
      try { window.dispatchEvent(new CustomEvent('zomino:notify', { detail: { message: `Order placed successfully (ID: ${resp.id || ''})`, severity: 'success' } })) } catch {}
      clearCart()
      navigate('/orders')
    } catch (e) {
      try { window.dispatchEvent(new CustomEvent('zomino:notify', { detail: { message: e.message || 'Failed to place order', severity: 'error' } })) } catch {}
    }
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Cart</Typography>

      {items.length === 0 ? (
        <Typography>Your cart is empty. Add items to start an order.</Typography>
      ) : (
        <>
          <List>
            {items.map((it) => (
              <div key={it.id}>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => removeFromCart(it.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={it.name}
                    secondary={`₹ ${parseFloat(it.price).toFixed(2)} x ${it.quantity} = ₹ ${(parseFloat(it.price) * it.quantity).toFixed(2)}`}
                  />
                </ListItem>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, ml: 2 }}>
                  <TextField
                    label="Quantity"
                    type="number"
                    size="small"
                    value={it.quantity}
                    inputProps={{ min: 1 }}
                    onChange={(e) => {
                      const v = parseInt(e.target.value || '1', 10)
                      updateQuantity(it.id, v >= 1 ? v : 1)
                    }}
                    sx={{ width: 100 }}
                  />
                </Box>
                <Divider />
              </div>
            ))}
          </List>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Box>
              <Typography variant="body2">Subtotal: ₹ {totalPrice.toFixed(2)}</Typography>
              <Typography variant="body2">Delivery: ₹ {DELIVERY_CHARGE.toFixed(2)}</Typography>
              <Typography variant="body2">Tax (5%): ₹ {(totalPrice * 0.05).toFixed(2)}</Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>Total: ₹ {(totalPrice + totalPrice*0.05 + DELIVERY_CHARGE).toFixed(2)}</Typography>
            </Box>
             <Box>
               <Button variant="outlined" color="inherit" sx={{ mr: 1 }} onClick={() => clearCart()}>Clear</Button>
               <Button variant="contained" onClick={handleCheckout}>Checkout</Button>
             </Box>
           </Box>
         </>
       )}
     </Box>
   )
 }
