import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FaSearch,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaShieldAlt,
  FaToggleOn,
  FaToggleOff,
  FaTrash,
  FaEdit,
  FaArrowLeft,
  FaArrowRight
} from 'react-icons/fa'
import AdminSidebar from '../../../components/Dashboard/admin/AdminSidebar'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [editingUser, setEditingUser] = useState(null)
  const [editForm, setEditForm] = useState(null)
  const [editError, setEditError] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)
  const usersPerPage = 10

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleUserStatus = async (id, currentStatus) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) return

    try {
      const res = await fetch(`/api/admin/users/${id}/toggle`, {
        method: 'PATCH',
        credentials: 'include'
      })
      const data = await res.json()
      if (data.success) {
        setUsers(users.map(user => 
          user.id === id ? { ...user, is_active: !user.is_active } : user
        ))
      }
    } catch (error) {
      console.error('Error toggling user status:', error)
    }
  }

  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      const data = await res.json()
      if (data.success) {
        setUsers(users.filter(user => user.id !== id))
      }
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const openEditUser = (user) => {
    setEditingUser(user)
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      phone_number: user.phone_number || '',
      role: user.role || 'customer',
      is_active: user.is_active !== false
    })
    setEditError('')
  }

  const updateUser = async (event) => {
    event.preventDefault()
    setSavingEdit(true)
    setEditError('')

    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editForm)
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update user')
      }
      setUsers(users.map(user => user.id === editingUser.id
        ? { ...user, ...data.user }
        : user
      ))
      setEditingUser(null)
    } catch (error) {
      setEditError(error.message)
    } finally {
      setSavingEdit(false)
    }
  }

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage)

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage all registered users
            </p>
          </div>
          <div className="mt-3 sm:mt-0 text-sm text-gray-500">
            Total: {filteredUsers.length} users
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Phone</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Joined</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Orders</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                            {user.name?.charAt(0) || 'U'}
                          </div>
                          <span className="font-medium">{user.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4 text-gray-600">{user.phone_number || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.role || 'customer'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.is_active !== false
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {user.is_active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">{user.order_count || 0}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleUserStatus(user.id, user.is_active !== false)}
                            className="text-gray-500 hover:text-black transition"
                            title={user.is_active !== false ? 'Deactivate' : 'Activate'}
                          >
                            {user.is_active !== false ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                          </button>
                          <Link
                            to="#edit-user"
                            onClick={(event) => {
                              event.preventDefault()
                              openEditUser(user)
                            }}
                            className="text-gray-500 hover:text-black transition"
                            title="Edit user"
                          >
                            <FaEdit size={18} />
                          </Link>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            <FaTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              <FaArrowLeft size={14} /> Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Next <FaArrowRight size={14} />
            </button>
          </div>
        )}

        {editingUser && editForm && (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4">
            <form onSubmit={updateUser} className="w-full max-w-lg bg-white rounded-xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Edit user</h2>
                  <p className="text-sm text-gray-500 mt-1">Update account details and access.</p>
                </div>
                <button type="button" onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-black text-2xl" aria-label="Close edit user dialog">×</button>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                  <input value={editForm.name} onChange={(event) => setEditForm({ ...editForm, name: event.target.value })} className="mt-1 w-full p-2.5 border border-gray-200 rounded-lg" required />
                </label>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                  <input type="email" value={editForm.email} onChange={(event) => setEditForm({ ...editForm, email: event.target.value })} className="mt-1 w-full p-2.5 border border-gray-200 rounded-lg" required />
                </label>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                  <input value={editForm.phone_number} onChange={(event) => setEditForm({ ...editForm, phone_number: event.target.value })} className="mt-1 w-full p-2.5 border border-gray-200 rounded-lg" />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                    <select value={editForm.role} onChange={(event) => setEditForm({ ...editForm, role: event.target.value })} className="mt-1 w-full p-2.5 border border-gray-200 rounded-lg">
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </label>
                  <label className="flex items-center gap-2 self-end pb-3 text-sm font-medium text-gray-700">
                    <input type="checkbox" checked={editForm.is_active} onChange={(event) => setEditForm({ ...editForm, is_active: event.target.checked })} />
                    Active account
                  </label>
                </div>
              </div>

              {editError && <p className="text-sm text-red-600 mt-4">{editError}</p>}
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 border border-gray-200 rounded-lg hover:border-black">Cancel</button>
                <button type="submit" disabled={savingEdit} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50">{savingEdit ? 'Saving...' : 'Save changes'}</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}