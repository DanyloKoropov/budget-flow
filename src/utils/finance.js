import { isSameMonth, parseISO } from 'date-fns'
import { getMonthKey } from './dates.js'

export function calculateTotalIncome(transactions) {
  return transactions.reduce((total, transaction) => {
    return transaction.type === 'income' ? total + Number(transaction.amount) : total
  }, 0)
}

export function calculateTotalExpenses(transactions) {
  return transactions.reduce((total, transaction) => {
    return transaction.type === 'expense' ? total + Number(transaction.amount) : total
  }, 0)
}

export function calculateBalance(transactions) {
  return calculateTotalIncome(transactions) - calculateTotalExpenses(transactions)
}

export function calculateMonthlyIncome(transactions, date = new Date()) {
  const monthKey = getMonthKey(date)

  return transactions.reduce((total, transaction) => {
    const transactionDate = typeof transaction.date === 'string' ? parseISO(transaction.date) : transaction.date
    if (transaction.type === 'income' && transactionDate && getMonthKey(transactionDate) === monthKey) {
      total += Number(transaction.amount)
    }
    return total
  }, 0)
}

export function calculateMonthlyExpenses(transactions, date = new Date()) {
  const monthKey = getMonthKey(date)

  return transactions.reduce((total, transaction) => {
    const transactionDate = typeof transaction.date === 'string' ? parseISO(transaction.date) : transaction.date
    if (transaction.type === 'expense' && transactionDate && getMonthKey(transactionDate) === monthKey) {
      total += Number(transaction.amount)
    }
    return total
  }, 0)
}

export function calculateRemainingBudget(budgets, transactions, date = new Date()) {
  const monthKey = getMonthKey(date)
  const budgetedExpenses = budgets.reduce((total, budget) => {
    if (budget.month !== monthKey) return total
    return total + Number(budget.limit)
  }, 0)

  const spent = transactions.reduce((total, transaction) => {
    const transactionDate = typeof transaction.date === 'string' ? parseISO(transaction.date) : transaction.date
    const isCurrentMonth = transactionDate && getMonthKey(transactionDate) === monthKey
    const matchingBudget = budgets.find((budget) => budget.month === monthKey && budget.category === transaction.category)

    if (transaction.type === 'expense' && isCurrentMonth && matchingBudget) {
      total += Number(transaction.amount)
    }

    return total
  }, 0)

  return budgetedExpenses - spent
}

export function groupExpensesByCategory(transactions, date = new Date()) {
  const monthKey = getMonthKey(date)
  const grouped = transactions.reduce((accumulator, transaction) => {
    if (transaction.type !== 'expense') return accumulator

    const transactionDate = typeof transaction.date === 'string' ? parseISO(transaction.date) : transaction.date
    if (!transactionDate || getMonthKey(transactionDate) !== monthKey) return accumulator

    const existing = accumulator.find((item) => item.name === transaction.category)
    if (existing) {
      existing.value += Number(transaction.amount)
    } else {
      accumulator.push({ name: transaction.category, value: Number(transaction.amount) })
    }

    return accumulator
  }, [])

  return grouped.sort((first, second) => second.value - first.value)
}

export function calculateBudgetSpent(budget, transactions, date = new Date()) {
  const monthKey = getMonthKey(date)

  if (budget.month !== monthKey) return 0

  return transactions.reduce((total, transaction) => {
    const transactionDate = typeof transaction.date === 'string' ? parseISO(transaction.date) : transaction.date
    const isCurrentMonth = transactionDate && getMonthKey(transactionDate) === monthKey

    if (transaction.type === 'expense' && isCurrentMonth && transaction.category === budget.category) {
      total += Number(transaction.amount)
    }

    return total
  }, 0)
}

export function calculateBudgetPercentage(budget, transactions, date = new Date()) {
  const spent = calculateBudgetSpent(budget, transactions, date)
  const limit = Number(budget.limit) || 0

  if (limit <= 0) return 0

  return (spent / limit) * 100
}

export function calculateGoalPercentage(goal) {
  const target = Number(goal.targetAmount) || 0
  if (target <= 0) return 0

  return (Number(goal.savedAmount) / target) * 100
}

export function filterTransactions(transactions, filters) {
  const { search = '', type = 'all', category = 'all', date = 'all' } = filters
  const normalizedSearch = search.toLowerCase()
  const today = new Date()

  return transactions.filter((transaction) => {
    const matchesType = type === 'all' || transaction.type === type
    const matchesCategory = category === 'all' || transaction.category === category
    const matchesSearch =
      transaction.title.toLowerCase().includes(normalizedSearch) ||
      transaction.description.toLowerCase().includes(normalizedSearch) ||
      transaction.category.toLowerCase().includes(normalizedSearch)

    let matchesDate = true
    if (date === 'this-month') {
      matchesDate = isSameMonth(parseISO(transaction.date), today)
    } else if (date === 'last-month') {
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      matchesDate = isSameMonth(parseISO(transaction.date), lastMonth)
    } else if (date === 'this-year') {
      const year = today.getFullYear()
      const transactionDate = parseISO(transaction.date)
      matchesDate = transactionDate.getFullYear() === year
    }

    return matchesType && matchesCategory && matchesSearch && matchesDate
  })
}

export function sortTransactions(transactions, sortKey) {
  const list = [...transactions]

  switch (sortKey) {
    case 'oldest':
      return list.sort((first, second) => new Date(first.date) - new Date(second.date))
    case 'highest':
      return list.sort((first, second) => Number(second.amount) - Number(first.amount))
    case 'lowest':
      return list.sort((first, second) => Number(first.amount) - Number(second.amount))
    case 'name-az':
      return list.sort((first, second) => first.title.localeCompare(second.title))
    case 'name-za':
      return list.sort((first, second) => second.title.localeCompare(first.title))
    case 'newest':
    default:
      return list.sort((first, second) => new Date(second.date) - new Date(first.date))
  }
}
