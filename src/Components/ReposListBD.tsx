import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTrashCan,
  faHouseUser,
  faDatabase
} from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Header from '../Components/Header'
import { useAuth } from '../Auth/AuthContext'
import '../Css/ReposListBD.css'

// Agregar BTN de Usuarios Buscados

interface SearchRepository {
  _id: string
  search: string
}

const RepositoryList: React.FC = () => {
  const [searches, setSearches] = useState<SearchRepository[]>([])
  const { state } = useAuth()
  const navigate = useNavigate()

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

  const handleGoToUsersBD = () => {
    navigate(`/user/${state.username}/userslistbd`)
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
              <button className="btn-back" onClick={handleGoToHome}>
                <FontAwesomeIcon icon={faHouseUser} className="" />
              </button>
            </div>
          </div>
        </div>

        {searches.length > 0 ? (
          <div className="repos-list-bd">
            <h1 className="fs-3">Lista de Repositorios Buscados</h1>
            <div className="line-h2"></div>
            <ul className="list-repos-searched">
              {searches.map(search => (
                <li key={search._id}>
                  <Link
                    to={`/user/${state.username}/reposlistbd/${search._id}`}
                    className="repos-list-bd-a"
                  >
                    {search.search}
                  </Link>
                  <button
                    className="ms-4 btn-delete"
                    onClick={() => handleDeleteSearch(search._id)}
                  >
                    <FontAwesomeIcon icon={faTrashCan} className="" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="repos-list-bd">
            <h1 className="fs-3">Ninguna búsqueda encontrada</h1>
            <div className="line-h2"></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RepositoryList
