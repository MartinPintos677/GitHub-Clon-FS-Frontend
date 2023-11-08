import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { useAuth } from '../Auth/AuthContext'
import axios from 'axios'
import '../Css/Header.css'

const Header = () => {
  const { state, dispatch } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleLogout = async () => {
    try {
      // Realiza una solicitud al servidor para cerrar la sesión
      await axios.get('http://localhost:3000/user/logout', {
        headers: {
          Authorization: `${state.token}`
        }
      })

      // Despacha la acción de cierre de sesión
      dispatch({ type: 'LOGOUT' })
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => !prevState)
  }

  const isTokenExpired = () => {
    const tokenCreationTime = localStorage.getItem('tokenCreationTime')
    if (tokenCreationTime) {
      const currentTime = new Date().getTime()
      const timeElapsed = (currentTime - parseInt(tokenCreationTime)) / 1000 // Convertir a segundos
      return timeElapsed >= 3600 // 3600 segundos = 1 hora
    }
    return false // No hay tiempo de creación de token en localStorage
  }

  return (
    <div className="header-full">
      <div className="elements">
        <div className="header-left">
          <FontAwesomeIcon icon={faGithub} className="github-logo" />
          {state.isLoggedIn ? (
            <div className="username-container">
              <div className="username-message" onClick={toggleDropdown}>
                {state.username} &#9660;
              </div>
              {isDropdownOpen && (
                <div className="dropdown-header mb-2">
                  <button className="username-logout" onClick={handleLogout}>
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
        <div>
          <div className="custom-dropdown-two">
            {state.isLoggedIn && !isTokenExpired() ? (
              <div></div>
            ) : (
              <p className="username-message-three">Bienvenidos a GitHub</p>
            )}
          </div>
        </div>
      </div>
      <div className="line-header"></div>
    </div>
  )
}

export default Header
