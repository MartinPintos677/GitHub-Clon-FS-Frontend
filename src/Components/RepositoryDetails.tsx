import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

interface RepositoryDetailsProps {
  // Agrega cualquier prop que necesites para el componente
}

const RepositoryDetails: React.FC<RepositoryDetailsProps> = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [repositoryData, setRepositoryData] = useState<any>({})

  useEffect(() => {
    const fetchRepositoryData = async () => {
      try {
        // Realiza una solicitud al backend para obtener los detalles del repositorio por su ID
        const response = await axios.get(`/repository/${id}`)
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
      await axios.delete(`/repository/${id}`)
      navigate('/repository-list') // Redirige a la lista de repositorios después de eliminar
    } catch (error) {
      console.error('Error al eliminar el repositorio', error)
    }
  }

  return (
    <div>
      <h1>Detalles del Repositorio</h1>
      <div>
        <h2>Nombre del repositorio: {repositoryData.name}</h2>
        <p>Descripción: {repositoryData.description}</p>
        {/* Agrega más detalles del repositorio según tu modelo de datos */}
      </div>
      <button onClick={handleDeleteRepository}>Eliminar Repositorio</button>
    </div>
  )
}

export default RepositoryDetails
