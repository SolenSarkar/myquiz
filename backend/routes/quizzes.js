import express from 'express'
import {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  addQuestionsToQuiz,
  deleteQuestion
} from '../mongodb.js'
import { verifyToken, verifyAdmin } from '../middleware.js'

const router = express.Router()

// Get all quizzes (public)
router.get('/', async (req, res) => {
  try {
    const quizzes = await getAllQuizzes()
    res.json(quizzes)
  } catch (err) {
    console.error('Get quizzes error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get specific quiz with questions
router.get('/:id', async (req, res) => {
  try {
    const quiz = await getQuizById(req.params.id)

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' })
    }

    res.json(quiz)
  } catch (err) {
    console.error('Get quiz error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create new quiz (admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { title, description, questions } = req.body

    if (!title) {
      return res.status(400).json({ error: 'Title is required' })
    }

    const quiz = await createQuiz(title, description || '', questions || [])
    res.status(201).json(quiz)
  } catch (err) {
    console.error('Create quiz error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update quiz (admin only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { title, description, questions } = req.body

    if (!title) {
      return res.status(400).json({ error: 'Title is required' })
    }

    const quiz = await updateQuiz(req.params.id, title, description || '', questions || [])

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' })
    }

    res.json(quiz)
  } catch (err) {
    console.error('Update quiz error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete quiz (admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const deleted = await deleteQuiz(req.params.id)

    if (!deleted) {
      return res.status(404).json({ error: 'Quiz not found' })
    }

    res.json({
      id: req.params.id,
      deleted: true
    })
  } catch (err) {
    console.error('Delete quiz error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Add questions to quiz (admin only)
router.post('/:quizId/questions', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { questions } = req.body

    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'Questions array required' })
    }

    const added = await addQuestionsToQuiz(req.params.quizId, questions)

    if (added === 0) {
      return res.status(404).json({ error: 'Quiz not found' })
    }

    res.json({
      quizId: req.params.quizId,
      added
    })
  } catch (err) {
    console.error('Add questions error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete specific question (admin only)
router.delete('/:quizId/questions/:questionId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const deleted = await deleteQuestion(req.params.quizId, req.params.questionId)

    if (!deleted) {
      return res.status(404).json({ error: 'Question not found' })
    }

    res.json({
      id: req.params.questionId,
      deleted: true
    })
  } catch (err) {
    console.error('Delete question error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
