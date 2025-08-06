import React, { useState } from 'react';

export default function Sidebar() {
  const [activeLink, setActiveLink] = useState('/admin/dashboard');

  const handleLogout = () => {
    alert('Logged out successfully!');
  };

  const handleNavClick = (path) => {
    setActiveLink(path);
  };

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 min-h-screen text-white p-6 flex flex-col border-r border-gray-700/50 backdrop-blur-sm">
      {/* Logo/Header */}
      <div className="mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-center text-white">Admin Portal</h2>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mx-auto mt-3"></div>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => handleNavClick('/admin/dashboard')}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group w-full text-left ${
                activeLink === '/admin/dashboard'
                  ? 'bg-gray-700/70 border border-gray-600/50 font-semibold text-white shadow-lg' 
                  : 'hover:bg-gray-700/50 hover:border border-transparent hover:border-gray-600/30 text-gray-300'
              }`}
            >
              <svg className="w-5 h-5 mr-3 transition-colors group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavClick('/admin/users')}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group w-full text-left ${
                activeLink === '/admin/users'
                  ? 'bg-gray-700/70 border border-gray-600/50 font-semibold text-white shadow-lg' 
                  : 'hover:bg-gray-700/50 hover:border border-transparent hover:border-gray-600/30 text-gray-300'
              }`}
            >
              <svg className="w-5 h-5 mr-3 transition-colors group-hover:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-1a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              Users
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavClick('/admin/trips')}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group w-full text-left ${
                activeLink === '/admin/trips'
                  ? 'bg-gray-700/70 border border-gray-600/50 font-semibold text-white shadow-lg' 
                  : 'hover:bg-gray-700/50 hover:border border-transparent hover:border-gray-600/30 text-gray-300'
              }`}
            >
              <svg className="w-5 h-5 mr-3 transition-colors group-hover:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Trips
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavClick('/admin/activities')}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group w-full text-left ${
                activeLink === '/admin/activities'
                  ? 'bg-gray-700/70 border border-gray-600/50 font-semibold text-white shadow-lg' 
                  : 'hover:bg-gray-700/50 hover:border border-transparent hover:border-gray-600/30 text-gray-300'
              }`}
            >
              <svg className="w-5 h-5 mr-3 transition-colors group-hover:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Activities
            </button>
          </li>
        </ul>
      </nav>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent my-6"></div>

      {/* Logout Button */}
      <div>
        <button
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-4 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}