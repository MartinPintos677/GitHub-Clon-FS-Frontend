import { Routes, Route, Navigate } from 'react-router-dom'
import Default from './Pages/Default'
import UserHome from './Pages/Home'
import UserList from './Pages/PageUsersList'
import SelectedUser from './Pages/PageSelectedUser'
import ReposList from './Pages/PageReposList'
import ReposListBD from './Components/ReposListBD'
import SelectedRepoBD from './Components/RepositoryDetails'
import { useAuth } from './Auth/AuthContext'
import './App.css'

function App() {
  const { state } = useAuth()

  return (
    <Routes>
      <Route
        path="/"
        element={!state.isLoggedIn ? <Default /> : <UserHome />}
      />

      <Route
        path="/user/:username"
        element={state.isLoggedIn ? <UserHome /> : <Navigate to="/" />}
      />
      <Route
        path="/user/:username/userslist"
        element={state.isLoggedIn ? <UserList /> : <Navigate to="/" />}
      />
      <Route
        path="/user/:username/userslist/:id"
        element={state.isLoggedIn ? <SelectedUser /> : <Navigate to="/" />}
      />
      <Route
        path="/user/:username/reposlist"
        element={state.isLoggedIn ? <ReposList /> : <Navigate to="/" />}
      />
      <Route
        path="/user/:username/reposlistbd"
        element={state.isLoggedIn ? <ReposListBD /> : <Navigate to="/" />}
      />
      <Route
        path="/user/:username/reposlistbd/:id"
        element={
          state.isLoggedIn ? (
            <SelectedRepoBD
              name={''}
              user={''}
              description={''}
              language={''}
              comment={''}
              url={''}
              created_at={''}
              pushed_at={''}
            />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  )
}

export default App
