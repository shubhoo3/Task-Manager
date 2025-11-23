const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user','admin').optional()
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

const createToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

exports.register = async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const { username, password, role } = value;
  try {
    const hashed = await bcrypt.hash(password, 10);
    db.run(
      `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
      [username, hashed, role || 'user'],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE')) return res.status(400).json({ message: 'Username taken' });
          return res.status(500).json({ message: 'DB error', error: err.message });
        }
        const user = { id: this.lastID, username, role: role || 'user' };
        const token = createToken(user);
        res.json({ token, user });
      }
    );
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const { username, password } = value;
  db.get(`SELECT id, username, password, role FROM users WHERE username = ?`, [username], async (err, row) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err.message });
    if (!row) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, row.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const user = { id: row.id, username: row.username, role: row.role };
    const token = createToken(user);
    res.json({ token, user });
  });
};
