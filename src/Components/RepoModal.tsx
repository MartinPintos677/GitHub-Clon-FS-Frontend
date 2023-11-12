//import { GitHubRepository } from './ReposList'
import { format } from 'date-fns'
import '../Css/RepoModal.css'

// Definir un tipo para las props
type RepoModalProps = {
  repo: any
  onClose: () => void // Esta función no recibe argumentos y no devuelve nada (void)
}

const RepoModal: React.FC<RepoModalProps> = ({ repo, onClose }) => {
  return (
    <div className="repo-modal">
      <div className="repo-modal-content">
        <h2 className="repo-name-modal">{repo.name}</h2>
        <div className="line-modal"></div>
        <p>Usuario: {repo.user ? repo.user : repo.owner.login}</p>
        {repo.description && <p>Descripción: {repo.description}</p>}
        {repo.language && <p>Tecnología: {repo.language}</p>}
        <p>
          Fecha de creación:{' '}
          {format(new Date(repo.created_at), 'dd/MM/yyyy HH:mm')}
        </p>
        <p>
          Última actualización:{' '}
          {format(new Date(repo.pushed_at), 'dd/MM/yyyy HH:mm')}
        </p>
        <p>URL: {repo.url}</p>
        <button className="btn-modal mt-2" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  )
}

export default RepoModal
