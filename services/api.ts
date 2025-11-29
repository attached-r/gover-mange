
import { GovDataRecord, DataStatus, CrawlerTask, CrawlerRule } from '../types';
import { mockService } from './mockService';

const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  private useMock: boolean = false;

  async checkBackendHealth() {
    try {
      await fetch('http://localhost:8000/', { method: 'GET', signal: AbortSignal.timeout(2000) });
      this.useMock = false;
      console.log('✅ Connected to Python Backend');
    } catch (e) {
      this.useMock = true;
      console.log('⚠️ Backend not detected, using Mock Data');
    }
  }

  async testCrawlRule(url: string, rules: CrawlerRule[]): Promise<any> {
    if (this.useMock) {
      await new Promise(r => setTimeout(r, 1500));
      return {
        status: 'success',
        data: {
          title: '【模拟数据】无法连接后端',
          content: '请先启动 Python 后端服务 (cd backend && uvicorn main:app --reload) 以使用真实爬虫功能。',
          date: new Date().toISOString(),
          source: 'System'
        }
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/crawl/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, rules })
      });
      return await response.json();
    } catch (error) {
      console.error("Crawl failed", error);
      return { status: 'error', message: '连接后端失败' };
    }
  }

  async getData(): Promise<GovDataRecord[]> {
    if (this.useMock) return mockService.getData();
    
    try {
      const res = await fetch(`${API_BASE_URL}/data`);
      if (!res.ok) throw new Error('Failed to fetch');
      const remoteData = await res.json();
      const mockData = await mockService.getData();
      // 合并数据：后端数据优先
      return [...remoteData, ...mockData]; 
    } catch (e) {
      console.warn("Fetch data failed, falling back to mock", e);
      return mockService.getData();
    }
  }

  async createData(data: Partial<GovDataRecord>): Promise<any> {
    if (this.useMock) {
        return mockService.addData(data as GovDataRecord);
    }

    const payload = {
        ...data,
        sourceName: data.sourceName || '手动采集/导入',
        status: data.status || DataStatus.PENDING,
        sensitiveInfo: data.sensitiveInfo || { hasSensitiveData: false, detectedTypes: [] }
    };

    const res = await fetch(`${API_BASE_URL}/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return await res.json();
  }

  async deleteData(id: string, uid: string) { 
      // 优先尝试从 mock 删除
      await mockService.deleteData(id, uid);

      if (!this.useMock) {
        try {
            await fetch(`${API_BASE_URL}/data/${id}`, { method: 'DELETE' });
        } catch {
            // ignore error
        }
      }
  }

  // Tasks, Login, Logs use Mock for simplicity in this demo
  async getTasks() { return mockService.getTasks(); }
  async addTask(task: CrawlerTask, uid: string) { return mockService.addTask(task, uid); }
  async login(u: string) { return mockService.login(u); }
  async getLogs() { return mockService.getLogs(); }
}

export const apiService = new ApiService();
// 初始化检查
apiService.checkBackendHealth();
