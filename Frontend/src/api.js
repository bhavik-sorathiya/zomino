// Small API helper that talks to the backend using relative paths (Vite dev proxy)

function normalizeRestaurantsPayload(data) {
  if (Array.isArray(data)) return data
  if (!data) return []
  // common wrappers
  if (data._embedded) {
    // HAL style: _embedded.restaurants or similar
    const keys = Object.keys(data._embedded)
    if (keys.length > 0) return data._embedded[keys[0]] || []
  }
  if (data.content && Array.isArray(data.content)) return data.content
  if (data.restaurants && Array.isArray(data.restaurants)) return data.restaurants
  if (data.data && Array.isArray(data.data)) return data.data
  // fallback: if it's an object with numeric keys
  const arr = Object.values(data).filter((v) => Array.isArray(v)).shift()
  if (Array.isArray(arr)) return arr
  return []
}

async function fetchJson(url, opts) {
  const res = await fetch(url, opts)
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`Request failed ${res.status}${txt ? `: ${txt}` : ''}`)
  }
  try {
    return await res.json()
  } catch {
    // If backend returns empty body or non-json, surface a helpful error
    throw new Error('Invalid JSON response')
  }
}

export async function getRestaurants(){
  const data = await fetchJson('/api/restaurants')
  const list = normalizeRestaurantsPayload(data)
  console.log('api.getRestaurants -> normalized count:', list.length)
  return list
}

export async function getMenu(restaurantId){
  // Backend may return an array or wrapper; normalize to array
  const data = await fetchJson(`/api/restaurants/${restaurantId}/menu`)
  if (Array.isArray(data)) return data
  if (data && data.menu && Array.isArray(data.menu)) return data.menu
  if (data && data.items && Array.isArray(data.items)) return data.items
  // fallback to extracting first array field
  const arr = Object.values(data || {}).filter((v) => Array.isArray(v)).shift()
  if (Array.isArray(arr)) return arr
  return []
}

// ------------------ Authentication API ------------------
// Expect backend AuthResponse: { message: string, user: { ... } }
export async function loginUser({ email, password }) {
  const data = await fetchJson('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  })
  return data
}

export async function registerUser(payload) {
  // payload should include: name, email, password, role?, phone?, address?
  const data = await fetchJson('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  })
  return data
}

// ------------------ Orders API ------------------
// getUserOrders expects a userId and returns an array of OrderDTOs
export async function getUserOrders(userId){
  if (!userId) return []
  const data = await fetchJson(`/api/orders/user/${userId}`, { credentials: 'include' })
  // backend returns JSON array of orders
  if (Array.isArray(data)) return data
  // if wrapped, try to return common array fields
  if (data && data.orders && Array.isArray(data.orders)) return data.orders
  if (data && data.data && Array.isArray(data.data)) return data.data
  return Array.isArray(data) ? data : []
}

// ------------------ Cart API ------------------
export async function getCart(userId){
  if (!userId) return []
  const data = await fetchJson(`/api/cart/user/${userId}`, { credentials: 'include' })
  return Array.isArray(data) ? data : (data && data.items) ? data.items : []
}

export async function addToCart({ userId, menuItemId, quantity = 1 }){
  const payload = { userId, menuItemId, quantity }
  const data = await fetchJson('/api/cart/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  })
  return data
}

export async function removeFromCart(cartItemId, userId){
  if (!cartItemId || !userId) throw new Error('cartItemId and userId required')
  const data = await fetchJson(`/api/cart/${cartItemId}?userId=${userId}`, {
    method: 'DELETE',
    credentials: 'include'
  })
  return data
}

export async function updateCartItem(cartItemId, { userId, quantity }){
  if (!cartItemId || !userId) throw new Error('cartItemId and userId required')
  const payload = { userId, menuItemId: null, quantity }
  const data = await fetchJson(`/api/cart/${cartItemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  })
  return data
}

export async function clearCart(userId){
  if (!userId) throw new Error('userId required')
  const data = await fetchJson(`/api/cart/clear/${userId}`, {
    method: 'DELETE',
    credentials: 'include'
  })
  return data
}

export async function getCartTotal(userId){
  if (!userId) return { total: 0 }
  const data = await fetchJson(`/api/cart/${userId}/total`, { credentials: 'include' })
  return data
}

// ------------------ Orders API ------------------
export async function placeOrder(orderRequest){
  // orderRequest should include: userId, restaurantId, deliveryAddress?, items: [{ menuItemId, quantity }]
  const data = await fetchJson('/api/orders/place', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(orderRequest)
  })
  return data
}
