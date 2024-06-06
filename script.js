document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const taskList = document.getElementById('task-list');
    const showAllBtn = document.getElementById('show-all');
    const showPendingBtn = document.getElementById('show-pending');
    const showCompletedBtn = document.getElementById('show-completed');

    form.addEventListener('submit', addTask);
    taskList.addEventListener('click', handleTaskAction);
    showAllBtn.addEventListener('click', showAllTasks);
    showPendingBtn.addEventListener('click', showPendingTasks);
    showCompletedBtn.addEventListener('click', showCompletedTasks);

    loadTasks();

    function addTask(e) {
        e.preventDefault();
        const taskText = input.value.trim();
        if (taskText === '') return;

        const task = {
            id: Date.now().toString(),
            text: taskText,
            completed: false
        };

        saveTask(task);
        appendTask(task);
        input.value = '';
    }

    function handleTaskAction(e) {
        const target = e.target;
        const taskElement = target.closest('li');
        const taskId = taskElement.getAttribute('data-id');

        if (target.classList.contains('delete-btn')) {
            removeTask(taskId);
            taskElement.remove();
        } else if (target.classList.contains('edit-btn')) {
            const newText = prompt('Edit task', taskElement.querySelector('span').textContent);
            if (newText) {
                taskElement.querySelector('span').textContent = newText;
                updateTask(taskId, { text: newText });
            }
        } else if (target.classList.contains('done-btn')) {
            const isCompleted = taskElement.classList.toggle('completed');
            updateTask(taskId, { completed: isCompleted });
        }
    }

    function saveTask(task) {
        const tasks = getTasks();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateTask(id, updates) {
        const tasks = getTasks();
        const taskIndex = tasks.findIndex(task => task.id === id);
        tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function removeTask(id) {
        const tasks = getTasks();
        const updatedTasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }

    function getTasks() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    function appendTask(task) {
        const taskElement = document.createElement('li');
        taskElement.setAttribute('data-id', task.id);
        taskElement.classList.toggle('completed', task.completed);
        taskElement.innerHTML = `
            <span>${task.text}</span>
            <div class="task-actions">
                <button class="done-btn">✔️</button>
                <button class="edit-btn">✏️</button>
                <button class="delete-btn">🗑️</button>
            </div>
        `;
        taskList.appendChild(taskElement);
    }

    function loadTasks() {
        const tasks = getTasks();
        tasks.forEach(task => appendTask(task));
    }

    function showAllTasks() {
        const tasks = taskList.children;
        for (let task of tasks) {
            task.style.display = 'flex';
        }
    }

    function showPendingTasks() {
        const tasks = taskList.children;
        for (let task of tasks) {
            task.style.display = task.classList.contains('completed') ? 'none' : 'flex';
        }
    }

    function showCompletedTasks() {
        const tasks = taskList.children;
        for (let task of tasks) {
            task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
        }
    }
});
