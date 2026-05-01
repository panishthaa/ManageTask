# Team Task Manager

A full-stack project management application built for an assignment. It allows users to create projects, manage tasks, and collaborate with team members using role-based access control.

## 🚀 Live Demo
**Frontend:** [Link to Railway Frontend]
**Backend:** [Link to Railway Backend]

## ✨ Features
- **Authentication:** Secure signup and login using JWT.
- **Project Management:** Create, update, and delete projects.
- **Team Collaboration:** Invite users to projects as Admins or Members.
- **Task Tracking:** Create tasks, assign them to members, set priorities, and track status.
- **Dashboard:** At-a-glance overview of total tasks, in-progress work, and overdue items.
- **Role-Based Access:** 
  - **Project Admin:** Full control over projects, members, and tasks.
  - **Project Member:** View tasks and update status of assigned tasks.

## 🛠️ Tech Stack
- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Axios, Lucide React.
- **Backend:** NestJS 11, Prisma ORM, Passport.js (JWT Strategy), Bcrypt.
- **Database:** NeonDB (PostgreSQL).
- **Deployment:** Railway.

## 📦 Local Setup

### Prerequisites
- Node.js (v18+)
- NeonDB or local PostgreSQL instance

### Backend
1. `cd backend`
2. `npm install`
3. Create `.env` file:
   ```env
   DATABASE_URL="your-neon-db-url"
   JWT_SECRET="your-secret"
   PORT=4000
   ```
4. `npx prisma migrate dev`
5. `npm run start:dev`

### Frontend
1. `cd frontend`
2. `npm install`
3. Create `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:4000/api"
   ```
4. `npm run dev`

## 📄 License
This project is for educational purposes.
