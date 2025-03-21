document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtns = document.querySelectorAll('.create-task-container');
    addTaskBtns.forEach(taskBtn => {
        taskBtn.addEventListener('click', () => {
            window.location.href = 'task-create.html';
        });
    });
    const homeBtn = document.querySelector('.logo-container');
    homeBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});