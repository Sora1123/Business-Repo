import express from 'express';
import { getQuestions, getRandomQuestion, getFlashcards } from './db.js';

export function setupRoutes(app: express.Express) {
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
}
