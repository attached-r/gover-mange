
import { GovDataRecord, DataStatus, CrawlerTask, CrawlerRule } from '../types';
import { mockService } from './mockService';

const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  private useMock: boolean = false;

  async checkBackendHealth() {
    try {
      await fetch('http://localhost:8000/');
      this.useMock = false;
      console.log('Connected to Python Backend');
    } catch (e) {
      this.useMock = true;
      console.log('Backend not detected, using Mock Data');
    }
  }

  async testCrawlRule(url: string, rules: CrawlerRule[]): Promise<any> {
    if (this.useMock) {
      await new Promise(r => setTimeout(r, 1500));
      return {
        status: 'success',
        data: {
          title: '【模拟数据】关于印发2024年数字经济工作要点的通知',
          content: '这是前端模拟的抓取结果。请启动 Python 后端以进行真实抓取。',
          date: '2024-03-20',
          source: '模拟来源'
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
      // Combine with mock data for better demo experience
      const mockData = await mockService.getData();
      // Remote data on top
      return [...remoteData, ...mockData]; 
    } catch (e) {
      console.warn("Fetch data failed, falling back to mock", e);
      return mockService.getData();
    }
  }

  async createData(data: Partial<GovDataRecord>): Promise<any> {
    if (this.useMock) {
        // Mock save
        return mockService.addData(data as GovDataRecord); // Assume mockService has this or we just ignore
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
      if (this.useMock) return mockService.deleteData(id, uid);
      
      // Try to delete from backend, if fails (e.g. 404 because it's a mock id), try mock service
      try {
          await fetch(`${API_BASE_URL}/data/${id}`, { method: 'DELETE' });
      } catch {
          // ignore
      }
      return mockService.deleteData(id, uid); 
  }

  // Tasks, Login, Logs etc. use Mock for now
  async getTasks() { return mockService.getTasks(); }
  async addTask(task: CrawlerTask, uid: string) { return mockService.addTask(task, uid); }
  async login(u: string) { return mockService.login(u); }
  async getLogs() { return mockService.getLogs(); }
}

export const apiService = new ApiService();
apiService.checkBackendHealth();
