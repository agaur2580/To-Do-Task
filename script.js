document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    setInterval(updateDateTime, 1000);
});

function updateDateTime() {
    const now = new Date();
    document.getElementById('current-date').textContent = now.toLocaleDateString();
    document.getElementById('current-time').textContent = now.toLocaleTimeString();
}

function toggleMode() {
    const body = document.body;
    const modeIcon = document.getElementById('mode-icon');
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        modeIcon.textContent = '🌙';
    } else {
        modeIcon.textContent = '🌞';
    }
}

function addTask() {
    const taskTitle = document.getElementById('task-title').value.trim();
    const taskDesc = document.getElementById('task-desc').value.trim();
    const taskPriority = document.getElementById('task-priority').value;

    if (!taskTitle) {
        alert('Task title cannot be empty.');
        return;
    }

    const tasksList = document.getElementById('tasks');
    const taskItem = document.createElement('li');
    taskItem.className = `task-item ${taskPriority}`;

    taskItem.innerHTML = `
        <div class="task-content">
            <h3>${taskTitle}</h3>
            <p>${taskDesc}</p>
            <span class="priority ${taskPriority}">${taskPriority} priority</span>
        </div>
        <div class="task-actions">
            <button onclick="markTaskComplete(this)">✔</button>
            <button onclick="deleteTask(this)">❌</button>
        </div>
    `;

    tasksList.appendChild(taskItem);
    document.getElementById('task-title').value = '';
    document.getElementById('task-desc').value = '';
    document.getElementById('task-priority').value = 'low';

    updateTaskStats();
}

function markTaskComplete(button) {
    const taskItem = button.closest('li');
    taskItem.classList.toggle('completed');
    updateTaskStats();
}

function deleteTask(button) {
    const taskItem = button.closest('li');
    taskItem.remove();
    updateTaskStats();
}

function clearCompletedTasks() {
    const tasksList = document.getElementById('tasks');
    const completedTasks = tasksList.querySelectorAll('li.completed');
    completedTasks.forEach(task => task.remove());
    updateTaskStats();
}

function updateTaskStats() {
    const tasksList = document.getElementById('tasks');
    const allTasksCount = tasksList.children.length;
    const activeTasksCount = tasksList.querySelectorAll('li:not(.completed)').length;
    const completedTasksCount = tasksList.querySelectorAll('li.completed').length;

    document.getElementById('all-tasks').textContent = allTasksCount;
    document.getElementById('active-tasks').textContent = activeTasksCount;
    document.getElementById('completed-tasks').textContent = completedTasksCount;
}

function searchTasks() {
    const query = document.getElementById('search-task').value.toLowerCase();
    const tasksList = document.getElementById('tasks');
    const tasks = tasksList.querySelectorAll('li');

    tasks.forEach(task => {
        const taskContent = task.textContent.toLowerCase();
        if (taskContent.includes(query)) {
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    });
}

function activateVoiceAssistant() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('task-title').value = transcript;
    };

    recognition.onerror = function() {
        alert('Voice recognition error. Please try again.');
    };
}