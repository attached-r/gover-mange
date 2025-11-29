import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Database, TrendingUp, CheckCircle, AlertTriangle, FileText } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const dataByDept = [
  { name: '发改委', value: 400 },
  { name: '经信局', value: 300 },
  { name: '教育局', value: 300 },
  { name: '环保局', value: 200 },
];

const dataTrend = [
  { name: '周一', new: 40, processed: 24 },
  { name: '周二', new: 30, processed: 13 },
  { name: '周三', new: 20, processed: 98 },
  { name: '周四', new: 27, processed: 39 },
  { name: '周五', new: 18, processed: 48 },
  { name: '周六', new: 23, processed: 38 },
  { name: '周日', new: 34, processed: 43 },
];

const dataStatus = [
  { name: '已清洗', value: 400 },
  { name: '待处理', value: 300 },
  { name: '已入库', value: 300 },
  { name: '异常', value: 200 },
];

const StatCard = ({ title, value, subtext, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 mt-2">{value}</h3>
        <p className={`text-xs mt-2 ${subtext.includes('+') ? 'text-green-600' : 'text-slate-400'}`}>
          {subtext}
        </p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">系统概览仪表盘</h2>
        <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-sm">导出报表</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">刷新数据</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="数据总量" value="12,543" subtext="+128 今日新增" icon={Database} color="bg-blue-500" />
        <StatCard title="处理效率" value="98.2%" subtext="+2.4% 较上周" icon={TrendingUp} color="bg-green-500" />
        <StatCard title="入库完成" value="8,920" subtext="本月累计" icon={CheckCircle} color="bg-indigo-500" />
        <StatCard title="待处理任务" value="342" subtext="需人工干预" icon={AlertTriangle} color="bg-orange-500" />
      </div>

      {/* Main Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart - Large */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">近七日数据采集趋势</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPro" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="new" name="新增采集" stroke="#3b82f6" fillOpacity={1} fill="url(#colorNew)" />
                <Area type="monotone" dataKey="processed" name="清洗入库" stroke="#10b981" fillOpacity={1} fill="url(#colorPro)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">数据状态分布</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

       {/* Main Charts Row 2 */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">各委办局数据贡献量</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataByDept}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" name="数据条数" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
         </div>
         
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-800">最新通知公告</h3>
                <span className="text-xs text-blue-600 cursor-pointer">查看更多</span>
             </div>
             <div className="space-y-4">
                 {[1,2,3,4].map(i => (
                     <div key={i} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-50 last:border-0">
                        <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                            <FileText size={16} />
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-slate-700">关于开展2024年度全市网络安全检查的通知</h4>
                            <p className="text-xs text-slate-400 mt-1">发布部门：市网信办 · 2小时前</p>
                        </div>
                     </div>
                 ))}
             </div>
         </div>
       </div>
    </div>
  );
};

export default Dashboard;