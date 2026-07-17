export function formatCurrency(value, currency = 'USD') {
  const amount = Number(value) || 0

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatPercentage(value) {
  return `${Math.round(Number(value) || 0)}%`
}
