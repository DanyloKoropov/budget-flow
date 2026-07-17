import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TransactionForm from '../components/transactions/TransactionForm.jsx'
import { useTransactions } from '../hooks/useTransactions.js'
import './PageShell.css'

function EditTransactionPage() {
  const { transactionId } = useParams()
  const navigate = useNavigate()
  const { getTransactionById } = useTransactions()

  const transaction = useMemo(() => getTransactionById(transactionId), [getTransactionById, transactionId])

  if (!transaction) {
    return (
      <div className="page-shell">
        <section className="page-shell__content card-shell">
          <h3>Transaction not found</h3>
          <p>The requested transaction can no longer be found.</p>
        </section>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <section className="page-shell__header">
        <div>
          <p className="eyebrow">Edit Transaction</p>
          <h3>Update the details for this entry.</h3>
        </div>
      </section>
      <section className="page-shell__content card-shell">
        <TransactionForm mode="edit" initialValues={transaction} onSubmitSuccess={() => navigate(`/transactions/${transactionId}`)} />
      </section>
    </div>
  )
}

export default EditTransactionPage
