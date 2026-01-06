// script.js

// Get all the "Add Task" buttons and input fields
const addTaskButtons = document.querySelectorAll('.addTaskBtn');
const taskInputs = document.querySelectorAll('.taskInput');

// Get the task lists for each day
const taskLists = document.querySelectorAll('.taskList');

// Load tasks from localStorage when the page loads
document.addEventListener('DOMContentLoaded', loadTasks);

addTaskButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        addTask(index);
    });
});

taskInputs.forEach((input, index) => {
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask(index);
        }
    });
});

// Add task to the list for the respective day
function addTask(dayIndex) {
    const taskInput = taskInputs[dayIndex];
    const taskText = taskInput.value.trim();

    if (taskText === "") return; // Don't add empty tasks

    // Create new list item for the task
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.classList.add('taskCheckbox');
    
    const span = document.createElement('span');
    span.textContent = taskText;

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

    // Append elements to the list item
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(removeBtn);

    // Append the task to the day's list
    taskLists[dayIndex].appendChild(li);

    // Clear the input field
    taskInput.value = "";

    // Save the tasks to localStorage
    saveTasks();
}

// Save all tasks to localStorage
function saveTasks() {
    const tasks = [];
    
    taskLists.forEach((list, dayIndex) => {
        const dayTasks = [];
        list.querySelectorAll('li').forEach((taskItem) => {
            const taskText = taskItem.querySelector('span').textContent;
            const isCompleted = taskItem.classList.contains('completed');
            dayTasks.push({ taskText, isCompleted });
        });
        tasks.push(dayTasks);
    });
    
    localStorage.setItem('weeklyTasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('weeklyTasks'));

    if (tasks) {
        tasks.forEach((dayTasks, dayIndex) => {
            dayTasks.forEach((task) => {
                const li = document.createElement('li');
                const checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.classList.add('taskCheckbox');
                checkbox.checked = task.isCompleted;
                
                const span = document.createElement('span');
                span.textContent = task.taskText;

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

                // Append elements to the list item
                li.appendChild(checkbox);
                li.appendChild(span);
                li.appendChild(removeBtn);

                // Append the task to the day's list
                taskLists[dayIndex].appendChild(li);

                if (task.isCompleted) {
                    li.classList.add('completed');
                }
            });
        });
    }
}
