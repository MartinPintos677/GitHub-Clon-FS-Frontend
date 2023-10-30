import { Routes, Route, Navigate } from 'react-router-dom'
import Default from './Pages/Default'
import UserHome from './Pages/Home'
import UserList from './Pages/PageUsersList'
import SelectedUser from './Pages/PageSelectedUser'
import ReposList from './Pages/PageReposList'
import { useAuth } from './Auth/AuthContext'
import './App.css'

function App() {
  const { state } = useAuth()

  const isTokenExpired = () => {
    const tokenCreationTime = localStorage.getItem('tokenCreationTime')
    if (tokenCreationTime) {
      const currentTime = new Date().getTime()
      const timeElapsed = (currentTime - parseInt(tokenCreationTime)) / 1000 // Convertir a segundos
      return timeElapsed >= 3600 // 3600 segundos = 1 hora
    }
    return false // No hay tiempo de creación de token en localStorage
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          !state.isLoggedIn || isTokenExpired() ? <Default /> : <UserHome />
        }
      />

      <Route
        path="/user/:username"
        element={
          state.isLoggedIn && !isTokenExpired() ? (
            <UserHome />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/user/:username/userslist"
        element={
          state.isLoggedIn && !isTokenExpired() ? (
            <UserList />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/user/:username/userslist/:id"
        element={
          state.isLoggedIn && !isTokenExpired() ? (
            <SelectedUser />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/user/:username/reposlist"
        element={
          state.isLoggedIn && !isTokenExpired() ? (
            <ReposList />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  )
}

export default App
