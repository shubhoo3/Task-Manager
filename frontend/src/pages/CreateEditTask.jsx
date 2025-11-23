import React, { useEffect, useState } from 'react';
import TaskForm from '../components/TaskForm';
import API from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';

export default function CreateEditTask(){
  const navigate = useNavigate();
  const { id } = useParams();
  const [initial, setInitial] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (id) {
      API.get(`/tasks/${id}`).then(res => {
        setInitial(res.data);
      }).catch(err => {
        setErr(err.response?.data?.message || 'Failed to load task');
      });
    } else {
      setInitial({ title: '', description: '', status: 'pending' });
    }
  }, [id]);

  const onSubmit = async (payload) => {
    try {
      if (id) {
        await API.put(`/tasks/${id}`, payload);
      } else {
        await API.post('/tasks', payload);
      }
      navigate('/');
    } catch (error) {
      setErr(error.response?.data?.message || 'Save failed');
    }
  };

  if (!initial) return <p>Loading form...</p>;

  return (
    <div>
      <h2>{id ? 'Edit Task' : 'Create Task'}</h2>
      {err && <div className="error">{err}</div>}
      <TaskForm initial={initial} onSubmit={onSubmit} />
    </div>
  );
}
