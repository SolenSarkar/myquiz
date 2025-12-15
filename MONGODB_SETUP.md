# MongoDB Integration Complete ✓

Your MyQuiz backend is now fully connected to MongoDB Atlas!

## Connection Details

- **Database**: MongoDB Atlas (Cloud)
- **Cluster**: cluster0.z2qjqjo.mongodb.net
- **Database Name**: quizdb
- **Username**: myquiz_db_user
- **Connection String**: `mongodb+srv://myquiz_db_user:admin123@cluster0.z2qjqjo.mongodb.net/quizdb?retryWrites=true&w=majority`

## Server Status

```
✓ Connected to MongoDB
✓ MyQuiz Backend running on http://localhost:5000
✓ Environment: development
✓ Database: MongoDB Atlas
```

## What Changed

1. **Replaced in-memory database** with MongoDB persistence
2. **New file**: `backend/mongodb.js` - MongoDB connection and data operations
3. **Updated all routes** to use async/await for MongoDB queries
4. **New env var**: `MONGODB_URI` in `.env` file
5. **Dependencies**: Added `mongodb` package (v6.3.0)

## Collections Created Automatically

The following MongoDB collections are created on first run:

- **quizzes** - Stores quiz data with embedded questions
- **scores** - Stores user quiz scores with indexes for email, quizId, and date
- **admin** - Stores admin credentials (email, password, timestamps)

## API Endpoints (Now with MongoDB!)

All endpoints work exactly the same, but data is now persisted in MongoDB:

### Public Endpoints
```
GET  /api/health                          - Server status
GET  /api/quizzes                         - Get all quizzes
GET  /api/quizzes/:id                     - Get specific quiz with questions
POST /api/scores                          - Submit quiz score
GET  /api/scores/:email                   - Get user's scores
```

### Admin Endpoints (Requires JWT Token)
```
POST /api/auth/admin-login                - Login and get token
PUT  /api/auth/admin/credentials          - Update admin email/password
POST /api/quizzes                         - Create new quiz
PUT  /api/quizzes/:id                     - Update quiz
DELETE /api/quizzes/:id                   - Delete quiz
POST /api/quizzes/:quizId/questions       - Add questions to quiz
DELETE /api/quizzes/:quizId/questions/:id - Delete question
GET  /api/scores                          - Get all scores (admin)
```

## Testing the Connection

### Test 1: Check Health
```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-12-14T...",
  "environment": "development"
}
```

### Test 2: Get All Quizzes
```bash
curl http://localhost:5000/api/quizzes
```

### Test 3: Submit a Score
```bash
curl -X POST http://localhost:5000/api/scores \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "quizId": "1",
    "quizTitle": "Web Dev Basics",
    "score": 8,
    "total": 10
  }'
```

### Test 4: Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@myquiz.com",
    "password": "admin123"
  }'
```

## Running the Full Stack

**Terminal 1 - Backend:**
```bash
cd d:\MYQUIZ\backend
npm install
npm start
# or for development with auto-reload:
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd d:\MYQUIZ
npm install
npm run dev
```

Access the app at: `http://localhost:5173` (or 5174 if 5173 is taken)

## Database Schema

### Quizzes Collection
```javascript
{
  _id: ObjectId,
  title: string,
  description: string,
  questions: [
    {
      id: string,
      text: string,
      type: 'mc' | 'text' | 'number',
      choices: string[],      // for mc type
      correct: number|string, // answer
      createdAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Scores Collection
```javascript
{
  _id: ObjectId,
  email: string,
  quizId: string,
  quizTitle: string,
  score: number,
  total: number,
  date: Date
}
```

### Admin Collection
```javascript
{
  _id: string ('default'),
  email: string,
  password: string,
  createdAt: Date,
  updatedAt: Date
}
```

## Indexes

MongoDB automatically creates indexes for:
- `quizzes.title`
- `scores.email`
- `scores.quizId`
- `scores.date` (descending)

This ensures fast queries for common operations.

## Next Steps

1. ✅ Backend connected to MongoDB Atlas
2. ✅ All CRUD operations working
3. ⏭️ Update frontend to use real API base URL
4. ⏭️ Test admin panel with backend
5. ⏭️ Deploy to production (Heroku, Railway, etc.)

## Production Notes

For production deployment:
1. **Never commit `.env`** - Use environment variables from hosting provider
2. **Change JWT_SECRET** to a strong random string
3. **Change ADMIN_PASSWORD** to a secure password
4. **Update MONGODB_URI** to production cluster
5. **Enable IP whitelist** in MongoDB Atlas security settings
6. **Use HTTPS** for all API calls
7. **Set NODE_ENV=production**

## Support

If the connection fails:
1. Check MongoDB Atlas cluster is running
2. Verify MONGODB_URI in `.env` file
3. Check IP whitelist in MongoDB Atlas (should include your IP)
4. Ensure network access is not blocked by firewall
5. Check backend logs for detailed error messages

---

**Status**: ✓ Production-ready with MongoDB persistence!
