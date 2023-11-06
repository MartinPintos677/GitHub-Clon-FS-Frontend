import React from 'react'
import { useAuth } from '../Auth/AuthContext'

import '../Css/RepoModal.css'

// Definir un tipo para las props
type RepoModalProps = {
  repoState: any
  onClose: () => void // Esta función no recibe argumentos y no devuelve nada (void)
}

const UserStateRepoModal: React.FC<RepoModalProps> = ({ onClose }) => {
  const { state } = useAuth()

  return (
    <div className="repo-modal">
      <div className="repo-modal-content">
        <h2 className="repo-name-modal">
          Repositorio para el curso de Full Stack
        </h2>
        <div className="line-modal"></div>
        <p>Usuario: {state.username}</p>
        <p>Descripción: Mi primer proyecto en GitHub</p>
        <p>Tecnología: Typescript</p>
        <p>Fecha de creación: 10/08/2023 12:00</p>
        <p>Última actualización: 20/09/2023 16:00</p>
        <p>URL: https://github.com/{state.username}/Repo-Full-Stack</p>
        <button className="btn-modal mt-2" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  )
}

export default UserStateRepoModal
