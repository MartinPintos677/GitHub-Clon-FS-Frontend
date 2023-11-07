import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../Auth/AuthContext'

interface SearchRepository {
  _id: string
  search: string
}

const RepositoryList: React.FC = () => {
  const [searches, setSearches] = useState<SearchRepository[]>([])
  const { state } = useAuth()

  useEffect(() => {
    const fetchSearches = async () => {
      try {
        const response = await axios.get<SearchRepository[]>(
          'http://localhost:3000/searchrepos',
          {
            headers: {
              Authorization: `${state.token}`
            }
          }
        )
        setSearches(response.data)
      } catch (error) {
        console.error('Error al obtener las búsquedas de repositorios', error)
      }
    }

    fetchSearches()
  }, [state.token])

  const handleDeleteSearch = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/searchrepos/${id}`, {
        headers: {
          Authorization: `${state.token}`
        }
      })
      // Actualiza la lista de búsquedas después de eliminar
      const updatedSearches = searches.filter(search => search._id !== id)
      setSearches(updatedSearches)
    } catch (error) {
      console.error('Error al eliminar la búsqueda de repositorios', error)
    }
  }

  return (
    <div>
      <h1 className="text-light">Lista de Repositorios Buscados</h1>
      <ul className="text-light">
        {searches.map(search => (
          <li key={search._id}>
            <Link to={`/repository-details/${search._id}`}>
              {search.search}
            </Link>
            <button onClick={() => handleDeleteSearch(search._id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RepositoryList
