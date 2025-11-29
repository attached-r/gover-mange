import React, { useState, useEffect } from 'react';
import { GovDataRecord, DataStatus, UserRole } from '../types';
import { apiService } from '../services/api';
import { analyzeGovData } from '../services/geminiService';
import { Eye, EyeOff, Edit2, Trash2, Bot, Check, AlertCircle, RefreshCw } from 'lucide-react';

interface DataManagementProps {
  currentUser: any;
}

const DataManagement: React.FC<DataManagementProps> = ({ currentUser }) => {
  const [data, setData] = useState<GovDataRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSensitive, setShowSensitive] = useState<Record<string, boolean>>({});
  const [analyzing, setAnalyzing] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    // Use API Service which tries backend first
    const result = await apiService.getData();
    setData(result);
    setLoading(false);
  };

  const toggleSensitive = (id: string) => {
    setShowSensitive(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAIAnalysis = async (record: GovDataRecord) => {
    setAnalyzing(record.id);
    const analysis = await analyzeGovData(record.content);
    alert(`
      AI智能分析报告：
      ----------------
      【摘要】：${analysis.summary}
      【标签】：${analysis.tags.join(', ')}
      【敏感度】：${analysis.sensitivity}
    `);
    setAnalyzing(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('确认删除该条数据吗？操作将被记录在审计日志中。')) {
       await apiService.deleteData(id, currentUser.id);
       loadData();
    }
  };

  const maskContent = (text: string) => {
      // Simple mock masking logic
      return text.replace(/(\d{3})\d{4}(\d{4})/g, "$1****$2") // Phone
                 .replace(/(\d{6})\d{8}(\d{4})/g, "$1********$2"); // ID Card
  };

  const getStatusColor = (status: DataStatus) => {
      switch(status) {
          case DataStatus.PUBLISHED: return 'bg-green-100 text-green-700 border-green-200';
          case DataStatus.PENDING: return 'bg-orange-100 text-orange-700 border-orange-200';
          case DataStatus.CLEANED: return 'bg-blue-100 text-blue-700 border-blue-200';
          case DataStatus.ERROR: return 'bg-red-100 text-red-700 border-red-200';
          default: return 'bg-slate-100 text-slate-700';
      }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-slate-800">数据资源管理</h2>
           <p className="text-sm text-slate-500 mt-1">共 {data.length} 条记录</p>
        </div>
        <div className="flex gap-3">
             <input type="text" placeholder="搜索标题或内容..." className="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
             <button onClick={loadData} className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50"><RefreshCw size={18} /></button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 uppercase font-medium">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4 w-1/4">标题/来源</th>
              <th className="px-6 py-4">类别</th>
              <th className="px-6 py-4 w-1/3">内容摘要 (脱敏)</th>
              <th className="px-6 py-4">状态</th>
              <th className="px-6 py-4">发布时间</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-400">加载中...</td></tr>
            ) : data.map((record) => (
              <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-slate-500">{record.id}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800 truncate max-w-xs" title={record.title}>{record.title}</div>
                  <div className="text-xs text-slate-400 mt-1">{record.sourceName}</div>
                  <div className="text-xs text-slate-300 truncate max-w-xs">{record.sourceUrl}</div>
                </td>
                <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs border border-slate-200">{record.category}</span>
                </td>
                <td className="px-6 py-4 relative group">
                  <div className="line-clamp-2 text-slate-500 max-w-sm">
                      {showSensitive[record.id] ? record.content : maskContent(record.content)}
                  </div>
                  {record.sensitiveInfo && record.sensitiveInfo.hasSensitiveData && (
                      <div className="flex items-center gap-1 text-xs text-red-500 mt-1">
                          <AlertCircle size={12} />
                          包含敏感信息: {record.sensitiveInfo.detectedTypes.join(', ')}
                      </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{record.publishDate}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                        onClick={() => handleAIAnalysis(record)}
                        disabled={!!analyzing}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded tooltip-trigger"
                        title="AI 智能分析"
                    >
                        {analyzing === record.id ? <RefreshCw className="animate-spin" size={16}/> : <Bot size={16} />}
                    </button>
                    <button 
                        onClick={() => toggleSensitive(record.id)}
                        className="p-1.5 text-slate-500 hover:bg-slate-100 rounded"
                        title={showSensitive[record.id] ? "隐藏敏感信息" : "显示原数据"}
                    >
                        {showSensitive[record.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    {currentUser.role !== UserRole.STAFF && (
                        <button onClick={() => handleDelete(record.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded" title="删除">
                        <Trash2 size={16} />
                        </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-between items-center text-xs text-slate-500">
          <span>显示 1 到 {data.length} 条</span>
          <div className="flex gap-2">
              <button className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-50">上一页</button>
              <button className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100">下一页</button>
          </div>
      </div>
    </div>
  );
};

export default DataManagement;
