import React, { useEffect, useState } from 'react';
import { AuditLog } from '../types';
import { mockService } from '../services/mockService';
import { ShieldAlert, Download } from 'lucide-react';

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    mockService.getLogs().then(setLogs);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
             <ShieldAlert className="text-indigo-600" />
             安全审计日志
           </h2>
           <p className="text-sm text-slate-500 mt-1">记录系统内所有用户关键操作行为</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 text-sm">
           <Download size={16} /> 导出日志
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 uppercase font-medium">
            <tr>
              <th className="px-6 py-4">时间</th>
              <th className="px-6 py-4">操作人</th>
              <th className="px-6 py-4">行为</th>
              <th className="px-6 py-4">操作对象</th>
              <th className="px-6 py-4">IP地址</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-slate-500">{log.timestamp}</td>
                <td className="px-6 py-4 font-medium text-slate-800">{log.userName}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-100 rounded text-xs border border-slate-200">
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-xs">{log.target}</td>
                <td className="px-6 py-4 text-slate-500">{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogs;