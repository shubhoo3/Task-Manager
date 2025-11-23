import React, { useState } from 'react';

export default function TaskForm({ initial = { title: '', description: '', status: 'pending' }, onSubmit }) {
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [status, setStatus] = useState(initial.status);

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, status });
  };

  return (
    <form className="task-form" onSubmit={submit}>
      <div className="form-group">
        <label>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <button className="btn save-btn">Save</button>
    </form>
  );
}
