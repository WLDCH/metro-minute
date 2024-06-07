import React, { useState, useEffect } from 'react';
import TransportToggle from './components/TransportToggle';
import StopsList from './components/StopsList';
import SchedulesList from './components/SchedulesList';
import FadeContainer from './components/FadeContainer';
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
  const [fadeOutStops, setFadeOutStops] = useState(false);
  const [fadeOutSchedules, setFadeOutSchedules] = useState(false);
  const [loadingNewStops, setLoadingNewStops] = useState(false);
  const [loadingNewSchedules, setLoadingNewSchedules] = useState(false);

  const transitionDuration = 600; // Durée de transition en millisecondes

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
    }, transitionDuration); // Utiliser la durée de transition pour le délai
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
    }, transitionDuration); // Utiliser la durée de transition pour le délai
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
            <TransportToggle
              type="Métro"
              logo="/static/images/metro.png"
              buttons={[
                { src: '/static/images/metro_1.png', alt: 'Métro 1', onClick: () => loadStopsNames('1', 'metro') },
                { src: '/static/images/metro_2.png', alt: 'Métro 2', onClick: () => loadStopsNames('2', 'metro') },
                { src: '/static/images/metro_3.png', alt: 'Métro 3', onClick: () => loadStopsNames('3', 'metro') },
                { src: '/static/images/metro_4.png', alt: 'Métro 4', onClick: () => loadStopsNames('4', 'metro') },
                { src: '/static/images/metro_5.png', alt: 'Métro 5', onClick: () => loadStopsNames('5', 'metro') },
                { src: '/static/images/metro_6.png', alt: 'Métro 6', onClick: () => loadStopsNames('6', 'metro') },
                { src: '/static/images/metro_7.png', alt: 'Métro 7', onClick: () => loadStopsNames('7', 'metro') },
                { src: '/static/images/metro_8.png', alt: 'Métro 8', onClick: () => loadStopsNames('8', 'metro') },
                { src: '/static/images/metro_9.png', alt: 'Métro 9', onClick: () => loadStopsNames('9', 'metro') },
                { src: '/static/images/metro_10.png', alt: 'Métro 10', onClick: () => loadStopsNames('10', 'metro') },
                { src: '/static/images/metro_11.png', alt: 'Métro 11', onClick: () => loadStopsNames('11', 'metro') },
                { src: '/static/images/metro_12.png', alt: 'Métro 12', onClick: () => loadStopsNames('12', 'metro') },
                { src: '/static/images/metro_13.png', alt: 'Métro 13', onClick: () => loadStopsNames('13', 'metro') },
                { src: '/static/images/metro_14.png', alt: 'Métro 14', onClick: () => loadStopsNames('14', 'metro') },
              ]}
            />
            <TransportToggle
              type="Tramway"
              logo="/static/images/tramway.png"
              buttons={[
                { src: '/static/images/tram_1.png', alt: 'Tramway 1', onClick: () => loadStopsNames('T1', 'tram') },
                { src: '/static/images/tram_2.png', alt: 'Tramway 2', onClick: () => loadStopsNames('T2', 'tram') },
                { src: '/static/images/tram_3a.png', alt: 'Tramway 3a', onClick: () => loadStopsNames('T3a', 'tram') },
                { src: '/static/images/tram_3b.png', alt: 'Tramway 3b', onClick: () => loadStopsNames('T3b', 'tram') },
                { src: '/static/images/tram_4.png', alt: 'Tramway 4', onClick: () => loadStopsNames('T4', 'tram') },
                { src: '/static/images/tram_5.png', alt: 'Tramway 5', onClick: () => loadStopsNames('T5', 'tram') },
                { src: '/static/images/tram_6.png', alt: 'Tramway 6', onClick: () => loadStopsNames('T6', 'tram') },
                { src: '/static/images/tram_7.png', alt: 'Tramway 7', onClick: () => loadStopsNames('T7', 'tram') },
                { src: '/static/images/tram_8.png', alt: 'Tramway 8', onClick: () => loadStopsNames('T8', 'tram') },
                { src: '/static/images/tram_9.png', alt: 'Tramway 9', onClick: () => loadStopsNames('T9', 'tram') },
                { src: '/static/images/tram_10.png', alt: 'Tramway 10', onClick: () => loadStopsNames('T10', 'tram') },
                { src: '/static/images/tram_11.png', alt: 'Tramway 11', onClick: () => loadStopsNames('T11', 'tram') },
                { src: '/static/images/tram_12.png', alt: 'Tramway 12', onClick: () => loadStopsNames('T12', 'tram') },
                { src: '/static/images/tram_13.png', alt: 'Tramway 13', onClick: () => loadStopsNames('T13', 'tram') },
              ]}
            />
            <TransportToggle
              type="Transilien"
              logo="/static/images/transilien.png"
              buttons={[
                { src: '/static/images/transilien_h.png', alt: 'Transilien H', onClick: () => loadStopsNames('H', 'transilien') },
                { src: '/static/images/transilien_j.png', alt: 'Transilien J', onClick: () => loadStopsNames('J', 'transilien') },
                { src: '/static/images/transilien_k.png', alt: 'Transilien K', onClick: () => loadStopsNames('K', 'transilien') },
                { src: '/static/images/transilien_l.png', alt: 'Transilien L', onClick: () => loadStopsNames('L', 'transilien') },
                { src: '/static/images/transilien_n.png', alt: 'Transilien N', onClick: () => loadStopsNames('N', 'transilien') },
                { src: '/static/images/transilien_p.png', alt: 'Transilien P', onClick: () => loadStopsNames('P', 'transilien') },
                { src: '/static/images/transilien_r.png', alt: 'Transilien R', onClick: () => loadStopsNames('R', 'transilien') },
              ]}
            />
            <TransportToggle
              type="RER"
              logo="/static/images/rer.png"
              buttons={[
                { src: '/static/images/rer_a.png', alt: 'RER A', onClick: () => loadStopsNames('A', 'rer') },
                { src: '/static/images/rer_b.png', alt: 'RER B', onClick: () => loadStopsNames('B', 'rer') },
                { src: '/static/images/rer_c.png', alt: 'RER C', onClick: () => loadStopsNames('C', 'rer') },
                { src: '/static/images/rer_d.png', alt: 'RER D', onClick: () => loadStopsNames('D', 'rer') },
                { src: '/static/images/rer_e.png', alt: 'RER E', onClick: () => loadStopsNames('E', 'rer') },
              ]}
            />
            <div className="stops-list-container">
              <FadeContainer isVisible={!fadeOutStops && stopsFetched && !loadingNewStops} onFadeOutEnd={() => setStops([])} duration={transitionDuration}>
                <StopsList stops={stops} handleStopSelection={handleStopSelection} />
              </FadeContainer>
            </div>
            <div className="schedules-container">
              <FadeContainer isVisible={!fadeOutSchedules && schedulesFetched && !loadingNewSchedules} onFadeOutEnd={() => setSchedules([])} duration={transitionDuration}>
                <SchedulesList schedules={schedules} formatMinutes={formatMinutes} />
              </FadeContainer>
            </div>
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
