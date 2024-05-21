document.addEventListener('DOMContentLoaded', (event) => {
    let currentStop = '';
    let currentLine = '';
    let currentType = '';

    function showSection(sectionId) {
        document.getElementById('horaire-section').style.display = 'none';
        document.getElementById('statistique-section').style.display = 'none';
        document.getElementById(sectionId + '-section').style.display = 'block';
    }

    function formatMinutes(minutes) {
        const unit = minutes < 2 ? 'minute' : 'minutes';
        return `${minutes} ${unit}`;
    }

    function loadStopsNames(line, type) {
        fetch(`/stops?line=${line}&type=${type}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);
            const stopsList = document.getElementById('stops-list');
            stopsList.innerHTML = ''; // Clear previous list items

            if (data.stops.length > 0) {
                const select = document.createElement('select');
                select.setAttribute('data-line', line);
                select.setAttribute('data-type', type);
                select.addEventListener('change', handleStopSelection);

                // Ajouter l'option par défaut
                const defaultOption = document.createElement('option');
                defaultOption.textContent = 'Choisissez un arrêt';
                defaultOption.value = '';
                defaultOption.disabled = true;
                defaultOption.selected = true;
                select.appendChild(defaultOption);

                // Trier les arrêts en ignorant les accents
                data.stops.sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));

                data.stops.forEach(stop => {
                    const option = document.createElement('option');
                    option.textContent = stop;
                    option.value = stop; // Use the stop value as the option value
                    select.appendChild(option);
                });
                stopsList.appendChild(select);
            } else {
                const noData = document.createElement('p');
                noData.textContent = 'No stops available';
                stopsList.appendChild(noData);
            }
        })
        .catch(error => console.error('Error fetching stops:', error));
    }

    function handleStopSelection(event) {
        currentStop = event.target.value;
        if (currentStop === '') {
            return; // Ne rien faire si l'option par défaut est sélectionnée
        }

        currentLine = event.target.getAttribute('data-line');
        currentType = event.target.getAttribute('data-type');
        console.log(`Selected stop: ${currentStop}, Line: ${currentLine}, Type: ${currentType}`);
        
        updateSchedules(currentStop, currentLine, currentType);
    }

    function updateSchedules(stop, line, type) {
        // Effacer les horaires affichés
        const schedulesContainer = document.getElementById('schedules-container');
        schedulesContainer.innerHTML = '';

        fetch(`/schedules?stop=${stop}&line=${line}&type=${type}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Stop schedules received:', data);

            if (data.schedules_in_minutes && data.schedules_in_minutes.length > 0) {
                data.schedules_in_minutes.forEach((schedule, index) => {
                    const scheduleItem = document.createElement('div');
                    scheduleItem.classList.add('schedule-item');

                    const destination = document.createElement('span');
                    destination.classList.add('destination');
                    destination.textContent = data.destination_names[index];

                    const minutes = parseFloat(schedule);
                    const formattedMinutes = formatMinutes(minutes);
                    const time = document.createElement('span');
                    time.classList.add('time');
                    time.textContent = `${formattedMinutes} (${data.schedules_in_time[index]})`;

                    scheduleItem.appendChild(destination);
                    scheduleItem.appendChild(time);
                    schedulesContainer.appendChild(scheduleItem);
                });
            } else {
                const noData = document.createElement('p');
                noData.textContent = 'Aucun départ actuellement';
                schedulesContainer.appendChild(noData);
            }
        })
        .catch(error => console.error('Error fetching stop schedules:', error));
    }

    function refreshSchedules() {
        if (currentStop && currentLine && currentType) {
            updateSchedules(currentStop, currentLine, currentType);
        }
    }

    // Expose the functions to the global scope
    window.showSection = showSection;
    window.loadStopsNames = loadStopsNames;
    window.refreshSchedules = refreshSchedules;
});
