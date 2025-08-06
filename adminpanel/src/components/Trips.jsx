import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = () => {
    setLoading(true);
    axios.get('http://localhost:1833/api/admin/trips')
      .then(res => {
        if (res.data.success) setTrips(res.data.trips);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;

    axios.delete(`http://localhost:1833/api/admin/trips/${id}`)
      .then(res => {
        if (res.data.success) {
          alert('Trip deleted');
          fetchTrips();
        }
      })
      .catch(() => alert('Failed to delete trip'));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Trips</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trips.map(trip => (
                <tr key={trip.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{trip.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{trip.user_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{trip.destination}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{trip.start_date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{trip.end_date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{trip.budget}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleDelete(trip.id)}
                      className="text-red-600 hover:text-red-900 font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {trips.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No trips found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
  