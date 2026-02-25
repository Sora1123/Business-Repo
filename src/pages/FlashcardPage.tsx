import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RefreshCw, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import Papa from 'papaparse';

interface Flashcard {
  id: number;
  type: string;
  front: string;
  back: string;
}

const fileMapping: Record<string, string> = {
  sl: 'Flashcards_SL.csv',
  hl: 'Flashcards_HL.csv',
};

const FlashcardPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const title = type === 'sl' ? 'SL Flashcards' : 'HL Flashcards';

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!type || !fileMapping[type]) {
        setError('Invalid flashcard type.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const fileName = fileMapping[type];
        // Use BASE_URL to ensure correct path in subdirectories
        const baseUrl = import.meta.env.BASE_URL.endsWith('/') 
          ? import.meta.env.BASE_URL 
          : `${import.meta.env.BASE_URL}/`;
        
        const url = `${baseUrl}CSVfiles/${fileName}`;
        console.log(`Fetching from: ${url}`);

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${fileName} (Status: ${response.status} ${response.statusText}) from ${url}`);
        }

        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const data = results.data as any[];
            
            // Map CSV rows to Flashcard objects
            const parsedCards: Flashcard[] = data
              .filter(row => (row.Front || row.front) && (row.Back || row.back))
              .map((row, index) => ({
                id: index,
                type: type,
                front: row.Front || row.front,
                back: row.Back || row.back
              }));

            if (parsedCards.length === 0) {
              setFlashcards([]); // Empty but valid
            } else {
              setFlashcards(parsedCards);
            }
            
            setCurrentIndex(0);
            setIsFlipped(false);
            setLoading(false);
          },
          error: (err) => {
            console.error('CSV Parse Error:', err);
            setError(`Failed to parse ${fileName}: ${err.message}`);
            setLoading(false);
          }
        });

      } catch (err: any) {
        console.error(err);
        setError(`Error: ${err.message}`);
        setLoading(false);
      }
    };
    fetchFlashcards();
  }, [type]);

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
    }
  };

  const currentCard = flashcards[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-8">{error}</div>
      ) : flashcards.length === 0 ? (
        <div className="text-center text-gray-500 p-12 bg-white rounded-2xl shadow-sm">
          No flashcards found in the CSV file.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative h-80 w-full perspective-1000 group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <motion.div
              className="w-full h-full relative preserve-3d transition-all duration-500"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front */}
              <div className="absolute inset-0 backface-hidden bg-white rounded-2xl shadow-md border border-gray-200 flex flex-col items-center justify-center p-8 text-center">
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-4">Term</span>
                <h2 className="text-3xl font-bold text-gray-900">{currentCard.front}</h2>
                <div className="absolute bottom-4 text-gray-400 text-sm flex items-center gap-1">
                  <RotateCw className="w-4 h-4" /> Click to flip
                </div>
              </div>

              {/* Back */}
              <div 
                className="absolute inset-0 backface-hidden bg-indigo-50 rounded-2xl shadow-md border border-indigo-100 flex flex-col items-center justify-center p-8 text-center"
                style={{ transform: 'rotateY(180deg)' }}
              >
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-4">Definition</span>
                <p className="text-xl text-gray-800 leading-relaxed">{currentCard.back}</p>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="font-medium text-gray-500">
              {currentIndex + 1} / {flashcards.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentIndex === flashcards.length - 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardPage;
