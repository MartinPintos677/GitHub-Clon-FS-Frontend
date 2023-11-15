import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUserGroup,
  faHouseUser,
  faDatabase
} from '@fortawesome/free-solid-svg-icons'
import RepoModal from './RepoModal'
import Header from '../Components/Header'
import axios from 'axios'
import { format } from 'date-fns'
import '../Css/User.css'
import '../Css/InputSearch.css'
import { useParams } from 'react-router-dom'
import { useAuth } from '../Auth/AuthContext'

type Repo = {
  id: number
  name: string
  description: string
}

const SelectedUser = () => {
  const { username } = useParams()
  const [userDetails, setUserDetails] = useState<any>(null)
  const [userRepos, setUserRepos] = useState<any[]>([])
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('') // Agregamos un estado para la consulta de búsqueda
  const navigate = useNavigate()
  const { state } = useAuth()

  const [userReposOriginal, setUserReposOriginal] = useState<any[]>([])

  useEffect(() => {
    // Realiza una llamada a la API de GitHub para obtener los detalles del usuario seleccionado
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.github.com/users/${username}`
        )
        setUserDetails(response.data)
      } catch (error) {
        console.error('Error fetching user details:', error)
      }
    }

    // Realiza una llamada a la API de GitHub para obtener los repositorios del usuario
    const fetchUserRepos = async () => {
      try {
        const response = await axios.get(
          `https://api.github.com/users/${username}/repos`
        )

        // Ordeno los repositorios por fecha de última actualización (de forma descendente)
        const organizedRepos = response.data.sort((a: any, b: any) =>
          a.pushed_at < b.pushed_at ? 1 : -1
        )
        setUserRepos(organizedRepos)
        setUserReposOriginal(organizedRepos) // Almacena la lista original
      } catch (error) {
        console.error('Error fetching user repositories:', error)
      }
    }

    if (username) {
      fetchUserDetails()
      fetchUserRepos()
    }
  }, [username])

  const handleRepoClick = (repo: Repo) => {
    setSelectedRepo(repo)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedRepo(null)
    setIsModalOpen(false)
  }

  const handleGoToUsers = () => {
    navigate(`/user/${state.username}/userslist`)
  }

  const handleGoToRepositories = () => {
    navigate(`/user/${state.username}/reposlist`)
  }

  const handleGoToAuth = () => {
    navigate(`/user/${state.username}/userslistbd`)
  }

  const handleGoToHome = () => {
    // Redirige a la ruta '/user/${state.username}'
    navigate(`/user/${state.username}`)
  }

  // Agregamos una función para manejar la búsqueda en tiempo real
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value
    setSearchQuery(text)

    // Si el campo de búsqueda está vacío, mostrar todos los repositorios nuevamente
    if (text === '') {
      setUserRepos(userReposOriginal) // Restaura la lista original de repositorios
    } else {
      // Filtrar repositorios en función del valor del campo de búsqueda
      const filteredRepos = userReposOriginal.filter(repo =>
        repo.name.toLowerCase().includes(text.toLowerCase())
      )
      setUserRepos(filteredRepos)
    }
  }

  return (
    <div>
      <Header />
      <div className="full-user-container">
        <div className="user-container">
          {userDetails && (
            <div className="user-profile">
              <img
                src={userDetails.avatar_url}
                alt={`Avatar de ${userDetails.login}`}
                className="avatar-user"
              />
              <h2 className="name-user">{userDetails.name}</h2>
              <p className="username-user">{userDetails.login}</p>
              <p className="bio-user">{userDetails.bio}</p>
              <div className="stats">
                <div className="user-group-icon">
                  <FontAwesomeIcon icon={faUserGroup} className="" />
                </div>
                <div className="followers">
                  Seguidores
                  <span className="count-user">
                    {' '}
                    {userDetails.followers}
                  </span>{' '}
                </div>
                <div className="following">
                  Siguiendo
                  <span className="count-user">
                    {' '}
                    {userDetails.following}
                  </span>{' '}
                </div>
              </div>
              <hr className="text-light" />
              <div className="btn-container">
                <button className="btn-clear" onClick={handleGoToUsers}>
                  Buscar usuarios
                </button>
                <br />
                <button className="btn-back" onClick={handleGoToRepositories}>
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
          )}
        </div>

        <div className="user-repos">
          <div className="repo-user-container">
            <h3 className="">Repositorios de {username}</h3>

            <div className="search-panels">
              <div className="search-group">
                <input
                  type="text"
                  name="text"
                  autoComplete="on"
                  className="input"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <label className="enter-label">Buscador</label>
                <div className="btn-box"></div>
              </div>
            </div>
          </div>
          {userRepos.length > 0 ? (
            <ul>
              <hr className="mt-4" />
              {userRepos.map((repo: any) => (
                <li key={repo.id}>
                  <div
                    className="repo-name"
                    onClick={() => handleRepoClick(repo)}
                  >
                    {repo.name}
                  </div>
                  {repo.description && (
                    <div className="repo-description">{repo.description}</div>
                  )}
                  <div className="repo-details">
                    {repo.language && <div>{repo.language}</div>}
                    <div>
                      Última actualización:{' '}
                      {format(new Date(repo.pushed_at), 'dd/MM/yyyy HH:mm')}
                    </div>
                  </div>
                  <hr className="mt-4" />
                </li>
              ))}
            </ul>
          ) : userDetails && userDetails.public_repos === 0 ? (
            <h3 className="text-light mt-5 no-repositories">
              Usuario sin repositorios.
            </h3>
          ) : (
            // Agrega un mensaje de "Ningún repositorio encontrado" si no hay repositorios
            <h4 className="text-light no-repositories">
              {searchQuery === ''
                ? 'Cargando repositorios...'
                : 'Ningún repositorio encontrado con el nombre indicado.'}
            </h4>
          )}
        </div>
      </div>
      {isModalOpen && (
        <RepoModal repo={selectedRepo} onClose={handleCloseModal} />
      )}
    </div>
  )
}

export default SelectedUser
