import React, { useEffect, useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';

// Mock axios for demonstration
const axios = {
  get: (url) => Promise.resolve({
    data: {
      success: true,
      trips: [
        {
          id: 1,
          user_id: 101,
          destination: "Paris, France",
          start_date: "2024-03-15",
          end_date: "2024-03-22",
          budget: "$2,500"
        },
        {
          id: 2,
          user_id: 102,
          destination: "Tokyo, Japan",
          start_date: "2024-04-10",
          end_date: "2024-04-18",
          budget: "$3,200"
        },
        {
          id: 3,
          user_id: 103,
          destination: "New York, USA",
          start_date: "2024-05-01",
          end_date: "2024-05-07",
          budget: "$1,800"
        }
      ]
    }
  }),
  delete: (url) => Promise.resolve({ data: { success: true } })
};

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

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

    setDeleting(id);
    axios.delete(`http://localhost:1833/api/admin/trips/${id}`)
      .then(res => {
        if (res.data.success) {
          alert('Trip deleted');
          fetchTrips();
        }
      })
      .catch(() => alert('Failed to delete trip'))
      .finally(() => setDeleting(null));
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Trips Management</h2>
          <p className="text-gray-400">Manage and monitor all travel bookings</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400 mr-3" />
            <span className="text-gray-300 text-lg">Loading trips...</span>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-750">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Trip ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      User ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Destination
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {trips.map((trip, index) => (
                    <tr 
                      key={trip.id} 
                      className="hover:bg-gray-750 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-blue-400">#{trip.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-300">{trip.user_id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-white">{trip.destination}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-300">{trip.start_date}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-300">{trip.end_date}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-green-400">{trip.budget}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleDelete(trip.id)}
                          disabled={deleting === trip.id}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deleting === trip.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {trips.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                            <span className="text-gray-400 text-xl">📋</span>
                          </div>
                          <h3 className="text-lg font-medium text-gray-300 mb-2">No trips found</h3>
                          <p className="text-gray-500">Get started by creating your first trip.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}