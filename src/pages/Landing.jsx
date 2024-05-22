import { Link } from 'react-router-dom'
import './Landing.css'
import { useAuth } from '../auth/AuthProvider'
import { Navigate } from 'react-router-dom'

export function Landing() {

  const auth = useAuth()

  if(auth.isAuthenticated) {
    return <Navigate to="/dashboard" />
  }

  return (
    <div className="landing-container">
      <section className="banner">
        <div className="banner-content">
          <header>
            <img src="/assets/logo.svg" alt="Logo" className="logo" />
            <h1 className="title">FitMaster</h1>
            <p className="banner-description">
              Tu compañero ideal para alcanzar tus metas de fitness. Comienza a registrar tus rutinas ahora mismo!
            </p>
            <div className='buttons'>
              <Link to="/signup" className="btn signup-btn">Registrarse</Link>
              <Link to="/login" className="btn login-btn">Iniciar sesión</Link>
            </div>
          </header>
        </div>
      </section>
    </div>
  )
}