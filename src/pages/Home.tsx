import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { FileText, GraduationCap, Book, Layers } from 'lucide-react';

const papers = [
  { id: 'paper1', name: 'Paper 1', icon: FileText, color: 'bg-blue-500', description: 'Standard Level & Higher Level', link: '/paper/paper1' },
  { id: 'paper2sl', name: 'Paper 2 SL', icon: Book, color: 'bg-green-500', description: 'Standard Level', link: '/paper/paper2sl' },
  { id: 'paper2hl', name: 'Paper 2 HL', icon: GraduationCap, color: 'bg-purple-500', description: 'Higher Level', link: '/paper/paper2hl' },
  { id: 'paper3hl', name: 'Paper 3 HL', icon: Layers, color: 'bg-orange-500', description: 'Higher Level Only', link: '/paper/paper3hl' },
  { id: 'flashcardsl', name: 'Flashcard SL', icon: Layers, color: 'bg-pink-500', description: 'Standard Level Flashcards', link: '/flashcards/sl' },
  { id: 'flashcardhl', name: 'Flashcard HL', icon: Layers, color: 'bg-red-500', description: 'Higher Level Flashcards', link: '/flashcards/hl' },
];

const Home: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          IB Question Bank & Flashcards
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose a resource below to start practicing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {papers.map((paper) => (
          <Link key={paper.id} to={paper.link}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 p-6 transition-all h-full flex flex-col items-start group cursor-pointer"
            >
              <div className={`p-3 rounded-xl ${paper.color} text-white mb-4 shadow-sm group-hover:shadow-md transition-shadow`}>
                <paper.icon className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {paper.name}
              </h2>
              <p className="text-gray-500 font-medium">
                {paper.description}
              </p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
