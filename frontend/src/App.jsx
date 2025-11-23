import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateEditTask from './pages/CreateEditTask';
import ProtectedRoute from './components/ProtectedRoute';

export default function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }/>
            <Route path="/task/new" element={
              <ProtectedRoute>
                <CreateEditTask />
              </ProtectedRoute>
            }/>
            <Route path="/task/edit/:id" element={
              <ProtectedRoute>
                <CreateEditTask />
              </ProtectedRoute>
            }/>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
