import { format, isSameMonth, parseISO, startOfMonth, endOfMonth } from 'date-fns'

export function formatDate(value, pattern = 'MMM d, yyyy') {
  if (!value) return ''

  const date = typeof value === 'string' ? parseISO(value) : value

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return format(date, pattern)
}

export function isCurrentMonth(value) {
  const date = typeof value === 'string' ? parseISO(value) : value

  if (Number.isNaN(date.getTime())) {
    return false
  }

  return isSameMonth(date, new Date())
}

export function getMonthKey(date = new Date()) {
  return format(date, 'yyyy-MM')
}

export function getCurrentMonthRange() {
  const now = new Date()
  return { start: startOfMonth(now), end: endOfMonth(now) }
}
