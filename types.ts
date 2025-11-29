export enum UserRole {
  ADMIN = '管理员',
  DEPT_LEADER = '部门领导',
  STAFF = '普通工作人员'
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  department: string;
  lastLogin: string;
}

export enum DataStatus {
  PENDING = '待处理',
  CLEANED = '已清洗',
  PUBLISHED = '已入库',
  ERROR = '异常'
}

export interface GovDataRecord {
  id: string;
  title: string;
  sourceUrl: string;
  sourceName: string;
  publishDate: string;
  crawlDate: string;
  content: string; // Plain text or HTML
  status: DataStatus;
  category: string;
  sensitiveInfo: {
    hasSensitiveData: boolean;
    detectedTypes: string[]; // e.g., "ID_CARD", "PHONE"
  };
  author?: string;
}

export interface CrawlerRule {
  field: string;
  selector: string;
  type: 'css' | 'xpath' | 'regex';
  attribute?: string; // e.g., 'href' or 'text'
}

export interface CrawlerTask {
  id: string;
  name: string;
  targetUrl: string;
  schedule: string; // Cron expression
  status: 'active' | 'paused' | 'error';
  lastRun: string;
  rules: CrawlerRule[];
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  timestamp: string;
  ipAddress: string;
}

export interface ChartData {
  name: string;
  value: number;
  category?: string;
}