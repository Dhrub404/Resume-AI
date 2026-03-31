import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import AnalysisPage from './pages/AnalysisPage';
import TemplatesPage from './pages/TemplatesPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <UserProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/builder" element={<ResumeBuilderPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
