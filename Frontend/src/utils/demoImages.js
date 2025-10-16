const CATEGORY_RULES = [
  { pattern: /\b(pizza|pizzeria)\b/, query: 'pizza' },
  { pattern: /\b(burger|cheeseburger|hamburger)\b/, query: 'burger' },
  { pattern: /\b(biryani|pulao|pilaf)\b/, query: 'biryani' },
  { pattern: /\b(dosa|idli|sambar|uttapam)\b/, query: 'south indian food' },
  { pattern: /\b(noodle|ramen|pho|udon|chow mein)\b/, query: 'noodle bowl' },
  { pattern: /\b(pasta|spaghetti|macaroni|lasagna)\b/, query: 'pasta' },
  { pattern: /\b(sushi|sashimi|tempura)\b/, query: 'sushi' },
  { pattern: /\b(taco|burrito|quesadilla|nacho)\b/, query: 'mexican food' },
  { pattern: /\b(cake|dessert|pastry|brownie|ice cream|gelato)\b/, query: 'dessert' },
  { pattern: /\b(salad|caesar|greens)\b/, query: 'healthy salad' },
  { pattern: /\b(sandwich|sub|toast|wrap)\b/, query: 'sandwich' },
  { pattern: /\b(coffee|latte|cappuccino|tea|mocha)\b/, query: 'coffee' },
  { pattern: /\b(chicken|grill|bbq|kebab|tikka)\b/, query: 'grilled chicken' },
  { pattern: /\b(seafood|fish|prawn|shrimp)\b/, query: 'seafood' },
  { pattern: /\b(thali|meal|combo|platter)\b/, query: 'indian thali' },
]

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function buildSearchText(parts) {
  return parts
    .map(normalizeText)
    .filter(Boolean)
    .join(' ')
}

function pickCategory(searchText) {
  const matchedRule = CATEGORY_RULES.find((rule) => rule.pattern.test(searchText))
  return matchedRule ? matchedRule.query : ''
}

export function getDemoImageUrl({ title, name, dish, type, cuisines = [], width = 800, height = 400 } = {}) {
  const searchText = buildSearchText([
    title,
    name,
    dish,
    type,
    Array.isArray(cuisines) ? cuisines.join(' ') : cuisines,
  ])
  const query = pickCategory(searchText) || (searchText ? `${searchText} food` : 'food plating')
  const safeWidth = Number(width) || 800
  const safeHeight = Number(height) || 400
  return `https://source.unsplash.com/featured/${safeWidth}x${safeHeight}/?${encodeURIComponent(query)}`
}