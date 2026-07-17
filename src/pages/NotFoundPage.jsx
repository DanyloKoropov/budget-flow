import { Link } from 'react-router-dom'
import './PageShell.css'

function NotFoundPage() {
  return (
    <div className="page-shell">
      <section className="page-shell__content card-shell not-found">
        <p className="eyebrow">404</p>
        <h3>Page not found</h3>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" className="primary-button">Back to Dashboard</Link>
      </section>
    </div>
  )
}

export default NotFoundPage
