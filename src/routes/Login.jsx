import { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { Navigate, Link } from 'react-router-dom'
import './Login.css'
import { API_URL } from '../auth/constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faChevronLeft } from '@fortawesome/free-solid-svg-icons'

export default function Login() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);

  const auth = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()

    try{
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })

      if(response.ok){
        const data = await response.json()
        auth.login(data.token)
        console.log('Usuario autenticado')
      }else {
        console.error('Error en la autenticación')
      }

    }catch(error){
      console.error('Error en la autenticación', error)
    }
  }

  useEffect(() => {
    console.log("isAuthenticated changed:", auth.isAuthenticated);
  }, [auth.isAuthenticated]);

  if(auth.isAuthenticated) {
    return <Navigate to="/dashboard" />
  }

  return (
    <div className="login-page">
      <div className="form-wrapper">
        <div className="form-container">
        <Link to="/" className="back-link"><FontAwesomeIcon icon={faChevronLeft} /> Atrás</Link>
          <p className="title">Bienvenido de nuevo</p>
          <form className="form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                className="input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                onClick={() => setShowPassword(!showPassword)}
                className="password-icon"
              />
            </div>
            <p className="page-link">
              <span className="page-link-label"><Link to="/forgot-password">¿Olvidaste tu contraseña?</Link></span>
            </p>
            <button className="form-btn" type="submit">Log in</button>
          </form>
          <p className="sign-up-label">No tienes cuenta?<span className="sign-up-link"><Link to="/signup">Registrate</Link></span>
          </p>
        </div>
      </div>
    </div>
  )
}