import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import PriceResearchPage from './pages/PriceResearchPage';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/pesquisa" element={<PriceResearchPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App; 