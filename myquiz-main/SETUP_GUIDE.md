# MyQuiz - Full Stack Setup Guide

Complete quiz application with React frontend and Node.js/Express backend.

## Project Structure

```
myquiz/
├── src/                    # React frontend (Vite)
│   ├── components/
│   ├── pages/
│   ├── admin/
│   ├── App.jsx
│   └── main.jsx
├── backend/               # Node.js/Express API
│   ├── routes/
│   ├── db.js
│   ├── middleware.js
│   ├── config.js
│   └── index.js
├── package.json           # Frontend dependencies
└── backend/package.json   # Backend dependencies
```

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Git (for cloning)

### 1. Frontend Setup

```bash
cd d:\MYQUIZ

# Copy environment variables
copy .env.example .env

# Edit .env and add your Firebase credentials
# VITE_API_BASE should be http://localhost:5000/api for local development

# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev
```

### 2. Backend Setup

```bash
cd d:\MYQUIZ\backend

# Copy environment variables
copy .env.example .env

# Edit .env if needed (defaults should work for local development)

# Install dependencies
npm install

# Start development server (runs on http://localhost:5000)
npm run dev

# In another terminal, run smoke tests
npm test
```

## API Endpoints

### Authentication
- `POST /api/auth/admin-login` - Admin login (returns JWT token)
- `POST /api/auth/user-login` - User login
- `PUT /api/auth/admin/credentials` - Update admin credentials (admin only)

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/:id` - Get specific quiz with questions
- `POST /api/quizzes` - Create new quiz (admin only)
- `PUT /api/quizzes/:id` - Update quiz (admin only)
- `DELETE /api/quizzes/:id` - Delete quiz (admin only)
- `POST /api/quizzes/:quizId/questions` - Add questions (admin only)
- `DELETE /api/quizzes/:quizId/questions/:questionId` - Delete question (admin only)

### Scores
- `POST /api/scores` - Submit score
- `GET /api/scores/:email` - Get scores for user
- `GET /api/scores` - Get all scores (admin only)

## Features

### Frontend
✅ Responsive design (mobile, tablet, desktop)
✅ Quiz with 3 question types (multiple choice, text, number)
✅ Admin authentication with session management
✅ Admin dashboard with score tracking
✅ Admin edit page for managing quizzes
✅ Add/delete questions in batch
✅ Show/hide password fields
✅ Manage admin credentials
✅ Firebase integration for user auth

### Backend
✅ RESTful API with Express
✅ JWT-based admin authentication
✅ CORS support for frontend integration
✅ In-memory database (can be replaced with MongoDB/PostgreSQL)
✅ Admin-only protected routes
✅ Score persistence
✅ Quiz and question management
✅ Error handling middleware
✅ Environment-based configuration

## Environment Variables

### Frontend (.env)
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_ADMIN_EMAIL=admin@example.com
VITE_ADMIN_PASSWORD=admin123
VITE_API_BASE=http://localhost:5000/api
```

### Backend (.env)
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
ADMIN_EMAIL=admin@myquiz.com
ADMIN_PASSWORD=admin123
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Development Workflow

### Running Everything Locally

**Terminal 1 - Frontend:**
```bash
cd d:\MYQUIZ
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd d:\MYQUIZ\backend
npm run dev
```

**Terminal 3 - Tests:**
```bash
cd d:\MYQUIZ\backend
npm test
```

Access the app at `http://localhost:5173`

### Admin Login
- Email: `admin@example.com` (or your VITE_ADMIN_EMAIL)
- Password: `admin123` (or your VITE_ADMIN_PASSWORD)

## Production Deployment

### Frontend (Vite)
```bash
npm run build        # Creates dist/ folder
npm run preview      # Test production build locally
```

Deploy `dist/` to:
- Vercel, Netlify, AWS S3, GitHub Pages, etc.

### Backend (Node.js)
```bash
npm install --production
npm start
```

Deploy to:
- Heroku, Railway, Render, AWS EC2, DigitalOcean, etc.

### Important for Production
1. Change `JWT_SECRET` to a strong random string
2. Update `ADMIN_PASSWORD` 
3. Change `NODE_ENV` to `production`
4. Use a real database (MongoDB, PostgreSQL)
5. Enable HTTPS on frontend and backend
6. Set `ALLOWED_ORIGINS` to your production domain

## Testing

### Backend Smoke Test
```bash
cd backend
npm test
```

Verifies all endpoints are responding correctly.

### Manual Testing
Use Postman, Insomnia, or curl to test endpoints:

```bash
# Get all quizzes
curl http://localhost:5000/api/quizzes

# Admin login
curl -X POST http://localhost:5000/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@myquiz.com","password":"admin123"}'

# Submit score
curl -X POST http://localhost:5000/api/scores \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","quizId":"1","quizTitle":"Web Dev","score":8,"total":10}'
```

## Troubleshooting

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check `VITE_API_BASE` in frontend .env
- Ensure CORS is enabled (check `ALLOWED_ORIGINS` in backend)

### Admin login not working
- Verify credentials in `.env` files match
- Check network tab in browser DevTools
- Ensure JWT_SECRET is set in backend .env

### Port already in use
```bash
# Kill process on port 5000 (backend)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 5173 (frontend)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

## Tech Stack

### Frontend
- React 18.2.0
- Vite 5.0.0
- React Router DOM 6.14.0
- Axios 1.4.0
- Firebase 12.6.0

### Backend
- Node.js 16+
- Express 4.18.2
- JSON Web Tokens (JWT)
- CORS enabled
- In-memory/file storage (upgradeable to MongoDB)

## Contributing

1. Create feature branch: `git checkout -b feature/feature-name`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/feature-name`
4. Create Pull Request

## License

MIT License - feel free to use this project for learning and development.

## Support

For issues or questions:
1. Check existing GitHub issues
2. Create a detailed issue with reproduction steps
3. Join our Discord/community chat

---

Happy quizzing! 🎉
