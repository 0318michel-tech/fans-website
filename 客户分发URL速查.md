# FANS 网站客户分发 URL 速查

## 🌐 主网址（云端）

**https://72d75d2288c74000ae6cc9ddadcb2a2e.gz1.agentos-app.net**

> 也可以部署到：腾讯云 / 阿里云 / 自己的域名。如需替换，告诉我新部署地址。

---

## 📲 客户分发链接

把对应的链接直接发给客户，他们点开就看到该行业的相关案例排在最前面：

| 客户类型 | 发给客户的链接 |
|---|---|
| **医疗/医院** | `…/project.html?industry=hospital` |
| **公共事业/政府** | `…/project.html?industry=public` |
| **教育/科研/高校** | `…/project.html?industry=education` |
| **商业/商业地产** | `…/project.html?industry=commerce` |
| **科技/智造** | `…/project.html?industry=tech` |
| **消费/餐饮/饮品** | `…/project.html?industry=consumer` 或 `?industry=food` |
| **时尚/服饰** | `…/project.html?industry=fashion` |
| **文化/公益/节事** | `…/project.html?industry=culture` |
| **看全部** | `…/project.html` 或 `?industry=all` |

不带参数也能用，进去后用户自己点顶部筛选标签。

---

## 🏠 其他入口（你可以挂在公众号菜单）

| 入口 | 链接 |
|---|---|
| 主页（封面） | `…/index.html` |
| FANSproject（全部案例） | `…/project.html` |
| FANSclient（客户清单） | `…/client.html` |
| FANSservice（服务维度） | `…/service.html` |
| ThingsMore（事儿多店） | `…/thingsmore.html` |
| aboutFANS（关于我们） | `…/about.html` |
| Get in touch（联系） | `…/contact.html` |

> 建议挂公众号菜单：案例展示 / 客户 / 服务 / 联系

---

## 🤝 协作更新

**当前是静态 HTML，文件级可协作：**
- 整个 `fans-website/` 文件夹就是网站
- 你或同事直接改 HTML 文件即可
- 我可以在代码层做改动、加新案例、补公众号文章

**3 种协作方式（详见 `fans-assets/同事协作方案.md`）：**
1. **简单**：用微云/iCloud/坚果云共享文件夹
2. **进阶**：放 GitHub / Gitee，用 Git 管理版本
3. **当前**：你把改动告诉我或者把文件丢到 `fans-assets/raw/`，我来做

---

## 📂 新增：专项出品入口（FANScraft 规划中）

画册 / 招商手册 / 品牌手册等专项作品不放在案例页里，建议独立一个 FANScraft 入口。

**当前状态：** 方案已写好（`fans-assets/专项出品呈现方案.md`），待你提供画册等专项 PDF 后开始实施。

---

## 📥 公众号文章集成

当前每个案例详情页底部预留了「设计风格」「项目图片」模块。

**两种填充方式：**
1. **你贴 URL/标题/摘要给我**，我批量更新对应案例的 modal 内容
2. **给我公众号管理员权限**（如可行），我写脚本自动抓取

`fans-assets/raw/wechat/` 已建好专门放公众号文章截图或 Markdown。
