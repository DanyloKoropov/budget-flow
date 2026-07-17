import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { TransactionsProvider } from './context/TransactionsContext.jsx'
import { BudgetsProvider } from './context/BudgetsContext.jsx'
import { GoalsProvider } from './context/GoalsContext.jsx'
import { SettingsProvider } from './context/SettingsContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import AppLayout from './components/layout/AppLayout.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import TransactionsPage from './pages/TransactionsPage.jsx'
import AddTransactionPage from './pages/AddTransactionPage.jsx'
import TransactionDetailsPage from './pages/TransactionDetailsPage.jsx'
import EditTransactionPage from './pages/EditTransactionPage.jsx'
import BudgetsPage from './pages/BudgetsPage.jsx'
import GoalsPage from './pages/GoalsPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <TransactionsProvider>
          <BudgetsProvider>
            <GoalsProvider>
              <ToastProvider>
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/transactions" element={<TransactionsPage />} />
                    <Route path="/transactions/new" element={<AddTransactionPage />} />
                    <Route path="/transactions/:transactionId" element={<TransactionDetailsPage />} />
                    <Route path="/transactions/:transactionId/edit" element={<EditTransactionPage />} />
                    <Route path="/budgets" element={<BudgetsPage />} />
                    <Route path="/goals" element={<GoalsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </AppLayout>
              </ToastProvider>
            </GoalsProvider>
          </BudgetsProvider>
        </TransactionsProvider>
      </SettingsProvider>
    </BrowserRouter>
  )
}

export default App
