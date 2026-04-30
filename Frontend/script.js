const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');

const API_URL = `/tasks`;

async function loadTasks() {
  try {
    console.log('GET:', API_URL);

    const response = await fetch(API_URL);
    console.log('GET status:', response.status);

    const tasks = await response.json();
    console.log('GET data:', tasks);

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
    console.log('POST:', API_URL, { title });

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title })
    });

    console.log('POST status:', response.status);

    const data = await response.json();
    console.log('POST data:', data);

    taskInput.value = '';
    loadTasks();
  } catch (error) {
    console.error('Error adding task:', error);
  }
}

async function deleteTask(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    console.log('DELETE status:', response.status);

    loadTasks();
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}

addTaskBtn.addEventListener('click', addTask);
loadTasks();
