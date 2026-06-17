# BlogSpace - A Full Stack Blogging Platform

A modern blogging platform built with the MERN stack featuring a clean Medium/Dev.to inspired UI.

## Live Demo

Frontend: https://blogspace-madhupriyakb.vercel.app

## Tech Stack

- Backend: Node.js, Express.js, MongoDB Atlas, JWT Authentication, bcryptjs, cookie-parser, cors
- Frontend: React, Vite, React Router DOM, Axios, React Hot Toast

## Features

- User Registration and Login with JWT Authentication
- Create, Read, Update and Delete Blog Posts
- Comment on Blog Posts
- Category based filtering
- Search posts by title, category or author
- My Stories dashboard with writing stats
- Read time estimation
- Responsive design with smooth hover animations

## Project Structure

```
blogspace/
├── backend/
│   ├── config/db.js
│   ├── middleware/authMiddleware.js
│   ├── models/User.js
│   ├── models/Post.js
│   ├── models/Comment.js
│   ├── routes/authRoutes.js
│   ├── routes/postRoutes.js
│   ├── routes/commentRoutes.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/Navbar.jsx
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/Home.jsx
│   │   ├── pages/Login.jsx
│   │   ├── pages/Register.jsx
│   │   ├── pages/CreatePost.jsx
│   │   ├── pages/EditPost.jsx
│   │   ├── pages/SinglePost.jsx
│   │   ├── pages/MyPosts.jsx
│   │   └── utils/api.js
└── README.md
```

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/MadhuPriya0920/blogspace
cd blogspace
```

2. Install backend dependencies

```bash
cd backend
npm install
```

3. Install frontend dependencies

```bash
cd frontend
npm install
```

4. Create .env file in backend folder

```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

5. Create .env file in frontend folder

```
VITE_API_URL=http://localhost:5000/api
```

6. Run backend

```bash
cd backend
npm run dev
```

7. Run frontend

```bash
cd frontend
npm run dev
```

8. Open http://localhost:5173

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout

### Posts
- GET /api/posts
- GET /api/posts/:id
- POST /api/posts
- PUT /api/posts/:id
- DELETE /api/posts/:id
- GET /api/posts/user/myposts

### Comments
- GET /api/comments/:postId
- POST /api/comments/:postId
- DELETE /api/comments/:id

## Deployment

- Backend: Render
- Frontend: Vercel
- Database: MongoDB Atlas

## Developer

Madhu Priya K B
GitHub: https://github.com/MadhuPriya0920
