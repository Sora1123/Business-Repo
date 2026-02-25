import express from 'express';
import { getQuestions, getRandomQuestion, addQuestion, deleteQuestion, updateQuestion, getFlashcards, addFlashcard, updateFlashcard, deleteFlashcard } from './db.js';

const PASSWORD = "password01#";

export function setupRoutes(app: express.Express) {
  // Middleware to check password for write operations
  const checkPassword = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const password = req.headers['x-admin-password'];
    if (password !== PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized: Incorrect password' });
    }
    next();
  };

  // API Routes - Questions
  app.get('/api/questions', async (req, res) => {
    const { paperType } = req.query;
    try {
      const questions = await getQuestions(paperType as string);
      res.json(questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).json({ error: 'Failed to fetch questions' });
    }
  });

  app.get('/api/questions/random', async (req, res) => {
    const { paperType } = req.query;
    if (!paperType) {
      return res.status(400).json({ error: 'paperType is required' });
    }
    try {
      const question = await getRandomQuestion(paperType as string);
      res.json(question || null);
    } catch (error) {
      console.error('Error fetching random question:', error);
      res.status(500).json({ error: 'Failed to fetch random question' });
    }
  });

  app.post('/api/questions', checkPassword, async (req, res) => {
    const { paperType, content } = req.body;
    if (!paperType || !content) {
      return res.status(400).json({ error: 'paperType and content are required' });
    }
    try {
      await addQuestion(paperType, content);
      res.status(201).json({ message: 'Question added successfully' });
    } catch (error) {
      console.error('Error adding question:', error);
      res.status(500).json({ error: 'Failed to add question' });
    }
  });

  app.put('/api/questions/:id', checkPassword, async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'content is required' });
    }
    try {
      await updateQuestion(parseInt(id), content);
      res.json({ message: 'Question updated successfully' });
    } catch (error) {
      console.error('Error updating question:', error);
      res.status(500).json({ error: 'Failed to update question' });
    }
  });

  app.delete('/api/questions/:id', checkPassword, async (req, res) => {
    const { id } = req.params;
    try {
      await deleteQuestion(parseInt(id));
      res.json({ message: 'Question deleted successfully' });
    } catch (error) {
      console.error('Error deleting question:', error);
      res.status(500).json({ error: 'Failed to delete question' });
    }
  });

  // API Routes - Flashcards
  app.get('/api/flashcards', async (req, res) => {
    const { type } = req.query;
    try {
      const flashcards = await getFlashcards(type as string);
      res.json(flashcards);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      res.status(500).json({ error: 'Failed to fetch flashcards' });
    }
  });

  app.post('/api/flashcards', checkPassword, async (req, res) => {
    const { type, front, back } = req.body;
    if (!type || !front || !back) {
      return res.status(400).json({ error: 'type, front, and back are required' });
    }
    try {
      await addFlashcard(type, front, back);
      res.status(201).json({ message: 'Flashcard added successfully' });
    } catch (error) {
      console.error('Error adding flashcard:', error);
      res.status(500).json({ error: 'Failed to add flashcard' });
    }
  });

  app.put('/api/flashcards/:id', checkPassword, async (req, res) => {
    const { id } = req.params;
    const { front, back } = req.body;
    if (!front || !back) {
      return res.status(400).json({ error: 'front and back are required' });
    }
    try {
      await updateFlashcard(parseInt(id), front, back);
      res.json({ message: 'Flashcard updated successfully' });
    } catch (error) {
      console.error('Error updating flashcard:', error);
      res.status(500).json({ error: 'Failed to update flashcard' });
    }
  });

  app.delete('/api/flashcards/:id', checkPassword, async (req, res) => {
    const { id } = req.params;
    try {
      await deleteFlashcard(parseInt(id));
      res.json({ message: 'Flashcard deleted successfully' });
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      res.status(500).json({ error: 'Failed to delete flashcard' });
    }
  });
}
