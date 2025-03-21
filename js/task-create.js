const PRIORITIES_API_URL = 'https://momentum.redberryinternship.ge/api/priorities';
const STATUSES_API_URL = 'https://momentum.redberryinternship.ge/api/statuses';
const DEPARTMENTS_API_URL = 'https://momentum.redberryinternship.ge/api/departments';
const EMPLOYEES_API_URL = 'https://momentum.redberryinternship.ge/api/employees';
const TASKS_API_URL = 'https://momentum.redberryinternship.ge/api/tasks';
const token = '9e6dffb0-c41e-459d-9630-7b729c73ee73';

const MIN_CHARACTERS = 3;
const MAX_CHARACTERS = 255;

async function sendGetRequest(API_URL) {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json'
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

async function renderElements(API_URL, elementId) {
    const elements = await sendGetRequest(API_URL);
    const dropdown = document.getElementById(elementId);
    elements.forEach(element => {
        const option = document.createElement('option');
        option.value = element.id;
        option.textContent = element.name;
        dropdown.appendChild(option);
    })
}

renderElements(PRIORITIES_API_URL, 'priority');
renderElements(STATUSES_API_URL, 'status');
renderElements(DEPARTMENTS_API_URL, 'department');

async function fetchEmployees() {
    try {
        const response = await fetch(EMPLOYEES_API_URL, {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        });
        if(!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
    }
}

async function renderEmployees() {
    const employees = await fetchEmployees();
    const employeeDropdown = document.getElementById('employee');
    employees.forEach(employee => {
        const option = document.createElement('option');
        option.value = employee.id;
        option.textContent = `${employee.name} ${employee.surname}`;
        employeeDropdown.appendChild(option);
    });
    console.log(employees)
}

renderEmployees();

const titleField = document.getElementById('title');
const descriptionField = document.getElementById('description');

titleField.addEventListener('input', () => {
    const hasValidLength = titleField.value.length >= MIN_CHARACTERS && titleField.value.length <= MAX_CHARACTERS;
    // const isValidFormat = isValidText(titleField.value);
    // console.log(isValidFormat)
    if (!hasValidLength) {
        document.getElementById('title-min').style.color = '#FA4D4D';
        document.getElementById('title-max').style.color = '#FA4D4D';
    } else {
        document.getElementById('title-min').style.color = '#08A508';
        document.getElementById('title-max').style.color = '#08A508';
    }
})

function isValidText(input) {
    const regex = /^[a-zA-Zა-ჰ\s]+$/;
    return regex.test(input);
}

descriptionField.addEventListener('input', () => {
    const text = descriptionField.value;
    if (text) {
        let splitted = text.split(' ');
        if((splitted.every(word => word.length > 0) && splitted.length >= 4) && text.length <= MAX_CHARACTERS) {
            // console.log(splitted)
            document.getElementById('description-min').style.color = '#08A508';
            document.getElementById('description-max').style.color = '#08A508';
        } else {
            document.getElementById('description-min').style.color = '#FA4D4D';
            document.getElementById('description-max').style.color = '#FA4D4D';    
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const deadlineInput = document.getElementById("deadline");

    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    let formattedDate = formatDate(tomorrow);

    deadlineInput.min = formattedDate;
    deadlineInput.value = formattedDate;
});

function formatDate(date) {
    return date.toISOString().split("T")[0];
}

document.querySelector("form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const priority = document.getElementById("priority").value;
    const status = document.getElementById("status").value;
    const employee = document.getElementById("employee").value;
    const deadlineValue = document.getElementById("deadline").value;

    if (title.length < 3 || title.length > 255) {
        alert("სათაური უნდა იყოს 3-255 სიმბოლოს შორის!");
        return;
    }

    const taskData = {
        "name": title,
        "description": description || null, // Send null if empty
        "due_date": deadlineValue,
        "status_id": status,
        "employee_id": employee,
        "priority_id": priority
    };

    try {
        const response = await fetch(TASKS_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            },
            body: JSON.stringify(taskData)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("Task Created Successfully:", responseData);
        alert("დავალება წარმატებით დაემატა!");
        document.querySelector("form").reset();
    } catch (error) {
        console.error("Failed to create task:", error);
        alert("დავალების შექმნისას შეცდომა მოხდა!");
    }
});

