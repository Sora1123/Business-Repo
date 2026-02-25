/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PaperPage from './pages/PaperPage';
import FlashcardPage from './pages/FlashcardPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/paper/:paperId" element={<PaperPage />} />
          <Route path="/flashcards/:type" element={<FlashcardPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
