import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../Auth/AuthContext'
import axios from 'axios'

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
  const [newComment, setNewComment] = useState('') // Nuevo estado para el comentario

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

  const handleAddOrUpdateComment = async () => {
    try {
      const currentDate = new Date() // Obtiene la fecha actual

      const response = await axios.patch(
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
      console.log('Comentario actualizado:', response.data)
    } catch (error) {
      console.error('Error al agregar o actualizar el comentario', error)
    }
  }

  return (
    <div>
      <h1 className="text-light">Detalles del Repositorio Buscado</h1>
      {repositoryData ? (
        <div className="text-light">
          <h2>Nombre del repositorio: {repositoryData.search}</h2>
          <p>Usuario: {repositoryData.user.username}</p>
          <p>
            Fecha de creación:{' '}
            {repositoryData.createdAt
              ? format(new Date(repositoryData.createdAt), 'dd/MM/yyyy HH:mm')
              : 'Fecha no disponible'}
          </p>
          <p>
            Última actualización:{' '}
            {repositoryData.updatedAt
              ? format(new Date(repositoryData.updatedAt), 'dd/MM/yyyy HH:mm')
              : 'Fecha no disponible'}
          </p>
          <p>Comentario: {repositoryData.comment}</p>
          {/* Campo de entrada para el comentario */}
          <input
            type="text"
            placeholder="Comentar"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
          />
          {/* Botón para agregar o editar el comentario */}
          <button className="mb-3" onClick={handleAddOrUpdateComment}>
            Agregar/Editar Comentario
          </button>
          <br />
          <button onClick={() => setDetailsVisible(!detailsVisible)}>
            {detailsVisible ? 'Ocultar detalles' : 'Mostrar detalles'}
          </button>
          <button onClick={handleDeleteRepository}>Eliminar Repositorio</button>
          {detailsVisible ? (
            <div>
              <h4 className="mt-3">Detalles adicionales:</h4>
              {repositoryData.reposlist.map((repo, index) => (
                <div key={index} className="mt-3">
                  <h5>Repositorio {index + 1}:</h5>
                  <p className="mt-3">Nombre: {repo.name}</p>
                  <p>Usuario: {repo.user}</p>
                  <p>Descripción: {repo.description}</p>
                  <p>Lenguaje: {repo.language}</p>
                  <p>
                    Fecha de creación:{' '}
                    {repo.created_at
                      ? format(new Date(repo.created_at), 'dd/MM/yyyy HH:mm')
                      : 'Fecha no disponible'}
                  </p>
                  <p>
                    Última actualización:{' '}
                    {repo.pushed_at
                      ? format(new Date(repo.pushed_at), 'dd/MM/yyyy HH:mm')
                      : 'Fecha no disponible'}
                  </p>
                  <p className="mb-4">URL: {repo.url}</p>
                  <div className="line-h2 mb-4"></div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <p>Cargando detalles del repositorio...</p>
      )}
    </div>
  )
}

export default RepositoryDetails
