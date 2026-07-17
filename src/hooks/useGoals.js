import { useContext } from 'react'
import { GoalsContext } from '../context/GoalsContext.jsx'

export function useGoals() {
  const context = useContext(GoalsContext)
  if (!context) {
    throw new Error('useGoals must be used inside GoalsProvider')
  }
  return context
}
