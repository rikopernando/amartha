import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import WizardPage from './pages/WizardPage/WizardPage';
import EmployeeListPage from './pages/EmployeeListPage/EmployeeListPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/employees" replace />} />
        <Route path="/wizard" element={<WizardPage />} />
        <Route path="/employees" element={<EmployeeListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
