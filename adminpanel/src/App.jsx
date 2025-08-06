// App.jsx
import React, { useState } from 'react';
import Map from './pages/Map';
import LocationInput from './pages/LocationInput';

const App = () => {
  const [coords, setCoords] = useState([51.505, -0.09]); // Default to London
  const [locationName, setLocationName] = useState('London');

  const handleLocationFound = (newCoords, name) => {
    setCoords(newCoords);
    setLocationName(name);
  };

  return (
    <div>
      <h1>Travel Planner</h1>
      <LocationInput onLocationFound={handleLocationFound} />
      <Map coords={coords} locationName={locationName} />
    </div>
  );
};

export default App;
