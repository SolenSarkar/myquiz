import express from 'express'
import { getAllScores, getScoresByEmail, addScore } from '../mongodb.js'
import { verifyToken, verifyAdmin } from '../middleware.js'

const router = express.Router()

// Submit score (public)
router.post('/', async (req, res) => {
  try {
    const { email, quizId, quizTitle, score, total } = req.body

    if (!email || !quizId || !quizTitle || score === undefined || !total) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    if (score > total) {
      return res.status(400).json({ error: 'Score cannot exceed total' })
    }

    const savedScore = await addScore(email, quizId, quizTitle, score, total)

    res.status(201).json({
      id: savedScore.id,
      score: savedScore.score,
      total: savedScore.total,
      saved: true,
      date: savedScore.date
    })
  } catch (err) {
    console.error('Add score error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get all scores (admin only)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const scores = await getAllScores()
    res.json(scores)
  } catch (err) {
    console.error('Get all scores error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get scores by email
router.get('/:email', async (req, res) => {
  try {
    const scores = await getScoresByEmail(req.params.email)

    res.json({
      email: req.params.email,
      scores,
      count: scores.length
    })
  } catch (err) {
    console.error('Get scores error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
