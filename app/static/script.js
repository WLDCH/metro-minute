function showSection(sectionId) {
    document.getElementById('horaire-section').style.display = 'none';
    document.getElementById('statistique-section').style.display = 'none';
    document.getElementById(sectionId + '-section').style.display = 'block';
}

function loadMetroSchedule(metroNumber) {
    console.log(`Loading schedule for Metro ${metroNumber}`);
    fetch(`/metro?metro_number=${metroNumber}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Data received:', data);
        const scheduleList = document.getElementById('schedule-list');
        scheduleList.innerHTML = ''; // Clear previous list items

        if (data.schedules.length > 0) {
            const select = document.createElement('select');
            data.schedules.forEach(schedule => {
                const option = document.createElement('option');
                option.textContent = schedule;
                select.appendChild(option);
            });
            scheduleList.appendChild(select);
        } else {
            const noData = document.createElement('p');
            noData.textContent = 'No schedule available';
            scheduleList.appendChild(noData);
        }
    })
    .catch(error => console.error('Error fetching schedules:', error));
}
