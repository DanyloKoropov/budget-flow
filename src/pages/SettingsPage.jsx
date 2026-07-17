import { useState } from 'react'
import { useSettings } from '../hooks/useSettings.js'
import { useToast } from '../hooks/useToast.js'
import { initialBudgets, initialGoals, initialSettings, initialTransactions } from '../data/initialData.js'
import { CURRENCIES } from '../constants/categories.js'
import ConfirmationModal from '../components/common/ConfirmationModal.jsx'
import './PageShell.css'

function SettingsPage() {
  const { settings, updateSettings, theme } = useSettings()
  const { addToast } = useToast()
  const [name, setName] = useState(settings.name)
  const [currency, setCurrency] = useState(settings.currency)
  const [modalType, setModalType] = useState(null)

  const saveSettings = (event) => {
    event.preventDefault()
    updateSettings({ name, currency, theme })
    addToast('Settings saved', 'success')
  }

  const resetDemoData = () => {
    updateSettings(initialSettings)
    setName(initialSettings.name)
    setCurrency(initialSettings.currency)
    // Rehydrate demo data via context storage replacement
    localStorage.setItem('budgetflow-transactions', JSON.stringify(initialTransactions))
    localStorage.setItem('budgetflow-budgets', JSON.stringify(initialBudgets))
    localStorage.setItem('budgetflow-goals', JSON.stringify(initialGoals))
    window.location.reload()
  }

  const deleteAllTransactions = () => {
    localStorage.setItem('budgetflow-transactions', JSON.stringify([]))
    window.location.reload()
  }

  return (
    <div className="page-shell">
      <section className="page-shell__header">
        <div>
          <p className="eyebrow">Settings</p>
          <h3>Customize your planner and reset demo data.</h3>
        </div>
      </section>

      <section className="page-shell__content card-shell">
        <form className="settings-form" onSubmit={saveSettings}>
          <div className="settings-group">
            <h4>Profile</h4>
            <label className="form-field">
              <span>Display name</span>
              <input value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <label className="form-field">
              <span>Preferred currency</span>
              <select value={currency} onChange={(event) => setCurrency(event.target.value)}>
                {CURRENCIES.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
          </div>
          <div className="settings-group">
            <h4>Appearance</h4>
            <div className="theme-options">
              <label><input type="radio" name="theme" checked={theme === 'light'} onChange={() => updateSettings({ theme: 'light' })} /> Light</label>
              <label><input type="radio" name="theme" checked={theme === 'dark'} onChange={() => updateSettings({ theme: 'dark' })} /> Dark</label>
            </div>
          </div>
          <div className="settings-group">
            <h4>Data</h4>
            <div className="settings-actions">
              <button type="button" className="ghost-button" onClick={() => setModalType('reset')}>Reset Demo Data</button>
              <button type="button" className="ghost-button danger" onClick={() => setModalType('delete')}>Delete All Transactions</button>
            </div>
          </div>
          <button type="submit" className="primary-button">Save Settings</button>
        </form>
      </section>

      <ConfirmationModal isOpen={Boolean(modalType)} title={modalType === 'reset' ? 'Reset demo data' : 'Delete all transactions'} message={modalType === 'reset' ? 'This will restore demo data and reset settings to the default example values.' : 'This will permanently erase every transaction in the planner.'} onCancel={() => setModalType(null)} onConfirm={modalType === 'reset' ? resetDemoData : deleteAllTransactions} />
    </div>
  )
}

export default SettingsPage
