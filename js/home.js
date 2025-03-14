const API_URL = 'https://momentum.redberryinternship.ge/api/statuses';
const token = '9e6dffb0-c41e-459d-9630-7b729c73ee73';

const taskList = document.getElementById('task-list');

async function fetchTaskStatus() {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching task status:', error);
    }
}

async function renderStatuses() {
    const statuses = await fetchTaskStatus();
    for (let status of statuses) {
        console.log(status)
        const statusElement = document.createElement('div');
        statusElement.classList.add(`status-${status.id}`);
        statusElement.classList.add('task-item');
        statusElement.textContent = status.name;
        taskList.appendChild(statusElement);
    }
    return statuses;
}

renderStatuses()