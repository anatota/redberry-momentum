const urlParams = new URLSearchParams(window.location.search);
const taskId = urlParams.get('taskId');

const API_URL_TASK = `https://momentum.redberryinternship.ge/api/tasks/${taskId}`;
const API_URL_STATUSES = 'https://momentum.redberryinternship.ge/api/statuses';
const API_URL_COMMENTS = `https://momentum.redberryinternship.ge/api/tasks/${taskId}/comments`;
const token = '9e6dffb0-c41e-459d-9630-7b729c73ee73';

const taskContainer = document.getElementById('task-description');

async function fetchTask() {
    try {
        const response = await fetch(API_URL_TASK, {
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

async function getStatuses() {
    const statuses = await fetchTaskStatus();
    return statuses;
}

async function renderStatuses() {
    const dropdown = document.getElementById('status-list');
    const statuses = await getStatuses();
    const task = await fetchTask();
    dropdown.innerHTML = statuses.map(status => `<option value="${status.name}">${status.name}</option>`).join('');
    dropdown.value = task.status.name;
}

renderStatuses();

async function renderEmployee() {
    const task = await fetchTask();
    const employeeWrapper = document.getElementById('employee-wrapper');
    const html = `
        <span id="department-name">${task.department.name}</span>
        <div class="employee-avatar-name">
            <img src="${task.employee.avatar}" alt="${task.employee.name.concat(" ", task.employee.surname)}">
            <p class="employee">${task.employee.name.concat(" ", task.employee.surname)}</p>
        </div>
    `;
    employeeWrapper.insertAdjacentHTML('afterbegin', html);
}

renderEmployee();

async function renderDate() {
    const task = await fetchTask();
    const date = document.getElementById('due-date');
    const formattedDate = formatDate(task.due_date); 
    date.innerHTML = formattedDate;
}

function formatDate(dateString) {
    const daysOfWeek = ["კვი", "ორშ", "სამ", "ოთხშ", "ხუთშ", "პარ", "შაბ"];
    const date = new Date(dateString);
    // Get day of the week (0 - Sunday, 6 - Saturday) using UTC methods
    const dayOfWeek = daysOfWeek[date.getUTCDay()];
    // Get the day, month, and year using UTC methods
    const day = date.getUTCDate();
    // Months are 0 indexed
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    return `${dayOfWeek} - ${day}/${month}/${year}`;
}

renderDate();

async function updateTaskStatus(id, newStatus) {
    const updatedData = {
        "status_id" : newStatus
    }
    try {
        const response = await fetch(API_URL_TASK, {
            method: 'PUT',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
            body : JSON.stringify(updatedData)
        });
        if(!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error updating task status: ', error);
    }
}

const dropdown = document.getElementById('status-list');
dropdown.addEventListener('change', async function() {
    const selectedStatus = dropdown.value;
    const statuses = await getStatuses();
    statuses.forEach(status => {
        if(status.name === selectedStatus) {
            updateTaskStatus(taskId, status.id);
        }
    });
});

async function loadComments() {
    try {
        const response = await fetch(API_URL_COMMENTS, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = response.json();
        return json;
    } catch(error) {
        console.error(`Error loading comments! ${error.message}`);
    }
}

async function countComments() {
    const comments = await loadComments();
    let count = comments.length;
    if (count == 0) return count;
    comments.forEach(comment => {
        if(comment.sub_comments.length > 0) {
            count += comment.sub_comments.length;
        }
    });
    return count;
}

async function loadCommentCount() {
    const commentCount = document.getElementById('comment-count');
    const numberOfComments = await countComments();
    commentCount.innerHTML = numberOfComments;
}

loadCommentCount();

async function renderComments() {
    const comments = await loadComments();
    if (comments.length == 0) return;
    const commentSection = document.getElementById('comment-section');
    commentSection.innerHTML = '';
    comments.forEach(comment => {
        commentSection.insertAdjacentHTML('afterbegin', buildHTML(comment));
    });
}

function buildHTML(comment) {
    const subComments = comment.sub_comments ?? []; // Use empty array if undefined

    return `
            <div class="comment-element">
                <div class="comment-top-section">
                    <img src="${comment.author_avatar}" alt="comment author avatar">
                    <div class="comment-text-wrapper">
                        <h5>${comment.author_nickname}</h5>
                        <p>${comment.text}</p>
                        <div class="reply-wrapper">
                            <div class="reply-icon-wrapper">
                                <img src="../img/reply-icon.svg" alt="reply icon">
                                <p class="reply-text">უპასუხე</p>
                            </div>
                            <div class="subcomment-section">
                                ${subComments.length > 0 ? renderSubcomments(comment) : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
}

function renderSubcomments(comment) {
    return comment.sub_comments.map(subComment => `
        <div class="sub-comment">
            <img src="${subComment.author_avatar}" alt="subcomment author avatar">
            <div class="subcomment-text-wrapper">
                <h5>${subComment.author_nickname}</h5>        
                <p>${subComment.text}</p>
            </div>
        </div>
        `
    ).join('');
}

renderComments();

submitBtn = document.getElementById('submit-comment');
submitBtn.addEventListener('click', async function() {
    const text = document.getElementById('comment-area').value.trim();
    if(!text) {
        alert('Comment cannot be empty!');
        return;
    }
    const newComment = {
        "text" : text,
        "parent_id" : null,

    };

    try {
        const response = await fetch(API_URL_COMMENTS, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept':"application/json",
                "Content-Type":"application/json"
            },
            body: JSON.stringify(newComment)
        });
        if(!response.ok ) {
            const errorText = await response.text();
            throw new Error(`Server Error: ${response.status} - ${errorText}`);
        }
        const savedComment = await response.json();
        const commentSection = document.getElementById('comment-section');
        commentSection.insertAdjacentHTML('afterbegin', buildHTML(savedComment));
        document.getElementById('comment-area').value = "";
        loadCommentCount();
        console.log('new comment added!')
    } catch(error) {
        console.error(error);
        alert("Error adding comment. Please try again.");
    }
});