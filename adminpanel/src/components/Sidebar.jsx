import React from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useNavigate, NavLink } from 'react-router-dom';

export default function Sidebar() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="w-64 bg-gray-800 min-h-screen text-white p-4 flex flex-col">
      <nav className="flex-1">
        <ul>
          <li className="mb-4">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `block px-4 py-2 rounded hover:bg-gray-700 transition ${
                  isActive ? 'bg-gray-700 font-bold' : ''
                }`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li className="mb-4">
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `block px-4 py-2 rounded hover:bg-gray-700 transition ${
                  isActive ? 'bg-gray-700 font-bold' : ''
                }`
              }
            >
              Users
            </NavLink>
          </li>
          <li className="mb-4">
            <NavLink
              to="/admin/trips"
              className={({ isActive }) =>
                `block px-4 py-2 rounded hover:bg-gray-700 transition ${
                  isActive ? 'bg-gray-700 font-bold' : ''
                }`
              }
            >
              Trips
            </NavLink>
          </li>
          <li className="mb-4">
            <NavLink
              to="/admin/activities"
              className={({ isActive }) =>
                `block px-4 py-2 rounded hover:bg-gray-700 transition ${
                  isActive ? 'bg-gray-700 font-bold' : ''
                }`
              }
            >
              Activities
            </NavLink>
          </li>
        </ul>
      </nav>

      <div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
