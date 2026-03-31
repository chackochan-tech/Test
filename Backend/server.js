const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: [
    'https://test-crh4kafio-chans-projects-29b09945.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

let tasks = [
  { id: 1, title: 'Learn frontend' },
  { id: 2, title: 'Learn backend' }
];

app.get('/', (req, res) => {
  res.json({ message: 'Backend is running' });
});

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const newTask = {
    id: Date.now(),
    title: title.trim()
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  tasks = tasks.filter((task) => task.id !== id);
  res.json({ message: 'Deleted successfully' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});