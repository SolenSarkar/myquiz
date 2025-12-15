import { MongoClient } from 'mongodb'
import config from './config.js'

async function resetQuizzes() {
  const client = new MongoClient(config.MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('quizdb')
    const quizzesCollection = db.collection('quizzes')
    
    // Delete all quizzes
    const deleteResult = await quizzesCollection.deleteMany({})
    console.log(`Deleted ${deleteResult.deletedCount} quizzes`)
    
    // Create new quizzes with all questions
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
    
    const insertResult = await quizzesCollection.insertMany(sampleQuizzes)
    console.log(`Created ${insertResult.insertedCount} quizzes`)
    
  } finally {
    await client.close()
  }
}

resetQuizzes().catch(console.error)
