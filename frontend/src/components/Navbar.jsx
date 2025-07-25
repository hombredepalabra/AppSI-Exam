import { useAuth } from '../Context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Sesión cerrada')
    navigate('/login')
  }

  const getRoleText = (role) => {
    const roles = {
      admin: 'Administrador',
      operador: 'Operador',
      usuario: 'Usuario',
      auditor: 'Auditor'
    }
    return roles[role] || role
  }

  const getNavLinks = () => {
    const links = []
    
    switch (user?.rol) {
      case 'admin':
        links.push(
          { path: '/admin', label: 'Panel Admin' },
          { path: '/users', label: 'Usuarios' },
          { path: '/dashboard', label: 'Dashboard' }
        )
        break
      case 'operador':
        links.push(
          { path: '/operador', label: 'Panel Operador' },
          { path: '/dashboard', label: 'Dashboard' }
        )
        break
      case 'usuario':
        links.push(
          { path: '/usuario', label: 'Mi Panel' }
        )
        break
      case 'auditor':
        links.push(
          { path: '/auditor', label: 'Panel Auditor' },
          { path: '/dashboard', label: 'Dashboard' }
        )
        break
    }
    
    return links
  }

  return (
    <nav className="bg-gray-800 shadow-lg text-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Título */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-white">
              Sistema de Administración
            </Link>
          </div>

          {/* Links de navegación */}
          <div className="hidden md:flex items-center space-x-4">
            {getNavLinks().map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Usuario y logout */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-300">
              <span className="font-medium">{user?.nombre}</span>
              <span className="ml-2 px-2 py-1 bg-blue-800 text-blue-100 rounded-full text-xs">
                {getRoleText(user?.rol)}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden pb-4">
          <div className="flex flex-col space-y-2">
            {getNavLinks().map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}