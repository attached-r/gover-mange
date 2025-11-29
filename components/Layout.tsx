import React from 'react';
import { User, UserRole } from '../types';
import { 
  LayoutDashboard, Database, Ghost, Users, FileText, LogOut, 
  Menu, Bell, Search, Shield
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, activeTab, onTabChange, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: '大屏概览', icon: LayoutDashboard },
    { id: 'data', label: '数据管理', icon: Database },
    { id: 'crawler', label: '爬虫配置', icon: Ghost, requiredRole: UserRole.DEPT_LEADER },
    { id: 'logs', label: '审计日志', icon: FileText, requiredRole: UserRole.ADMIN },
    { id: 'users', label: '用户管理', icon: Users, requiredRole: UserRole.ADMIN },
  ];

  const filteredMenu = menuItems.filter(item => {
    if (!item.requiredRole) return true;
    if (user.role === UserRole.ADMIN) return true;
    if (item.requiredRole === UserRole.DEPT_LEADER && user.role === UserRole.DEPT_LEADER) return true;
    return false;
  });

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
           <Shield className="text-blue-500 mr-3" />
           <span className="text-white font-bold text-lg tracking-wide">政务数据云</span>
        </div>

        <nav className="flex-1 py-6 space-y-1 px-3">
          {filteredMenu.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
             <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                {user.name.charAt(0)}
             </div>
             <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.role}</p>
             </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-400 transition-colors"
          >
            <LogOut className="w-3 h-3 mr-2" /> 退出系统
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
           <div className="flex items-center text-slate-400">
              <Menu className="w-5 h-5 mr-4 lg:hidden" />
              <div className="relative hidden md:block">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input 
                    type="text" 
                    placeholder="全局搜索..." 
                    className="pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all w-64"
                 />
              </div>
           </div>
           <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                 最后登录: {user.lastLogin}
              </div>
           </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-8">
           <div className="max-w-7xl mx-auto">
             {children}
           </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;