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

const statusList = []

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
        statusList.push(status)
    }
    return statuses;
}

renderStatuses();

// console.log(statusList);

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
    console.log(tasks)
    renderTaskHeader(tasks);
    return tasks;
}

renderTasks();

function renderTaskHeader(tasks) {
    for(let task of tasks) {
        // Create whole task element
        const taskElement = createDiv('task-item');
        // Create wrapper for the whole header of a single task
        const contentHeader = createDiv('task-content-header');
        // Create wrapper for the left side priority and department
        const leftSide = createDiv('left-side');
        // Create wrapper for priority icon and name
        const priorityContainer = createDiv('priority-container');

        const priorityName = task.priority.name;
        const priorityIcon = task.priority.icon;
        const priorityNameParagraph = createParagraph(priorityName);
        const img = createImage(priorityIcon);
        priorityContainer.classList.add(`priority-${task.priority.id}`)
        priorityContainer.append(img, priorityNameParagraph);

        const department = task.department.name;
        const departmentParagraph = createParagraph(department);
        const dueDate = task.due_date;
        const dueDateConverted = formatDate(dueDate);
        const dueDateParagraph = createParagraph(dueDateConverted);
        dueDateParagraph.classList.add('date');
        leftSide.append(priorityContainer, departmentParagraph);
        contentHeader.append(leftSide, dueDateParagraph);

        const statusBlocks = document.querySelectorAll('.status-block');
        for (let block of statusBlocks) {
            if (block.classList.contains(`status-${task.status.id}`)) {
                block.appendChild(taskElement);
                taskElement.append(contentHeader);
            }
        }
    }
}

function formatDate(isoString) {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('ka-GE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(date);
}

function createDiv(className) {
    const div = document.createElement('div');
    div.classList.add(className);
    return div;
}

function createParagraph(text) {
    const p = document.createElement('p');
    p.textContent = text;
    return p;
}

function createImage(src, alt) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    return img;
}