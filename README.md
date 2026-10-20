# 校园组织一站通 · 一期演示站（内测版）

纯静态 H5：无后端、无登录、无构建步骤。`index.html` + `style.css` + `app.js` 读取 `orgs.json`。
路由（hash）：`#/` 首页选校区 → `#/list/shangchuan` 列表（分类筛选+搜索）→ `#/org/<id>` 详情。

> 数据：上海立信会计金融学院团委 2023–2024 学年社团年审公示（上川路 42、文翔路 28），简介等字段待补；logo/封面为按名称首字生成的 SVG 占位图。

## orgs.json 结构
顶层：`campuses`（校区列表：id/name/desc）、`categories`（分类顺序）、`orgs`（组织数组）。

| 字段 | 类型 | 说明 |
|---|---|---|
| id | 字符串 | 唯一 ID，用于详情页地址，如 `a-1` |
| campus | 字符串 | 所属校区，须与 `campuses[].id` 一致 |
| category | 字符串 | 学生会 / 学生发展中心 / 社团 / 艺术团 / 校队 / 其他 |
| name | 字符串 | 组织名称 |
| logo | 路径/URL | 方形，≥400×400 |
| cover | 路径/URL | 16:9，宽 ≥1280 |
| summary | 字符串 | 一句话简介（卡片显示） |
| description | 字符串 | 详细介绍 |
| recruit_status | 字符串 | `招新中` 或 `未招新` |
| recruit_start / recruit_deadline | 日期 `YYYY-MM-DD` | 可留空 |
| apply_url | URL | 报名外链；有值时显示「去报名」按钮 |
| apply_qr | 路径/URL | 报名二维码；无外链时显示「扫码报名」 |
| contact | 对象 | `{ "wechat": "", "qq": "" }` |
| video | URL | 介绍视频（mp4，建议竖屏 720p、≤10MB）；留空则隐藏 |
| photos | 数组 | 活动照 3–5 张，横图 |
| pair_id | 字符串/null | 预留：两校区同名社团用同一个值关联（三期用） |

## 如何修改数据
1. 直接编辑 `orgs.json`（注意 JSON 逗号/引号），图片放入 `img/` 并填相对路径。
2. 运营的名单表可导出 CSV 后用脚本转成 JSON。
3. 本地预览：在本目录运行 `python3 -m http.server 8080`，浏览器打开 `http://localhost:8080/`（不能双击直接打开文件，fetch 会失败）。

## 部署到国内对象存储 + CDN（通用步骤）
1. 在所用云厂商开通对象存储，新建存储桶，读权限设为「公共读」。
2. 开启「静态网站托管」，索引文档设为 `index.html`。
3. 上传本目录全部文件（保持目录结构，`shots/`、`README.md` 可不传）。
4. 开通 CDN，源站选该存储桶，绑定自有域名并配置 HTTPS 证书（国内面向公众的自有域名需完成 ICP 备案）。
5. 更新数据：重新上传 `orgs.json`/图片后，在 CDN 控制台刷新对应文件缓存（或给 `orgs.json` 设置较短缓存时间）。

## 后续规划
- **二期**：微信小程序 + 云开发。学号认证登录、一键报名、组织方后台（名单、面试排期、结果通知）；核心表 campus / org / recruit / application / interview。视频与图片放云存储，`video` 字段存地址。
- **三期**：同名社团通过 `pair_id` 配对，增加跨校区交流区。
