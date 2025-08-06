// LocationInput.jsx
import React, { useState } from 'react';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

const LocationInput = ({ onLocationFound }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    const provider = new OpenStreetMapProvider();

    try {
      const results = await provider.search({ query });
      if (results.length > 0) {
        const { x: lng, y: lat, label } = results[0];
        onLocationFound([lat, lng], label);
      } else {
        setError('Location not found');
      }
    } catch (err) {
      setError('Error searching location');
    }
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Enter a city or place"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">Search</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default LocationInput;
