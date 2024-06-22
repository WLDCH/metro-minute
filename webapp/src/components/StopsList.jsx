import React from 'react';

const StopsList = ({ stops, handleStopSelection, hasFetched }) => {
  return (
    <div>
      {hasFetched && stops.length === 0 && <p>No stops available</p>}
      {stops.length > 0 && (
        <select onChange={handleStopSelection}>
          <option value="">Choisissez un arrêt</option>
          {stops.map((stop, index) => (
            <option key={index} value={stop}>{stop}</option>
          ))}
        </select>
      )}
    </div>
  );
};

export default StopsList;
