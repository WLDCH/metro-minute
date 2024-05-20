document.addEventListener('DOMContentLoaded', (event) => {
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

        const schedulesContainer = document.getElementById('schedules-container');
        schedulesContainer.innerHTML = '';

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

                    const defaultOption = document.createElement('option');
                    defaultOption.textContent = 'Choisissez un arrêt';
                    defaultOption.value = '';
                    defaultOption.disabled = true;
                    defaultOption.selected = true;
                    select.appendChild(defaultOption);

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
        const selectedStop = event.target.value;
        if (selectedStop === '') {
            return; // Ne rien faire si l'option par défaut est sélectionnée
        }

        const line = event.target.getAttribute('data-line');
        const type = event.target.getAttribute('data-type');
        console.log(`Selected stop: ${selectedStop}, Line: ${line}, Type: ${type}`);

        fetch(`/schedules?stop=${selectedStop}&line=${line}&type=${type}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Stop schedules received:', data);
                const schedulesContainer = document.getElementById('schedules-container');
                schedulesContainer.innerHTML = ''; // Clear previous results

                if (data.schedules && data.schedules.length > 0) {
                    data.schedules.forEach((schedule, index) => {
                        const scheduleItem = document.createElement('div');
                        scheduleItem.classList.add('schedule-item');

                        const destination = document.createElement('span');
                        destination.classList.add('destination');
                        destination.textContent = data.destination_names[index];

                        const minutes = parseFloat(schedule);
                        const time = document.createElement('span');
                        time.classList.add('time');
                        time.textContent = formatMinutes(minutes);

                        scheduleItem.appendChild(destination);
                        scheduleItem.appendChild(time);
                        schedulesContainer.appendChild(scheduleItem);
                    });
                } else {
                    const noData = document.createElement('p');
                    noData.textContent = 'No schedules available';
                    schedulesContainer.appendChild(noData);
                }
            })
            .catch(error => console.error('Error fetching stop schedules:', error));
    }

    // Expose the functions to the global scope
    window.showSection = showSection;
    window.loadStopsNames = loadStopsNames;
});
