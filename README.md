# 政务数据管理系统 (GovData Manager)

## 简介
这是一个集成了爬虫调度、数据清洗、敏感信息脱敏和可视化大屏的政务数据管理系统。
系统采用前后端分离架构，前端使用 React + TypeScript，后端使用 Python FastAPI + Playwright。

## 目录结构
- `/` - 前端 React 项目代码
- `/backend` - 后端 Python 爬虫服务代码

## 快速开始

### 1. 启动前端 (Frontend)
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```
访问 http://localhost:5173

### 2. 启动后端爬虫服务 (Backend)
为了使用真实的爬虫功能，请开启 Python 后端。

```bash
cd backend

# 推荐使用虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 安装 Playwright 浏览器内核
playwright install chromium

# 启动 API 服务
uvicorn main:app --reload
```
API 将运行在 http://localhost:8000

## 功能演示
1. **登录**：使用默认账号 `admin` 登录。
2. **爬虫配置**：进入"爬虫配置"页面，点击"新建任务"或"配置"。
   - 在右侧输入目标 URL (例如一个新闻列表页)。
   - 配置 CSS 选择器规则 (例如 `title` -> `h1`, `content` -> `.article-body`)。
   - 点击 **"立即测试"**，后端会实时抓取并返回 JSON 结果。
3. **数据管理**：抓取的数据会显示在列表中，支持敏感字段（手机号、身份证）自动脱敏。
4. **AI 分析**：点击机器人图标，调用 Gemini 模型分析政策文件摘要。

## 技术栈
- **Frontend**: React, Vite, TailwindCSS, Recharts
- **Backend**: FastAPI, Playwright (Headless Browser), BeautifulSoup
- **AI**: Google Gemini API
