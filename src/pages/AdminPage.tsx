import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Save, AlertCircle, Lock, Edit2, X, Check } from 'lucide-react';

const papers = [
  { id: 'paper1', name: 'Paper 1' },
  { id: 'paper2sl', name: 'Paper 2 SL' },
  { id: 'paper2hl', name: 'Paper 2 HL' },
  { id: 'paper3hl', name: 'Paper 3 HL' },
];

const flashcardTypes = [
  { id: 'sl', name: 'Flashcard SL' },
  { id: 'hl', name: 'Flashcard HL' },
];

interface Question {
  id: number;
  paper_type: string;
  content: string;
  created_at: string;
}

interface Flashcard {
  id: number;
  type: string;
  front: string;
  back: string;
  created_at: string;
}

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'questions' | 'flashcards'>('questions');
  
  // Questions State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedPaper, setSelectedPaper] = useState(papers[0].id);
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [bulkContent, setBulkContent] = useState('');
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [editQuestionContent, setEditQuestionContent] = useState('');

  // Flashcards State
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [selectedFlashcardType, setSelectedFlashcardType] = useState(flashcardTypes[0].id);
  const [newFlashcardFront, setNewFlashcardFront] = useState('');
  const [newFlashcardBack, setNewFlashcardBack] = useState('');
  const [editingFlashcardId, setEditingFlashcardId] = useState<number | null>(null);
  const [editFlashcardFront, setEditFlashcardFront] = useState('');
  const [editFlashcardBack, setEditFlashcardBack] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
  });

  // --- Questions Logic ---

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
        headers: getHeaders(),
        body: JSON.stringify({ paperType: selectedPaper, content: newQuestionContent }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Question added successfully!' });
        setNewQuestionContent('');
        fetchQuestions();
      } else {
        const err = await response.json();
        throw new Error(err.error || 'Failed to add question');
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleBulkAdd = async () => {
    if (!bulkContent.trim()) return;
    setLoading(true);
    try {
      const questionsToAdd = bulkContent.split('\n').filter(q => q.trim().length > 0);
      let successCount = 0;
      for (const content of questionsToAdd) {
        const response = await fetch('/api/questions', {
          method: 'POST',
          headers: getHeaders(),
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

  const handleDeleteQuestion = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      const response = await fetch(`/api/questions/${id}`, { 
        method: 'DELETE',
        headers: getHeaders()
      });
      if (response.ok) {
        setQuestions(questions.filter(q => q.id !== id));
        setMessage({ type: 'success', text: 'Question deleted.' });
      } else {
        throw new Error('Unauthorized');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete. Check password.' });
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const startEditQuestion = (q: Question) => {
    setEditingQuestionId(q.id);
    setEditQuestionContent(q.content);
  };

  const saveEditQuestion = async (id: number) => {
    try {
      const response = await fetch(`/api/questions/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ content: editQuestionContent }),
      });
      if (response.ok) {
        setQuestions(questions.map(q => q.id === id ? { ...q, content: editQuestionContent } : q));
        setEditingQuestionId(null);
        setMessage({ type: 'success', text: 'Question updated.' });
      } else {
        throw new Error('Unauthorized');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update. Check password.' });
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // --- Flashcards Logic ---

  const fetchFlashcards = async () => {
    try {
      const response = await fetch(`/api/flashcards?type=${selectedFlashcardType}`);
      if (response.ok) {
        const data = await response.json();
        setFlashcards(data);
      }
    } catch (error) {
      console.error('Failed to fetch flashcards', error);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, [selectedFlashcardType]);

  const handleAddFlashcard = async () => {
    if (!newFlashcardFront.trim() || !newFlashcardBack.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ type: selectedFlashcardType, front: newFlashcardFront, back: newFlashcardBack }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Flashcard added successfully!' });
        setNewFlashcardFront('');
        setNewFlashcardBack('');
        fetchFlashcards();
      } else {
        const err = await response.json();
        throw new Error(err.error || 'Failed to add flashcard');
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDeleteFlashcard = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      const response = await fetch(`/api/flashcards/${id}`, { 
        method: 'DELETE',
        headers: getHeaders()
      });
      if (response.ok) {
        setFlashcards(flashcards.filter(f => f.id !== id));
        setMessage({ type: 'success', text: 'Flashcard deleted.' });
      } else {
        throw new Error('Unauthorized');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete. Check password.' });
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const startEditFlashcard = (f: Flashcard) => {
    setEditingFlashcardId(f.id);
    setEditFlashcardFront(f.front);
    setEditFlashcardBack(f.back);
  };

  const saveEditFlashcard = async (id: number) => {
    try {
      const response = await fetch(`/api/flashcards/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ front: editFlashcardFront, back: editFlashcardBack }),
      });
      if (response.ok) {
        setFlashcards(flashcards.map(f => f.id === id ? { ...f, front: editFlashcardFront, back: editFlashcardBack } : f));
        setEditingFlashcardId(null);
        setMessage({ type: 'success', text: 'Flashcard updated.' });
      } else {
        throw new Error('Unauthorized');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update. Check password.' });
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      {message && (
        <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} flex items-center gap-2`}>
          <AlertCircle className="w-5 h-5" />
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('questions')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'questions'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Questions
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'flashcards'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Flashcards
          </button>
        </nav>
      </div>

      {activeTab === 'questions' ? (
        <div className="space-y-8">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Save className="w-5 h-5 text-green-600" />
                Bulk Add Questions
              </h2>
              <p className="text-xs text-gray-500">Separate multiple questions with a new line (Enter key once).</p>
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
                    {editingQuestionId === q.id ? (
                      <div className="flex-1 flex gap-2">
                        <textarea
                          value={editQuestionContent}
                          onChange={(e) => setEditQuestionContent(e.target.value)}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                          rows={3}
                        />
                        <div className="flex flex-col gap-2">
                          <button onClick={() => saveEditQuestion(q.id)} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check className="w-5 h-5" /></button>
                          <button onClick={() => setEditingQuestionId(null)} className="p-1 text-red-600 hover:bg-red-50 rounded"><X className="w-5 h-5" /></button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-gray-900 whitespace-pre-wrap flex-1">{q.content}</p>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEditQuestion(q)}
                            className="text-gray-400 hover:text-indigo-600 p-1 rounded-full hover:bg-indigo-50"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <label htmlFor="flashcard-select" className="text-sm font-medium text-gray-700">Select Type:</label>
            <select
              id="flashcard-select"
              value={selectedFlashcardType}
              onChange={(e) => setSelectedFlashcardType(e.target.value)}
              className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            >
              {flashcardTypes.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              Add Flashcard
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Front (Term)</label>
                <input
                  type="text"
                  value={newFlashcardFront}
                  onChange={(e) => setNewFlashcardFront(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  placeholder="e.g. Opportunity Cost"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Back (Definition)</label>
                <textarea
                  value={newFlashcardBack}
                  onChange={(e) => setNewFlashcardBack(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  placeholder="Definition..."
                  rows={3}
                />
              </div>
            </div>
            <button
              onClick={handleAddFlashcard}
              disabled={loading || !newFlashcardFront.trim() || !newFlashcardBack.trim()}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Flashcard'}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">Existing Flashcards ({flashcards.length})</h2>
            </div>
            <ul className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {flashcards.length === 0 ? (
                <li className="px-6 py-8 text-center text-gray-500 italic">
                  No flashcards found. Add some above!
                </li>
              ) : (
                flashcards.map((f) => (
                  <li key={f.id} className="px-6 py-4 hover:bg-gray-50 transition-colors flex justify-between items-start gap-4 group">
                    {editingFlashcardId === f.id ? (
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          value={editFlashcardFront}
                          onChange={(e) => setEditFlashcardFront(e.target.value)}
                          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                        <div className="flex gap-2">
                          <textarea
                            value={editFlashcardBack}
                            onChange={(e) => setEditFlashcardBack(e.target.value)}
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            rows={2}
                          />
                          <div className="flex flex-col gap-2">
                            <button onClick={() => saveEditFlashcard(f.id)} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check className="w-5 h-5" /></button>
                            <button onClick={() => setEditingFlashcardId(null)} className="p-1 text-red-600 hover:bg-red-50 rounded"><X className="w-5 h-5" /></button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="font-bold text-gray-900">{f.front}</div>
                          <div className="col-span-2 text-gray-600">{f.back}</div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEditFlashcard(f)}
                            className="text-gray-400 hover:text-indigo-600 p-1 rounded-full hover:bg-indigo-50"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteFlashcard(f.id)}
                            className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
