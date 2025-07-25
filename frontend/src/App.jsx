import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './Context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminPanel from './pages/AdminPanel'
import OperatorPanel from './pages/OperatorPanel'
import UserPanel from './pages/UserPanel'
import AuditorPanel from './pages/AuditorPanel'
import UserManagement from './pages/UserManagement'
import Dashboard from './pages/Dashboard'
import { Toaster } from 'react-hot-toast'

function App() {
  const { user, loading } = useAuth()


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <>
      {/* Un único Toaster global, 1 seg de duración */}
      <Toaster toastOptions={{ duration: 1000 }} />

      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" /> : <Register />}
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminPanel />
            </PrivateRoute>
          }
        />
        <Route
          path="/operador"
          element={
            <PrivateRoute role="operador">
              <OperatorPanel />
            </PrivateRoute>
          }
        />
        <Route
          path="/usuario"
          element={
            <PrivateRoute role="usuario">
              <UserPanel />
            </PrivateRoute>
          }
        />
        <Route
          path="/auditor"
          element={
            <PrivateRoute role="auditor">
              <AuditorPanel />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute role="admin">
              <UserManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />

        <Route
          path="*"
          element={
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="mb-4">Página no encontrada</p>
                <a href="/" className="text-blue-500 hover:underline">
                  Volver al inicio
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </>
  )
}

export default App