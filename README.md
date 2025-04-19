# SyncScribe

![SyncScribe Logo](icons/128.png)

一款优雅的跨设备文本同步工具，通过GitHub Gist实现无缝连接。轻松记录、同步并随时访问您的重要内容，无论您身在何处。

## 主要特性

- 实时自动保存：边输入边保存，不再担心内容丢失
- 跨设备同步：在任何设备上访问您的文本内容
- 简洁现代界面：精心设计的暗色主题UI，提供舒适的写作体验
- 安全可靠：数据仅存储在您的个人GitHub Gist中
- 无缝集成：与GitHub生态系统完美融合
- 无需注册：使用您现有的GitHub账户即可

## 快速开始

### 安装扩展

#### Chrome网上应用商店

1. 访问[Chrome网上应用商店的SyncScribe页面](https://chrome.google.com/webstore/detail/syncscribe/yourextensionid)
2. 点击"添加至Chrome"按钮
3. 扩展将自动安装到您的浏览器

#### 开发者模式安装

1. 下载本仓库的ZIP文件或使用Git克隆

   ```bash
   git clone https://github.com/yourusername/syncscribe.git
   ```

2. 打开Chrome，访问 `chrome://extensions/`
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"并选择项目文件夹

### 设置GitHub

#### 创建GitHub令牌

1. 登录您的[GitHub账户](https://github.com)
2. 访问[Personal Access Tokens](https://github.com/settings/tokens)页面
3. 点击"Generate new token (classic)"
4. 为令牌命名（如"SyncScribe"）
5. 勾选"gist"权限
6. 点击底部的"Generate token"
7. **重要**：复制并安全保存生成的令牌，它只会显示一次

#### 创建Gist

1. 访问[GitHub Gist](https://gist.github.com/)
2. 创建一个新Gist（可以是公开或私密的）
3. 为文件命名（如"notes.txt"）
4. 添加一些初始内容
5. 点击"Create secret gist"或"Create public gist"
6. 从浏览器地址栏复制Gist ID（URL中最后一段字符串）

### 配置扩展

1. 点击浏览器工具栏中的SyncScribe图标
2. 点击"设置"按钮
3. 填写：
   - GitHub Token（刚才生成的令牌）
   - Gist ID（刚才创建的Gist ID）
   - 文件名（您在Gist中使用的文件名）
4. 点击"保存设置"

## 使用指南

### 基本操作

- **编辑文本**：在主文本区域直接输入内容
- **上传**：点击金色"上传"按钮将内容保存到GitHub Gist
- **下载**：点击粉色"下载"按钮从GitHub Gist获取最新内容

### 高效工作流

#### 在多设备间同步

1. 设备A：编辑文本并点击"上传"
2. 设备B：打开SyncScribe并点击"下载"
3. 编辑完成后，再次点击"上传"保持同步

#### 使用多个文件

- 在设置中更改"文件名"字段来切换不同文件
- 为不同类型的内容创建专用文件
  - `work-notes.txt` - 工作笔记
  - `ideas.txt` - 灵感记录
  - `code.js` - 代码片段

## 故障排除

| 问题 | 可能原因 | 解决方案 |
|------|---------|---------|
| 无法上传/下载 | GitHub Token无效 | 检查并重新生成Token |
| 找不到文件 | 文件名不匹配 | 确认设置中的文件名与Gist中的完全一致 |
| 同步失败 | 网络连接问题 | 检查网络连接并重试 |
| 内容丢失 | 本地缓存清除 | 从GitHub Gist下载最新版本 |

## 隐私与安全

- 所有数据仅存储在您的GitHub Gist和本地浏览器缓存中
- GitHub Token安全存储在浏览器的加密存储中
- 不收集任何用户数据或使用情况统计
- 通过HTTPS安全传输所有数据

## 进阶功能

- **自动保存**：在输入时自动保存到本地缓存
- **缓存恢复**：在网络不可用时从本地缓存恢复内容
- **文件名建议**：在设置中自动显示可用的Gist文件名

## 未来规划

- [ ] 离线编辑模式
- [ ] Markdown格式支持与预览
- [ ] 版本历史查看
- [ ] 多主题选择
- [ ] 移动应用版本

## 贡献

欢迎贡献代码、报告问题或提出新功能建议！

1. Fork本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-idea`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-idea`)
5. 开启Pull Request

## 许可证

本项目采用MIT许可证 - 详情请参阅[LICENSE](LICENSE)文件

---

打造您的数字笔记体验，随时随地保持同步  
[GitHub](https://github.com/yourusername/syncscribe) •
[报告问题](https://github.com/yourusername/syncscribe/issues) •
[讨论](https://github.com/yourusername/syncscribe/discussions)
