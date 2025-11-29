import React, { useState, useEffect } from 'react';
import { CrawlerTask, CrawlerRule } from '../types';
import { mockService } from '../services/mockService';
import { Play, Pause, Plus, Trash2, Settings, Globe, Clock, Code, Save } from 'lucide-react';

const CrawlerConfig: React.FC<{ currentUser: any }> = ({ currentUser }) => {
  const [tasks, setTasks] = useState<CrawlerTask[]>([]);
  const [editingTask, setEditingTask] = useState<CrawlerTask | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const t = await mockService.getTasks();
    setTasks(t);
  };

  const handleAddNew = () => {
      setEditingTask({
          id: Math.random().toString(36).substr(2,9),
          name: '',
          targetUrl: '',
          schedule: '0 0 * * *',
          status: 'paused',
          lastRun: '-',
          rules: [{ field: 'title', selector: '', type: 'css', attribute: 'text' }]
      });
  };

  const handleSave = async () => {
      if(editingTask) {
          await mockService.addTask(editingTask, currentUser.id);
          setEditingTask(null);
          loadTasks();
      }
  };

  const addRule = () => {
      if(editingTask) {
          setEditingTask({
              ...editingTask,
              rules: [...editingTask.rules, { field: '', selector: '', type: 'css', attribute: 'text' }]
          });
      }
  };

  return (
    <div className="space-y-6">
      {editingTask ? (
         /* Task Editor */
         <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 max-w-4xl mx-auto">
             <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                 <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                     <Settings className="text-blue-500" />
                     {editingTask.name ? '编辑采集任务' : '新建采集任务'}
                 </h2>
                 <button onClick={() => setEditingTask(null)} className="text-slate-400 hover:text-slate-600">取消</button>
             </div>
             
             <div className="grid grid-cols-2 gap-6 mb-6">
                 <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">任务名称</label>
                     <input 
                        type="text" 
                        value={editingTask.name}
                        onChange={e => setEditingTask({...editingTask, name: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="例如：市发改委公告采集"
                     />
                 </div>
                 <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">Cron 调度表达式</label>
                     <div className="flex items-center gap-2">
                        <Clock className="text-slate-400 w-5 h-5" />
                        <input 
                            type="text" 
                            value={editingTask.schedule}
                            onChange={e => setEditingTask({...editingTask, schedule: e.target.value})}
                            className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                     </div>
                 </div>
                 <div className="col-span-2">
                     <label className="block text-sm font-medium text-slate-700 mb-2">目标 URL</label>
                     <div className="flex items-center gap-2">
                        <Globe className="text-slate-400 w-5 h-5" />
                        <input 
                            type="text" 
                            value={editingTask.targetUrl}
                            onChange={e => setEditingTask({...editingTask, targetUrl: e.target.value})}
                            className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" 
                            placeholder="https://..."
                        />
                     </div>
                 </div>
             </div>

             <div className="mb-6">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-slate-800">提取规则配置</h3>
                    <button onClick={addRule} className="text-xs flex items-center gap-1 text-blue-600 hover:bg-blue-50 px-2 py-1 rounded">
                        <Plus size={14} /> 添加规则
                    </button>
                 </div>
                 <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                     {editingTask.rules.map((rule, idx) => (
                         <div key={idx} className="flex gap-3 items-center">
                             <input 
                                placeholder="字段名 (如: title)" 
                                value={rule.field} 
                                onChange={e => {
                                    const newRules = [...editingTask.rules];
                                    newRules[idx].field = e.target.value;
                                    setEditingTask({...editingTask, rules: newRules});
                                }}
                                className="w-32 text-sm border border-slate-300 rounded p-2"
                             />
                             <select 
                                value={rule.type}
                                onChange={e => {
                                    const newRules = [...editingTask.rules];
                                    newRules[idx].type = e.target.value as any;
                                    setEditingTask({...editingTask, rules: newRules});
                                }}
                                className="w-24 text-sm border border-slate-300 rounded p-2 bg-white"
                             >
                                 <option value="css">CSS</option>
                                 <option value="xpath">XPath</option>
                                 <option value="regex">Regex</option>
                             </select>
                             <input 
                                placeholder="选择器 / 表达式" 
                                value={rule.selector} 
                                onChange={e => {
                                    const newRules = [...editingTask.rules];
                                    newRules[idx].selector = e.target.value;
                                    setEditingTask({...editingTask, rules: newRules});
                                }}
                                className="flex-1 text-sm border border-slate-300 rounded p-2 font-mono"
                             />
                             <button 
                                onClick={() => {
                                     const newRules = editingTask.rules.filter((_, i) => i !== idx);
                                     setEditingTask({...editingTask, rules: newRules});
                                }}
                                className="text-red-400 hover:text-red-600 p-2"
                             >
                                 <Trash2 size={16} />
                             </button>
                         </div>
                     ))}
                 </div>
             </div>

             <div className="flex justify-end pt-4">
                 <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium shadow-lg shadow-blue-500/20">
                     <Save size={18} /> 保存配置
                 </button>
             </div>
         </div>
      ) : (
        /* Task List */
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                   <h2 className="text-xl font-bold text-slate-800">爬虫任务调度</h2>
                   <p className="text-sm text-slate-500 mt-1">管理自动数据采集任务与规则</p>
                </div>
                <button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                    <Plus size={16} /> 新建任务
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {tasks.map(task => (
                    <div key={task.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all bg-white relative overflow-hidden group">
                        <div className={`absolute top-0 left-0 w-1 h-full ${task.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <Globe size={20} />
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${task.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                {task.status === 'active' ? '运行中' : '已暂停'}
                            </span>
                        </div>
                        <h3 className="font-bold text-slate-800 mb-1">{task.name}</h3>
                        <p className="text-xs text-slate-500 truncate mb-4">{task.targetUrl}</p>
                        
                        <div className="space-y-2 text-xs text-slate-500 mb-6">
                            <div className="flex items-center gap-2">
                                <Clock size={14} /> 调度: {task.schedule}
                            </div>
                            <div className="flex items-center gap-2">
                                <Code size={14} /> 规则: {task.rules.length} 条
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-slate-100">
                            <button className="flex-1 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded border border-slate-200 flex items-center justify-center gap-2">
                                <Settings size={14} /> 配置
                            </button>
                            <button className={`flex-1 py-2 text-sm font-medium rounded text-white flex items-center justify-center gap-2 ${task.status === 'active' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}`}>
                                {task.status === 'active' ? <><Pause size={14} /> 暂停</> : <><Play size={14} /> 启动</>}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default CrawlerConfig;