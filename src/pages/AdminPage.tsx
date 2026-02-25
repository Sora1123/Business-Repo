import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Save, AlertCircle } from 'lucide-react';

const papers = [
  { id: 'paper1', name: 'Paper 1' },
  { id: 'paper2sl', name: 'Paper 2 SL' },
  { id: 'paper2hl', name: 'Paper 2 HL' },
  { id: 'paper3hl', name: 'Paper 3 HL' },
];

interface Question {
  id: number;
  paper_type: string;
  content: string;
  created_at: string;
}

const AdminPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedPaper, setSelectedPaper] = useState(papers[0].id);
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [bulkContent, setBulkContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/api/questions?paperType=${selectedPaper}`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      }
    } catch (error) {
      console.error('Failed to fetch questions', error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedPaper]);

  const handleAddQuestion = async () => {
    if (!newQuestionContent.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paperType: selectedPaper, content: newQuestionContent }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Question added successfully!' });
        setNewQuestionContent('');
        fetchQuestions();
      } else {
        throw new Error('Failed to add question');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add question.' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleBulkAdd = async () => {
    if (!bulkContent.trim()) return;
    setLoading(true);
    try {
      // Split by newline to separate questions
      const questionsToAdd = bulkContent.split(/\n+/).filter(q => q.trim().length > 0);
      
      let successCount = 0;
      for (const content of questionsToAdd) {
        const response = await fetch('/api/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paperType: selectedPaper, content: content.trim() }),
        });
        if (response.ok) successCount++;
      }

      setMessage({ type: 'success', text: `Successfully added ${successCount} questions.` });
      setBulkContent('');
      fetchQuestions();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add questions.' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      const response = await fetch(`/api/questions/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setQuestions(questions.filter(q => q.id !== id));
        setMessage({ type: 'success', text: 'Question deleted.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete question.' });
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="paper-select" className="text-sm font-medium text-gray-700">Select Paper:</label>
          <select
            id="paper-select"
            value={selectedPaper}
            onChange={(e) => setSelectedPaper(e.target.value)}
            className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          >
            {papers.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} flex items-center gap-2`}>
          <AlertCircle className="w-5 h-5" />
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Single Question */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-600" />
            Add Single Question
          </h2>
          <textarea
            value={newQuestionContent}
            onChange={(e) => setNewQuestionContent(e.target.value)}
            placeholder="Type your question here..."
            className="w-full h-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border resize-none"
          />
          <button
            onClick={handleAddQuestion}
            disabled={loading || !newQuestionContent.trim()}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Question'}
          </button>
        </div>

        {/* Bulk Add */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Save className="w-5 h-5 text-green-600" />
            Bulk Add Questions
          </h2>
          <p className="text-xs text-gray-500">Paste a list of questions (one question per line).</p>
          <textarea
            value={bulkContent}
            onChange={(e) => setBulkContent(e.target.value)}
            placeholder="Question 1...&#10;Question 2...&#10;Question 3..."
            className="w-full h-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border resize-none"
          />
          <button
            onClick={handleBulkAdd}
            disabled={loading || !bulkContent.trim()}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Bulk Add'}
          </button>
        </div>
      </div>

      {/* Existing Questions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">Existing Questions ({questions.length})</h2>
        </div>
        <ul className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
          {questions.length === 0 ? (
            <li className="px-6 py-8 text-center text-gray-500 italic">
              No questions found for this paper type. Add some above!
            </li>
          ) : (
            questions.map((q) => (
              <li key={q.id} className="px-6 py-4 hover:bg-gray-50 transition-colors flex justify-between items-start gap-4 group">
                <p className="text-sm text-gray-900 whitespace-pre-wrap flex-1">{q.content}</p>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Delete question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;
