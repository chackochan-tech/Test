const express = require('express');
const cors = require('cors');
require('dotenv').config();

const getTenantDb = require('./db/tenantDb');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'SaaS backend is running' });
});

app.get('/api/:tenant/tasks', async (req, res) => {
  try {
    const db = await getTenantDb(req.params.tenant);
    const [rows] = await db.query('SELECT * FROM tasks ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error('GET tasks error:', error.message);
    res.status(400).json({ message: error.message });
  }
});

app.post('/api/:tenant/tasks', async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const db = await getTenantDb(req.params.tenant);

    const task = {
      id: Date.now(),
      title: title.trim()
    };

    await db.query(
      'INSERT INTO tasks (id, title) VALUES (?, ?)',
      [task.id, task.title]
    );

    res.status(201).json(task);
  } catch (error) {
    console.error('POST tasks error:', error.message);
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/:tenant/tasks/:id', async (req, res) => {
  try {
    const db = await getTenantDb(req.params.tenant);

    await db.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('DELETE task error:', error.message);
    res.status(400).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SaaS backend running on port ${PORT}`);
});
