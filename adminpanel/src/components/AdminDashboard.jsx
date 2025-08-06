import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const { token } = useAdminAuth();

  useEffect(() => {
    if (!token) return; // Don't call API if no token

    axios
      .get('http://localhost:1833/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) {
          setStats(res.data.stats);
        }
      })
      .catch((err) => console.error('Error loading stats:', err));
  }, [token]);

  if (!stats) return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center backdrop-blur-sm">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-300 text-lg">Loading stats...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-6 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto mt-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mx-auto"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-700/50 border border-gray-600/50 p-6 rounded-lg text-center hover:bg-gray-700/70 transition-all duration-200 backdrop-blur-sm group">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-1a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-300 mb-2">Users</h2>
            <p className="text-4xl font-bold text-white">{stats.users}</p>
          </div>

          <div className="bg-gray-700/50 border border-gray-600/50 p-6 rounded-lg text-center hover:bg-gray-700/70 transition-all duration-200 backdrop-blur-sm group">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-300 mb-2">Trips</h2>
            <p className="text-4xl font-bold text-white">{stats.trips}</p>
          </div>

          <div className="bg-gray-700/50 border border-gray-600/50 p-6 rounded-lg text-center hover:bg-gray-700/70 transition-all duration-200 backdrop-blur-sm group">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-300 mb-2">Activities</h2>
            <p className="text-4xl font-bold text-white">{stats.activities}</p>
          </div>
        </div>
      </div>
    </div>
  );
}