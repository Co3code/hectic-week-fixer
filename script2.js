// script.js

const addTaskButtons = document.querySelectorAll('.addTaskBtn');
const taskInputs = document.querySelectorAll('.taskInput');
const taskTimeInputs = document.querySelectorAll('.taskTimeInput');
const prioritySelects = document.querySelectorAll('.prioritySelect');
const clearDayButtons = document.querySelectorAll('.clearDayBtn');
const taskLists = document.querySelectorAll('.taskList');

// Load tasks from localStorage when the page loads
document.addEventListener('DOMContentLoaded', loadTasks);

addTaskButtons.forEach((button, index) => {
    button.addEventListener('click', () => addTask(index));
});

taskInputs.forEach((input, index) => {
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTask(index);
    });
});

// Helper: create a task <li> element
function createTaskElement(taskText, dueTime, priority, isCompleted, dayIndex) {
    const li = document.createElement('li');
    li.dataset.priority = priority;
    li.classList.add(`${priority}-priority`);

    const checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.classList.add('taskCheckbox');
    checkbox.checked = isCompleted;

    const span = document.createElement('span');
    span.textContent = dueTime ? `${taskText} - ${dueTime}` : taskText;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.classList.add('removeBtn');

    // Mark task as completed
    checkbox.addEventListener('click', function() {
        li.classList.toggle('completed');
        saveTasks();
    });

    // Remove task
    removeBtn.addEventListener('click', function() {
        li.remove();
        saveTasks();
    });

    if (isCompleted) li.classList.add('completed');

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(removeBtn);

    taskLists[dayIndex].appendChild(li);
}

// Add task to the list for the respective day
function addTask(dayIndex) {
    const taskInput = taskInputs[dayIndex];
    const taskTimeInput = taskTimeInputs[dayIndex];
    const prioritySelect = prioritySelects[dayIndex];

    const taskText = taskInput.value.trim();
    const dueTime = taskTimeInput.value;
    const priority = prioritySelect.value;

    if (taskText === "") return; // Don't add empty tasks

    createTaskElement(taskText, dueTime, priority, false, dayIndex);

    // Clear inputs
    taskInput.value = "";
    taskTimeInput.value = "";

    saveTasks();
}

// Clear all tasks for the day
clearDayButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        taskLists[index].innerHTML = '';
        saveTasks();
    });
});

// Save all tasks to localStorage
function saveTasks() {
    const tasks = [];

    taskLists.forEach((list) => {
        const dayTasks = [];
        list.querySelectorAll('li').forEach((taskItem) => {
            const spanText = taskItem.querySelector('span').textContent;
            const [taskText, dueTime = ""] = spanText.split(' - ');
            const isCompleted = taskItem.classList.contains('completed');
            const priority = taskItem.dataset.priority;

            dayTasks.push({ taskText, dueTime, isCompleted, priority });
        });
        tasks.push(dayTasks);
    });

    localStorage.setItem('weeklyTasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('weeklyTasks'));
    if (!tasks) return;

    tasks.forEach((dayTasks, dayIndex) => {
        dayTasks.forEach((task) => {
            createTaskElement(task.taskText, task.dueTime, task.priority, task.isCompleted, dayIndex);
        });
    });
}
