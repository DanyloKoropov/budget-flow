import { useContext } from 'react'
import { BudgetsContext } from '../context/BudgetsContext.jsx'

export function useBudgets() {
  const context = useContext(BudgetsContext)
  if (!context) {
    throw new Error('useBudgets must be used inside BudgetsProvider')
  }
  return context
}
