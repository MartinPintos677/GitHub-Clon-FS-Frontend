import React, { useState, useEffect } from 'react'
import Header from '../Components/Header'
import { useAuth } from '../Auth/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserGroup, faDatabase } from '@fortawesome/free-solid-svg-icons'
import RepoModal from './UserStateModal'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../Css/User.css'

type User = {
  nombre: string
  username: string
  biografia: string
  avatar_url: string
  seguidores: number
  siguiendo: number
}

const User: React.FC = () => {
  const { state } = useAuth()
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null)
  const [userData, setUserData] = useState<User | null>()

  useEffect(() => {
    async function fetchUserData() {
      try {
        //console.log(`${state.token}`)

        const response = await axios.get(
          `http://localhost:3000/user/${state.username}`,
          {
            headers: {
              Authorization: `${state.token}`
            }
          }
        )

        //console.log('Después de la solicitud')
        setUserData(response.data)
      } catch (error) {
        console.error('Error de red:', error)
      }
    }

    fetchUserData()
  }, [state.username, state.token])

  type Repo = {
    name: string
    description: string
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

  const handleRepoClick = () => {
    const repoData: Repo = {
      name: 'Repositorio para el curso de Full Stack',
      description: 'Mi primer proyecto en GitHub'
    }

    setSelectedRepo(repoData)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedRepo(null)
    setIsModalOpen(false)
  }

  return (
    <div>
      <Header />
      <div className="full-user-container">
        <div className="user-profile">
          <img
            src={userData?.avatar_url}
            alt={`Avatar de ${state.username}`}
            className="avatar-user"
          />
          <div className="user-container">
            <h2 className="name-user">{userData?.nombre}</h2>
            <p className="username-user">{userData?.username}</p>
            <p className="bio-user">
              {userData?.biografia || 'Bienvenidos a mi GitHub'}
            </p>
            <div className="stats">
              <div className="user-group-icon">
                <FontAwesomeIcon icon={faUserGroup} className="" />
              </div>
              <div className="followers">
                Seguidores
                <span className="count-user"> {userData?.seguidores}</span>
              </div>
              <div className="following">
                Siguiendo
                <span className="count-user"> {userData?.siguiendo}</span>
              </div>
            </div>
          </div>
          <hr className="text-light" />
          <div className="btn-container">
            <button className="btn-back" onClick={handleGoToUsers}>
              Buscar usuarios
            </button>
            <button className="btn-back" onClick={handleGoToRepositories}>
              Buscar repositorios
            </button>
            <br />
            <button className="btn-back" onClick={handleGoToAuth}>
              <FontAwesomeIcon
                icon={faDatabase}
                style={{ marginRight: '7px' }}
              />{' '}
              Base de datos
            </button>
          </div>
        </div>

        <div className="user-repos">
          <h3>Repositorios de {state.username}</h3>
          <ul>
            <hr className="mt-4" />

            <li>
              <div className="repo-name" onClick={handleRepoClick}>
                Repositorio para el curso de Full Stack
              </div>
              <div className="repo-description">
                Mi primer proyecto en GitHub
              </div>
              <div className="repo-details">
                <div>Typescript</div>
                <div>Última actualización: 10/08/2023 12:00</div>
              </div>
              <hr className="mt-4" />
            </li>
          </ul>
        </div>
      </div>
      {isModalOpen && (
        <RepoModal repoState={selectedRepo} onClose={handleCloseModal} />
      )}
    </div>
  )
}

export default User
