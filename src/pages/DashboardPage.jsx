import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, ReceiptText } from 'lucide-react'
import { useTransactions } from '../hooks/useTransactions.js'
import { useBudgets } from '../hooks/useBudgets.js'
import { useSettings } from '../hooks/useSettings.js'
import { calculateBalance, calculateMonthlyExpenses, calculateMonthlyIncome, calculateRemainingBudget, groupExpensesByCategory } from '../utils/finance.js'
import { formatCurrency, formatPercentage } from '../utils/formatters.js'
import { formatDate } from '../utils/dates.js'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import './DashboardPage.css'

const summaryConfig = [
  { key: 'balance', label: 'Current Balance', icon: Wallet },
  { key: 'income', label: 'Income This Month', icon: ArrowUpRight },
  { key: 'expenses', label: 'Expenses This Month', icon: ArrowDownRight },
  { key: 'budget', label: 'Remaining Budget', icon: TrendingUp },
]

function DashboardPage() {
  const { transactions } = useTransactions()
  const { budgets } = useBudgets()
  const { settings } = useSettings()

  const currentMonthExpenses = useMemo(() => transactions.filter((transaction) => transaction.type === 'expense' && transaction.date.startsWith(new Date().toISOString().slice(0, 7))), [transactions])

  const balance = calculateBalance(transactions)
  const income = calculateMonthlyIncome(transactions)
  const expenses = calculateMonthlyExpenses(transactions)
  const remainingBudget = calculateRemainingBudget(budgets, transactions)
  const expenseBreakdown = groupExpensesByCategory(transactions)
  const recentTransactions = [...transactions].sort((first, second) => new Date(second.date) - new Date(first.date)).slice(0, 5)

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const chartData = [
    { name: 'Income', value: income },
    { name: 'Expenses', value: expenses },
  ]

  const budgetPreview = [...budgets]
    .map((budget) => ({
      ...budget,
      spent: currentMonthExpenses.filter((transaction) => transaction.category === budget.category).reduce((sum, transaction) => sum + transaction.amount, 0),
    }))
    .sort((first, second) => {
      const firstRatio = first.limit > 0 ? first.spent / first.limit : 0
      const secondRatio = second.limit > 0 ? second.spent / second.limit : 0
      return secondRatio - firstRatio
    })
    .slice(0, 3)

  return (
    <div className="dashboard-page">
      <section className="hero-card">
        <div>
          <p className="eyebrow">{greeting()}, {settings.name}</p>
          <h3>Here is your financial overview for this month.</h3>
          <p className="hero-copy">A quick snapshot of cash flow, spending, and your progress toward budget goals.</p>
        </div>
        <Link to="/transactions/new" className="primary-button">
          <ReceiptText size={16} />
          Add Transaction
        </Link>
      </section>

      <section className="summary-grid">
        {summaryConfig.map((card) => {
          let value = 0
          let tone = 'neutral'
          if (card.key === 'balance') {
            value = balance
            tone = value >= 0 ? 'positive' : 'danger'
          } else if (card.key === 'income') {
            value = income
            tone = 'positive'
          } else if (card.key === 'expenses') {
            value = expenses
            tone = 'danger'
          } else {
            value = remainingBudget
            tone = value >= 0 ? 'positive' : 'danger'
          }

          return (
            <article key={card.key} className={`summary-card ${tone}`}>
              <div className="summary-card__header">
                <span className="summary-card__label">{card.label}</span>
                <card.icon size={18} />
              </div>
              <strong>{formatCurrency(value, settings.currency)}</strong>
            </article>
          )
        })}
      </section>

      <section className="dashboard-grid">
        <article className="panel-card">
          <div className="panel-card__header">
            <h4>Expenses by Category</h4>
          </div>
          {expenseBreakdown.length > 0 ? (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={expenseBreakdown} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={3}>
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`${entry.name}-${index}`} fill={index % 2 === 0 ? 'var(--color-primary)' : 'var(--color-danger)'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value, settings.currency)} />
                </PieChart>
              </ResponsiveContainer>
              <ul className="legend-list">
                {expenseBreakdown.map((entry) => (
                  <li key={entry.name}>
                    <span className="legend-dot" />
                    <span>{entry.name}</span>
                    <strong>{formatCurrency(entry.value, settings.currency)}</strong>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="empty-state small">No expenses this month yet.</div>
          )}
        </article>

        <article className="panel-card">
          <div className="panel-card__header">
            <h4>Income vs Expenses</h4>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => formatCurrency(value, settings.currency)} />
                <Bar dataKey="value" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="dashboard-grid lower-grid">
        <article className="panel-card">
          <div className="panel-card__header">
            <h4>Recent Transactions</h4>
            <Link to="/transactions">View all</Link>
          </div>
          <ul className="transaction-list">
            {recentTransactions.map((transaction) => (
              <li key={transaction.id}>
                <Link to={`/transactions/${transaction.id}`}>
                  <div>
                    <strong>{transaction.title}</strong>
                    <p>{transaction.category}</p>
                  </div>
                  <div className="transaction-meta">
                    <span>{formatDate(transaction.date, 'MMM d')}</span>
                    <strong className={transaction.type === 'income' ? 'positive' : 'danger'}>
                      {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount, settings.currency)}
                    </strong>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel-card">
          <div className="panel-card__header">
            <h4>Budget Preview</h4>
            <Link to="/budgets">View budgets</Link>
          </div>
          <div className="budget-preview-list">
            {budgetPreview.map((budget) => {
              const percentage = Math.min((budget.spent / budget.limit) * 100, 100)
              return (
                <div key={budget.id} className="preview-row">
                  <div className="preview-row__top">
                    <strong>{budget.category}</strong>
                    <span>{formatPercentage(percentage)}</span>
                  </div>
                  <div className="progress-bar">
                    <div style={{ width: `${percentage}%` }} />
                  </div>
                  <p>{formatCurrency(budget.spent, settings.currency)} of {formatCurrency(budget.limit, settings.currency)} spent</p>
                </div>
              )
            })}
          </div>
        </article>
      </section>
    </div>
  )
}

export default DashboardPage
