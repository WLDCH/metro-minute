import React from 'react';
import { Fade } from "react-awesome-reveal";


const SchedulesList = ({ schedules, formatMinutes, hasFetched }) => {
  return (
    <div>
    <Fade>

      {hasFetched && schedules.length === 0 && <p>Aucun départ actuellement</p>}
      {schedules.map((schedule, index) => (
        <div key={index} className="schedule-item">
          <span className="destination">{schedule.destination}</span>
          <span className="time">{formatMinutes(schedule.schedule)} ({schedule.time})</span>
        </div>
      ))}
      </Fade>

    </div>
  );
};

export default SchedulesList;
