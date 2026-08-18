# 新增 Project 案例 — 文件接收目录

把新案例 PDF 拖进此目录即可，两种方式都行：

## 方式 A：把 PDF 拖到对话窗口
直接把 PDF 拖到 WorkBuddy 对话窗口，告诉我"这是新案例 PDF，请处理"即可。我会读取 PDF 内容提取案例信息。

## 方式 B：放在这里
把 PDF 放到本目录：
```
fans-website/assets/incoming/new-cases/
```

文件命名建议：
- `hangzhou-fans-cases-v2.pdf` （如果指杭州凡事的新案例 PDF）
- 或 `项目简称-客户名.pdf`

## 我会做什么
收到 PDF 后：
1. 解析每一页/每个案例，提取：
   - 案例名称（中英文）
   - 行业归属（科技智造 / 企业商业 / 公共事业 / 零售餐饮 / 生活方式时尚 / 文化公益）
   - 子行业标签
   - 缩略图（首页图 1 张）
   - 详情图集（内页各页图）
2. 与现有 Project 45 个案例对比，不重复则新增
3. 更新 `project.html`（网格 + spread + modal 三个视图同步）
4. 更新 `cases.json`（如果有）
5. 处理跨行业归属（如酒店业标记 cross_tags）

## 当前已收录的 Project 案例
详见 `fans-website/project.html` 的 45 个 case 块。

## 当前案例编号范围
- 已使用：CASE 01 ~ CASE 45
- 下次新增：自动续到 CASE 46 起
