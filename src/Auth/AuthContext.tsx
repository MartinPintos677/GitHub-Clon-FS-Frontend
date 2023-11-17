import React, { createContext, useContext, useReducer, Dispatch } from 'react'

// Define el tipo de estado y las acciones
type AuthState = {
  isLoggedIn: boolean
  username: string
  token: string | null
}

type AuthAction =
  | { type: 'LOGIN'; payload: { username: string; token: string } }
  | { type: 'LOGOUT' }

// Define el contexto de autenticación
interface AuthContextType {
  state: AuthState
  dispatch: Dispatch<AuthAction>
  login: (username: string, token: string) => void // Modificar la función de inicio de sesión para incluir el token
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
  const localStorageToken = localStorage.getItem('token') || null // Recuperar el token

  const initialState: AuthState = {
    isLoggedIn: localStorageIsLoggedIn,
    username: localStorageUsername,
    token: localStorageToken // Agregar el token al estado inicial
  }

  const [state, dispatch] = useReducer(
    (prevState: AuthState, action: AuthAction) => {
      switch (action.type) {
        case 'LOGIN':
          // Al realizar un inicio de sesión exitoso, también almacena los datos en localStorage
          localStorage.setItem('isLoggedIn', 'true')
          localStorage.setItem('username', action.payload.username)
          localStorage.setItem('token', action.payload.token) // Almacenar el token en localStorage
          return {
            ...prevState,
            isLoggedIn: true,
            username: action.payload.username,
            token: action.payload.token // Agregar el token al estado
          }
        case 'LOGOUT':
          // Cuando se cierra la sesión, también limpia los datos de localStorage
          localStorage.removeItem('isLoggedIn')
          localStorage.removeItem('username')
          localStorage.removeItem('token') // Eliminar el token de localStorage
          return {
            ...prevState,
            isLoggedIn: false,
            username: '',
            token: null // Establecer el token como nulo
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
