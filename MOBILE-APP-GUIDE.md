# Confluence 手机APP使用指南

## 方案一：PWA（最简单，推荐）

PWA 不需要安装任何工具，不需要电脑，手机浏览器就能直接安装。

### iPhone (Safari)
1. 用 Safari 打开网站
2. 点击底部中间的**分享按钮**（方形带箭头）
3. 下滑找到**"添加到主屏幕"**
4. 点击**"添加"**
5. 桌面上会出现 Confluence 图标，打开就是全屏APP体验

### Android (Chrome)
1. 用 Chrome 打开网站
2. 点击右上角**菜单（三个点）**
3. 选择**"安装应用"** 或 **"添加到主屏幕"**
4. 点击**"安装"**
5. 桌面上会出现图标，和原生APP一样使用

### PWA 特性
- 离线访问（没有网络也能看已缓存的内容）
- 全屏无浏览器地址栏
- 独立的应用图标
- 自动更新
- 支持系统分享（直接分享到微信、QQ）

---

## 方案二：原生 Android APK

### 方式A：GitHub Actions 自动构建（不需要电脑）

1. 把代码推送到 GitHub 仓库
2. 进入仓库页面的 **Actions** 标签
3. 找到 **"Build Android APK"** 工作流，点击 **Run workflow**
4. 等待约 5-10 分钟构建完成
5. 完成后进入该 workflow 的详情页，在 **Artifacts** 区域下载 `confluence-debug-apk`
6. 把下载的 APK 传到手机上安装

### 方式B：本地构建（需要电脑）

```bash
# 1. 安装依赖
npm install

# 2. 构建前端
npm run build

# 3. 同步到 Android 项目
npx cap sync android

# 4. 构建 APK
cd android
./gradlew assembleDebug

# APK 输出位置：
# android/app/build/outputs/apk/debug/app-debug.apk
```

### 安装 APK 到手机
- 把 `app-debug.apk` 传到手机（微信文件传输、数据线、邮件等）
- 手机上点击 APK 文件安装
- 如果提示"未知来源"，去设置里允许安装未知来源应用

---

## 两种方案对比

| 特性 | PWA | 原生APK |
|------|-----|---------|
| 安装难度 | 极低（浏览器一键安装） | 需要构建或下载APK |
| 离线使用 | 支持 | 支持 |
| 系统分享 | 支持（可调起微信） | 支持 |
| 推送通知 | 支持 | 支持 |
| 应用商店上架 | 不能 | 可以 |
| 更新方式 | 自动静默更新 | 需要重新安装 |

**建议**：先用 PWA 快速上手，需要上架应用商店时再构建 APK。
