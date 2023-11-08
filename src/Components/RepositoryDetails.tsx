import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../Auth/AuthContext'
import axios from 'axios'

interface RepositoryDetailsProps {
  // Agrega cualquier prop que necesites para el componente
  search: string
  user: string
  description: string
  language: string
  comment: string
  url: string
  createdAt: string
  updatedAt: string
}

const RepositoryDetails: React.FC<RepositoryDetailsProps> = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { state } = useAuth()
  const [repositoryData, setRepositoryData] = useState<any>({})

  useEffect(() => {
    const fetchRepositoryData = async () => {
      try {
        // Realiza una solicitud al backend para obtener los detalles del repositorio por su ID
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
      // Realiza una solicitud al backend para eliminar el repositorio por su ID
      await axios.delete(`http://localhost:3000/searchrepos/${id}`, {
        headers: {
          Authorization: `${state.token}`
        }
      })
      navigate(`/user/${state.username}/reposlistbd`) // Redirige a la lista de repositorios después de eliminar
    } catch (error) {
      console.error('Error al eliminar el repositorio', error)
    }
  }

  return (
    <div>
      <h1 className="text-light">Detalles del Repositorio Buscado</h1>
      <div className="text-light">
        <h2>Nombre del repositorio: {repositoryData.search}</h2>
        <p>Usuario: {repositoryData.user?.username}</p>
        <p>Descripción: {repositoryData.description}</p>
        <p>Tecnología: {repositoryData.language}</p>
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
        <p>URL: {repositoryData.url}</p>
        <p>Comentario: {repositoryData.comment}</p>
        {/* Agrega más detalles del repositorio según tu modelo de datos */}
      </div>
      <button onClick={handleDeleteRepository}>Eliminar Repositorio</button>
    </div>
  )
}

export default RepositoryDetails
