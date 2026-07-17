import { useContext } from 'react'
import { TransactionsContext } from '../context/TransactionsContext.jsx'

export function useTransactions() {
  const context = useContext(TransactionsContext)
  if (!context) {
    throw new Error('useTransactions must be used inside TransactionsProvider')
  }
  return context
}
