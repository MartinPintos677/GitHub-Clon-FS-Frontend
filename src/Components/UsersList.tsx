import { useState, useEffect } from 'react'
import Header from '../Components/Header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouseUser, faDatabase } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import '../Css/UsersList.css'
import '../Css/InputSearch.css'
import { useAuth } from '../Auth/AuthContext'

type GitHubUser = {
  username: string
  avatar: string
}

const GitHubUsers = () => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [users, setUsers] = useState<GitHubUser[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [hasSearched, setHasSearched] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const [headerMessage, setHeaderMessage] = useState('Buscador de usuarios')
  const usersPerPage = 10
  const navigate = useNavigate()
  const { state } = useAuth()

  useEffect(() => {
    if (hasSearched) {
      if (users.length === 1) {
        setHeaderMessage('Resultados de la búsqueda: (1 usuario)')
      } else if (users.length > 1) {
        setHeaderMessage(
          `Resultados de la búsqueda: (${users.length} usuarios)`
        )
      } else {
        setHeaderMessage('Ningún usuario con el nombre indicado.')
      }
    } else {
      setHeaderMessage('Buscador de usuarios')
    }
  }, [hasSearched, users])

  const handleSearch = async () => {
    if (searchQuery.trim() !== '') {
      setIsLoading(true) // Iniciar la carga

      try {
        const response = await axios.post(
          'http://localhost:3000/searchuser',
          { searchTerm: searchQuery },
          {
            headers: {
              Authorization: `${state.token}`
            }
          }
        )

        const searchData = response.data || {}

        const usersData = searchData.usersList || []

        setUsers(usersData)
        setCurrentPage(1)
        setHasSearched(true)
      } catch (error) {
        console.error('Error fetching GitHub users:', error)
      } finally {
        setIsLoading(false) // Detener la carga después de la búsqueda
      }
    }
  }

  const handleClearSearch = () => {
    setSearchQuery('') // Limpia el campo de búsqueda
    setUsers([]) // Limpia la lista de usuarios encontrados
    setHasSearched(false)
  }

  const handleGoToRepos = () => {
    navigate(`/user/${state.username}/reposlist`)
  }

  const handleGoToHome = () => {
    navigate(`/user/${state.username}`)
  }

  const handleGoToAuth = () => {
    navigate(`/user/${state.username}/userslistbd`)
  }

  // Calcular el índice inicial y final de los usuarios a mostrar en la página actual
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser)

  // Calcular el número total de páginas
  const totalPages = Math.ceil(users.length / usersPerPage)

  return (
    <div>
      <Header />
      <div className="list-users-container">
        <div className="input-container">
          <div className="search-panels">
            <div className="search-group">
              <input
                required
                type="text"
                name="text"
                autoComplete="on"
                className="input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    handleSearch()
                  }
                }}
              />
              <label className="enter-label">Buscar usuarios</label>
              <div className="btn-box">
                <button className="btn-search" onClick={handleSearch}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 512 512"
                  >
                    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
                    <circle id="svg-circle" cx="208" cy="208" r="144"></circle>
                  </svg>
                </button>
              </div>
            </div>
            <div className="btn-container">
              <button className="btn-clear" onClick={handleClearSearch}>
                Limpiar búsqueda
              </button>
              <br />
              <button className="btn-clear" onClick={handleGoToRepos}>
                Buscar repositorios
              </button>
              <br />
              <button className="btn-back" onClick={handleGoToAuth}>
                <FontAwesomeIcon
                  icon={faDatabase}
                  style={{ marginRight: '7px' }}
                />
                Base de datos
              </button>
              <br />
              <button className="btn-back" onClick={handleGoToHome}>
                <FontAwesomeIcon icon={faHouseUser} className="" />
              </button>
            </div>
          </div>
        </div>

        <div className="users-container">
          <div className="user-list">
            <h2>{hasSearched ? headerMessage : 'Buscador de usuarios'}</h2>
            {isLoading ? (
              <p className="loading-repos">Cargando usuarios...</p>
            ) : hasSearched ? (
              currentUsers.length > 0 ? (
                <ul>
                  {currentUsers.map(user => (
                    <Link
                      to={`/user/${user.username}/userslist/${user.username}`}
                      target="_blank"
                    >
                      <li
                        key={user.username}
                        className="d-grid justify-content-center align-items-center mb-4"
                      >
                        <img
                          className="mb-2"
                          src={user.avatar}
                          alt={`${user.username}'s avatar`}
                        />

                        {user.username}
                      </li>
                    </Link>
                  ))}
                </ul>
              ) : null
            ) : null}
          </div>
          {/* Agrega la paginación aquí */}
          <div className="pagination mb-3">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={currentPage === index + 1 ? 'active' : ''}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GitHubUsers
