import { useState } from 'react'
import Header from '../Components/Header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouseUser } from '@fortawesome/free-solid-svg-icons'
import RepoModal from './RepoModal'
import axios from 'axios'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import '../Css/UsersList.css'
import '../Css/ReposList.css'
import '../Css/InputSearch.css'
import { useAuth } from '../Auth/AuthContext'

type GitHubRepository = {
  language: string
  name: string
  description: string
  html_url: string
  pushed_at: string
}

const GitHubRepos = () => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [repositories, setRepositories] = useState<GitHubRepository[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [hasSearched, setHasSearched] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepository | null>(
    null
  )
  const repositoriesPerPage = 10
  const navigate = useNavigate()
  const { state } = useAuth()

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://api.github.com/search/repositories?q=${searchQuery}&per_page=100`
      )

      setRepositories([])

      setRepositories(response.data.items)
      setCurrentPage(1)
      setHasSearched(true)
    } catch (error) {
      console.error('Error fetching GitHub repositories:', error)
    }
  }

  const handleClearSearch = () => {
    setSearchQuery('') // Limpia el campo de búsqueda
    setRepositories([]) // Limpia la lista de repositorios encontrados
    setHasSearched(false)
  }

  const handleGoToUsers = () => {
    navigate(`/user/${state.username}/userslist`)
  }

  const handleGoToHome = () => {
    // Redirige a la ruta '/user/${state.username}'
    navigate(`/user/${state.username}`)
  }

  // Función para abrir el modal
  const handleOpenModal = (repo: GitHubRepository) => {
    setSelectedRepo(repo)
    setIsModalOpen(true)
  }

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRepo(null)
  }

  // Calcular el índice inicial y final de los repositorios a mostrar en la página actual
  const indexOfLastRepository = currentPage * repositoriesPerPage
  const indexOfFirstRepository = indexOfLastRepository - repositoriesPerPage
  const currentRepositories = repositories.slice(
    indexOfFirstRepository,
    indexOfLastRepository
  )

  // Calcular el número total de páginas
  const totalPages = Math.ceil(repositories.length / repositoriesPerPage)

  // Determina el mensaje del encabezado en función del número de repositorios encontrados
  let headerMessage = ''
  if (hasSearched) {
    if (repositories.length === 1) {
      headerMessage = 'Resultados de la búsqueda: (1 repositorio)'
    } else if (repositories.length > 1) {
      headerMessage = `Resultados de la búsqueda: (${repositories.length} repositorios)`
    } else {
      headerMessage = 'Ningún repositorio con el nombre indicado.'
    }
  } else {
    headerMessage = 'Buscador de repositorios'
  }

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
              <label className="enter-label">Buscar repositorios</label>
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
              <button className="btn-clear" onClick={handleGoToUsers}>
                Buscar usuarios
              </button>
              <br />
              <button className="btn-back" onClick={handleGoToHome}>
                <FontAwesomeIcon icon={faHouseUser} className="" />
              </button>
            </div>
          </div>
        </div>

        <div className="repos-container">
          <div className="repos-list">
            <h2>{headerMessage}</h2>
            <ul>
              {currentRepositories.map((repository, index) => (
                <li key={index} className="user-repos-list">
                  <div
                    className="repo-name"
                    onClick={() => handleOpenModal(repository)}
                  >
                    {repository.name}
                  </div>
                  {repository.description && (
                    <div className="repo-description">
                      {repository.description}
                    </div>
                  )}
                  <div className="repo-details">
                    {repository.language && <div>{repository.language}</div>}
                    <div>
                      Última actualización:{' '}
                      {format(
                        new Date(repository.pushed_at),
                        'dd/MM/yyyy HH:mm'
                      )}
                    </div>
                  </div>
                  <hr className="mt-4 text-light" />
                </li>
              ))}
            </ul>
          </div>
          {/* Agrega la paginación aquí, similar a la versión anterior */}
          <div className="pagination-repos mb-3 mt-4">
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
        {/* Renderiza el modal */}
        {isModalOpen && selectedRepo && (
          <RepoModal repo={selectedRepo} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  )
}

export default GitHubRepos
