import { useContext, createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from './constants'

const AuthContext = createContext({
  isAuthenticated: false,
  getAccessToken: () => '',
  login: () => {},
  logout: () => {},
  renewAccessToken: () => {}
})

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [accessToken, setAccessToken] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const checkRefeshToken = async () => {
      try {
        const response = await fetch(`${API_URL}/refresh`, {
          method: 'POST',
          credentials: 'include'
        })

        if(response.ok) {
          const data = await response.json()
          setAccessToken(data.token)
          setIsAuthenticated(true)
        }else {
          setIsAuthenticated(false)
        }
      }catch(error) {
        console.error('Error al renovar el token', error)
        setIsAuthenticated(false)
      }
    }

    checkRefeshToken()
  }, [])


  const login = (token) => {
    console.log('Login called with token:', token);
    setAccessToken(token)
    setIsAuthenticated(true)
    console.log('isAuthenticated set to true');
    navigate('/dashboard')
  }

  const logout = () => {
    setAccessToken('')
    setIsAuthenticated(false)
    navigate('/')
  }

  const getAccessToken = () => accessToken

  const renewAccessToken = async () => {
    try {
      const response = await fetch(`${API_URL}/refresh`, {
        method: 'POST',
        credentials: 'include'
      })

      if(response.ok) {
        const data = await response.json()
        setAccessToken(data.token)
      } else {
        console.error('Error al renovar el token')
        logout()
      }

    }catch(error){
      console.error('Error al renovar el token', error)
      logout()
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, getAccessToken, renewAccessToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)