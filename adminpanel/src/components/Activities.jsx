import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchActivities = () => {
    axios.get('http://localhost:1833/api/admin/activities')
      .then(res => {
        if (res.data.success) setActivities(res.data.activities);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;

    setDeletingId(id);
    axios.delete(`http://localhost:1833/api/admin/activities/${id}`)
      .then(res => {
        if (res.data.success) {
          setActivities(prev => prev.filter(act => act.id !== id));
        }
      })
      .catch(console.error)
      .finally(() => setDeletingId(null));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Activities</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trip ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activities.map(act => (
                <tr key={act.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{act.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{act.trip_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{act.activity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{act.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{act.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{act.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{act.estimated_cost}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(act.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                      disabled={deletingId === act.id}
                    >
                      {deletingId === act.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
              {activities.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">No activities found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
