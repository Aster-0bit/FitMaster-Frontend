import { useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { Navigate } from 'react-router-dom'
import './Login.css'
import { API_URL } from '../auth/constants'

export default function Login() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const auth = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()

    try{
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      if(response.ok){
        console.log('Usuario autenticado')
      }else {
        console.error('Error en la autenticación')
      }

    }catch(error){
      console.error('Error en la autenticación', error)
    }
  }

  if(auth.isAuthenticated) {
    return <Navigate to="/dashboard" />
  }

  return (
    <div className="login-page">
      <div className="form-wrapper">
        <div className="form-container">
          <p className="title">Bienvenido de nuevo</p>
          <form className="form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="page-link">
              <span className="page-link-label">¿Olvidaste tu contraseña?</span>
            </p>
            <button className="form-btn" type="submit">Log in</button>
          </form>
          <p className="sign-up-label">No tienes cuenta?<span className="sign-up-link">Registrate</span>
          </p>
        </div>
      </div>
    </div>
  )
}