import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import '../Css/RepoModal.css'

// Definir un tipo para las props
type RepoModalProps = {
  repo: any
  onClose: () => void // Esta función no recibe argumentos y no devuelve nada (void)
}

const RepoModal: React.FC<RepoModalProps> = ({ repo, onClose }) => {
  const [languages, setLanguages] = useState<string[]>([])

  useEffect(() => {
    // Realizar la solicitud a la URL de las tecnologías del repositorio
    if (repo.languages_url) {
      axios
        .get(repo.languages_url)
        .then(response => {
          // Obtener los nombres de las tecnologías y convertirlas en un array
          const languageNames = Object.keys(response.data)
          setLanguages(languageNames)
        })
        .catch(error => console.error('Error al obtener los lenguajes:', error))
    }
  }, [repo.languages_url])

  return (
    <div className="repo-modal">
      <div className="repo-modal-content">
        <h2 className="repo-name-modal">{repo.name}</h2>
        <div className="line-modal"></div>
        <p>Usuario: {repo.owner.login}</p>
        {repo.description && <p>Descripción: {repo.description}</p>}
        {repo.language && <p>Tecnologías: {languages.join(', ')}</p>}
        <p>
          Fecha de creación:{' '}
          {format(new Date(repo.created_at), 'dd/MM/yyyy HH:mm')}
        </p>
        <p>
          Última actualización:{' '}
          {format(new Date(repo.pushed_at), 'dd/MM/yyyy HH:mm')}
        </p>
        <p>URL: {repo.html_url}</p>
        <button className="btn-modal mt-2" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  )
}

export default RepoModal
