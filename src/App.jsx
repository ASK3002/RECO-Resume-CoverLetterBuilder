import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ResumeProvider } from './contexts/ResumeContext';
import { CoverLetterProvider } from './contexts/CoverLetterContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import AuthWrapper from './components/auth/AuthWrapper';
import Dashboard from './components/Dashboard';
import ResumeBuilder from './components/resume/ResumeBuilder';
import CoverLetterBuilder from './components/CoverLetterBuilder';
import MyDocuments from './components/documents/MyDocuments';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/auth" element={<AuthWrapper />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/resume-builder" element={
            <ProtectedRoute>
              <ResumeProvider>
                <Layout>
                  <ResumeBuilder />
                </Layout>
              </ResumeProvider>
            </ProtectedRoute>
          } />
          
          <Route path="/cover-letter" element={
            <ProtectedRoute>
              <ResumeProvider>
                <CoverLetterProvider>
                  <Layout>
                    <CoverLetterBuilder />
                  </Layout>
                </CoverLetterProvider>
              </ResumeProvider>
            </ProtectedRoute>
          } />
          
          <Route path="/my-documents" element={
            <ProtectedRoute>
              <Layout>
                <MyDocuments />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
