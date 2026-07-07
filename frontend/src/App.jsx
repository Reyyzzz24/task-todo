import { useState } from 'react';
import './App.css';
import AuthPage from './pages/auth/AuthPage';
import DashboardLayout from './components/DashboardLayout';
import TaskIndex from './pages/task/TaskIndex';
import PositionIndex from './pages/position/PositionIndex';
import UserPositionIndex from './pages/user-position/UserPositionIndex';
import UserIndex from './pages/user/UserIndex';

function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'tasks';
  });

  const handleNavigate = (page) => {
    setCurrentPage(page);
    localStorage.setItem('currentPage', page);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setToken('');
    setUsername('');
  };

  if (!token) {
    return <AuthPage setToken={setToken} setUsername={setUsername} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'tasks':
        return <TaskIndex />;
      case 'dashboard':
        return (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <p className="mt-4 text-slate-600">Selamat datang di Task Manager</p>
          </div>
        );
      case 'positions':
        return <PositionIndex />;
      case 'user-positions':
        return <UserPositionIndex />;
      case 'users':
        return <UserIndex />;
      default:
        return <TaskIndex />;
    }
  };

  return (
    <DashboardLayout
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      username={username}
    >
      {renderPage()}
    </DashboardLayout>
  );
}

export default App;