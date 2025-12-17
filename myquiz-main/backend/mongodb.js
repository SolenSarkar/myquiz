import { MongoClient, ObjectId } from 'mongodb'
import config from './config.js'

let client = null
let db = null

export async function connectDB() {
  try {
    client = new MongoClient(config.MONGODB_URI, {
      retryWrites: true,
      w: 'majority'
    })

    await client.connect()
    db = client.db('quizdb')

    // Create collections if they don't exist
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map(c => c.name)

    if (!collectionNames.includes('quizzes')) {
      await db.createCollection('quizzes')
      await db.collection('quizzes').createIndex({ title: 1 })
    }

    if (!collectionNames.includes('scores')) {
      await db.createCollection('scores')
      await db.collection('scores').createIndex({ email: 1 })
      await db.collection('scores').createIndex({ quizId: 1 })
      await db.collection('scores').createIndex({ date: -1 })
    }

    if (!collectionNames.includes('admin')) {
      await db.createCollection('admin')
      // Initialize with default admin credentials
      await db.collection('admin').insertOne({
        _id: 'default',
        email: config.ADMIN_EMAIL,
        password: config.ADMIN_PASSWORD,
        createdAt: new Date()
      })
    }

    // Initialize sample quizzes if collection is empty
    const quizzesCollection = db.collection('quizzes')
    const quizCount = await quizzesCollection.countDocuments()
    
    if (quizCount === 0) {
      const sampleQuizzes = [
        {
          id: 'general-knowledge',
          title: 'General Knowledge',
          description: '12 questions about general knowledge',
          questions: [
            {
              id: 'gk1',
              text: 'Which language runs in a web browser?',
              choices: ['Java', 'C', 'Python', 'JavaScript'],
              correct: 3,
              type: 'mc'
            },
            {
              id: 'gk2',
              text: 'What does CSS stand for?',
              choices: ['Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style System', 'Colorful Style Syntax'],
              correct: 0,
              type: 'mc'
            },
            {
              id: 'gk3',
              text: 'Which HTML element do we put the JavaScript in?',
              choices: ['<js>', '<script>', '<javascript>', '<code>'],
              correct: 1,
              type: 'mc'
            },
            {
              id: 'gk4',
              text: 'Which company developed the React library?',
              choices: ['Google', 'Facebook (Meta)', 'Microsoft', 'Twitter'],
              correct: 1,
              type: 'mc'
            },
            {
              id: 'gk5',
              text: 'Which of these is a JavaScript package manager?',
              choices: ['npm', 'rails', 'composer', 'pip'],
              correct: 0,
              type: 'mc'
            },
            {
              id: 'gk6',
              text: 'Which data structure uses LIFO ordering?',
              choices: ['Queue', 'Stack', 'Tree', 'Graph'],
              correct: 1,
              type: 'mc'
            },
            {
              id: 'gk7',
              text: 'What does HTTP stand for?',
              choices: ['Hyper Transfer Text Protocol', 'HyperText Transfer Protocol', 'HighText Transfer Protocol', 'Hyperlink Transfer Protocol'],
              correct: 1,
              type: 'mc'
            },
            {
              id: 'gk8',
              text: 'Who wrote "Pride and Prejudice"?',
              correct: 'jane austen',
              type: 'text'
            },
            {
              id: 'gk9',
              text: 'What is 7 × 8?',
              correct: 56,
              type: 'number'
            },
            {
              id: 'gk10',
              text: 'Who wrote "1984"?',
              correct: 'george orwell',
              type: 'text'
            },
            {
              id: 'gk11',
              text: 'What is the square root of 144?',
              correct: 12,
              type: 'number'
            },
            {
              id: 'gk12',
              text: 'What is the capital of France?',
              correct: 'paris',
              type: 'text'
            }
          ],
          createdAt: new Date()
        },
        {
          id: 'web-development',
          title: 'Web Development',
          description: '8 questions about web development',
          questions: [
            {
              id: 'wd1',
              text: 'Which company developed the React library?',
              choices: ['Google', 'Facebook (Meta)', 'Microsoft', 'Twitter'],
              correct: 1,
              type: 'mc'
            },
            {
              id: 'wd2',
              text: 'Which of these is a JavaScript package manager?',
              choices: ['npm', 'rails', 'composer', 'pip'],
              correct: 0,
              type: 'mc'
            },
            {
              id: 'wd3',
              text: 'What does HTTP stand for?',
              choices: ['Hyper Transfer Text Protocol', 'HyperText Transfer Protocol', 'HighText Transfer Protocol', 'Hyperlink Transfer Protocol'],
              correct: 1,
              type: 'mc'
            },
            {
              id: 'wd4',
              text: 'Who wrote "To Kill a Mockingbird"?',
              correct: 'harper lee',
              type: 'text'
            },
            {
              id: 'wd5',
              text: 'What is the atomic number of Carbon?',
              correct: 6,
              type: 'number'
            },
            {
              id: 'wd6',
              text: 'What is the capital of Germany?',
              correct: 'berlin',
              type: 'text'
            },
            {
              id: 'wd7',
              text: 'What is the chemical symbol for Gold?',
              correct: 'au',
              type: 'text'
            },
            {
              id: 'wd8',
              text: 'How many continents are there?',
              correct: 7,
              type: 'number'
            }
          ],
          createdAt: new Date()
        },
        {
          id: 'history',
          title: 'History',
          description: '10 questions about world history',
          questions: [
            {
              id: 'h1',
              text: 'In which year did World War II end?',
              choices: ['1943', '1944', '1945', '1946'],
              correct: 2,
              type: 'mc'
            },
            {
              id: 'h2',
              text: 'Who was the first President of the United States?',
              choices: ['Thomas Jefferson', 'George Washington', 'John Adams', 'Benjamin Franklin'],
              correct: 1,
              type: 'mc'
            },
            {
              id: 'h3',
              text: 'In which year did the Titanic sink?',
              choices: ['1910', '1911', '1912', '1913'],
              correct: 2,
              type: 'mc'
            },
            {
              id: 'h4',
              text: 'Which data structure uses LIFO ordering?',
              choices: ['Queue', 'Stack', 'Tree', 'Graph'],
              correct: 1,
              type: 'mc'
            },
            {
              id: 'h5',
              text: 'What does LIFO stand for?',
              correct: 'last in first out',
              type: 'text'
            },
            {
              id: 'h6',
              text: 'In what year did Christopher Columbus reach the Americas?',
              choices: ['1492', '1502', '1512', '1522'],
              correct: 0,
              type: 'mc'
            },
            {
              id: 'h7',
              text: 'Who was the first Emperor of Rome?',
              correct: 'augustus',
              type: 'text'
            },
            {
              id: 'h8',
              text: 'In which year did the French Revolution begin?',
              correct: 1789,
              type: 'number'
            },
            {
              id: 'h9',
              text: 'Who painted the Mona Lisa?',
              correct: 'leonardo da vinci',
              type: 'text'
            },
            {
              id: 'h10',
              text: 'How many years did the Hundred Years War last?',
              correct: 116,
              type: 'number'
            }
          ],
          createdAt: new Date()
        }
      ]

      await quizzesCollection.insertMany(sampleQuizzes)
      console.log('✓ Sample quizzes created')
    }

    console.log('✓ Connected to MongoDB')
    return db
  } catch (err) {
    console.error('✗ Failed to connect to MongoDB:', err.message)
    process.exit(1)
  }
}

export async function disconnectDB() {
  if (client) {
    await client.close()
    console.log('✓ Disconnected from MongoDB')
  }
}

// Quiz operations
export async function getAllQuizzes() {
  const quizzes = await db.collection('quizzes').find({}).toArray()
  return quizzes.map(q => ({
    id: q._id.toString(),
    title: q.title,
    description: q.description,
    questionCount: q.questions?.length || 0,
    createdAt: q.createdAt,
    updatedAt: q.updatedAt
  }))
}

export async function getQuizById(id) {
  try {
    const quiz = await db.collection('quizzes').findOne({ _id: new ObjectId(id) })
    if (!quiz) return null

    return {
      id: quiz._id.toString(),
      title: quiz.title,
      description: quiz.description,
      questions: quiz.questions || [],
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt
    }
  } catch (err) {
    return null
  }
}

export async function createQuiz(title, description = '', questions = []) {
  const result = await db.collection('quizzes').insertOne({
    title,
    description,
    questions: questions.map((q, idx) => ({
      id: `q${idx + 1}`,
      text: q.text,
      type: q.type,
      ...(q.type === 'mc' && { choices: q.choices }),
      correct: q.correct,
      createdAt: new Date()
    })),
    createdAt: new Date(),
    updatedAt: new Date()
  })

  return {
    id: result.insertedId.toString(),
    title,
    description,
    questionCount: questions.length
  }
}

export async function updateQuiz(id, title, description = '', questions = []) {
  try {
    const result = await db.collection('quizzes').findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          description,
          questions: questions.map((q, idx) => ({
            id: q.id || `q${idx + 1}`,
            text: q.text,
            type: q.type,
            ...(q.type === 'mc' && { choices: q.choices }),
            correct: q.correct,
            createdAt: q.createdAt || new Date()
          })),
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )

    if (!result.value) return null

    return {
      id: result.value._id.toString(),
      title: result.value.title,
      description: result.value.description,
      updated: true
    }
  } catch (err) {
    return null
  }
}

export async function deleteQuiz(id) {
  try {
    const result = await db.collection('quizzes').deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  } catch (err) {
    return false
  }
}

// Question operations
export async function addQuestionsToQuiz(quizId, newQuestions) {
  try {
    const quiz = await db.collection('quizzes').findOne({ _id: new ObjectId(quizId) })
    if (!quiz) return 0

    const startIdx = (quiz.questions || []).length
    const formattedQuestions = newQuestions.map((q, idx) => ({
      id: `q${startIdx + idx + 1}`,
      text: q.text,
      type: q.type,
      ...(q.type === 'mc' && { choices: q.choices }),
      correct: q.correct,
      createdAt: new Date()
    }))

    await db.collection('quizzes').updateOne(
      { _id: new ObjectId(quizId) },
      {
        $push: { questions: { $each: formattedQuestions } },
        $set: { updatedAt: new Date() }
      }
    )

    return formattedQuestions.length
  } catch (err) {
    return 0
  }
}

export async function deleteQuestion(quizId, questionId) {
  try {
    const result = await db.collection('quizzes').updateOne(
      { _id: new ObjectId(quizId) },
      {
        $pull: { questions: { id: questionId } },
        $set: { updatedAt: new Date() }
      }
    )

    return result.modifiedCount > 0
  } catch (err) {
    return false
  }
}

// Score operations
export async function getAllScores() {
  const scores = await db.collection('scores')
    .find({})
    .sort({ date: -1 })
    .toArray()

  return scores.map(s => ({
    id: s._id.toString(),
    email: s.email,
    quizId: s.quizId,
    quizTitle: s.quizTitle,
    score: s.score,
    total: s.total,
    date: s.date
  }))
}

export async function getScoresByEmail(email) {
  const scores = await db.collection('scores')
    .find({ email: { $regex: email, $options: 'i' } })
    .sort({ date: -1 })
    .toArray()

  return scores.map(s => ({
    id: s._id.toString(),
    email: s.email,
    quizId: s.quizId,
    quizTitle: s.quizTitle,
    score: s.score,
    total: s.total,
    date: s.date
  }))
}

export async function addScore(email, quizId, quizTitle, score, total) {
  const result = await db.collection('scores').insertOne({
    email,
    quizId,
    quizTitle,
    score,
    total,
    date: new Date()
  })

  return {
    id: result.insertedId.toString(),
    email,
    quizId,
    quizTitle,
    score,
    total,
    date: new Date()
  }
}

// Admin credentials
export async function getAdminCredentials() {
  const admin = await db.collection('admin').findOne({ _id: 'default' })
  return admin || { email: config.ADMIN_EMAIL, password: config.ADMIN_PASSWORD }
}

export async function updateAdminCredentials(newEmail, newPassword) {
  const result = await db.collection('admin').updateOne(
    { _id: 'default' },
    {
      $set: {
        email: newEmail,
        password: newPassword,
        updatedAt: new Date()
      }
    },
    { upsert: true }
  )

  return result.modifiedCount > 0 || result.upsertedCount > 0
}
