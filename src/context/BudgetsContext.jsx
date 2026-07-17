import { createContext, useCallback, useMemo } from 'react'
import { initialBudgets } from '../data/initialData.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { createId } from '../utils/id.js'

export const BudgetsContext = createContext(null)

export function BudgetsProvider({ children }) {
  const [budgets, setBudgets] = useLocalStorage('budgetflow-budgets', initialBudgets)

  const addBudget = useCallback((budget) => {
    setBudgets((current) => [{ ...budget, id: createId() }, ...current])
  }, [setBudgets])

  const updateBudget = useCallback((budgetId, updatedBudget) => {
    setBudgets((current) => current.map((budget) => (budget.id === budgetId ? { ...budget, ...updatedBudget } : budget)))
  }, [setBudgets])

  const deleteBudget = useCallback((budgetId) => {
    setBudgets((current) => current.filter((budget) => budget.id !== budgetId))
  }, [setBudgets])

  const getBudgetByCategory = useCallback((category, month) => {
    return budgets.find((budget) => budget.category === category && budget.month === month)
  }, [budgets])

  const value = useMemo(() => ({ budgets, addBudget, updateBudget, deleteBudget, getBudgetByCategory }), [budgets, addBudget, updateBudget, deleteBudget, getBudgetByCategory])

  return <BudgetsContext.Provider value={value}>{children}</BudgetsContext.Provider>
}
