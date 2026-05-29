
import { generateHtml } from './src/services/templates';

// 测试数据
const testTopic = 'HTML演示文稿创作工具介绍';
const testOutline = [
  { id: '1', title: '产品特点', content: '单 HTML 文件导出，无需安装任何软件，双击即可查看' },
  { id: '2', title: '核心功能', content: 'AI 自动生成大纲，5种精美模板，支持全屏演示和键盘快捷键' },
  { id: '3', title: '使用场景', content: '教育培训、商务汇报、产品发布、个人分享' },
  { id: '4', title: '技术优势', content: '基于 Tauri + React，跨平台支持，性能优异' },
];

// 生成测试 HTML
const html = generateHtml('business', testOutline, testTopic);

// 写入文件
import fs from 'fs';
import path from 'path';

const testPath = path.join(__dirname, 'test-presentation.html');
fs.writeFileSync(testPath, html);

console.log('✅ 测试演示文稿已生成:', testPath);
console.log('📖 请用浏览器打开该文件测试功能');
