import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RefreshCw, Copy, Check, FileText } from 'lucide-react';
import Papa from 'papaparse';

const paperNames: Record<string, string> = {
  paper1: 'Paper 1',
  paper2sl: 'Paper 2 SL',
  paper2hl: 'Paper 2 HL',
  paper3hl: 'Paper 3 HL',
};

const fileMapping: Record<string, string> = {
  paper1: 'Paper 1.csv',
  paper2sl: 'Paper 2 SL.csv',
  paper2hl: 'Paper 2 HL.csv',
  paper3hl: 'Paper 3.csv',
};

const PaperPage: React.FC = () => {
  const { paperId } = useParams<{ paperId: string }>();
  const [question, setQuestion] = useState<{ content: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const paperName = paperId ? paperNames[paperId] : 'Unknown Paper';

  const fetchQuestion = async () => {
    if (!paperId || !fileMapping[paperId]) {
      setError('Invalid paper type.');
      return;
    }

    setLoading(true);
    setError(null);
    setQuestion(null);

    try {
      const fileName = fileMapping[paperId];
      const response = await fetch(`/CSVfiles/${fileName}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${fileName}`);
      }

      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data as any[];
          if (data.length === 0) {
            setError('No questions found in the file.');
            setLoading(false);
            return;
          }

          // Filter out empty rows or bad data if necessary
          const validQuestions = data.filter(row => row.Content || row.content || Object.values(row)[0]);
          
          if (validQuestions.length === 0) {
             setError('No valid questions found.');
             setLoading(false);
             return;
          }

          const randomIndex = Math.floor(Math.random() * validQuestions.length);
          const randomRow = validQuestions[randomIndex];
          const content = randomRow.Content || randomRow.content || Object.values(randomRow)[0];

          setQuestion({ content });
          setLoading(false);
        },
        error: (err) => {
          console.error('CSV Parse Error:', err);
          setError('Failed to parse question file.');
          setLoading(false);
        }
      });

    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching the question file.');
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (question) {
      navigator.clipboard.writeText(question.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{paperName} Practice</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 min-h-[300px] flex flex-col justify-center items-center text-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin" />
              <p className="text-gray-500 font-medium">Reading CSV file...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-red-500 font-medium max-w-md"
            >
              {error}
            </motion.div>
          ) : question ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full text-left space-y-4"
            >
              <div className="prose prose-lg max-w-none text-gray-800">
                <p className="whitespace-pre-wrap">{question.content}</p>
              </div>
              <div className="absolute top-4 right-4">
                <button
                  onClick={copyToClipboard}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-gray-400 flex flex-col items-center gap-2"
            >
              <FileText className="w-12 h-12 opacity-20" />
              <p>Click the button below to generate a question.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-center">
        <button
          onClick={fetchQuestion}
          disabled={loading}
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-lg shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5" />
              Generate Question
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PaperPage;
