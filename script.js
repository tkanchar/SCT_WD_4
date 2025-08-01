// script.js
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskTime = document.getElementById('task-time');
const taskPriority = document.getElementById('task-priority');
const taskCategory = document.getElementById('task-category');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('[data-filter]');
const sortTimeBtn = document.getElementById('sort-time');
const sortPriorityBtn = document.getElementById('sort-priority');

let tasks = [];
let filter = 'all';

function renderTasks() {
  taskList.innerHTML = '';
  let filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task' + (task.completed ? ' completed' : '');
    li.draggable = true;
    li.dataset.index = index;
    li.innerHTML = `
      <span>
        ${task.text} 
        ${task.time ? '(' + task.time + ')' : ''} 
        [Priority: ${task.priority}] 
        [Category: ${task.category}]
      </span>
      <div class="actions">
        <button onclick="toggleComplete(${index})">✔</button>
        <button onclick="editTask(${index})">✎</button>
        <button onclick="deleteTask(${index})">🗑</button>
      </div>
    `;
    addDragAndDrop(li);
    taskList.appendChild(li);
  });
}

function addDragAndDrop(el) {
  el.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', el.dataset.index);
  });
  el.addEventListener('dragover', e => e.preventDefault());
  el.addEventListener('drop', e => {
    e.preventDefault();
    const fromIndex = +e.dataTransfer.getData('text/plain');
    const toIndex = +el.dataset.index;
    const moved = tasks.splice(fromIndex, 1)[0];
    tasks.splice(toIndex, 0, moved);
    renderTasks();
  });
}

taskForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = taskInput.value.trim();
  const time = taskTime.value;
  const priority = taskPriority.value;
  const category = taskCategory.value.trim();

  if (text) {
    tasks.push({ text, time, priority, category, completed: false });
    taskInput.value = '';
    taskTime.value = '';
    taskPriority.value = 'Medium';
    taskCategory.value = '';
    renderTasks();
  }
});

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function editTask(index) {
  const newText = prompt('Edit task:', tasks[index].text);
  if (newText !== null) {
    tasks[index].text = newText;
    renderTasks();
  }
}

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filter = button.dataset.filter;
    renderTasks();
  });
});

sortTimeBtn.addEventListener('click', () => {
  tasks.sort((a, b) => new Date(a.time) - new Date(b.time));
  renderTasks();
});

sortPriorityBtn.addEventListener('click', () => {
  const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
  tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  renderTasks();
});

renderTasks();
