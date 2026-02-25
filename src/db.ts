import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.TURSO_DATABASE_URL || 'file:questions.db';
const authToken = process.env.TURSO_AUTH_TOKEN;

const db = createClient({
  url,
  authToken,
});

// Initialize the database schema
export const initDb = async () => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      paper_type TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS flashcards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      front TEXT NOT NULL,
      back TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

export interface Question {
  id: number;
  paper_type: string;
  content: string;
  created_at: string;
}

export interface Flashcard {
  id: number;
  type: string;
  front: string;
  back: string;
  created_at: string;
}

export const getQuestions = async (paperType?: string): Promise<Question[]> => {
  if (paperType) {
    const rs = await db.execute({
      sql: 'SELECT * FROM questions WHERE paper_type = ? ORDER BY created_at DESC',
      args: [paperType]
    });
    return rs.rows as unknown as Question[];
  }
  const rs = await db.execute('SELECT * FROM questions ORDER BY created_at DESC');
  return rs.rows as unknown as Question[];
};

export const getRandomQuestion = async (paperType: string): Promise<Question | undefined> => {
  const rs = await db.execute({
    sql: 'SELECT * FROM questions WHERE paper_type = ? ORDER BY RANDOM() LIMIT 1',
    args: [paperType]
  });
  return (rs.rows[0] as unknown as Question) || undefined;
};

export const addQuestion = async (paperType: string, content: string): Promise<void> => {
  await db.execute({
    sql: 'INSERT INTO questions (paper_type, content) VALUES (?, ?)',
    args: [paperType, content]
  });
};

export const updateQuestion = async (id: number, content: string): Promise<void> => {
  await db.execute({
    sql: 'UPDATE questions SET content = ? WHERE id = ?',
    args: [content, id]
  });
};

export const deleteQuestion = async (id: number): Promise<void> => {
  await db.execute({
    sql: 'DELETE FROM questions WHERE id = ?',
    args: [id]
  });
};

// Flashcard operations
export const getFlashcards = async (type?: string): Promise<Flashcard[]> => {
  if (type) {
    const rs = await db.execute({
      sql: 'SELECT * FROM flashcards WHERE type = ? ORDER BY created_at DESC',
      args: [type]
    });
    return rs.rows as unknown as Flashcard[];
  }
  const rs = await db.execute('SELECT * FROM flashcards ORDER BY created_at DESC');
  return rs.rows as unknown as Flashcard[];
};

export const addFlashcard = async (type: string, front: string, back: string): Promise<void> => {
  await db.execute({
    sql: 'INSERT INTO flashcards (type, front, back) VALUES (?, ?, ?)',
    args: [type, front, back]
  });
};

export const updateFlashcard = async (id: number, front: string, back: string): Promise<void> => {
  await db.execute({
    sql: 'UPDATE flashcards SET front = ?, back = ? WHERE id = ?',
    args: [front, back, id]
  });
};

export const deleteFlashcard = async (id: number): Promise<void> => {
  await db.execute({
    sql: 'DELETE FROM flashcards WHERE id = ?',
    args: [id]
  });
};

export default db;
