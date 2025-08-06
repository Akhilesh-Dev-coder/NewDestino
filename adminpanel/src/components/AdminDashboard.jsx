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

  if (!stats) return <p className="text-center mt-20 text-lg">Loading stats...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-12">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-blue-100 p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <p className="text-4xl font-bold">{stats.users}</p>
        </div>
        <div className="bg-green-100 p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold mb-2">Trips</h2>
          <p className="text-4xl font-bold">{stats.trips}</p>
        </div>
        <div className="bg-red-100 p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold mb-2">Activities</h2>
          <p className="text-4xl font-bold">{stats.activities}</p>
        </div>
      </div>
    </div>
  );
}
