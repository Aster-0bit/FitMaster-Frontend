import { useContext, createContext, useState, useEffect } from 'react'
import { API_URL } from './constants'
import { ProgressSpinner } from 'primereact/progressspinner'

const AuthContext = createContext({
  isAuthenticated: false,
  getAccessToken: () => '',
  saveUser: () => { },
  getRefreshToken: () => '',
  checkAuth: () => { },
  logout: () => { },
})

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [accessToken, setAccessToken] = useState('')
  const [isLoading, setIsLoading] = useState(true)

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

  function logout() {
    setAccessToken('');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  }

  async function checkAuth() {
    const token = getRefreshToken();
    if (token) {
      const newAccessToken = await requestNewAccessToken(token);
      if (newAccessToken) {
        saveUser({ accessToken: newAccessToken, refreshToken: token });
      }
    }
    setIsLoading(false);
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
    localStorage.setItem('token', JSON.stringify(userData.refreshToken))
    setIsAuthenticated(true)
  }

  if (isLoading) {
    return <div className="spinner-container"><ProgressSpinner /></div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, getAccessToken, saveUser, getRefreshToken, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
