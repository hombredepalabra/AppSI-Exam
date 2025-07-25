import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import DeleteModal from '../components/DeleteModal'
import { usersApi } from '../Services/api'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null })
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'usuario'
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async (q = '') => {
    try {
      const response = await usersApi.getAll(q)
      setUsers(response.data)
    } catch {
      toast.error('Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const userData = { ...formData }
      if (editingUser && !userData.password) {
        delete userData.password
      }
      if (editingUser) {
        await usersApi.update(editingUser.id, userData)
        toast.success('Usuario actualizado')
      } else {
        await usersApi.create(userData)
        toast.success('Usuario creado')
      }
      setEditingUser(null)
      setFormData({ nombre: '', email: '', password: '', rol: 'usuario' })
      loadUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar el usuario')
    }
  }

  const handleDelete = async (id) => {
    try {
      await usersApi.delete(id)
      toast.success('Usuario eliminado')
      loadUsers()
      setDeleteModal({ show: false, id: null })
    } catch {
      toast.error('Error al eliminar el usuario')
    }
  }

  const startEdit = (user) => {
    setEditingUser(user)
    setFormData({
      nombre: user.nombre,
      email: user.email,
      password: '',
      rol: user.rol
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o email"
            className="px-3 py-2 rounded-md bg-gray-700 border-gray-600 text-gray-100 flex-1"
          />
          <button
            onClick={() => {
              setLoading(true)
              loadUsers(search)
            }}
            className="px-4 py-2 bg-indigo-600 rounded text-white"
          >
            Buscar
          </button>
          <button
            onClick={() => {
              setSearch('')
              setLoading(true)
              loadUsers()
            }}
            className="px-4 py-2 bg-gray-600 rounded text-white"
          >
            Limpiar
          </button>
        </div>

        {/* Formulario */}
        <div className="bg-gray-800 shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">
            {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium">
                  Contraseña{' '}
                  {editingUser && <span className="text-gray-400">(dejar vacío para no cambiar)</span>}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Rol</label>
                <select
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100"
                >
                  <option value="usuario">Usuario</option>
                  <option value="operador">Operador</option>
                  <option value="auditor">Auditor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              {editingUser && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingUser(null)
                    setFormData({ nombre: '', email: '', password: '', rol: 'usuario' })
                  }}
                  className="px-4 py-2 bg-gray-700 rounded text-gray-300"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 rounded text-white"
              >
                {editingUser ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>

        {/* Tabla de usuarios */}
        <div className="bg-gray-800 shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Creado</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 text-sm">{u.id}</td>
                  <td className="px-6 py-4 text-sm">{u.nombre}</td>
                  <td className="px-6 py-4 text-sm">{u.email}</td>
                  <td className="px-6 py-4 text-sm capitalize">{u.rol}</td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(u.createdAt).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 text-right text-sm space-x-4">
                    <button
                      onClick={() => startEdit(u)}
                      className="text-indigo-400 hover:text-indigo-200"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setDeleteModal({ show: true, id: u.id })}
                      className="text-red-400 hover:text-red-200"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteModal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, id: null })}
        onConfirm={() => handleDelete(deleteModal.id)}
        title="Eliminar usuario"
        message="¿Estás seguro? Esta acción no se puede deshacer."
      />
    </div>
  )
}
