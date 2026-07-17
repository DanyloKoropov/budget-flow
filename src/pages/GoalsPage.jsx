import { useState } from 'react'
import { Plus, Pencil, Trash2, HandCoins } from 'lucide-react'
import { useGoals } from '../hooks/useGoals.js'
import { useSettings } from '../hooks/useSettings.js'
import { useToast } from '../hooks/useToast.js'
import { calculateGoalPercentage } from '../utils/finance.js'
import { formatCurrency } from '../utils/formatters.js'
import { formatDate } from '../utils/dates.js'
import ConfirmationModal from '../components/common/ConfirmationModal.jsx'
import './PageShell.css'

function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal, addGoalContribution } = useGoals()
  const { settings } = useSettings()
  const { addToast } = useToast()
  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [savedAmount, setSavedAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [editingGoalId, setEditingGoalId] = useState(null)
  const [contributionId, setContributionId] = useState(null)
  const [contributionAmount, setContributionAmount] = useState('')
  const [selectedGoalId, setSelectedGoalId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState('')

  const submitGoal = (event) => {
    event.preventDefault()
    if (!name || !targetAmount || !deadline) {
      setError('Please fill in the name, target amount, and deadline.')
      return
    }

    const parsedTarget = Number(targetAmount)
    const parsedSaved = Number(savedAmount || 0)
    if (parsedTarget <= 0) {
      setError('Target must be greater than zero.')
      return
    }

    if (parsedSaved < 0) {
      setError('Saved amount cannot be negative.')
      return
    }

    if (editingGoalId) {
      updateGoal(editingGoalId, { name, targetAmount: parsedTarget, savedAmount: parsedSaved, deadline })
      addToast('Goal updated', 'success')
    } else {
      addGoal({ name, targetAmount: parsedTarget, savedAmount: parsedSaved, deadline })
      addToast('Goal created', 'success')
    }

    resetForm()
  }

  const resetForm = () => {
    setName('')
    setTargetAmount('')
    setSavedAmount('')
    setDeadline('')
    setEditingGoalId(null)
    setError('')
  }

  const startEdit = (goal) => {
    setEditingGoalId(goal.id)
    setName(goal.name)
    setTargetAmount(goal.targetAmount)
    setSavedAmount(goal.savedAmount)
    setDeadline(goal.deadline)
    setError('')
  }

  const handleContribution = (event) => {
    event.preventDefault()
    const parsedContribution = Number(contributionAmount)
    if (!parsedContribution || parsedContribution <= 0) {
      setError('Contribution must be greater than zero.')
      return
    }

    addGoalContribution(contributionId, parsedContribution)
    addToast('Contribution added', 'success')
    setContributionAmount('')
    setContributionId(null)
    setError('')
  }

  const handleDelete = () => {
    if (!selectedGoalId) return
    deleteGoal(selectedGoalId)
    addToast('Goal deleted', 'success')
    setSelectedGoalId(null)
    setIsModalOpen(false)
  }

  return (
    <div className="page-shell">
      <section className="page-shell__header">
        <div>
          <p className="eyebrow">Savings Goals</p>
          <h3>Track progress toward the things that matter.</h3>
        </div>
      </section>

      <section className="page-shell__content card-shell">
        <form className="goal-form" onSubmit={submitGoal}>
          <label className="form-field">
            <span>Goal name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="form-field">
            <span>Target amount</span>
            <input type="number" min="0.01" step="0.01" value={targetAmount} onChange={(event) => setTargetAmount(event.target.value)} />
          </label>
          <label className="form-field">
            <span>Current saved amount</span>
            <input type="number" min="0" step="0.01" value={savedAmount} onChange={(event) => setSavedAmount(event.target.value)} />
          </label>
          <label className="form-field">
            <span>Deadline</span>
            <input type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
          </label>
          <button type="submit" className="primary-button">
            <Plus size={16} />
            {editingGoalId ? 'Save Goal' : 'Add Goal'}
          </button>
        </form>
        {error && <p className="field-error">{error}</p>}
      </section>

      <section className="page-shell__content card-shell goal-list">
        {goals.length === 0 ? (
          <div className="empty-state">
            <h4>No savings goals yet</h4>
            <p>Create your first goal and start tracking your progress.</p>
          </div>
        ) : (
          goals.map((goal) => {
            const percentage = Math.min(calculateGoalPercentage(goal), 100)
            const remaining = Number(goal.targetAmount) - Number(goal.savedAmount)
            return (
              <article key={goal.id} className="goal-card">
                <div className="goal-top">
                  <div>
                    <h4>{goal.name}</h4>
                    <p>{formatCurrency(goal.savedAmount, settings.currency)} of {formatCurrency(goal.targetAmount, settings.currency)}</p>
                  </div>
                  <div className="goal-actions">
                    <button type="button" className="icon-button" onClick={() => setContributionId(goal.id)} aria-label={`Add money to ${goal.name}`}>
                      <HandCoins size={16} />
                    </button>
                    <button type="button" className="icon-button" onClick={() => startEdit(goal)} aria-label={`Edit ${goal.name}`}>
                      <Pencil size={16} />
                    </button>
                    <button type="button" className="icon-button" onClick={() => { setSelectedGoalId(goal.id); setIsModalOpen(true) }} aria-label={`Delete ${goal.name}`}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="progress-bar">
                  <div style={{ width: `${percentage}%` }} />
                </div>
                <div className="budget-meta">
                  <span>{percentage >= 100 ? 'Goal completed' : `${Math.round(percentage)}% complete`}</span>
                  <span>{remaining > 0 ? `${formatCurrency(remaining, settings.currency)} remaining` : 'Target reached'}</span>
                </div>
                <p className="goal-deadline">Deadline: {formatDate(goal.deadline, 'MMMM d, yyyy')}</p>
                {contributionId === goal.id && (
                  <form className="contribution-form" onSubmit={handleContribution}>
                    <input type="number" min="0.01" step="0.01" value={contributionAmount} onChange={(event) => setContributionAmount(event.target.value)} placeholder="Contribution amount" />
                    <button type="submit" className="primary-button">Add Money</button>
                  </form>
                )}
              </article>
            )
          })
        )}
      </section>

      <ConfirmationModal isOpen={isModalOpen} title="Delete goal" message="This will permanently remove the savings goal." onCancel={() => { setSelectedGoalId(null); setIsModalOpen(false) }} onConfirm={handleDelete} />
    </div>
  )
}

export default GoalsPage
