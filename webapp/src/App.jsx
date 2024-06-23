import React, { useState, useEffect } from 'react';
import TransportToggle from './components/TransportToggle';
import StopsList from './components/StopsList';
import SchedulesList from './components/SchedulesList';
import FadeContainer from './components/FadeContainer';

const App = () => {
  const [section, setSection] = useState('horaire');
  const [currentStop, setCurrentStop] = useState('');
  const [currentLine, setCurrentLine] = useState('');
  const [currentType, setCurrentType] = useState('');
  const [stops, setStops] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [stopsFetched, setStopsFetched] = useState(false);
  const [schedulesFetched, setSchedulesFetched] = useState(false);
  const [fadeOutStops, setFadeOutStops] = useState(false);
  const [fadeOutSchedules, setFadeOutSchedules] = useState(false);
  const [loadingNewStops, setLoadingNewStops] = useState(false);
  const [loadingNewSchedules, setLoadingNewSchedules] = useState(false);

  const transitionDuration = 600;

  const showSection = (sectionId) => {
    setSection(sectionId);
  };

  const formatMinutes = (minutes) => {
    const unit = minutes < 2 ? 'minute' : 'minutes';
    return `${minutes} ${unit}`;
  };

  const loadStopsNames = (line, type) => {
    setFadeOutStops(true);
    setFadeOutSchedules(true);

    setTimeout(() => {
      setLoadingNewStops(true);
      fetch(`/stops?line=${line}&type=${type}`)
        .then(response => response.json())
        .then(data => {
          setStops(data.stops);
          setCurrentLine(line);
          setCurrentType(type);
          setStopsFetched(true);
          setFadeOutStops(false);
          setLoadingNewStops(false);
        })
        .catch(error => {
          console.error('Error fetching stops:', error);
          setStopsFetched(true);
          setFadeOutStops(false);
          setLoadingNewStops(false);
        });
    }, transitionDuration);
  };

  const handleStopSelection = (event) => {
    const stop = event.target.value;
    setCurrentStop(stop);
    if (stop) {
      updateSchedules(stop, currentLine, currentType);
    }
  };

  const updateSchedules = (stop, line, type) => {
    setFadeOutSchedules(true);

    setTimeout(() => {
      setLoadingNewSchedules(true);
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
          setFadeOutSchedules(false);
          setLoadingNewSchedules(false);
        })
        .catch(error => {
          console.error('Error fetching schedules:', error);
          setSchedulesFetched(true);
          setFadeOutSchedules(false);
          setLoadingNewSchedules(false);
        });
    }, transitionDuration);
  };

  const refreshSchedules = () => {
    if (currentStop && currentLine && currentType) {
      updateSchedules(currentStop, currentLine, currentType);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '200px', background: '#f0f0f0', padding: '20px' }}>
        <h2>Menu</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li><button onClick={() => showSection('horaire')} style={buttonStyle}>Horaires</button></li>
          <li><button onClick={() => showSection('statistique')} style={buttonStyle}>Statistiques</button></li>
        </ul>
      </div>
      <div style={{ flexGrow: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {section === 'horaire' && (
          <div style={{ textAlign: 'center' }}>
            <h2>Horaires</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', width: '100%' }}>
              <TransportToggle type="Metro" logo="/static/images/metro.png" onClickHandler={loadStopsNames} />
              <TransportToggle type="Tramway" logo="/static/images/tramway.png" onClickHandler={loadStopsNames} />
              <TransportToggle type="Transilien" logo="/static/images/transilien.png" onClickHandler={loadStopsNames} />
              <TransportToggle type="RER" logo="/static/images/rer.png" onClickHandler={loadStopsNames} />
            </div>
            <div style={{ minHeight: '100px', transition: 'opacity 0.5s ease-in-out' }}>
              <FadeContainer isVisible={!fadeOutStops && stopsFetched && !loadingNewStops} onFadeOutEnd={() => setStops([])} duration={transitionDuration}>
                <StopsList stops={stops} handleStopSelection={handleStopSelection} hasFetched={stopsFetched} />
              </FadeContainer>
            </div>
            <div style={{ minHeight: '100px', transition: 'opacity 0.5s ease-in-out' }}>
              <FadeContainer isVisible={!fadeOutSchedules && schedulesFetched && !loadingNewSchedules} onFadeOutEnd={() => setSchedules([])} duration={transitionDuration}>
                <SchedulesList schedules={schedules} formatMinutes={formatMinutes} hasFetched={schedulesFetched} />
              </FadeContainer>
            </div>
            <button onClick={refreshSchedules} style={buttonStyle}>Actualiser</button>
          </div>
        )}
        {section === 'statistique' && (
          <div style={{ textAlign: 'center' }}>
            <h2>Statistiques</h2>
            {/* Contenu des statistiques */}
          </div>
        )}
      </div>
    </div>
  );
};

const buttonStyle = {
  margin: '5px',
  padding: '10px',
  backgroundColor: '#f0f0f0',
  border: 'none',
  cursor: 'pointer',
  color: '#003366',
  fontWeight: 'bold',
  fontSize: '1.2em',
  borderRadius: '8px',
  transition: 'background-color 0.3s',
};

export default App;
