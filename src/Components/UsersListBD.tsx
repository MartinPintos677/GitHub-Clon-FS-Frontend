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

interface SearchUser {
  _id: string
  search: string
}

const UserList: React.FC = () => {
  const [searches, setSearches] = useState<SearchUser[]>([])
  const { state } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSearches = async () => {
      try {
        const response = await axios.get<SearchUser[]>(
          'http://localhost:3000/searchuser',
          {
            headers: {
              Authorization: `${state.token}`
            }
          }
        )
        setSearches(response.data)
      } catch (error) {
        console.error('Error al obtener las búsquedas de usuarios', error)
      }
    }

    fetchSearches()
  }, [state.token])

  const handleDeleteSearch = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/searchuser/${id}`, {
        headers: {
          Authorization: `${state.token}`
        }
      })
      // Actualiza la lista de búsquedas después de eliminar
      const updatedSearches = searches.filter(search => search._id !== id)
      setSearches(updatedSearches)
    } catch (error) {
      console.error('Error al eliminar la búsqueda de usuarios', error)
    }
  }

  const handleGoToReposSearched = () => {
    navigate(`/user/${state.username}/reposlistbd`)
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
              <button className="btn-clear" onClick={handleGoToReposSearched}>
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
              <button className="btn-back" onClick={handleGoToHome}>
                <FontAwesomeIcon icon={faHouseUser} className="" />
              </button>
            </div>
          </div>
        </div>

        {searches.length > 0 ? (
          <div className="repos-list-bd">
            <h1 className="fs-3">Lista de Usuarios Buscados</h1>
            <div className="line-h2"></div>
            <ul className="list-repos-searched">
              {searches.map(search => (
                <li key={search._id}>
                  <Link
                    to={`/user/${state.username}/userslistbd/${search._id}`}
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

export default UserList
