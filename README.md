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

### 从Chrome网上应用店安装

1. 访问[Chrome网上应用店](https://chrome.google.com/webstore/category/extensions)（即将上线）
2. 搜索"Gist Text Sync"
3. 点击"添加至Chrome"

### 开发者模式安装

1. 下载或克隆此仓库到本地
2. 在Chrome浏览器中打开扩展管理页面 (`chrome://extensions/`)
3. 启用"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择此仓库的文件夹

## 使用指南

### 初始设置

在使用Gist Text Sync之前，您需要完成以下设置：

1. **获取GitHub个人访问令牌**：
   - 访问[GitHub的个人访问令牌页面](https://github.com/settings/tokens)
   - 点击"Generate new token"（生成新令牌）
   - 为令牌添加描述，如"Gist Text Sync"
   - 选择"gist"权限范围
   - 点击"Generate token"（生成令牌）
   - 复制生成的令牌（注意：此令牌只会显示一次）

2. **创建GitHub Gist**：
   - 访问[GitHub Gist](https://gist.github.com/)
   - 创建一个新的Gist
   - 添加文件名（例如："sync-text.md"）
   - 添加一些初始内容
   - 选择是公开还是私密Gist
   - 点击"Create secret gist"或"Create public gist"
   - 创建后，从URL中复制Gist ID（例如：`https://gist.github.com/yourusername/abcdef1234567890`中的`abcdef1234567890`部分）

3. **配置扩展**：
   - 点击Chrome工具栏中的Gist Text Sync图标
   - 点击"设置"链接
   - 输入您的GitHub令牌
   - 输入Gist ID
   - 输入文件名（与您在Gist中创建的文件名相同）
   - 点击"保存"

### 日常使用

1. **查看同步内容**：
   - 点击Chrome工具栏中的Gist Text Sync图标
   - 扩展会自动加载最新的同步内容

2. **编辑和上传内容**：
   - 在文本区域中编辑内容
   - 点击"上传"按钮将内容保存到Gist

3. **刷新内容**：
   - 点击"下载"按钮从Gist获取最新内容

## 技术实现

- **前端**：使用原生HTML、CSS和JavaScript构建
- **存储**：使用Chrome的`storage.sync` API存储配置信息
- **同步**：通过GitHub Gist API实现文本内容的同步
- **认证**：使用GitHub个人访问令牌进行API认证
- **性能优化**：实现了文本编辑的防抖处理和性能优化

## 隐私说明

- 所有数据都存储在您自己的GitHub Gist中
- 您的GitHub令牌仅存储在浏览器本地，不会发送到任何第三方服务器
- 扩展不会收集任何个人信息或使用情况数据

## 故障排除

### 常见问题

1. **无法保存设置**
   - 确保您的GitHub令牌有效且具有gist权限
   - 检查网络连接

2. **无法加载或保存内容**
   - 确认Gist ID是否正确
   - 确认文件名与Gist中的文件名完全匹配
   - 检查您是否有权限访问该Gist

3. **同步内容丢失**
   - 在上传前确保您没有在其他设备上修改内容
   - 如果发生冲突，请手动合并更改

### 联系支持

如果您遇到任何问题或有改进建议，请在GitHub仓库中提交issue。

## 许可证

此项目采用MIT许可证 - 详情请参阅LICENSE文件。

## 贡献指南

欢迎贡献！如果您想为Gist Text Sync做出贡献，请遵循以下步骤：

1. Fork此仓库
2. 创建您的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个Pull Request