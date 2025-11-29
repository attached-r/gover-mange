import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import DataManagement from './components/DataManagement';
import CrawlerConfig from './components/CrawlerConfig';
import AuditLogs from './components/AuditLogs';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Load user from local storage on mount (simple persistence)
  useEffect(() => {
    const storedUser = localStorage.getItem('gov_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('gov_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('gov_user');
    setActiveTab('dashboard');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'data':
        return <DataManagement currentUser={user} />;
      case 'crawler':
        return <CrawlerConfig currentUser={user} />;
      case 'logs':
        return <AuditLogs />;
      case 'users':
        return (
          <div className="flex flex-col items-center justify-center h-96 text-slate-400">
             <h3 className="text-lg font-medium">用户管理模块</h3>
             <p className="text-sm mt-2">（此模块在演示版中未完全展开，逻辑同数据管理）</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout 
      user={user} 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;