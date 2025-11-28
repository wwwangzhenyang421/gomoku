# 五子棋 Gomoku

一个精美的纯前端五子棋游戏，使用 React + Canvas + Tailwind CSS 构建。

## 特性

- 🎮 经典五子棋规则：15x15 棋盘，先连成5子获胜
- 🎨 精美设计：木纹棋盘、渐变棋子、动画效果
- 📱 响应式设计：完美适配手机和桌面
- ⏮️ 悔棋功能：支持撤销上一步
- 🔄 重玩功能：一键重置游戏
- ⚫⚪ 先手切换：选择黑子或白子先手
- ✨ 胜负检测：自动检测并高亮获胜连线

## 技术栈

- React 18
- Vite
- Canvas API
- Tailwind CSS
- react-use

## 安装和运行

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 游戏规则

1. 黑白双方轮流在棋盘上落子
2. 先在横、竖、斜任意方向连成5子的一方获胜
3. 点击棋盘交叉点落子
4. 可以使用悔棋功能撤销上一步
5. 游戏结束后可以点击重玩开始新局

## 部署

### GitHub Pages 自动部署

项目已配置 GitHub Actions 自动部署，只需以下步骤：

1. **创建 GitHub 仓库**
   ```bash
   # 初始化 Git 仓库（如果还没有）
   git init
   
   # 添加所有文件
   git add .
   
   # 提交
   git commit -m "Initial commit"
   
   # 在 GitHub 上创建新仓库（例如：gomoku）
   # 然后添加远程仓库并推送
   git remote add origin https://github.com/你的用户名/gomoku.git
   git branch -M main
   git push -u origin main
   ```

2. **修改 base 路径（重要）**
   
   如果您的仓库名不是 `gomoku`，需要修改 `vite.config.js` 中的 base 路径：
   
   ```javascript
   base: process.env.NODE_ENV === 'production' 
     ? '/你的仓库名/'  // 修改这里
     : '/',
   ```
   
   例如，如果仓库名是 `my-gomoku-game`，则改为：
   ```javascript
   base: process.env.NODE_ENV === 'production' 
     ? '/my-gomoku-game/'
     : '/',
   ```

3. **启用 GitHub Pages**
   - 进入 GitHub 仓库的 Settings
   - 点击左侧的 Pages
   - 在 Source 下拉菜单中选择 "GitHub Actions"
   - 保存设置

4. **自动部署**
   - 每次推送到 `main` 或 `master` 分支时，GitHub Actions 会自动构建并部署
   - 部署完成后，访问地址为：`https://你的用户名.github.io/你的仓库名/`
   - 首次部署可能需要几分钟时间

### 手动部署

如果需要手动部署：

```bash
npm run build
# 将 dist 目录的内容部署到 GitHub Pages
```

### 其他部署平台

也可以使用 Vercel、Netlify 等平台部署，这些平台通常支持自动部署。使用这些平台时，需要将 `vite.config.js` 中的 base 路径改为 `/`。
