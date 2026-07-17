import { createContext, useCallback, useMemo } from 'react'
import { initialTransactions } from '../data/initialData.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { createId } from '../utils/id.js'

export const TransactionsContext = createContext(null)

export function TransactionsProvider({ children }) {
  const [transactions, setTransactions] = useLocalStorage('budgetflow-transactions', initialTransactions)

  const addTransaction = useCallback((transaction) => {
    const newTransaction = {
      ...transaction,
      id: createId(),
      createdAt: new Date().toISOString(),
    }

    setTransactions((current) => [newTransaction, ...current])
  }, [setTransactions])

  const updateTransaction = useCallback((transactionId, updatedTransaction) => {
    setTransactions((current) =>
      current.map((transaction) => (transaction.id === transactionId ? { ...transaction, ...updatedTransaction } : transaction)),
    )
  }, [setTransactions])

  const deleteTransaction = useCallback((transactionId) => {
    setTransactions((current) => current.filter((transaction) => transaction.id !== transactionId))
  }, [setTransactions])

  const getTransactionById = useCallback((transactionId) => {
    return transactions.find((transaction) => transaction.id === transactionId)
  }, [transactions])

  const value = useMemo(
    () => ({
      transactions,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      getTransactionById,
    }),
    [transactions, addTransaction, updateTransaction, deleteTransaction, getTransactionById],
  )

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>
}
