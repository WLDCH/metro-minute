import React from 'react';

const SchedulesList = ({ schedules, formatMinutes, hasFetched }) => (
  <div id="schedules-container">
    {hasFetched && schedules.length === 0 ? (
      <p>Aucun départ actuellement</p>
    ) : (
      schedules.length > 0 && (
        schedules.map((schedule, index) => (
          <div key={index} className="schedule-item">
            <span className="destination">{schedule.destination}</span>
            <span className="time">{`${formatMinutes(parseFloat(schedule.schedule))} (${schedule.time})`}</span>
          </div>
        ))
      )
    )}
  </div>
);

export default SchedulesList;
