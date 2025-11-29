import { User, UserRole, GovDataRecord, DataStatus, CrawlerTask, AuditLog } from '../types';

// Mock Initial Data
const INITIAL_USERS: User[] = [
  { id: '1', username: 'admin', name: '系统管理员', role: UserRole.ADMIN, department: '信息中心', lastLogin: '2023-10-27 09:00:00' },
  { id: '2', username: 'leader', name: '李处长', role: UserRole.DEPT_LEADER, department: '发改委', lastLogin: '2023-10-26 14:30:00' },
  { id: '3', username: 'staff', name: '王专员', role: UserRole.STAFF, department: '发改委', lastLogin: '2023-10-27 08:45:00' },
];

const INITIAL_DATA: GovDataRecord[] = [
  {
    id: '1001',
    title: '关于2024年数字化转型专项资金申报的通知',
    sourceUrl: 'http://gov.example.com/notice/123',
    sourceName: '市经信局',
    publishDate: '2023-10-25',
    crawlDate: '2023-10-26 02:00:00',
    content: '各有关单位：根据《...》文件精神，现启动2024年申报工作... 联系人：张三，电话：13812345678',
    status: DataStatus.PENDING,
    category: '政策通知',
    sensitiveInfo: { hasSensitiveData: true, detectedTypes: ['PHONE'] },
    author: '张三'
  },
  {
    id: '1002',
    title: '2023年第三季度全市经济运行情况',
    sourceUrl: 'http://gov.example.com/stats/456',
    sourceName: '市统计局',
    publishDate: '2023-10-20',
    crawlDate: '2023-10-21 02:00:00',
    content: '前三季度，全市地区生产总值完成... 身份证号：310101199001011234 (示例数据)',
    status: DataStatus.CLEANED,
    category: '统计数据',
    sensitiveInfo: { hasSensitiveData: true, detectedTypes: ['ID_CARD'] },
    author: '统计科'
  },
  {
    id: '1003',
    title: '环保局关于开展秋季大气污染防治行动的公告',
    sourceUrl: 'http://gov.example.com/env/789',
    sourceName: '市环保局',
    publishDate: '2023-10-26',
    crawlDate: '2023-10-27 01:00:00',
    content: '为改善空气质量...',
    status: DataStatus.PUBLISHED,
    category: '环保公告',
    sensitiveInfo: { hasSensitiveData: false, detectedTypes: [] },
    author: '大气办'
  },
   {
    id: '1004',
    title: '市教育局2024年小学招生工作实施方案',
    sourceUrl: 'http://gov.example.com/edu/101',
    sourceName: '市教育局',
    publishDate: '2023-10-15',
    crawlDate: '2023-10-16 03:00:00',
    content: '...',
    status: DataStatus.CLEANED,
    category: '民生服务',
    sensitiveInfo: { hasSensitiveData: false, detectedTypes: [] },
    author: '基教处'
  },
];

const INITIAL_TASKS: CrawlerTask[] = [
  {
    id: 't1',
    name: '市政府官网-通知公告',
    targetUrl: 'http://www.gov.example.com/notices',
    schedule: '0 2 * * *',
    status: 'active',
    lastRun: '2023-10-27 02:00:00',
    rules: [
      { field: 'title', selector: '.article-title', type: 'css', attribute: 'text' },
      { field: 'content', selector: '#main-content', type: 'css', attribute: 'text' },
      { field: 'date', selector: '//span[@class="pub-time"]', type: 'xpath', attribute: 'text' }
    ]
  }
];

// Helper to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockService {
  private users: User[] = INITIAL_USERS;
  private data: GovDataRecord[] = INITIAL_DATA;
  private tasks: CrawlerTask[] = INITIAL_TASKS;
  private logs: AuditLog[] = [];

  constructor() {
    this.addLog('system', 'System', '系统初始化', 'System', '127.0.0.1');
  }

  // Auth
  async login(username: string): Promise<User | undefined> {
    await delay(500);
    const user = this.users.find(u => u.username === username);
    if (user) {
      this.addLog(user.id, user.name, '用户登录', 'Auth', '192.168.1.10');
    }
    return user;
  }

  // Data Management
  async getData(): Promise<GovDataRecord[]> {
    await delay(300);
    return [...this.data];
  }

  async updateDataStatus(id: string, status: DataStatus, userId: string): Promise<void> {
    const record = this.data.find(d => d.id === id);
    if (record) {
      record.status = status;
      const user = this.users.find(u => u.id === userId);
      this.addLog(userId, user?.name || 'Unknown', `更新数据状态: ${status}`, `Data:${id}`, '192.168.1.10');
    }
  }

  async deleteData(id: string, userId: string): Promise<void> {
    this.data = this.data.filter(d => d.id !== id);
    const user = this.users.find(u => u.id === userId);
    this.addLog(userId, user?.name || 'Unknown', '删除数据', `Data:${id}`, '192.168.1.10');
  }

  // Crawler Management
  async getTasks(): Promise<CrawlerTask[]> {
    await delay(300);
    return [...this.tasks];
  }

  async addTask(task: CrawlerTask, userId: string): Promise<void> {
    this.tasks.push(task);
    const user = this.users.find(u => u.id === userId);
    this.addLog(userId, user?.name || 'Unknown', '新增爬虫任务', `Task:${task.name}`, '192.168.1.10');
  }

  // Logs
  async getLogs(): Promise<AuditLog[]> {
    await delay(300);
    return [...this.logs].reverse();
  }

  private addLog(userId: string, userName: string, action: string, target: string, ip: string) {
    const log: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      userName,
      action,
      target,
      timestamp: new Date().toLocaleString('zh-CN'),
      ipAddress: ip
    };
    this.logs.push(log);
  }
}

export const mockService = new MockService();