import { createContext, useCallback, useMemo } from 'react'
import { initialGoals } from '../data/initialData.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { createId } from '../utils/id.js'

export const GoalsContext = createContext(null)

export function GoalsProvider({ children }) {
  const [goals, setGoals] = useLocalStorage('budgetflow-goals', initialGoals)

  const addGoal = useCallback((goal) => {
    setGoals((current) => [{ ...goal, id: createId(), createdAt: new Date().toISOString() }, ...current])
  }, [setGoals])

  const updateGoal = useCallback((goalId, updatedGoal) => {
    setGoals((current) => current.map((goal) => (goal.id === goalId ? { ...goal, ...updatedGoal } : goal)))
  }, [setGoals])

  const deleteGoal = useCallback((goalId) => {
    setGoals((current) => current.filter((goal) => goal.id !== goalId))
  }, [setGoals])

  const addGoalContribution = useCallback((goalId, contribution) => {
    setGoals((current) =>
      current.map((goal) => {
        if (goal.id === goalId) {
          return { ...goal, savedAmount: Number(goal.savedAmount) + Number(contribution) }
        }
        return goal
      }),
    )
  }, [setGoals])

  const value = useMemo(() => ({ goals, addGoal, updateGoal, deleteGoal, addGoalContribution }), [goals, addGoal, updateGoal, deleteGoal, addGoalContribution])

  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>
}
