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

## 部署到 GitHub Pages

### 一键部署（推荐）

项目已配置简单的部署脚本，只需一个命令：

```bash
npm run deploy
```

这个命令会：
1. 自动构建项目
2. 创建或切换到 `gh-pages` 分支
3. 将构建文件推送到 GitHub
4. 自动切换回 `main` 分支

### 首次部署前的设置

1. **启用 GitHub Pages**
   - 访问：https://github.com/wwwangzhenyang421/gomoku/settings/pages
   - 在 Source 下拉菜单中选择 **"Deploy from a branch"**
   - Branch 选择 `gh-pages`，文件夹选择 `/ (root)`
   - 点击 Save

2. **运行部署命令**
   ```bash
   npm run deploy
   ```

3. **访问你的网站**
   - 部署完成后，访问：https://wwwangzhenyang421.github.io/gomoku/
   - 首次部署可能需要几分钟才能生效

### 后续更新

每次修改代码后，只需运行：

```bash
npm run deploy
```

即可自动部署最新版本。

### 其他部署平台

也可以使用 Vercel、Netlify 等平台部署，这些平台通常支持自动部署。使用这些平台时，需要将 `vite.config.js` 中的 base 路径改为 `/`。
