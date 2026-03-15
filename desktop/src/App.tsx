import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Pairing from './components/Pairing';
import { socketService } from './services/socket';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    if (isAuthenticated) {
      const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
      if (userId) {
        socketService.connect(userId);
      }
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={() => setIsAuthenticated(true)} />} 
          />
          <Route 
            path="/" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/pairing" 
            element={isAuthenticated ? <Pairing /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
