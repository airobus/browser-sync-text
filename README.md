# Gist Text Sync

一个简单而强大的浏览器扩展，使用GitHub Gist在不同浏览器和设备之间同步文本内容。

![Gist Text Sync Logo](icons/gist-text-sync-icon.svg)

## 功能特点

- **跨浏览器同步**：在任何支持Chrome扩展的浏览器之间无缝同步文本内容
- **实时更新**：通过GitHub Gist API实现文本内容的实时保存和更新
- **安全可靠**：使用GitHub个人访问令牌进行安全认证
- **简洁界面**：现代化、直观的用户界面，易于使用
- **自定义设置**：可配置GitHub令牌、Gist ID和文件名
- **性能优化**：针对文本编辑和同步操作进行了性能优化

## 安装说明

### 开发者模式安装

1. 下载或克隆此仓库到本地
2. 在Chrome浏览器中打开扩展管理页面 (`chrome://extensions/`)
3. 启用"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择此仓库的文件夹

### 生产环境安装

1. 从Chrome网上应用商店安装扩展
2. 安装完成后，点击扩展图标打开主界面

## 使用指南

1. **首次使用**：点击设置按钮配置GitHub Gist信息
2. **同步文本**：
   - 上传：编辑文本后点击上传按钮
   - 下载：点击下载按钮获取最新文本
3. **自动同步**：扩展会在打开时自动加载最新文本

## 配置GitHub Gist

1. 在GitHub上创建个人访问令牌（需要`gist`权限）
2. 创建一个新的Gist或使用现有Gist
3. 在扩展设置中输入：
   - GitHub个人访问令牌
   - Gist ID
   - 文件名（默认为`sync-text.txt`）

## 常见问题

### 同步失败怎么办？

1. 检查GitHub令牌是否有效且有gist权限
2. 确认Gist ID和文件名正确
3. 检查网络连接

### 如何更新扩展？

1. 开发者模式：拉取最新代码并重新加载扩展
2. 生产环境：等待Chrome自动更新

## 开发环境

- Node.js 16+
- Chrome扩展API
- GitHub REST API

## 贡献指南

欢迎提交Pull Request或Issue报告问题。请遵循现有代码风格并添加适当的测试。

## 故障排除

### 联系支持

如果您遇到任何问题或有改进建议，请在GitHub仓库中提交issue。
