import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Auth/AuthContext'
import axios from 'axios'
import '../Css/GitLogin.css'

const LoginForm = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('MichiCat')
  const [password, setPassword] = useState('123')
  const [error, setError] = useState('')

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()

    if (username && password) {
      try {
        const response = await axios.post('http://localhost:3000/user/login', {
          username: username,
          password: password
        })
        // console.log('Login response:', response)

        if (response.status === 200) {
          const token = response.data.token
          login(username, token)
          navigate(`/user/${username}`)
        } else {
          setError('Credenciales incorrectas')
          console.error('Error de inicio de sesión')
        }
      } catch (error) {
        setError('Credenciales incorrectas')
        console.error('Error de red:', error)
      }
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin} method="post">
        <div className="">
          <FontAwesomeIcon icon={faGithub} className="github-logo-login" />
        </div>
        <h2>Iniciar Sesión en GitHub</h2>
        {error && <p className="alert alert-danger fs-5">{error}</p>}
        <div className="line-h2"></div>
        <div className="input-container-login">
          <label className="input-container-label" htmlFor="username">
            Nombre de Usuario
          </label>
          <input
            className="input-container-label"
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            maxLength={18}
          />
        </div>
        <div className="input-container-login">
          <label className="input-container-label-pass" htmlFor="password">
            Contraseña
          </label>
          <input
            className="input-container-label"
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            maxLength={18}
          />
        </div>

        <button className="btn-login" type="submit">
          Iniciar Sesión
        </button>
      </form>
    </div>
  )
}

export default LoginForm
