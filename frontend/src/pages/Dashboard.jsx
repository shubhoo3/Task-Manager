import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import TaskCard from '../components/TaskCard';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard(){
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get('/tasks');
      setTasks(res.data);
    } catch (error) {
      setErr(error.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      alert(error.response?.data?.message || 'Delete failed');
    }
  };

  const canEdit = (task) => user?.role === 'admin' || task.createdBy === user?.id;

  return (
    <div>
      <div className="page-head">
        <h2>Dashboard</h2>
        <div>
          <button className="btn" onClick={() => navigate('/task/new')}>Create Task</button>
        </div>
      </div>

      {loading ? <p>Loading...</p> : null}
      {err && <div className="error">{err}</div>}

      <div className="grid">
        {tasks.length === 0 && !loading ? <p>No tasks yet.</p> : tasks.map(task => (
          <TaskCard key={task.id} task={task} onDelete={handleDelete} canEdit={canEdit(task)} />
        ))}
      </div>
    </div>
  );
}
