Task Manager with Role-Based Access (React + Node.js + SQLite)

A full-stack Task Management System with authentication, authorization, and CRUD operations.
This project uses:

Frontend: React (Vite)

Backend: Node.js + Express

Database: SQLite (zero setup)

Authentication: JWT + bcrypt

RBAC: Admin & User roles

🚀 Features
👤 User Management

Register & Login

Password hashing using bcryptjs

JWT authentication stored in localStorage

Users can only manage their own tasks

🛡 Role-Based Access Control

Normal Users

Create / Edit / Delete their own tasks

View only their own tasks

Admin Users

View all tasks

Delete any task

📝 Task Management

Title, description, status (Pending / In-progress / Done)

Fully responsive UI

Clean and simple UX

Create .env File

Create a .env inside the backend folder:

JWT_SECRET=your_super_secret_key
PORT=5000
