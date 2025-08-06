import React, { useEffect, useState } from 'react';
import { UserPlus, Edit3, Trash2, Loader2, X, User } from 'lucide-react';

// Mock axios for demonstration
const axios = {
  get: (url) => Promise.resolve({
    data: {
      success: true,
      users: [
        {
          user_id: 101,
          name: "John Doe",
          email: "john.doe@example.com"
        },
        {
          user_id: 102,
          name: "Jane Smith",
          email: "jane.smith@example.com"
        },
        {
          user_id: 103,
          name: "Mike Johnson",
          email: "mike.johnson@example.com"
        }
      ]
    }
  }),
  post: (url, data) => Promise.resolve({ data: { success: true } }),
  put: (url, data) => Promise.resolve({ data: { success: true } }),
  delete: (url) => Promise.resolve({ data: { success: true } })
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);

  // Modal state
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null for create

  // Form state
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const fetchUsers = () => {
    setLoading(true);
    axios.get('http://localhost:1833/api/admin/users')
      .then(res => {
        if (res.data.success) setUsers(res.data.users);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setForm({ name: '', email: '', password: '' });
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: '' }); // password blank
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSubmitting(false);
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!form.name || !form.email || (!editingUser && !form.password)) {
      alert('Please fill in all required fields');
      return;
    }
    
    setSubmitting(true);

    try {
      if (editingUser) {
        // Edit user
        await axios.put(`http://localhost:1833/api/admin/users/${editingUser.user_id}`, form);
        alert('User updated successfully');
      } else {
        // Create user
        if (!form.password) {
          alert('Password is required for new user');
          setSubmitting(false);
          return;
        }
        await axios.post('http://localhost:1833/api/admin/users', form);
        alert('User created successfully');
      }
      fetchUsers();
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
      setSubmitting(false);
    }
  };

  const handleDelete = (user_id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    setDeleting(user_id);
    axios.delete(`http://localhost:1833/api/admin/users/${user_id}`)
      .then(res => {
        if (res.data.success) {
          alert('User deleted');
          fetchUsers();
        }
      })
      .catch(() => alert('Failed to delete user'))
      .finally(() => setDeleting(null));
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Users Management</h2>
            <p className="text-gray-400">Manage user accounts and permissions</p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Add User
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400 mr-3" />
            <span className="text-gray-300 text-lg">Loading users...</span>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-750">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      User ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {users.map((user) => (
                    <tr 
                      key={user.user_id} 
                      className="hover:bg-gray-750 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-blue-400">#{user.user_id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center mr-3">
                            <User className="w-4 h-4 text-gray-400" />
                          </div>
                          <span className="text-sm font-medium text-white">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-300">{user.email}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/20 rounded-lg transition-all duration-200"
                          >
                            <Edit3 className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user.user_id)}
                            disabled={deleting === user.user_id}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deleting === user.user_id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                            <User className="w-6 h-6 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-300 mb-2">No users found</h3>
                          <p className="text-gray-500">Get started by adding your first user.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/75 z-50 p-4">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter user name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password {editingUser && <span className="text-gray-500 text-xs">(leave blank to keep unchanged)</span>}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder={editingUser ? "Leave blank to keep current password" : "Enter password"}
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        {editingUser ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingUser ? 'Update User' : 'Create User'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}