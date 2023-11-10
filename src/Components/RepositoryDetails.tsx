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
  faTrashCan
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

  return (
    <div>
      <Header />
      <div className="repos-list-bd-container">
        <div className="input-container">
          <div className="search-panels">
            <div className="btn-container-bd">
              <button className="btn-clear" onClick={handleGoToUsers}>
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
              <button className="btn-back" onClick={handleGoToHome}>
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
              <p>Comentario: {repositoryData.comment}</p>
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
              <button
                className="ms-3 btn-delete-details"
                onClick={handleDeleteRepository}
              >
                <FontAwesomeIcon
                  icon={faTrashCan}
                  style={{ marginRight: '7px' }}
                />
                Eliminar búsqueda
              </button>
              {detailsVisible ? (
                <div>
                  <h4 className="mt-3">Detalles adicionales:</h4>
                  {repositoryData.reposlist.map((repo, index) => (
                    <div key={index} className="mt-3">
                      <h5>Repositorio {index + 1}</h5>
                      <p className="mt-3">Nombre: {repo.name}</p>
                      <p>Usuario: {repo.user}</p>
                      <p>Descripción: {repo.description}</p>
                      <p>Tecnología: {repo.language}</p>
                      <p>
                        Fecha de creación:{' '}
                        {repo.created_at
                          ? format(
                              new Date(repo.created_at),
                              'dd/MM/yyyy HH:mm'
                            )
                          : 'Fecha no disponible'}
                      </p>
                      <p>
                        Última actualización:{' '}
                        {repo.pushed_at
                          ? format(new Date(repo.pushed_at), 'dd/MM/yyyy HH:mm')
                          : 'Fecha no disponible'}
                      </p>
                      <p className="mb-4">URL: {repo.url}</p>
                      <hr className="mt-4 text-light" />
                    </div>
                  ))}
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
