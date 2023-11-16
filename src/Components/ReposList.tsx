import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouseUser, faDatabase } from '@fortawesome/free-solid-svg-icons'
import { format } from 'date-fns'
import Header from '../Components/Header'
import RepoModal from './RepoModal'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../Css/UsersList.css'
import '../Css/ReposList.css'
import '../Css/InputSearch.css'
import { useAuth } from '../Auth/AuthContext'

type GitHubRepository = {
  name: string
  user: string
  description: string
  language: string
  url: string
  created_at: string
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
  const [headerMessage, setHeaderMessage] = useState('Buscador de repositorios')
  const [isLoading, setIsLoading] = useState(false)
  const repositoriesPerPage = 10
  const navigate = useNavigate()
  const { state } = useAuth()

  useEffect(() => {
    if (hasSearched) {
      // Verificar la longitud de repositories y establecer headerMessage aquí
      if (repositories.length === 1) {
        setHeaderMessage('Resultados de la búsqueda: (1 repositorio)')
      } else if (repositories.length > 1) {
        setHeaderMessage(
          `Resultados de la búsqueda: (${repositories.length} repositorios)`
        )
      } else {
        setHeaderMessage('Ningún repositorio con el nombre indicado.')
      }
    } else {
      setHeaderMessage('Buscador de repositorios')
    }
  }, [hasSearched, repositories])

  const fetchRepositories = async () => {
    if (searchQuery.trim() !== '') {
      setIsLoading(true) // Iniciar la carga

      try {
        const response = await axios.post(
          'http://localhost:3000/searchrepos',
          { searchTerm: searchQuery },
          {
            headers: {
              Authorization: `${state.token}`
            }
          }
        )
        // console.log('GitHub API response:', response.data)

        // Verifica si 'response.data.reposlist' contiene los datos de los repositorios.
        const repositoriesData = response.data.reposlist || []

        // Actualiza 'currentRepositories' con los datos de los repositorios.
        setRepositories(repositoriesData)

        setCurrentPage(1)
        setHasSearched(true)
      } catch (error) {
        console.error('Error fetching repositories:', error)
      } finally {
        setIsLoading(false) // Detener la carga después de la búsqueda
      }
    }
  }

  const handleSearch = () => {
    // Realizar una búsqueda solo si se ha proporcionado un término de búsqueda
    if (searchQuery.trim() !== '') {
      // Mostrar un indicador de carga
      setRepositories([]) // Reiniciar los resultados
      fetchRepositories()
    }
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setRepositories([])
    setHasSearched(false)
  }

  const handleGoToUsers = () => {
    navigate(`/user/${state.username}/userslist`)
  }

  const handleGoToHome = () => {
    navigate(`/user/${state.username}`)
  }

  const handleGoToAuth = () => {
    navigate(`/user/${state.username}/reposlistbd`)
  }

  const handleOpenModal = (repo: GitHubRepository) => {
    console.log('handleOpenModal called')
    setSelectedRepo(repo)
    console.log('Selected Repo:', selectedRepo)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRepo(null)
  }

  const indexOfLastRepository = currentPage * repositoriesPerPage
  const indexOfFirstRepository = indexOfLastRepository - repositoriesPerPage

  const currentRepositories = repositories.slice(
    indexOfFirstRepository,
    indexOfLastRepository
  )

  const totalPages = Math.ceil(repositories.length / repositoriesPerPage)

  //console.log('Repositories data:', currentRepositories)

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

        <div className="repos-container">
          <div className="repos-list">
            <h2>{hasSearched ? headerMessage : 'Buscador de repositorios'}</h2>
            {isLoading ? (
              <p className="loading-repos">Cargando repositorios...</p>
            ) : hasSearched ? (
              currentRepositories.length > 0 ? (
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
                        {repository.language && (
                          <div>{repository.language}</div>
                        )}
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
              ) : null
            ) : null}
          </div>
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
        {isModalOpen && selectedRepo && (
          <RepoModal repo={selectedRepo} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  )
}

export default GitHubRepos
