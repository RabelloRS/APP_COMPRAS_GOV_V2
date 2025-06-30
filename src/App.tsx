import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import PriceResearchPage from './pages/PriceResearchPage';
import MaterialsAnalysisPage from './pages/MaterialsAnalysisPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/pesquisa" element={<PriceResearchPage />} />
        <Route path="/analise-materiais" element={<MaterialsAnalysisPage />} />
      </Routes>
    </Router>
  );
}

export default App; 