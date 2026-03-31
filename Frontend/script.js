const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');

const BASE_URL = 'https://test-wuuo.onrender.com';
const API_URL = `${BASE_URL}/tasks`;

async function loadTasks() {
  try {
    const response = await fetch(API_URL);
    const tasks = await response.json();

    taskList.innerHTML = '';

    tasks.forEach((task) => {
      const li = document.createElement('li');
      li.className = 'task-item';
      li.innerHTML = `
        <span>${task.title}</span>
        <button onclick="deleteTask(${task.id})">Delete</button>
      `;
      taskList.appendChild(li);
    });
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
}

async function addTask() {
  const title = taskInput.value.trim();

  if (!title) {
    alert('Please enter a task');
    return;
  }

  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title })
    });

    taskInput.value = '';
    loadTasks();
  } catch (error) {
    console.error('Error adding task:', error);
  }
}

async function deleteTask(id) {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    loadTasks();
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}

addTaskBtn.addEventListener('click', addTask);

loadTasks();