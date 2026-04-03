import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import PublishedPage from './pages/PublishedPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',fontFamily:'Inter'}}>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
          <Route path="/app" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/app/edit/:id" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
          <Route path="/p/:slug" element={<PublishedPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}