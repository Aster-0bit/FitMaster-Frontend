import { useContext, createContext, useState, useEffect } from 'react'
import { API_URL } from './constants'
const AuthContext = createContext({
  isAuthenticated: false,
  getAccessToken: () => '',
  saveUser: () => { },
  getRefreshToken: () => '',
  checkAuth: () => { },
})

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [accessToken, setAccessToken] = useState('')
  // const [refreshToken, setRefreshToken] = useState('')

  useEffect(() => {
    checkAuth();
  }, []);

  async function requestNewAccessToken(refreshToken) {
    try {
      const response = await fetch(`${API_URL}/login/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()

        return data.accessToken
      } else {
        throw new Error('Error al solicitar un nuevo token')
      }
    } catch (error) {
      console.error('Error al solicitar un nuevo token', error)
      return null
    }
  }

  // async function getUserInfo()

  async function checkAuth() {
    if (accessToken) {
      setIsAuthenticated(true)
      setAccessToken(accessToken)

    } else {
      const token = getRefreshToken()
      if (token) {
        const newAccessToken = await requestNewAccessToken(token)
        if (newAccessToken) {
          saveUser({ accessToken: newAccessToken, refreshToken: token })
        }
      }
    }
  }



  function getAccessToken() {
    return accessToken
  }

  function getRefreshToken() {
    const token = localStorage.getItem('token');
    if (token) {
      const parsedToken = JSON.parse(token);
      return parsedToken;
    }

    return null;
  }

  function saveUser(userData) {
    
    setAccessToken(userData.accessToken)
    // setRefreshToken(userData.refreshToken)

    localStorage.setItem('token', JSON.stringify(userData.refreshToken))
    setIsAuthenticated(true)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, getAccessToken, saveUser, getRefreshToken, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)