import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve('questions.db');
const db = new Database(dbPath);

// Initialize the database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    paper_type TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface Question {
  id: number;
  paper_type: string;
  content: string;
  created_at: string;
}

export const getQuestions = (paperType?: string): Question[] => {
  if (paperType) {
    const stmt = db.prepare('SELECT * FROM questions WHERE paper_type = ? ORDER BY created_at DESC');
    return stmt.all(paperType) as Question[];
  }
  const stmt = db.prepare('SELECT * FROM questions ORDER BY created_at DESC');
  return stmt.all() as Question[];
};

export const getRandomQuestion = (paperType: string): Question | undefined => {
  const stmt = db.prepare('SELECT * FROM questions WHERE paper_type = ? ORDER BY RANDOM() LIMIT 1');
  return stmt.get(paperType) as Question | undefined;
};

export const addQuestion = (paperType: string, content: string): void => {
  const stmt = db.prepare('INSERT INTO questions (paper_type, content) VALUES (?, ?)');
  stmt.run(paperType, content);
};

export const deleteQuestion = (id: number): void => {
  const stmt = db.prepare('DELETE FROM questions WHERE id = ?');
  stmt.run(id);
};

export default db;
