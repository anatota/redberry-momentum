const urlParams = new URLSearchParams(window.location.search);
const taskId = urlParams.get('taskId');

console.log(taskId);