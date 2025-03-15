const API_URL_STATUSES = 'https://momentum.redberryinternship.ge/api/statuses';
const API_URL_TASKS = 'https://momentum.redberryinternship.ge/api/tasks';
const token = '9e6dffb0-c41e-459d-9630-7b729c73ee73';

const taskList = document.getElementById('task-list');

async function fetchTaskStatus() {
    try {
        const response = await fetch(API_URL_STATUSES, {
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
        const statusBlock = document.createElement('div');
        statusBlock.classList.add('status-block');
        statusBlock.classList.add(`status-${status.id}`);
        taskList.appendChild(statusBlock);
        const statusElement = document.createElement('div');
        statusElement.classList.add(`status-${status.id}`);
        statusElement.classList.add('status-item');
        statusElement.textContent = status.name;
        statusBlock.appendChild(statusElement);
    }
    return statuses;
}

renderStatuses();

async function fetchTasks() {
    try {
        const response = await fetch(API_URL_TASKS, {
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

async function renderTasks() {
    const tasks = await fetchTasks();
    console.log(tasks);
    for(let task of tasks) {
        const description = formatDescription(task.description);
        const taskHTML = `
        <div class="task-item task-status-${task.status.id}">
            <div class="task-content-header">
                <div class="left-side">
                    <div class="priority-container priority-${task.priority.id}">
                        <img src="${task.priority.icon}" alt="${task.priority.name} priority icon">
                        <p>${task.priority.name}</p>
                    </div>
                    <p class="department department-${task.department.id}">${task.department.name}</p>
                </div>
                <p class="date">${formatDate(task.due_date)}</p>
            </div>
            <div class="task-content">
                <p class="task-name">${task.name}</p>
                <p class="task-description">${description}</p>
            </div>
            <div class="task-content-footer">
                <img src="${task.employee.avatar}" alt="${task.employee.name.concat(" ", task.employee.surname)} avatar" class="employee-avatar">
                <div class="comments-container">
                    <img src="../img/comments.svg" alt="comments" class="comments-icon">
                    <span class="comment-num">${task.total_comments}</span>
                </div>
            </div>
        </div>
        `;
        const statusBlock = document.querySelector(`.status-block.status-${task.status.id}`);
        if (statusBlock) {
            statusBlock.insertAdjacentHTML('beforeend', taskHTML);
        }
    }
    return tasks;
}

renderTasks();

function formatDescription(description) {
    if (description.length > 100) {
        return `${description.slice(0, 100)}...`
    }
    return description;
}

function formatDate(isoString) {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('ka-GE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(date);
}
