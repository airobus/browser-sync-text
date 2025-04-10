
# 隐私权政策

最后更新：2023年11月15日

## 1. 数据收集范围

我们严格限制收集以下数据：

- **用户明确选择的文本片段**（通过浏览器选择API获取）
- 来源网页基础URL（不含查询参数或片段标识符）
- 操作时间戳（精确到分钟级别）

## 2. 数据处理方式

- 本地存储：使用`chrome.storage.sync` API（自动加密）
- 数据加密：采用Chrome原生加密机制
- 数据保留：本地数据保留至用户主动删除，云数据保留30天

## 3. 权限使用说明

| 权限 | 用途 | 是否必需 |
|------|------|---------|
| storage | 保存用户收集的文本 | 是 |
| activeTab | 获取当前页面选中文本 | 是 |

## 4. 用户数据控制

您拥有完整控制权：

- 实时查看所有存储数据（通过扩展选项页）
- 一键清除所有历史记录
- 选择性导出数据（支持JSON/Markdown格式）
- 完全退出账号并删除云端数据

## 5. 儿童隐私保护

本扩展不面向13岁以下儿童设计，不会故意收集儿童信息。

## 6. 政策更新

将通过以下方式通知变更：

1. 扩展更新时弹窗提示
2. 官网公告栏公示
3. 版本日志中标注

## 7. 联系方式

隐私专员邮箱：<robus@foxmail.com>
（24小时内响应）
