import React from 'react';

const StopsList = ({ stops, handleStopSelection, hasFetched }) => (
  <div id="stops-list">
    {hasFetched && stops.length === 0 ? (
      <p>No stops available</p>
    ) : (
      stops.length > 0 && (
        <select onChange={handleStopSelection}>
          <option value="" disabled selected>Choisissez un arrêt</option>
          {stops.sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' })).map((stop, index) => (
            <option key={index} value={stop}>{stop}</option>
          ))}
        </select>
      )
    )}
  </div>
);

export default StopsList;
