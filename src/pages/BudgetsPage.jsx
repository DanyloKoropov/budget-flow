import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, Wallet2 } from 'lucide-react'
import { useBudgets } from '../hooks/useBudgets.js'
import { useTransactions } from '../hooks/useTransactions.js'
import { useSettings } from '../hooks/useSettings.js'
import { useToast } from '../hooks/useToast.js'
import { EXPENSE_CATEGORIES } from '../constants/categories.js'
import { calculateBudgetPercentage, calculateBudgetSpent } from '../utils/finance.js'
import { formatCurrency } from '../utils/formatters.js'
import { getMonthKey } from '../utils/dates.js'
import ConfirmationModal from '../components/common/ConfirmationModal.jsx'
import './PageShell.css'

function BudgetsPage() {
  const { budgets, addBudget, updateBudget, deleteBudget } = useBudgets()
  const { transactions } = useTransactions()
  const { settings } = useSettings()
  const { addToast } = useToast()
  const [category, setCategory] = useState('')
  const [limit, setLimit] = useState('')
  const [editingBudgetId, setEditingBudgetId] = useState(null)
  const [selectedBudgetId, setSelectedBudgetId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState('')

  const month = getMonthKey()
  const monthBudgets = useMemo(() => budgets.filter((budget) => budget.month === month), [budgets, month])

  const submitBudget = (event) => {
    event.preventDefault()
    if (!category || !limit) {
      setError('Category and limit are required.')
      return
    }

    const parsedLimit = Number(limit)
    if (parsedLimit <= 0) {
      setError('Limit must be greater than zero.')
      return
    }

    const duplicate = monthBudgets.some((budget) => budget.category === category && budget.id !== editingBudgetId)
    if (duplicate) {
      setError('A budget for this category already exists for this month.')
      return
    }

    if (editingBudgetId) {
      updateBudget(editingBudgetId, { category, limit: parsedLimit, month })
      addToast('Budget updated', 'success')
    } else {
      addBudget({ category, limit: parsedLimit, month })
      addToast('Budget created', 'success')
    }

    setCategory('')
    setLimit('')
    setEditingBudgetId(null)
    setError('')
  }

  const startEdit = (budget) => {
    setEditingBudgetId(budget.id)
    setCategory(budget.category)
    setLimit(budget.limit)
    setError('')
  }

  const handleDelete = () => {
    if (!selectedBudgetId) return
    deleteBudget(selectedBudgetId)
    addToast('Budget deleted', 'success')
    setIsModalOpen(false)
    setSelectedBudgetId(null)
  }

  return (
    <div className="page-shell">
      <section className="page-shell__header">
        <div>
          <p className="eyebrow">Monthly Budgets</p>
          <h3>Set spending limits and track your progress.</h3>
        </div>
      </section>

      <section className="page-shell__content card-shell">
        <form className="budget-form" onSubmit={submitBudget}>
          <label className="form-field">
            <span>Category</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="">Select category</option>
              {EXPENSE_CATEGORIES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="form-field">
            <span>Monthly limit</span>
            <input type="number" min="0.01" step="0.01" value={limit} onChange={(event) => setLimit(event.target.value)} />
          </label>
          <button type="submit" className="primary-button">
            <Plus size={16} />
            {editingBudgetId ? 'Save Budget' : 'Add Budget'}
          </button>
        </form>
        {error && <p className="field-error">{error}</p>}
      </section>

      <section className="page-shell__content card-shell budget-list">
        {monthBudgets.length === 0 ? (
          <div className="empty-state">
            <h4>No budgets created</h4>
            <p>Create category budgets to control your monthly spending.</p>
          </div>
        ) : (
          monthBudgets.map((budget) => {
            const spent = calculateBudgetSpent(budget, transactions)
            const percentage = calculateBudgetPercentage(budget, transactions)
            const remaining = Number(budget.limit) - spent
            const status = percentage >= 100 ? 'exceeded' : percentage >= 90 ? 'near' : percentage >= 70 ? 'warning' : 'normal'

            return (
              <article key={budget.id} className={`budget-card budget-${status}`}>
                <div className="budget-top">
                  <div className="budget-title">
                    <Wallet2 size={18} />
                    <div>
                      <h4>{budget.category}</h4>
                      <p>{formatCurrency(spent, settings.currency)} of {formatCurrency(budget.limit, settings.currency)} spent</p>
                    </div>
                  </div>
                  <div className="budget-actions">
                    <button type="button" className="icon-button" onClick={() => startEdit(budget)} aria-label={`Edit ${budget.category}`}>
                      <Pencil size={16} />
                    </button>
                    <button type="button" className="icon-button" onClick={() => { setSelectedBudgetId(budget.id); setIsModalOpen(true) }} aria-label={`Delete ${budget.category}`}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="progress-bar">
                  <div style={{ width: `${Math.min(percentage, 100)}%` }} />
                </div>
                <div className="budget-meta">
                  <span>{Math.round(percentage)}% used</span>
                  <span>{remaining >= 0 ? `${formatCurrency(remaining, settings.currency)} remaining` : `Over budget by ${formatCurrency(Math.abs(remaining), settings.currency)}`}</span>
                </div>
              </article>
            )
          })
        )}
      </section>

      <ConfirmationModal isOpen={isModalOpen} title="Delete budget" message="This will remove this spending limit for the month." onCancel={() => { setSelectedBudgetId(null); setIsModalOpen(false) }} onConfirm={handleDelete} />
    </div>
  )
}

export default BudgetsPage
