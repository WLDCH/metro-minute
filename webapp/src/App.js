import React, { useState } from 'react';
import TransportButtons from './components/TransportButtons';
import StopsList from './components/StopsList';
import SchedulesList from './components/SchedulesList';
import './styles.css';

const App = () => {
  const [section, setSection] = useState('horaire');
  const [currentStop, setCurrentStop] = useState('');
  const [currentLine, setCurrentLine] = useState('');
  const [currentType, setCurrentType] = useState('');
  const [stops, setStops] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [stopsFetched, setStopsFetched] = useState(false);
  const [schedulesFetched, setSchedulesFetched] = useState(false);

  const showSection = (sectionId) => {
    setSection(sectionId);
  };

  const formatMinutes = (minutes) => {
    const unit = minutes < 2 ? 'minute' : 'minutes';
    return `${minutes} ${unit}`;
  };

  const loadStopsNames = (line, type) => {
    setStopsFetched(false);
    fetch(`/stops?line=${line}&type=${type}`)
      .then(response => response.json())
      .then(data => {
        setStops(data.stops);
        setCurrentLine(line);
        setCurrentType(type);
        setStopsFetched(true);
      })
      .catch(error => {
        console.error('Error fetching stops:', error);
        setStopsFetched(true);
      });
  };

  const handleStopSelection = (event) => {
    const stop = event.target.value;
    setCurrentStop(stop);
    if (stop) {
      updateSchedules(stop, currentLine, currentType);
    }
  };

  const updateSchedules = (stop, line, type) => {
    setSchedulesFetched(false);
    fetch(`/schedules?stop=${stop}&line=${line}&type=${type}`)
      .then(response => response.json())
      .then(data => {
        if (data.schedules_in_minutes) {
          const sortedSchedules = data.schedules_in_minutes.map((schedule, index) => ({
            schedule,
            destination: data.destination_names[index],
            time: data.schedules_in_time[index]
          })).sort((a, b) => parseFloat(a.schedule) - parseFloat(b.schedule));
          setSchedules(sortedSchedules);
        } else {
          setSchedules([]);
        }
        setSchedulesFetched(true);
      })
      .catch(error => {
        console.error('Error fetching schedules:', error);
        setSchedulesFetched(true);
      });
  };

  const refreshSchedules = () => {
    if (currentStop && currentLine && currentType) {
      updateSchedules(currentStop, currentLine, currentType);
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h2>Menu</h2>
        <ul>
          <li><button onClick={() => showSection('horaire')}>Horaires</button></li>
          <li><button onClick={() => showSection('statistique')}>Statistiques</button></li>
        </ul>
      </div>
      <div className="content">
        {section === 'horaire' && (
          <div id="horaire-section" className="section">
            <h2>Horaires</h2>
            <TransportButtons type="tram" loadStopsNames={loadStopsNames} />
            <TransportButtons type="metro" loadStopsNames={loadStopsNames} />
            <TransportButtons type="transilien" loadStopsNames={loadStopsNames} />
            <TransportButtons type="rer" loadStopsNames={loadStopsNames} />
            <StopsList stops={stops} handleStopSelection={handleStopSelection} hasFetched={stopsFetched} />
            <SchedulesList schedules={schedules} formatMinutes={formatMinutes} hasFetched={schedulesFetched} />
            <button onClick={refreshSchedules}>Actualiser</button>
          </div>
        )}
        {section === 'statistique' && (
          <div id="statistique-section" className="section">
            <h2>Statistiques</h2>
            {/* Contenu des statistiques */}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
