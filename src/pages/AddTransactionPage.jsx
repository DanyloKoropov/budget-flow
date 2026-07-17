import { useNavigate } from 'react-router-dom'
import TransactionForm from '../components/transactions/TransactionForm.jsx'
import './PageShell.css'

function AddTransactionPage() {
  const navigate = useNavigate()

  return (
    <div className="page-shell">
      <section className="page-shell__header">
        <div>
          <p className="eyebrow">Add Transaction</p>
          <h3>Record a new income or expense.</h3>
        </div>
      </section>
      <section className="page-shell__content card-shell">
        <TransactionForm onSubmitSuccess={() => navigate('/transactions')} />
      </section>
    </div>
  )
}

export default AddTransactionPage
