import { createId } from '../utils/id.js'

const currentDate = new Date()
const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`
const previousMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 12)

const createDate = (offsetDays) => {
  const date = new Date(currentDate)
  date.setDate(currentDate.getDate() + offsetDays)
  return date.toISOString().slice(0, 10)
}

const createPreviousDate = (offsetDays) => {
  const date = new Date(previousMonthDate)
  date.setDate(previousMonthDate.getDate() + offsetDays)
  return date.toISOString().slice(0, 10)
}

export const initialTransactions = [
  { id: createId(), title: 'Salary', amount: 2400, type: 'income', category: 'Salary', date: createDate(-3), description: 'Monthly salary deposit', createdAt: new Date().toISOString() },
  { id: createId(), title: 'Freelance Project', amount: 650, type: 'income', category: 'Freelance', date: createDate(-10), description: 'Design sprint invoice', createdAt: new Date().toISOString() },
  { id: createId(), title: 'Refund', amount: 75, type: 'income', category: 'Refund', date: createDate(-15), description: 'Returned purchase', createdAt: new Date().toISOString() },
  { id: createId(), title: 'Rent', amount: 1450, type: 'expense', category: 'Housing', date: createDate(-1), description: 'Apartment rent payment', createdAt: new Date().toISOString() },
  { id: createId(), title: 'Costco', amount: 185.42, type: 'expense', category: 'Groceries', date: createDate(-2), description: 'Weekly grocery shopping', createdAt: new Date().toISOString() },
  { id: createId(), title: 'Walmart', amount: 82.19, type: 'expense', category: 'Groceries', date: createDate(-5), description: 'Household essentials', createdAt: new Date().toISOString() },
  { id: createId(), title: 'Shell Gas', amount: 54.8, type: 'expense', category: 'Transportation', date: createDate(-6), description: 'Fuel refill', createdAt: new Date().toISOString() },
  { id: createId(), title: 'Internet', amount: 69.99, type: 'expense', category: 'Bills', date: createDate(-8), description: 'Internet service', createdAt: new Date().toISOString() },
  { id: createId(), title: 'Phone', amount: 91.25, type: 'expense', category: 'Bills', date: createDate(-9), description: 'Mobile bill', createdAt: new Date().toISOString() },
  { id: createId(), title: 'Netflix', amount: 22.99, type: 'expense', category: 'Subscriptions', date: createDate(-11), description: 'Streaming subscription', createdAt: new Date().toISOString() },
  { id: createId(), title: 'Spotify', amount: 11.99, type: 'expense', category: 'Subscriptions', date: createDate(-12), description: 'Music plan', createdAt: new Date().toISOString() },
  { id: createId(), title: 'Amazon', amount: 64.35, type: 'expense', category: 'Shopping', date: createDate(-13), description: 'Routine shopping', createdAt: new Date().toISOString() },
  { id: createId(), title: 'Restaurant', amount: 78.6, type: 'expense', category: 'Restaurants', date: createDate(-14), description: 'Dinner out', createdAt: new Date().toISOString() },
  { id: createId(), title: 'Gym', amount: 39.99, type: 'expense', category: 'Entertainment', date: createDate(-16), description: 'Fitness membership', createdAt: new Date().toISOString() },
  { id: createId(), title: 'Car Insurance', amount: 176.45, type: 'expense', category: 'Transportation', date: createDate(-19), description: 'Monthly insurance', createdAt: new Date().toISOString() },
  { id: createId(), title: 'Daycare', amount: 420, type: 'expense', category: 'Childcare', date: createDate(-20), description: 'Childcare services', createdAt: new Date().toISOString() },
  { id: createId(), title: 'Coffee', amount: 8.75, type: 'expense', category: 'Restaurants', date: createDate(-21), description: 'Morning coffee', createdAt: new Date().toISOString() },
  { id: createId(), title: 'Business Consulting', amount: 320, type: 'income', category: 'Business', date: createPreviousDate(2), description: 'Client retainer', createdAt: new Date().toISOString() },
  { id: createId(), title: 'Utilities', amount: 128.5, type: 'expense', category: 'Bills', date: createPreviousDate(5), description: 'Electricity bill', createdAt: new Date().toISOString() },
  { id: createId(), title: 'Groceries', amount: 96.1, type: 'expense', category: 'Groceries', date: createPreviousDate(8), description: 'Weekend groceries', createdAt: new Date().toISOString() },
  { id: createId(), title: 'Taxi', amount: 41.2, type: 'expense', category: 'Transportation', date: createPreviousDate(10), description: 'City rides', createdAt: new Date().toISOString() },
  { id: createId(), title: 'Streaming Bundle', amount: 35.5, type: 'expense', category: 'Subscriptions', date: createPreviousDate(12), description: 'Previous month bundle', createdAt: new Date().toISOString() },
  { id: createId(), title: 'Online Course', amount: 89, type: 'expense', category: 'Education', date: createPreviousDate(14), description: 'Learning subscription', createdAt: new Date().toISOString() },
]

export const initialBudgets = [
  { id: createId(), category: 'Groceries', limit: 600, month: currentMonth },
  { id: createId(), category: 'Restaurants', limit: 250, month: currentMonth },
  { id: createId(), category: 'Transportation', limit: 350, month: currentMonth },
  { id: createId(), category: 'Shopping', limit: 300, month: currentMonth },
  { id: createId(), category: 'Entertainment', limit: 150, month: currentMonth },
  { id: createId(), category: 'Subscriptions', limit: 100, month: currentMonth },
]

export const initialGoals = [
  { id: createId(), name: 'Emergency Fund', targetAmount: 10000, savedAmount: 4600, deadline: '2026-12-31', createdAt: new Date().toISOString() },
  { id: createId(), name: 'Vacation', targetAmount: 3000, savedAmount: 1850, deadline: '2026-08-20', createdAt: new Date().toISOString() },
  { id: createId(), name: 'New Laptop', targetAmount: 1800, savedAmount: 700, deadline: '2026-09-15', createdAt: new Date().toISOString() },
]

export const initialSettings = {
  name: 'Danylo',
  currency: 'USD',
  theme: 'light',
}
