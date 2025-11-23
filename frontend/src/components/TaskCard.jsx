import React from 'react';
import { Link } from 'react-router-dom';

export default function TaskCard({ task, onDelete, canEdit }) {
  return (
    <div className="task-card">
      <div className="task-head">
        <h3>{task.title}</h3>
        <span className="badge">{task.status}</span>
      </div>
      <p className="task-desc">{task.description}</p>
      <div className="task-meta">
        <small>By: {task.createdByUsername || 'Unknown'}</small>
        <div>
          {canEdit && <Link to={`/task/edit/${task.id}`} className="btn-sm">Edit</Link>}
          <button className="btn-sm danger" onClick={() => onDelete(task.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}
