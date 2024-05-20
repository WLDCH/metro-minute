function showSection(sectionId) {
    document.getElementById('horaire-section').style.display = 'none';
    document.getElementById('statistique-section').style.display = 'none';
    document.getElementById(sectionId + '-section').style.display = 'block';
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
            data.stops.forEach(schedule => {
                const option = document.createElement('option');
                option.textContent = schedule;
                select.appendChild(option);
            });
            stopsList.appendChild(select);
        } else {
            const noData = document.createElement('p');
            noData.textContent = 'No schedule available';
            stopsList.appendChild(noData);
        }
    })
    .catch(error => console.error('Error fetching stops:', error));
}
