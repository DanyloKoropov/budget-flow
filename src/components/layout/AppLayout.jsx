import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, List, Wallet, Target, Settings, Menu, X, Sun, Moon, ChevronRight } from 'lucide-react'
import { NAV_ITEMS } from '../../constants/navigation.js'
import { useSettings } from '../../hooks/useSettings.js'
import { formatDate } from '../../utils/dates.js'
import './AppLayout.css'

function AppLayout({ children }) {
  const location = useLocation()
  const { settings, toggleTheme, theme } = useSettings()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const pageTitle = {
    '/': 'Dashboard',
    '/transactions': 'Transactions',
    '/transactions/new': 'Add Transaction',
    '/budgets': 'Budgets',
    '/goals': 'Goals',
    '/settings': 'Settings',
  }[location.pathname] || 'BudgetFlow'

  const pageDescription = {
    '/': 'Here is your financial overview for today.',
    '/transactions': 'Monitor every income and expense in one view.',
    '/transactions/new': 'Capture a new income or expense with confidence.',
    '/budgets': 'Set monthly limits and keep your spending in check.',
    '/goals': 'Track savings milestones and stay focused.',
    '/settings': 'Adjust your profile and app appearance.',
  }[location.pathname] || 'BudgetFlow helps you stay on top of money.'

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-icon">BF</div>
          <div>
            <h1>BudgetFlow</h1>
            <p>Personal planner</p>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = {
              LayoutDashboard,
              List,
              Wallet,
              Target,
              Settings,
            }[item.icon]

            return (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>
          <div className="profile-pill">
            <strong>{settings.name}</strong>
            <span>{settings.currency}</span>
          </div>
        </div>
      </aside>

      <div className="main-panel">
        <header className="topbar">
          <div className="mobile-menu-button">
            <button type="button" onClick={() => setMobileMenuOpen((open) => !open)} aria-label="Open navigation menu">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          <div>
            <p className="eyebrow">{pageTitle}</p>
            <h2>{pageDescription}</h2>
          </div>
          <div className="topbar-actions">
            <div className="date-pill">{formatDate(new Date(), 'MMM d, yyyy')}</div>
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="mobile-nav-sheet">
            {NAV_ITEMS.map((item) => {
              const Icon = {
                LayoutDashboard,
                List,
                Wallet,
                Target,
                Settings,
              }[item.icon]

              return (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                  <ChevronRight size={16} />
                </NavLink>
              )
            })}
          </div>
        )}

        <main className="content-area">{children}</main>
      </div>
    </div>
  )
}

export default AppLayout
