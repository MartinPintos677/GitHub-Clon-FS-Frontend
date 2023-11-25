import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../Components/Header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHouseUser,
  faPenToSquare,
  faArrowDown,
  faArrowUp,
  faTrashCan,
  faCircleArrowLeft,
  faDatabase
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../Auth/AuthContext'
import axios from 'axios'
import '../Css/RepoDetails.css'

interface User {
  _id: string
  search: string
  user: {
    username: string
  }
  usersList: [
    {
      username: string
      avatar: string
      url: string
    }
  ]
  comment: string
  createdAt: string
  updatedAt: string
}

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { state } = useAuth()
  const [userData, setUserData] = useState<User | null>(null)
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const usersPerPage = 10

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/searchuser/${id}`,
          {
            headers: {
              Authorization: `${state.token}`
            }
          }
        )
        //console.log(response.data)
        setUserData(response.data)
      } catch (error) {
        console.error('Error al obtener los detalles del usuario', error)
      }
    }

    fetchUserData()
  }, [id])

  const handleAddOrUpdateComment = async () => {
    try {
      const currentDate = new Date() // Obtiene la fecha actual

      await axios.patch(
        `http://localhost:3000/searchuser/${id}`,
        { comment: newComment, updatedAt: currentDate.toISOString() },
        {
          headers: {
            Authorization: `${state.token}`
          }
        }
      )
      // Actualiza el comentario y la fecha en el estado
      if (userData) {
        const updatedUserData = {
          ...userData,
          comment: newComment,
          updatedAt: currentDate.toISOString()
        }
        setUserData(updatedUserData)
      }
      setNewComment('') // Limpia el campo de entrada
    } catch (error) {
      console.error('Error al agregar o actualizar el comentario', error)
    }
  }

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`http://localhost:3000/searchuser/${id}`, {
        headers: {
          Authorization: `${state.token}`
        }
      })
      navigate(`/user/${state.username}/userslistbd`)
    } catch (error) {
      console.error('Error al eliminar el usuario', error)
    }
  }

  const handleGoToUsers = () => {
    navigate(`/user/${state.username}/userslist`)
  }

  const handleGoToHome = () => {
    navigate(`/user/${state.username}`)
  }

  const handleGoToRepos = () => {
    navigate(`/user/${state.username}/reposlist`)
  }

  const handleGoToBackUsers = () => {
    navigate(`/user/${state.username}/userslistbd`)
  }

  const handleGoToReposBD = () => {
    navigate(`/user/${state.username}/reposlistbd`)
  }

  const indexOfLastRepository = currentPage * usersPerPage
  const indexOfFirstRepository = indexOfLastRepository - usersPerPage

  const currentRepositories = userData
    ? userData.usersList.slice(indexOfFirstRepository, indexOfLastRepository)
    : []

  const totalPages = userData
    ? Math.ceil((userData.usersList.length || 0) / usersPerPage)
    : 0

  return (
    <div>
      <Header />
      <div className="repos-details-bd-container">
        <div className="input-container">
          <div className="search-panels">
            <div className="btn-container-bd">
              <button className="btn-clear" onClick={handleGoToReposBD}>
                <FontAwesomeIcon
                  icon={faDatabase}
                  style={{ marginRight: '7px' }}
                />
                Repositorios buscados
              </button>
              <br />
              <button className="btn-clear" onClick={handleGoToUsers}>
                Buscar usuarios
              </button>
              <br />
              <button className="btn-clear" onClick={handleGoToRepos}>
                Buscar repositorios
              </button>
              <br />
              <button className="btn-back" onClick={handleGoToBackUsers}>
                <FontAwesomeIcon icon={faCircleArrowLeft} className="" />
              </button>
              <button className="btn-back ms-4" onClick={handleGoToHome}>
                <FontAwesomeIcon icon={faHouseUser} className="" />
              </button>
            </div>
          </div>
        </div>

        <div className="repos-details-bd">
          {userData ? (
            <div className="">
              <h3 className="mb-3">Búsqueda realizada: {userData.search}</h3>
              <div className="line-h2"></div>
              <p className="mt-3">Usuario: {userData.user.username}</p>
              <p>
                Fecha de creación:{' '}
                {userData.createdAt
                  ? format(new Date(userData.createdAt), 'dd/MM/yyyy HH:mm')
                  : 'Fecha no disponible'}
              </p>
              <p>
                Última actualización:{' '}
                {userData.updatedAt
                  ? format(new Date(userData.updatedAt), 'dd/MM/yyyy HH:mm')
                  : 'Fecha no disponible'}
              </p>
              <p>Usuarios encontrados: {userData.usersList.length}</p>
              {userData.comment && <p>Comentario: {userData.comment}</p>}
              {/* Campo de entrada para el comentario */}
              <input
                className="repo-details-input"
                type="text"
                placeholder="Agregar / Editar Comentario"
                maxLength={50}
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    handleAddOrUpdateComment()
                  }
                }}
              />
              {/* Botón para agregar o editar el comentario */}
              <button
                className="mb-3 btn-comment-repos"
                onClick={handleAddOrUpdateComment}
              >
                <FontAwesomeIcon icon={faPenToSquare} />
              </button>
              <br />

              <div className="btn-update-delete">
                {userData.usersList.length > 0 ? (
                  <button
                    className="btn-show-details"
                    onClick={() => setDetailsVisible(!detailsVisible)}
                  >
                    {detailsVisible ? (
                      <>
                        <FontAwesomeIcon icon={faArrowUp} /> Ocultar detalles
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faArrowDown} /> Mostrar detalles
                      </>
                    )}
                  </button>
                ) : null}

                <button
                  className="btn-delete-details"
                  onClick={handleDeleteUser}
                >
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    style={{ marginRight: '7px' }}
                  />
                  Eliminar búsqueda
                </button>
              </div>

              {detailsVisible ? (
                <div>
                  <h4 className="mt-3">Detalles adicionales:</h4>
                  {currentRepositories.map((user, index) => (
                    <div key={index} className="mt-3">
                      <h5>
                        Usuario {(currentPage - 1) * usersPerPage + index + 1}
                      </h5>
                      <div className="d-flex">
                        <img
                          src={user.avatar}
                          alt="Avatar"
                          className="avatar-image-details mt-3"
                        />
                        <p className="username-details ms-4 fs-5">
                          {user.username}
                        </p>
                      </div>
                      <hr className="mt-3 text-light" />
                    </div>
                  ))}

                  <div className="pagination-repos-details mt-4">
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
              ) : null}
            </div>
          ) : (
            <p>Cargando detalles del usuario...</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDetails
