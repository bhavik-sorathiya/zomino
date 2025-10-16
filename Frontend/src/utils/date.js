// tiny date helper to avoid adding an external dependency
export function formatDate(dateInput, options) {
  if (!dateInput) return ''
  const d = new Date(dateInput)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString(undefined, options || { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })
}

