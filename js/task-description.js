const urlParams = new URLSearchParams(window.location.search);
const taskId = urlParams.get('taskId');

API_URL = `https://momentum.redberryinternship.ge/api/tasks/${taskId}`;
const token = '9e6dffb0-c41e-459d-9630-7b729c73ee73';

console.log(taskId);
const taskContainer = document.getElementById('task-description');

async function fetchTask() {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if(!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        return json;
    } catch(error) {
        console.error(error.message);
    }
}

fetchTask();

async function renderDescription() {
    const task = await fetchTask();
    console.log(task)
    const html = `
        <div class="top-icons">
            <div class="priority-container priority-${task.priority.id}">
                <img src="${task.priority.icon}" alt="priority icon">
                <p>${task.priority.name}</p>
            </div>
            <p class="department department-${task.department.id}">${task.department.name}</p>
        </div>
        <h1 class="task-name">${task.name}</h1>
        <p>${task.description}</p>
    `;
    taskContainer.insertAdjacentHTML('afterbegin', html);
}

renderDescription();