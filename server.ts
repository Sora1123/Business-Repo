import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { getQuestions, getRandomQuestion, addQuestion, deleteQuestion } from './src/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/questions', (req, res) => {
    const { paperType } = req.query;
    try {
      const questions = getQuestions(paperType as string);
      res.json(questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).json({ error: 'Failed to fetch questions' });
    }
  });

  app.get('/api/questions/random', (req, res) => {
    const { paperType } = req.query;
    if (!paperType) {
      return res.status(400).json({ error: 'paperType is required' });
    }
    try {
      const question = getRandomQuestion(paperType as string);
      res.json(question || null);
    } catch (error) {
      console.error('Error fetching random question:', error);
      res.status(500).json({ error: 'Failed to fetch random question' });
    }
  });

  app.post('/api/questions', (req, res) => {
    const { paperType, content } = req.body;
    if (!paperType || !content) {
      return res.status(400).json({ error: 'paperType and content are required' });
    }
    try {
      addQuestion(paperType, content);
      res.status(201).json({ message: 'Question added successfully' });
    } catch (error) {
      console.error('Error adding question:', error);
      res.status(500).json({ error: 'Failed to add question' });
    }
  });

  app.delete('/api/questions/:id', (req, res) => {
    const { id } = req.params;
    try {
      deleteQuestion(parseInt(id));
      res.json({ message: 'Question deleted successfully' });
    } catch (error) {
      console.error('Error deleting question:', error);
      res.status(500).json({ error: 'Failed to delete question' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
