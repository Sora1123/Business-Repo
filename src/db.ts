import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const CSV_DIR = path.resolve('CSVfiles');

// Map frontend IDs to filenames
const FILE_MAPPING: Record<string, string> = {
  'paper1': 'Paper 1.csv',
  'paper2sl': 'Paper 2 SL.csv',
  'paper2hl': 'Paper 2 HL.csv',
  'paper3hl': 'Paper 3.csv',
  'sl': 'Flashcards SL.csv',
  'hl': 'Flashcards HL.csv'
};

export interface Question {
  content: string;
}

export interface Flashcard {
  id: number; // Generated index
  front: string;
  back: string;
}

// Helper to read CSV
const readCsv = (filename: string): any[] => {
  const filePath = path.join(CSV_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return [];
  }
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });
};

export const initDb = async () => {
  // No-op for CSV implementation, but kept for compatibility if needed
  console.log('CSV Database initialized');
};

export const getQuestions = async (paperType?: string): Promise<Question[]> => {
  if (!paperType || !FILE_MAPPING[paperType]) {
    return [];
  }
  const filename = FILE_MAPPING[paperType];
  const records = readCsv(filename);
  
  // Expecting CSV with 'Content' column
  return records.map((r: any) => ({
    content: r.Content || r.content || Object.values(r)[0] // Fallback to first column
  }));
};

export const getRandomQuestion = async (paperType: string): Promise<Question | undefined> => {
  const questions = await getQuestions(paperType);
  if (questions.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
};

export const getFlashcards = async (type?: string): Promise<Flashcard[]> => {
  if (!type || !FILE_MAPPING[type]) {
    return [];
  }
  const filename = FILE_MAPPING[type];
  const records = readCsv(filename);

  // Expecting CSV with 'Front' and 'Back' columns
  return records.map((r: any, index: number) => ({
    id: index,
    front: r.Front || r.front,
    back: r.Back || r.back
  }));
};

// Write operations are disabled/removed as per request
export const addQuestion = async () => { throw new Error('Write operations disabled'); };
export const updateQuestion = async () => { throw new Error('Write operations disabled'); };
export const deleteQuestion = async () => { throw new Error('Write operations disabled'); };
export const addFlashcard = async () => { throw new Error('Write operations disabled'); };
export const updateFlashcard = async () => { throw new Error('Write operations disabled'); };
export const deleteFlashcard = async () => { throw new Error('Write operations disabled'); };
