import React from 'react';
import { Fade } from "react-awesome-reveal";

const SchedulesList = ({ schedules, formatMinutes, hasFetched }) => {
  return (
    <div>
      <Fade>
        {hasFetched && schedules.length === 0 && <p>Aucun départ actuellement</p>}
        {schedules.map((schedule, index) => (
          <div key={index} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <span>{schedule.destination}</span>
            <span>{formatMinutes(schedule.schedule)} ({schedule.time})</span>
          </div>
        ))}
      </Fade>
    </div>
  );
};

export default SchedulesList;
