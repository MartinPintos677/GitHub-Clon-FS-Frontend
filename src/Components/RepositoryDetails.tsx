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

interface Repository {
  _id: string
  search: string
  user: {
    username: string
  }
  reposlist: [
    {
      name: string
      user: string
      description: string
      language: string
      url: string
      created_at: string
      pushed_at: string
    }
  ]
  comment: string
  createdAt: string
  updatedAt: string
}

const RepositoryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { state } = useAuth()
  const [repositoryData, setRepositoryData] = useState<Repository | null>(null)
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const repositoriesPerPage = 10

  useEffect(() => {
    const fetchRepositoryData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/searchrepos/${id}`,
          {
            headers: {
              Authorization: `${state.token}`
            }
          }
        )
        setRepositoryData(response.data)
      } catch (error) {
        console.error('Error al obtener los detalles del repositorio', error)
      }
    }

    fetchRepositoryData()
  }, [id])

  const handleAddOrUpdateComment = async () => {
    try {
      const currentDate = new Date() // Obtiene la fecha actual

      await axios.patch(
        `http://localhost:3000/searchrepos/${id}`,
        { comment: newComment, updatedAt: currentDate.toISOString() },
        {
          headers: {
            Authorization: `${state.token}`
          }
        }
      )
      // Actualiza el comentario y la fecha en el estado
      if (repositoryData) {
        const updatedRepositoryData = {
          ...repositoryData,
          comment: newComment,
          updatedAt: currentDate.toISOString()
        }
        setRepositoryData(updatedRepositoryData)
      }
      setNewComment('') // Limpia el campo de entrada
      //console.log('Comentario actualizado:', response.data)
    } catch (error) {
      console.error('Error al agregar o actualizar el comentario', error)
    }
  }

  const handleDeleteRepository = async () => {
    try {
      await axios.delete(`http://localhost:3000/searchrepos/${id}`, {
        headers: {
          Authorization: `${state.token}`
        }
      })
      navigate(`/user/${state.username}/reposlistbd`)
    } catch (error) {
      console.error('Error al eliminar el repositorio', error)
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
    navigate(`/user/${state.username}/reposlistbd`)
  }

  const handleGoToUsersBD = () => {
    navigate(`/user/${state.username}/userslistbd`)
  }

  const indexOfLastRepository = currentPage * repositoriesPerPage
  const indexOfFirstRepository = indexOfLastRepository - repositoriesPerPage

  const currentRepositories = repositoryData
    ? repositoryData.reposlist.slice(
        indexOfFirstRepository,
        indexOfLastRepository
      )
    : []

  const totalPages = repositoryData
    ? Math.ceil((repositoryData.reposlist.length || 0) / repositoriesPerPage)
    : 0

  return (
    <div>
      <Header />
      <div className="repos-details-bd-container">
        <div className="input-container">
          <div className="search-panels">
            <div className="btn-container-bd">
              <button className="btn-clear" onClick={handleGoToUsersBD}>
                <FontAwesomeIcon
                  icon={faDatabase}
                  style={{ marginRight: '7px' }}
                />
                Usuarios buscados
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
          {repositoryData ? (
            <div className="">
              <h3 className="mb-3">
                Búsqueda realizada: {repositoryData.search}
              </h3>
              <div className="line-h2"></div>
              <p className="mt-3">Usuario: {repositoryData.user.username}</p>
              <p>
                Fecha de creación:{' '}
                {repositoryData.createdAt
                  ? format(
                      new Date(repositoryData.createdAt),
                      'dd/MM/yyyy HH:mm'
                    )
                  : 'Fecha no disponible'}
              </p>
              <p>
                Última actualización:{' '}
                {repositoryData.updatedAt
                  ? format(
                      new Date(repositoryData.updatedAt),
                      'dd/MM/yyyy HH:mm'
                    )
                  : 'Fecha no disponible'}
              </p>
              <p>Repositorios encontrados: {repositoryData.reposlist.length}</p>
              {repositoryData.comment && (
                <p>Comentario: {repositoryData.comment}</p>
              )}
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
                {repositoryData.reposlist.length > 0 ? (
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
                  onClick={handleDeleteRepository}
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
                  {currentRepositories.map((repo, index) => (
                    <div key={index} className="mt-3">
                      <h5>
                        Repositorio{' '}
                        {(currentPage - 1) * repositoriesPerPage + index + 1}
                      </h5>
                      <p className="mt-3">Nombre: {repo.name}</p>
                      <p>Usuario: {repo.user}</p>
                      {repo.description && (
                        <p>Descripción: {repo.description}</p>
                      )}
                      {repo.language && <p>Tecnología: {repo.language}</p>}
                      <p>
                        Fecha de creación:{' '}
                        {repo.created_at
                          ? format(
                              new Date(repo.created_at),
                              'dd/MM/yyyy HH:mm'
                            )
                          : 'Fecha no disponible'}
                      </p>
                      <p className="mb-4">
                        Última actualización:{' '}
                        {repo.pushed_at
                          ? format(new Date(repo.pushed_at), 'dd/MM/yyyy HH:mm')
                          : 'Fecha no disponible'}
                      </p>

                      <hr className="mt-4 text-light" />
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
            <p>Cargando detalles del repositorio...</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default RepositoryDetails
