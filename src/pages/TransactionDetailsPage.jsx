import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Pencil, Trash2, ArrowLeft } from 'lucide-react'
import { useTransactions } from '../hooks/useTransactions.js'
import { useToast } from '../hooks/useToast.js'
import { useSettings } from '../hooks/useSettings.js'
import { formatCurrency } from '../utils/formatters.js'
import { formatDate } from '../utils/dates.js'
import ConfirmationModal from '../components/common/ConfirmationModal.jsx'
import './PageShell.css'

function TransactionDetailsPage() {
  const { transactionId } = useParams()
  const navigate = useNavigate()
  const { getTransactionById, deleteTransaction } = useTransactions()
  const { settings } = useSettings()
  const { addToast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const transaction = useMemo(() => getTransactionById(transactionId), [getTransactionById, transactionId])

  if (!transaction) {
    return (
      <div className="page-shell">
        <section className="page-shell__content card-shell">
          <h3>Transaction not found</h3>
          <p>The requested transaction does not exist.</p>
        </section>
      </div>
    )
  }

  const handleDelete = () => {
    deleteTransaction(transaction.id)
    addToast('Transaction deleted', 'success')
    navigate('/transactions')
  }

  return (
    <div className="page-shell">
      <section className="page-shell__header">
        <div>
          <p className="eyebrow">Transaction Details</p>
          <h3>{transaction.title}</h3>
        </div>
        <div className="action-buttons">
          <button type="button" className="ghost-button" onClick={() => navigate('/transactions')}>
            <ArrowLeft size={16} />
            Back
          </button>
          <button type="button" className="ghost-button" onClick={() => navigate(`/transactions/${transaction.id}/edit`)}>
            <Pencil size={16} />
            Edit
          </button>
          <button type="button" className="primary-button" onClick={() => setIsModalOpen(true)}>
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </section>
      <section className="page-shell__content card-shell detail-card">
        <div className="detail-row">
          <span>Type</span>
          <strong className={transaction.type === 'income' ? 'positive' : 'danger'}>{transaction.type}</strong>
        </div>
        <div className="detail-row">
          <span>Amount</span>
          <strong>{transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount, settings.currency)}</strong>
        </div>
        <div className="detail-row">
          <span>Category</span>
          <strong>{transaction.category}</strong>
        </div>
        <div className="detail-row">
          <span>Date</span>
          <strong>{formatDate(transaction.date, 'MMM d, yyyy')}</strong>
        </div>
        <div className="detail-row">
          <span>Description</span>
          <strong>{transaction.description || 'No description provided.'}</strong>
        </div>
        <div className="detail-row">
          <span>Created</span>
          <strong>{formatDate(transaction.createdAt, 'MMM d, yyyy')}</strong>
        </div>
      </section>
      <ConfirmationModal isOpen={isModalOpen} title="Delete transaction" message="This will remove the transaction from your planner." onCancel={() => setIsModalOpen(false)} onConfirm={handleDelete} />
    </div>
  )
}

export default TransactionDetailsPage
