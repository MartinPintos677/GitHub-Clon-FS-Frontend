import React, { createContext, useContext, useReducer, Dispatch } from 'react'

// Define el tipo de estado y las acciones
type AuthState = {
  isLoggedIn: boolean
  username: string
  token: string | null
  tokenCreationTime: number | null // Agregar la fecha de creación del token al estado
}

type AuthAction =
  | { type: 'LOGIN'; payload: { username: string; token: string } }
  | { type: 'LOGOUT' }

// Define el contexto de autenticación
interface AuthContextType {
  state: AuthState
  dispatch: Dispatch<AuthAction>
  login: (username: string, token: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider')
  }
  return context
}

// Define el tipo para children
interface AuthProviderProps {
  children: React.ReactNode
}

// Define el componente AuthProvider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Recupera los datos de autenticación de localStorage si están disponibles
  const localStorageIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  const localStorageUsername = localStorage.getItem('username') || ''
  const localStorageToken = localStorage.getItem('token') || null
  const localStorageTokenCreationTime =
    localStorage.getItem('tokenCreationTime') || null

  const initialState: AuthState = {
    isLoggedIn: localStorageIsLoggedIn,
    username: localStorageUsername,
    token: localStorageToken,
    tokenCreationTime: localStorageTokenCreationTime
      ? parseInt(localStorageTokenCreationTime)
      : null // Agregar la fecha de creación del token
  }

  const [state, dispatch] = useReducer(
    (prevState: AuthState, action: AuthAction) => {
      switch (action.type) {
        case 'LOGIN':
          const tokenCreationTime = new Date().getTime() // Timestamp en milisegundos
          localStorage.setItem('isLoggedIn', 'true')
          localStorage.setItem('username', action.payload.username)
          localStorage.setItem('token', action.payload.token)
          localStorage.setItem(
            'tokenCreationTime',
            tokenCreationTime.toString()
          ) // Almacenar la fecha de creación del token
          return {
            ...prevState,
            isLoggedIn: true,
            username: action.payload.username,
            token: action.payload.token,
            tokenCreationTime: tokenCreationTime
          }
        case 'LOGOUT':
          localStorage.removeItem('isLoggedIn')
          localStorage.removeItem('username')
          localStorage.removeItem('token')
          localStorage.removeItem('tokenCreationTime') // Eliminar la fecha de creación del token
          return {
            ...prevState,
            isLoggedIn: false,
            username: '',
            token: null,
            tokenCreationTime: null // Establecer la fecha de creación del token como nula
          }
        default:
          return prevState
      }
    },
    initialState
  )

  // Define la función 'login' que puedes utilizar para iniciar sesión
  const login = (username: string, token: string) => {
    dispatch({ type: 'LOGIN', payload: { username, token } })
  }

  return (
    <AuthContext.Provider value={{ state, dispatch, login }}>
      {children}
    </AuthContext.Provider>
  )
}
