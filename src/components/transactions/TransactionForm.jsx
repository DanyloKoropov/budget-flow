import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../constants/categories.js'
import { useToast } from '../../hooks/useToast.js'
import { useTransactions } from '../../hooks/useTransactions.js'
import './TransactionForm.css'

function TransactionForm({ mode = 'create', initialValues = null, onSubmitSuccess }) {
  const navigate = useNavigate()
  const { addTransaction, updateTransaction } = useTransactions()
  const { addToast } = useToast()
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      type: initialValues?.type || 'expense',
      title: initialValues?.title || '',
      amount: initialValues?.amount || '',
      category: initialValues?.category || '',
      date: initialValues?.date || new Date().toISOString().slice(0, 10),
      description: initialValues?.description || '',
    },
  })

  const selectedType = watch('type')

  useEffect(() => {
    if (initialValues) {
      reset({
        type: initialValues.type || 'expense',
        title: initialValues.title || '',
        amount: initialValues.amount || '',
        category: initialValues.category || '',
        date: initialValues.date || new Date().toISOString().slice(0, 10),
        description: initialValues.description || '',
      })
    }
  }, [initialValues, reset])

  const onSubmit = (data) => {
    const transactionPayload = {
      title: data.title.trim(),
      amount: Number(data.amount),
      type: data.type,
      category: data.category,
      date: data.date,
      description: data.description.trim(),
    }

    if (mode === 'edit' && initialValues?.id) {
      updateTransaction(initialValues.id, transactionPayload)
      addToast('Transaction updated', 'success')
      onSubmitSuccess?.(initialValues.id)
    } else {
      addTransaction(transactionPayload)
      addToast('Transaction added', 'success')
      onSubmitSuccess?.()
    }
  }

  const categories = selectedType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  return (
    <form className="transaction-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="segmented-control" role="radiogroup" aria-label="Transaction type">
        <button type="button" className={`segment ${selectedType === 'income' ? 'active' : ''}`} onClick={() => reset((current) => ({ ...current, type: 'income', category: '' }))}>
          Income
        </button>
        <button type="button" className={`segment ${selectedType === 'expense' ? 'active' : ''}`} onClick={() => reset((current) => ({ ...current, type: 'expense', category: '' }))}>
          Expense
        </button>
      </div>

      <div className="form-grid">
        <label className="form-field">
          <span>Title</span>
          <input
            {...register('title', {
              required: 'Title is required',
              minLength: { value: 2, message: 'Title must be at least 2 characters' },
              maxLength: { value: 40, message: 'Title must be less than 40 characters' },
            })}
            placeholder="Salary"
          />
          {errors.title && <small className="field-error">{errors.title.message}</small>}
        </label>

        <label className="form-field">
          <span>Amount</span>
          <input
            type="number"
            step="0.01"
            min="0.01"
            {...register('amount', {
              required: 'Amount is required',
              validate: (value) => Number(value) > 0 || 'Amount must be greater than zero',
            })}
            placeholder="0.00"
          />
          {errors.amount && <small className="field-error">{errors.amount.message}</small>}
        </label>

        <label className="form-field">
          <span>Category</span>
          <select {...register('category', { required: 'Category is required' })}>
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && <small className="field-error">{errors.category.message}</small>}
        </label>

        <label className="form-field">
          <span>Date</span>
          <input type="date" {...register('date', { required: 'Date is required' })} />
          {errors.date && <small className="field-error">{errors.date.message}</small>}
        </label>

        <label className="form-field full-width">
          <span>Description</span>
          <textarea {...register('description', { maxLength: { value: 180, message: 'Description should stay under 180 characters' } })} rows="4" placeholder="Optional details" />
          {errors.description && <small className="field-error">{errors.description.message}</small>}
        </label>
      </div>

      <div className="form-actions">
        <button type="button" className="ghost-button" onClick={() => navigate(-1)}>Cancel</button>
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {mode === 'edit' ? 'Save Changes' : 'Add Transaction'}
        </button>
      </div>
    </form>
  )
}

export default TransactionForm
