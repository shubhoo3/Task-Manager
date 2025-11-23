const db = require('../config/db');
const Joi = require('joi');

const taskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().allow('').optional(),
  status: Joi.string().valid('pending','in-progress','done').optional()
});

exports.createTask = (req, res) => {
  const { error, value } = taskSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const { title, description, status } = value;
  const createdBy = req.user.id;

  db.run(
    `INSERT INTO tasks (title, description, status, createdBy) VALUES (?, ?, ?, ?)`,
    [title, description || '', status || 'pending', createdBy],
    function (err) {
      if (err) return res.status(500).json({ message: 'DB error', error: err.message });
      db.get(`SELECT * FROM tasks WHERE id = ?`, [this.lastID], (err2, row) => {
        if (err2) return res.status(500).json({ message: 'DB error', error: err2.message });
        res.status(201).json(row);
      });
    }
  );
};

exports.getTasks = (req, res) => {
  if (req.user.role === 'admin') {
    db.all(`SELECT tasks.*, users.username as createdByUsername FROM tasks LEFT JOIN users ON tasks.createdBy = users.id ORDER BY createdAt DESC`, [], (err, rows) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err.message });
      res.json(rows);
    });
  } else {
    db.all(`SELECT tasks.*, users.username as createdByUsername FROM tasks LEFT JOIN users ON tasks.createdBy = users.id WHERE createdBy = ? ORDER BY createdAt DESC`, [req.user.id], (err, rows) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err.message });
      res.json(rows);
    });
  }
};

exports.getTaskById = (req, res) => {
  const id = req.params.id;
  db.get(`SELECT * FROM tasks WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err.message });
    if (!row) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role !== 'admin' && row.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(row);
  });
};

exports.updateTask = (req, res) => {
  const id = req.params.id;
  const { error, value } = taskSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  db.get(`SELECT * FROM tasks WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err.message });
    if (!row) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role !== 'admin' && row.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    db.run(`UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?`,
      [value.title, value.description || '', value.status || 'pending', id],
      function (updateErr) {
        if (updateErr) return res.status(500).json({ message: 'DB error', error: updateErr.message });
        db.get(`SELECT * FROM tasks WHERE id = ?`, [id], (err2, updated) => {
          if (err2) return res.status(500).json({ message: 'DB error', error: err2.message });
          res.json(updated);
        });
      }
    );
  });
};

exports.deleteTask = (req, res) => {
  const id = req.params.id;
  db.get(`SELECT * FROM tasks WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err.message });
    if (!row) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role !== 'admin' && row.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    db.run(`DELETE FROM tasks WHERE id = ?`, [id], function (delErr) {
      if (delErr) return res.status(500).json({ message: 'DB error', error: delErr.message });
      res.json({ message: 'Task deleted' });
    });
  });
};
