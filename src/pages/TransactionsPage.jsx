import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Plus, Eye, Pencil, Trash2, X } from 'lucide-react'
import { useTransactions } from '../hooks/useTransactions.js'
import { useSettings } from '../hooks/useSettings.js'
import { useToast } from '../hooks/useToast.js'
import { filterTransactions, sortTransactions } from '../utils/finance.js'
import { formatCurrency } from '../utils/formatters.js'
import { formatDate } from '../utils/dates.js'
import ConfirmationModal from '../components/common/ConfirmationModal.jsx'
import './TransactionsPage.css'

function TransactionsPage() {
  const { transactions, deleteTransaction } = useTransactions()
  const { settings } = useSettings()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [sortKey, setSortKey] = useState('newest')
  const [selectedTransactionId, setSelectedTransactionId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const categories = useMemo(() => {
    const allCategories = Array.from(new Set(transactions.map((transaction) => transaction.category)))
    return allCategories.sort((first, second) => first.localeCompare(second))
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    const filtered = filterTransactions(transactions, { search, type: typeFilter, category: categoryFilter, date: dateFilter })
    return sortTransactions(filtered, sortKey)
  }, [transactions, search, typeFilter, categoryFilter, dateFilter, sortKey])

  const handleDelete = () => {
    if (!selectedTransactionId) return
    deleteTransaction(selectedTransactionId)
    addToast('Transaction deleted', 'success')
    setIsModalOpen(false)
    setSelectedTransactionId(null)
  }

  const hasActiveFilters = search || typeFilter !== 'all' || categoryFilter !== 'all' || dateFilter !== 'all'

  return (
    <div className="transactions-page">
      <section className="page-header-card">
        <div>
          <p className="eyebrow">Transactions</p>
          <h3>Manage your income and expenses.</h3>
        </div>
        <Link to="/transactions/new" className="primary-button">
          <Plus size={16} />
          Add Transaction
        </Link>
      </section>

      <section className="toolbar-card">
        <div className="search-field">
          <Search size={16} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search transactions" aria-label="Search transactions" />
        </div>
        <div className="toolbar-controls">
          <label className="field-label">
            <span>Type</span>
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
          </label>
          <label className="field-label">
            <span>Category</span>
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>
          <label className="field-label">
            <span>Date</span>
            <select value={dateFilter} onChange={(event) => setDateFilter(event.target.value)}>
              <option value="all">All Time</option>
              <option value="this-month">This Month</option>
              <option value="last-month">Last Month</option>
              <option value="this-year">This Year</option>
            </select>
          </label>
          <label className="field-label">
            <span>Sort</span>
            <select value={sortKey} onChange={(event) => setSortKey(event.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
              <option value="name-az">Name A–Z</option>
              <option value="name-za">Name Z–A</option>
            </select>
          </label>
          {hasActiveFilters && (
            <button type="button" className="ghost-button" onClick={() => { setSearch(''); setTypeFilter('all'); setCategoryFilter('all'); setDateFilter('all'); setSortKey('newest') }}>
              <X size={16} />
              Clear Filters
            </button>
          )}
        </div>
      </section>

      <section className="results-card">
        <div className="results-header">
          <p>Showing {filteredTransactions.length} of {transactions.length} transactions</p>
        </div>
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <h4>{transactions.length === 0 ? 'No transactions yet' : 'No matching transactions'}</h4>
            <p>{transactions.length === 0 ? 'Add your first income or expense to start tracking your money.' : 'Try changing your search or filters.'}</p>
            {transactions.length === 0 ? (
              <Link to="/transactions/new" className="primary-button">Add Transaction</Link>
            ) : (
              <button type="button" className="primary-button" onClick={() => { setSearch(''); setTypeFilter('all'); setCategoryFilter('all'); setDateFilter('all'); }}>Clear Filters</button>
            )}
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      <div className="transaction-cell">
                        <strong>{transaction.title}</strong>
                        <span>{transaction.description}</span>
                      </div>
                    </td>
                    <td>{transaction.category}</td>
                    <td>{formatDate(transaction.date, 'MMM d, yyyy')}</td>
                    <td>
                      <span className={`pill ${transaction.type === 'income' ? 'pill-income' : 'pill-expense'}`}>{transaction.type}</span>
                    </td>
                    <td className={transaction.type === 'income' ? 'positive' : 'danger'}>
                      {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount, settings.currency)}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button type="button" className="icon-button" onClick={() => navigate(`/transactions/${transaction.id}`)} aria-label={`View ${transaction.title}`}>
                          <Eye size={16} />
                        </button>
                        <button type="button" className="icon-button" onClick={() => navigate(`/transactions/${transaction.id}/edit`)} aria-label={`Edit ${transaction.title}`}>
                          <Pencil size={16} />
                        </button>
                        <button type="button" className="icon-button" onClick={() => { setSelectedTransactionId(transaction.id); setIsModalOpen(true) }} aria-label={`Delete ${transaction.title}`}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ConfirmationModal isOpen={isModalOpen} title="Delete transaction" message="This action will remove the transaction permanently." onCancel={() => { setSelectedTransactionId(null); setIsModalOpen(false) }} onConfirm={handleDelete} />
    </div>
  )
}

export default TransactionsPage
