# MyQuiz Backend API

A Node.js/Express backend for the MyQuiz application, providing authentication, quiz management, and score tracking.

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Create `.env` file in the `backend/` directory:**
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
ADMIN_EMAIL=admin@myquiz.com
ADMIN_PASSWORD=admin123
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

3. **Start the server:**
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication

**POST** `/api/auth/admin-login`
- Login admin user
- Body: `{ email, password }`
- Response: `{ authenticated: true, token: "jwt_token" }`

**POST** `/api/auth/user-login`
- Login regular user (Firebase auth token)
- Body: `{ token }`
- Response: `{ authenticated: true, email }`

### Quizzes

**GET** `/api/quizzes`
- Get all available quizzes
- Response: `[{ id, title, description, questionCount }]`

**GET** `/api/quizzes/:id`
- Get quiz with all questions
- Response: `{ id, title, questions: [...] }`

**POST** `/api/quizzes`
- Create new quiz (admin only)
- Body: `{ title, description, questions: [...] }`
- Response: `{ id, title }`

**PUT** `/api/quizzes/:id`
- Update quiz (admin only)
- Body: `{ title, description, questions: [...] }`
- Response: `{ id, title, updated: true }`

**DELETE** `/api/quizzes/:id`
- Delete quiz (admin only)
- Response: `{ id, deleted: true }`

### Questions

**POST** `/api/quizzes/:quizId/questions`
- Add questions to quiz (admin only)
- Body: `{ questions: [{ text, type, choices?, correct }] }`
- Response: `{ added: number }`

**DELETE** `/api/quizzes/:quizId/questions/:questionId`
- Delete specific question (admin only)
- Response: `{ id, deleted: true }`

### Scores

**POST** `/api/scores`
- Submit quiz score
- Body: `{ email, quizId, quizTitle, score, total }`
- Response: `{ id, score, saved: true }`

**GET** `/api/scores`
- Get all scores (admin only)
- Response: `[{ id, email, quizTitle, score, total, date }]`

**GET** `/api/scores/:email`
- Get scores for specific user
- Response: `[{ quizTitle, score, total, date }]`

### Admin Management

**PUT** `/api/admin/credentials`
- Update admin email and password (admin only, requires current password)
- Body: `{ currentPassword, newEmail, newPassword }`
- Response: `{ updated: true }`

## Data Models

### Quiz
```javascript
{
  id: string,
  title: string,
  description: string,
  createdAt: date,
  updatedAt: date,
  questions: [Question]
}
```

### Question
```javascript
{
  id: string,
  quizId: string,
  text: string,
  type: 'mc' | 'text' | 'number',
  choices: string[], // for 'mc' type
  correct: number | string, // index for 'mc', string for 'text', number for 'number'
  createdAt: date
}
```

### Score
```javascript
{
  id: string,
  email: string,
  quizId: string,
  quizTitle: string,
  score: number,
  total: number,
  date: date
}
```

## Development

- Uses `nodemon` for auto-restart during development
- CORS enabled for frontend integration
- JWT tokens for admin authentication
- In-memory database (can be replaced with MongoDB, PostgreSQL, etc.)

## Testing

Run smoke test:
```bash
npm test
```

This will verify all endpoints are responding correctly.
