import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { mockService } from '../services/mockService';
import { Shield, Lock, User as UserIcon, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('admin');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await mockService.login(username);
      if (user) {
        onLogin(user);
      } else {
        alert('用户不存在 (试用账号: admin, leader, staff)');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute left-0 bottom-0 w-96 h-96 bg-indigo-600 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 mb-4 shadow-lg shadow-blue-500/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">政务数据管理系统</h1>
          <p className="text-slate-400 text-sm mt-2">安全 · 智能 · 高效</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">用户名</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-500"
                placeholder="请输入用户名"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">密码</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
              <input
                type="password"
                value="password"
                readOnly
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-500"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2 text-right cursor-pointer hover:text-blue-400">忘记密码?</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-lg shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02] flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : '安全登录'}
          </button>
        </form>

        <div className="mt-8 border-t border-white/10 pt-6">
           <p className="text-xs text-center text-slate-500">模拟账号提示</p>
           <div className="flex justify-center gap-4 mt-3">
             <button onClick={() => setUsername('admin')} className={`text-xs px-2 py-1 rounded ${username === 'admin' ? 'bg-blue-500/20 text-blue-300' : 'text-slate-400 hover:text-white'}`}>管理员</button>
             <button onClick={() => setUsername('leader')} className={`text-xs px-2 py-1 rounded ${username === 'leader' ? 'bg-blue-500/20 text-blue-300' : 'text-slate-400 hover:text-white'}`}>部门领导</button>
             <button onClick={() => setUsername('staff')} className={`text-xs px-2 py-1 rounded ${username === 'staff' ? 'bg-blue-500/20 text-blue-300' : 'text-slate-400 hover:text-white'}`}>工作人员</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;